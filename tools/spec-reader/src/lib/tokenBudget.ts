/**
 * Token budget estimation, tier-aware trimming, and budget pressure signaling.
 *
 * Uses char-based heuristic: ~4 chars per token for English/mixed text.
 * This avoids a dependency on tiktoken while being accurate enough for budget enforcement.
 *
 * Tier-aware trimming: sections tagged with [Tn] are trimmed bottom-up
 * (Tier 4 first, then 3, 2). If Tier 1-2 content is dropped, a pressure
 * signal recommends budget expansion.
 *
 * Aspect-aware mode (v2): when BudgetContext is provided, T1+T2 are always
 * preserved, T3/T4 sections are scored by keyword/onto relevance and kept
 * by descending score until budget is filled. This prevents blind tier-based
 * cutting of relevant supplementary content.
 */

import type { ReadingPlan, ScoredChain } from './readingPlanFunnel.js';
import type { OntoRole } from './types.js';

/** Default budget in estimated tokens */
export const DEFAULT_BUDGET = 4000;

/** Maximum budget for auto-expand (hard ceiling) */
const MAX_AUTO_EXPAND = 20000;

/** Average chars per token (conservative for mixed English + markdown + code) */
const CHARS_PER_TOKEN = 4;

/** Tiers that are considered "core" — dropping them triggers expansion signal */
const CORE_TIERS = new Set([1, 2]);

/**
 * Detail level controls which tiers are "protected" from trimming.
 * - brief: only T1 (core definitions)
 * - normal: T1 + T2 (default — current behavior)
 * - detailed: T1 + T2 + T3 (includes registry, cross-refs, matrices)
 * - complete: all tiers, no trimming
 */
export type DetailLevel = 'brief' | 'normal' | 'detailed' | 'complete';

/** Protected tier sets per detail level */
const DETAIL_PROTECTED_TIERS: Record<DetailLevel, Set<number>> = {
  brief: new Set([1]),
  normal: new Set([1, 2]),
  detailed: new Set([1, 2, 3]),
  complete: new Set([1, 2, 3, 4]),
};

/**
 * Estimate token count from text length.
 * Uses 4 chars/token heuristic — accurate within ~15% for English + markdown.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

/** Budget pressure signal — indicates whether budget expansion is recommended */
export interface BudgetPressure {
  /** True when Tier 1 or 2 content was dropped — agent should expand budget */
  expandRecommended: boolean;
  /** Sections dropped per tier */
  droppedByTier: Record<number, number>;
  /** Total sections dropped */
  droppedTotal: number;
  /** Estimated tokens of all dropped sections */
  droppedTokens: number;
  /** Suggested budget to fit all Tier 1-2 content */
  suggestedBudget: number;
}

export interface BudgetResult {
  /** The (possibly trimmed) text */
  text: string;
  /** Estimated tokens of the returned text */
  tokens: number;
  /** Whether the text was trimmed */
  trimmed: boolean;
  /** Original estimated tokens (before trim) */
  originalTokens: number;
  /** Budget that was applied */
  budget: number;
  /** Pressure signal — present when content was trimmed */
  pressure?: BudgetPressure;
  /** When autoExpand kicked in: the original budget before expansion */
  expandedFrom?: number;
}

/** Options for applyBudget */
export interface BudgetOptions {
  /** Token budget (default: DEFAULT_BUDGET) */
  budget?: number;
  /** Detail level — controls which tiers are protected from trimming */
  detail?: DetailLevel;
  /** When true, automatically expand budget to preserve protected tiers instead of signaling BUDGET_PRESSURE */
  autoExpand?: boolean;
  /** Aspect-aware context — enables smart T3/T4 relevance scoring instead of blind tier drops */
  context?: BudgetContext;
}

/** Context for aspect-aware budget trimming (v2 algorithm) */
export interface BudgetContext {
  /** The reading plan with scored chains — provides indexAlias, heading, score per address */
  plan: ReadingPlan;
  /** Query keywords for content-level relevance matching in T3/T4 */
  keywords: string[];
  /** Ontological query role — boosts T3/T4 sections from matching aspect indices */
  onto?: OntoRole;
}

/** Regex to extract tier tag from a section marker: ▸ [T2] 2.6.8 */
const TIER_TAG_RE = /^\▸ \[T(\d+)\]/;

/** Regex to extract tier + address from a section marker: ▸ [T2] 5.3/(A) */
const TIER_ADDR_RE = /^\▸ \[T(\d+)\] (.+)/;

/** Parse tier number from a section block (first line) */
function parseTier(section: string): number {
  const match = TIER_TAG_RE.exec(section);
  return match ? parseInt(match[1], 10) : 4; // default to Tier 4 if no tag
}

/** Parse chain address from a section block (first line) */
function parseAddress(section: string): string | undefined {
  const match = TIER_ADDR_RE.exec(section);
  return match ? match[2].trim() : undefined;
}

/**
 * Index → onto-role affinity: which indices are "close to" each onto role.
 * Score 3 = strong affinity, 2 = moderate, 1 = weak.
 * Used by aspect-aware trimming to boost T3/T4 sections from relevant indices.
 */
const INDEX_ONTO_AFFINITY: Record<string, Record<string, number>> = {
  WHAT: { phya: 3, sema: 3, trma: 2, ont: 2, onma: 1 },
  WHY:  { phla: 3, ont: 3, desa: 3, onma: 2 },
  HOW:  { bsyn: 3, grma: 3, desa: 3, bhva: 2, onma: 2 },
  WHEN: { bhva: 3, desa: 2, ont: 1 },
};

/**
 * Apply budget guard to MCP response text.
 *
 * **Tier-aware mode** (when sections have [Tn] tags):
 * Trims bottom-up — drops highest-tier sections first (T4 → T3 → T2).
 * If Tier 1-2 sections are dropped, returns a `pressure` signal recommending
 * budget expansion.
 *
 * **Legacy mode** (no [Tn] tags):
 * Trims top-down by keeping first N sections (backward compat).
 *
 * Splits on section markers (▸) to trim at section boundaries rather than mid-text.
 */
export function applyBudget(text: string, opts?: number | BudgetOptions): BudgetResult {
  // Backward compat: accept plain number as budget
  const options: BudgetOptions = typeof opts === 'number'
    ? { budget: opts }
    : opts ?? {};

  const requestedBudget = options.budget ?? DEFAULT_BUDGET;
  const detail: DetailLevel = options.detail ?? 'normal';
  const autoExpand = options.autoExpand ?? false;
  const protectedTiers = DETAIL_PROTECTED_TIERS[detail];

  let budget = requestedBudget;
  const originalTokens = estimateTokens(text);

  // Early exit when content fits — BUT skip if aspect-aware mode is active,
  // because we still need to filter out irrelevant T3/T4 sections.
  if (originalTokens <= budget && !(autoExpand && options.context)) {
    return { text, tokens: originalTokens, trimmed: false, originalTokens, budget };
  }

  // Split on section markers to trim at logical boundaries
  const SECTION_MARKER = '▸ ';
  const parts = text.split(new RegExp(`(?=^${SECTION_MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'm'));

  // If no section markers, do a hard char cut
  if (parts.length <= 1) {
    const maxChars = budget * CHARS_PER_TOKEN;
    const trimmed = text.slice(0, maxChars);
    const tokens = estimateTokens(trimmed);
    return {
      text: trimmed + `\n\n[... TRUNCATED — ${originalTokens} tokens exceeded budget of ${budget}. Use filter:true, extract, or lower maxUnits to reduce size.]`,
      tokens: tokens + 20,
      trimmed: true,
      originalTokens,
      budget,
    };
  }

  // Determine header vs first section: if parts[0] starts with ▸, it's a section, not header
  const SECTION_PREFIX = '▸ ';
  const firstIsSection = parts[0].startsWith(SECTION_PREFIX);
  const header = firstIsSection ? '' : parts[0];
  const sections = firstIsSection ? parts : parts.slice(1);

  // Check if sections have tier tags
  const hasTierTags = sections.some(s => TIER_TAG_RE.test(s));

  if (hasTierTags) {
    // Aspect-aware mode: when context is available, use smart relevance scoring
    if (autoExpand && options.context) {
      return applyAspectAwareBudget(header, sections, budget, originalTokens, protectedTiers, options.context, requestedBudget);
    }

    // First pass: try with requested budget
    const result = applyTierAwareBudget(header, sections, budget, originalTokens, protectedTiers);

    // Auto-expand (legacy): if protected tiers were dropped, re-run with expanded budget
    if (autoExpand && result.pressure?.expandRecommended) {
      const expandedBudget = Math.min(result.pressure.suggestedBudget, MAX_AUTO_EXPAND);
      if (expandedBudget > budget) {
        const expanded = applyTierAwareBudget(header, sections, expandedBudget, originalTokens, protectedTiers);
        expanded.expandedFrom = requestedBudget;
        return expanded;
      }
    }

    return result;
  }

  // ─── Legacy mode: top-down trimming (no tier tags) ───
  return applyLegacyBudget(header, sections, budget, originalTokens);
}

/**
 * Tier-aware trimming: drops lowest-priority tiers first.
 * Returns pressure signal when Tier 1-2 content is dropped.
 */
function applyTierAwareBudget(
  header: string,
  sections: string[],
  budget: number,
  originalTokens: number,
  protectedTiers: Set<number> = CORE_TIERS,
): BudgetResult {
  const maxChars = budget * CHARS_PER_TOKEN;

  // Tag each section with its tier and size
  const tagged = sections.map(s => ({
    text: s,
    tier: parseTier(s),
    chars: s.length,
  }));

  // Sort by tier descending (drop T4 first, T3 second, etc.)
  // Protected tiers are pushed to the end of the drop order
  // Within same tier, drop from end (last = least important by score)
  const dropOrder = tagged
    .map((t, i) => ({ ...t, originalIndex: i }))
    .sort((a, b) => {
      const aProtected = protectedTiers.has(a.tier) ? 0 : 1;
      const bProtected = protectedTiers.has(b.tier) ? 0 : 1;
      if (aProtected !== bProtected) return bProtected - aProtected; // unprotected dropped first
      if (b.tier !== a.tier) return b.tier - a.tier;  // higher tier dropped first
      return b.originalIndex - a.originalIndex;        // later order dropped first
    });

  // Determine which sections to drop
  let currentChars = header.length + tagged.reduce((sum, t) => sum + t.chars, 0);
  const droppedIndices = new Set<number>();
  const droppedByTier: Record<number, number> = {};
  let droppedTokens = 0;

  for (const candidate of dropOrder) {
    if (currentChars <= maxChars) break;
    droppedIndices.add(candidate.originalIndex);
    currentChars -= candidate.chars;
    droppedByTier[candidate.tier] = (droppedByTier[candidate.tier] ?? 0) + 1;
    droppedTokens += estimateTokens(candidate.text);
  }

  // Build kept text in original order
  const keptSections = tagged.filter((_, i) => !droppedIndices.has(i));
  let accumulated = header + keptSections.map(s => s.text).join('');

  // If even after dropping everything we're still over, hard-cut the remainder
  if (estimateTokens(accumulated) > budget && keptSections.length > 0) {
    accumulated = accumulated.slice(0, maxChars);
  }

  const droppedTotal = droppedIndices.size;
  const tokens = estimateTokens(accumulated);

  if (droppedTotal === 0) {
    return { text: accumulated, tokens, trimmed: false, originalTokens, budget };
  }

  // Check if protected tiers were dropped
  const protectedDropped = Object.entries(droppedByTier)
    .filter(([tier]) => protectedTiers.has(Number(tier)))
    .reduce((sum, [, count]) => sum + count, 0);

  const expandRecommended = protectedDropped > 0;

  // Estimate suggested budget: current budget + dropped protected-tier tokens + 10% headroom
  const protectedDroppedTokens = tagged
    .filter((_, i) => droppedIndices.has(i) && protectedTiers.has(tagged[i].tier))
    .reduce((sum, t) => sum + estimateTokens(t.text), 0);
  const suggestedBudget = expandRecommended
    ? Math.ceil((budget + protectedDroppedTokens) * 1.1)
    : budget;

  const pressure: BudgetPressure = {
    expandRecommended,
    droppedByTier,
    droppedTotal,
    droppedTokens,
    suggestedBudget,
  };

  // Build truncation notice with tier breakdown
  const tierBreakdown = Object.entries(droppedByTier)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([t, n]) => `T${t}:${n}`)
    .join(', ');

  const protectedLabel = [...protectedTiers].sort().map(t => `T${t}`).join('+');
  const notice = expandRecommended
    ? `\n\n[BUDGET_PRESSURE: ${droppedTotal} sections dropped (${tierBreakdown}), ${originalTokens} tokens > budget ${budget}. Protected content (${protectedLabel}) lost. Suggested budget: ${suggestedBudget}. Retry with budget:${suggestedBudget}, autoExpand:true, or use filter:true / tier:1.]`
    : `\n\n[... ${droppedTotal} sections trimmed (${tierBreakdown}) — ${originalTokens} est. tokens > budget ${budget}. Only supplementary content dropped. Use tier:1-2 or filter:true for focused reading.]`;

  return {
    text: accumulated + notice,
    tokens: tokens + 40,
    trimmed: true,
    originalTokens,
    budget,
    pressure,
  };
}

/**
 * Aspect-aware budget trimming (v2).
 *
 * Algorithm:
 * 1. T1+T2 sections are ALWAYS preserved — budget expands to fit them.
 * 2. T3/T4 sections are scored by relevance (keywords in text, onto-affinity, heading match).
 * 3. ALL T3/T4 with relevance > 0 are included — budget expands to fit them (cap: MAX_AUTO_EXPAND).
 * 4. T3/T4 with relevance ≤ 0 are dropped (irrelevant supplementary).
 * 5. Final budget = coreTokens + all relevant T3/T4 tokens.
 */
function applyAspectAwareBudget(
  header: string,
  sections: string[],
  requestedBudget: number,
  originalTokens: number,
  protectedTiers: Set<number>,
  ctx: BudgetContext,
  originalRequestedBudget: number,
): BudgetResult {
  // Build chain address → ScoredChain lookup from the plan
  const chainLookup = new Map<string, ScoredChain>();
  for (const chain of ctx.plan.chains) {
    chainLookup.set(chain.address, chain);
  }

  // Build keywords regex for content matching (case insensitive)
  const kwPatterns = ctx.keywords
    .filter(k => k.length >= 3)
    .map(k => new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

  // Tag each section with tier, address, chars, relevance score
  const tagged = sections.map((s, i) => {
    const tier = parseTier(s);
    const address = parseAddress(s);
    const chars = s.length;
    const chain = address ? chainLookup.get(address) : undefined;

    // Compute relevance score for T3/T4 sections (higher = more relevant)
    let relevance = 0;
    if (tier >= 3) {
      // Keywords found in section text (strongest signal)
      const textLower = s.toLowerCase();
      for (const pat of kwPatterns) {
        if (pat.test(textLower)) relevance += 20;
      }

      // Heading matches query keywords
      if (chain?.heading) {
        const headingLower = chain.heading.toLowerCase();
        for (const kw of ctx.keywords) {
          if (kw.length >= 3 && headingLower.includes(kw.toLowerCase())) {
            relevance += 15;
          }
        }
      }

      // Onto-affinity: boost sections from indices that match the query's onto role
      if (ctx.onto && chain?.indexAlias) {
        const affinityMap = INDEX_ONTO_AFFINITY[ctx.onto];
        if (affinityMap) {
          const affinity = affinityMap[chain.indexAlias] ?? 0;
          relevance += affinity * 5; // 0, 5, 10, or 15
        }
      }

      // Territory: in-territory sections get a small boost
      if (chain?.territory === 'in') relevance += 5;

      // Cross-references are less important
      if (chain?.isRef) relevance -= 10;

      // Use original plan score as tiebreaker (lower score = more important)
      if (chain) {
        // Normalize: score ranges ~30-200, map to 0-10 bonus range
        relevance += Math.max(0, 10 - Math.floor(chain.score / 20));
      }
    }

    return { text: s, tier, address, chars, relevance, originalIndex: i, chain };
  });

  // Phase 1: Compute core budget (T1 + T2 always kept)
  const coreSections = tagged.filter(s => s.tier <= 2);
  const coreChars = header.length + coreSections.reduce((sum, s) => sum + s.chars, 0);
  const coreTokens = estimateTokens(header + coreSections.map(s => s.text).join(''));

  // Phase 2: Score and sort T3/T4 sections by relevance (descending)
  const supplementary = tagged
    .filter(s => s.tier >= 3)
    .sort((a, b) => b.relevance - a.relevance);

  // Phase 3: Include ALL relevant T3/T4 sections (relevance > 0).
  // Budget expands to fit them, capped at MAX_AUTO_EXPAND.
  // Irrelevant sections (relevance ≤ 0) are always dropped.
  const maxChars = MAX_AUTO_EXPAND * CHARS_PER_TOKEN;

  let currentChars = coreChars;
  const keptSupplementary = new Set<number>();
  const droppedSupplementary: typeof supplementary = [];

  for (const section of supplementary) {
    if (section.relevance > 0 && currentChars + section.chars <= maxChars) {
      keptSupplementary.add(section.originalIndex);
      currentChars += section.chars;
    } else {
      droppedSupplementary.push(section);
    }
  }

  // Phase 4: Build result in original order
  const keptIndices = new Set<number>();
  for (const s of coreSections) keptIndices.add(s.originalIndex);
  for (const idx of keptSupplementary) keptIndices.add(idx);

  const keptSections = tagged.filter(s => keptIndices.has(s.originalIndex));
  const accumulated = header + keptSections.map(s => s.text).join('');

  const tokens = estimateTokens(accumulated);
  const actualBudget = Math.max(tokens, requestedBudget);
  const droppedTotal = droppedSupplementary.length;

  // Check if we expanded beyond original request
  const expanded = actualBudget > originalRequestedBudget;

  if (droppedTotal === 0) {
    const result: BudgetResult = { text: accumulated, tokens, trimmed: false, originalTokens, budget: actualBudget };
    if (expanded) result.expandedFrom = originalRequestedBudget;
    return result;
  }

  // Build tier breakdown for dropped sections
  const droppedByTier: Record<number, number> = {};
  let droppedTokens = 0;
  for (const s of droppedSupplementary) {
    droppedByTier[s.tier] = (droppedByTier[s.tier] ?? 0) + 1;
    droppedTokens += estimateTokens(s.text);
  }

  const tierBreakdown = Object.entries(droppedByTier)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([t, n]) => `T${t}:${n}`)
    .join(', ');

  // Report what was kept and dropped
  const keptSupCount = keptSupplementary.size;
  const irrelevantCount = droppedSupplementary.filter(s => s.relevance <= 0).length;
  const notice = keptSupCount > 0
    ? `\n\n[... ${droppedTotal} sections trimmed (${tierBreakdown}) — ${droppedTokens} est. tokens dropped (${irrelevantCount} irrelevant). ${keptSupCount} relevant T3/T4 sections preserved by aspect scoring. Budget: ${tokens}/${actualBudget}.]`
    : `\n\n[... ${droppedTotal} sections trimmed (${tierBreakdown}) — ${originalTokens} est. tokens > budget ${actualBudget}. Only T1+T2 core content preserved.]`;

  const pressure: BudgetPressure = {
    expandRecommended: false, // T1+T2 are always preserved in aspect-aware mode
    droppedByTier,
    droppedTotal,
    droppedTokens,
    suggestedBudget: actualBudget,
  };

  const result: BudgetResult = {
    text: accumulated + notice,
    tokens: tokens + 40,
    trimmed: true,
    originalTokens,
    budget: actualBudget,
    pressure,
  };
  if (expanded) result.expandedFrom = originalRequestedBudget;
  return result;
}

/**
 * Legacy top-down trimming for text without tier tags.
 */
function applyLegacyBudget(
  header: string,
  sections: string[],
  budget: number,
  originalTokens: number,
): BudgetResult {
  const maxChars = budget * CHARS_PER_TOKEN;
  let accumulated = header;
  let keptSections = 0;

  for (const section of sections) {
    const candidate = accumulated + section;
    if (candidate.length > maxChars && keptSections > 0) break;
    accumulated = candidate;
    keptSections++;
  }

  const tokens = estimateTokens(accumulated);
  const totalSections = sections.length;
  const droppedSections = totalSections - keptSections;

  if (droppedSections === 0) {
    return { text: accumulated, tokens, trimmed: false, originalTokens, budget };
  }

  const notice = `\n\n[... ${droppedSections} of ${totalSections} sections truncated — ${originalTokens} est. tokens exceeded budget of ${budget}. Use filter:true, extract:"normative"/"code"/"table", tier:1, or lower maxUnits.]`;

  return {
    text: accumulated + notice,
    tokens: tokens + 30,
    trimmed: true,
    originalTokens,
    budget,
  };
}
