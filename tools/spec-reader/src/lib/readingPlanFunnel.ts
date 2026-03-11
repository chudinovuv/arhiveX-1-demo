import type { IndexUnit, IndexFile, OntoRole, SeqEntry, EnumTag, NormTag } from './types.js';

// ─── Index registry: alias → IndexFile (unitName → IndexUnit) ──────
export type IndexRegistry = Map<string, IndexFile>;

// ─── Types ──────────────────────────────────────────────────────────

/** A single scored chain entry in the reading plan */
export interface ScoredChain {
  /** Chain address (e.g. "2.5.6/A.") */
  address: string;
  /** Computed priority score (lower = higher importance) */
  score: number;
  /** Source index alias (phya, sema, ont, desa) */
  indexAlias: string;
  /** Source unit name */
  unitName: string;
  /** Order within the unit's seq */
  order: number;
  /** Whether this came from a $ref */
  isRef: boolean;
  /** Heading label from seq entry */
  heading: string;
  /** Whether the chain address is inside the expected section territory for this query */
  territory: 'in' | 'out';
}

/** A tier group for reading */
export interface ReadingTier {
  /** Tier number (1 = highest priority) */
  tier: number;
  /** Score range label */
  label: string;
  /** Grouped chains by target file (basename key) */
  groups: Map<string, ScoredChain[]>;
}

/** Complete reading plan */
export interface ReadingPlan {
  /** Flat scored + deduped + subsumed chain list, sorted by score */
  chains: ScoredChain[];
  /** Tiered grouping for batch reading */
  tiers: ReadingTier[];
  /** Unit abstracts for pre-filtering (if available) */
  unitAbstracts?: Array<{ unitName: string; abstract: string }>;
  /** Summary statistics */
  stats: {
    totalUnits: number;
    totalChainsBefore: number;
    totalChainsAfter: number;
    dedupedCount: number;
    subsumedCount: number;
  };
}

// ─── Weight constants ───────────────────────────────────────────────

const META_WEIGHT = 30;
const ORDER_WEIGHT = 10;
const REF_PENALTY = 2;
const ONTO_BONUS = 15;
const PAIR_PRIMARY = 25;
const PAIR_SECONDARY = 15;
const DIMENSION_BONUS = 5;
const KEYWORD_RESONANCE = 8;
const KEYWORD_IRRELEVANCE = 15;  // penalty when heading matches NONE of the query keywords
const TERRITORY_PENALTY = 20;

// ─── Content tag bonuses ────────────────────────────────────────────
// Applied when seq entry's enumTag/normTag aligns with query intent/dimension.
const ENUM_DIM_BONUS = 10;      // enumTag matches query dimension
const ENUM_INTENT_BONUS = 15;   // enumTag matches intent (list/enumerate → normative enum)
const NORM_DIM_BONUS = 8;       // normTag matches query dimension
const NORM_ONTO_BONUS = 5;      // normTag present + onto=WHEN

// ─── Index territory: which spec section prefixes each index "owns" ──
// Derived from spec structure. Top-2 indices in ranking define the
// "expected zone" — chains outside it get TERRITORY_PENALTY.

const INDEX_TERRITORY: Record<string, string[]> = {
  'bsyn': ['3.'],                                   // block syntax §3
  'grma': ['3.'],                                   // grammar §3
  'phya': ['2.', 'A.', 'B.'],                      // types §2, annexes A/B
  'sema': ['2.7', '4.'],                            // semantic types §2.7, semantic model §4
  'trma': ['2.0', 'B.'],                            // terms §2.0, metadata §B
  'desa': ['8.0', '8.1', '1.'],                     // design §8.0-8.1, principles §1
  'ont':  ['1.', '5.'],                             // ontology §1, domain authority §5
  'bhva': ['7.', '8.8', '8.10', 'D.', 'E.', 'G.'], // enforcement, admissibility, normative, diagnostics
  'phla': ['1.', '5.'],                             // philosophy §1, domain §5
  'onma': ['2.', '3.', '5.', '8.8'],                // ontological role: types, syntax, domain authority, admissibility
};

// ─── 2D Heading Pair model ──────────────────────────────────────────
// Each heading signal maps to an onto-pair [primary, secondary] and a
// query dimension (structural vs behavioral). The pair drives tier
// promotion; the dimension adds an alignment bonus when the query's
// dimension matches.

export type QueryDimension = 'structural' | 'behavioral' | 'mixed';

/** [primary onto, secondary onto, dimension] */
type OntoPairEntry = [OntoRole, OntoRole, QueryDimension];

const HEADING_ONTO_PAIRS: Array<[string, OntoPairEntry]> = [
  // ── WHAT/WHY (structural): identity + purpose ──
  ['semantic role',      ['WHAT', 'WHY',   'structural']],
  ['designation',        ['WHAT', 'WHY',   'structural']],
  ['purpose',            ['WHY',  'WHAT',  'structural']],
  ['rationale',          ['WHY',  'WHAT',  'structural']],
  ['overview',           ['WHAT', 'WHY',   'structural']],

  // ── WHAT/WHERE (structural): scope + location ──
  ['applicability',      ['WHERE','WHEN',  'structural']],
  ['scope',              ['WHERE','WHAT',  'structural']],
  ['visibility',         ['WHERE','WHAT',  'structural']],
  ['placement',          ['WHERE','HOW',   'structural']],

  // ── WHAT/WHEN (structural): properties + rules ──
  ['normative properties', ['WHAT','WHEN', 'structural']],
  ['normative rules',    ['WHEN', 'WHAT',  'structural']],
  ['normative',          ['WHAT', 'WHEN',  'structural']],
  ['constraint',         ['WHEN', 'WHAT',  'structural']],
  ['prohibition',        ['WHEN', 'WHAT',  'structural']],
  ['requirement',        ['WHEN', 'WHAT',  'structural']],

  // ── WHY/WHEN (behavioral): rationale + mechanics ──
  ['enforcement model',  ['WHY',  'WHEN',  'behavioral']],
  ['enforcement mechanic', ['WHY','WHEN',  'behavioral']],
  ['enforcement propagation', ['WHY','WHEN','behavioral']],
  ['enforcement invariant', ['WHEN','WHY', 'behavioral']],
  ['enforcement',        ['WHEN', 'WHY',   'behavioral']],
  ['execution model',    ['WHY',  'WHEN',  'behavioral']],
  ['admissibility',      ['WHEN', 'WHERE', 'behavioral']],
  ['admission',          ['WHEN', 'WHERE', 'behavioral']],
  ['obligation',         ['WHEN', 'WHY',   'behavioral']],
  ['compliance',         ['WHEN', 'WHY',   'behavioral']],
  ['resilience',         ['WHY',  'WHEN',  'behavioral']],
  ['diagnostic',         ['WHEN', 'HOW',   'behavioral']],
  ['lifecycle',          ['WHEN', 'WHAT',  'behavioral']],
  ['evaluation order',   ['HOW',  'WHEN',  'behavioral']],
  ['sequencing',         ['HOW',  'WHEN',  'behavioral']],
  ['closure',            ['HOW',  'WHEN',  'behavioral']],
  ['gate',               ['WHEN', 'WHERE', 'behavioral']],
  ['evidence',           ['WHEN', 'WHY',   'behavioral']],
  ['audit',              ['WHEN', 'WHY',   'behavioral']],
  ['emission',           ['HOW',  'WHEN',  'behavioral']],
  ['inspection',         ['WHEN', 'HOW',   'behavioral']],

  // ── WHAT/HOW (structural): syntax + method ──
  ['syntax',             ['HOW',  'WHAT',  'structural']],
  ['declaration',        ['HOW',  'WHAT',  'structural']],
  ['grammar',            ['HOW',  'WHAT',  'structural']],
  ['canonical',          ['HOW',  'WHAT',  'structural']],

  // ── Pure WHAT (structural) ──
  ['classification',     ['WHAT', 'WHAT',  'structural']],
  ['registry',           ['WHAT', 'WHAT',  'structural']],
  ['type class',         ['WHAT', 'WHAT',  'structural']],
  ['identity',           ['WHAT', 'WHAT',  'structural']],
  ['encoding',           ['HOW',  'WHAT',  'structural']],
  ['serialization',      ['HOW',  'WHAT',  'structural']],
];

// ─── Dimension detection signals (from query keywords) ─────────────

const BEHAVIORAL_SIGNALS = [
  'enforcement', 'enforce', 'admission', 'admissibility', 'gate',
  'obligation', 'compliance', 'diagnostic', 'resilience',
  'execution model', 'evaluation', 'chaining', 'closure', 'emission',
  'audit', 'evidence', 'circuit breaker', 'retry', 'reaction',
  'lifecycle', 'inspection', 'sequencing',
];

const STRUCTURAL_SIGNALS = [
  'syntax', 'declaration', 'type', 'field', 'schema', 'encoding',
  'serialization', 'envelope', 'structure', 'layout', 'format',
  'block', 'stream', 'primitive', 'derived', 'record', 'grammar',
  'identity', 'registry', 'canonical',
];

/** Detect query dimension from keywords */
export function detectDimension(keywords: string[]): QueryDimension {
  const joined = keywords.map(k => k.toLowerCase()).join(' ');
  const hasBeh = BEHAVIORAL_SIGNALS.some(s => joined.includes(s));
  const hasStr = STRUCTURAL_SIGNALS.some(s => joined.includes(s));
  if (hasBeh && !hasStr) return 'behavioral';
  if (hasStr && !hasBeh) return 'structural';
  return 'mixed';
}

/**
 * Compute heading-pair bonus for a heading against query onto + dimension.
 * Pairs are checked longest-first (more specific terms matched first).
 * Returns a non-negative bonus (subtracted from score → lower = better).
 */
function headingPairBonus(headingLower: string, onto: OntoRole | undefined, dimension: QueryDimension): number {
  if (!onto) return 0;

  // Find the longest matching term (most specific match wins)
  let bestTerm = '';
  let bestEntry: OntoPairEntry | undefined;
  for (const [term, entry] of HEADING_ONTO_PAIRS) {
    if (term.length > bestTerm.length && headingLower.includes(term)) {
      bestTerm = term;
      bestEntry = entry;
    }
  }
  if (!bestEntry) return 0;

  const [primary, secondary, pairDim] = bestEntry;
  const dimBonus = (dimension === pairDim || dimension === 'mixed') ? DIMENSION_BONUS : 0;

  if (onto === primary)   return PAIR_PRIMARY   + dimBonus; // 25-30
  if (onto === secondary) return PAIR_SECONDARY + dimBonus; // 15-20
  // Heading matched a pair term but neither role matches the query onto —
  // still give a small boost when the dimension aligns.
  return dimBonus; // 0 or 5
}

// ─── Tier boundaries (score ranges) ────────────────────────────────
// With META=30: rank1/order1=40, rank2/order1=70, rank3/order1=100
// With onto bonus -15: rank2/order1+onto=55, rank3/order1+onto=85
// With pair bonus -25...-30, keyword resonance -8: up to -38 additional
// Tier promotion examples:
//   rank2/order5 (110) + pair primary -25 + dim -5 = 80 → T2  (was T3)
//   rank2/order8 (140) + pair secondary -15 + kw -8      = 117 → T3  (was T4)

const TIER_BOUNDARIES = [
  { tier: 1, max: 60, label: 'Core definitions' },
  { tier: 2, max: 95, label: 'Normative properties' },
  { tier: 3, max: 125, label: 'Registry & cross-refs' },
  { tier: 4, max: Infinity, label: 'Supplementary context' },
];

// ─── Funnel implementation ──────────────────────────────────────────

/**
 * Build a weighted reading plan from matched index units.
 * 
 * Algorithm:
 * 1. Detect query dimension (structural | behavioral | mixed)
 * 2. Score each chain: metaWeight × 30 + order × 10 - ontoBonus - headingPairBonus - keywordResonance
 * 3. Sort by score ascending
 * 4. Deduplicate by chain address (keep lowest score)
 * 5. Subsume child addresses when parent is present
 * 6. Group by file, assign to tiers
 */
/**
 * Derive expected section prefixes from the top indices in the ranking.
 * Chains whose address does not match any expected prefix get TERRITORY_PENALTY.
 */
function deriveExpectedPrefixes(indexRanking: string[], onto?: OntoRole, intent?: string): Set<string> {
  const prefixes = new Set<string>();

  // Top-2 indices define the "expected zone"
  for (const idx of indexRanking.slice(0, 2)) {
    const territory = INDEX_TERRITORY[idx];
    if (territory) {
      for (const p of territory) prefixes.add(p);
    }
  }

  // Intent modifiers — widen zone for specific intents
  if (intent === 'grammar' || intent === 'declaration') prefixes.add('3.');
  if (intent === 'normative_rules') { prefixes.add('D.'); prefixes.add('E.'); }
  if (intent === 'canonical_example') prefixes.add('3.');

  // Onto modifiers
  if (onto === 'WHAT') { prefixes.add('2.'); prefixes.add('A.'); }
  if (onto === 'WHY')  { prefixes.add('1.'); prefixes.add('5.'); }
  if (onto === 'HOW')  prefixes.add('3.');

  return prefixes;
}

/** Check if a chain address falls within the expected section territory */
function isInTerritory(address: string, expectedPrefixes: Set<string>): boolean {
  const base = address.split('/')[0];
  for (const prefix of expectedPrefixes) {
    if (base.startsWith(prefix)) return true;
    // Exact prefix match for annex-style (e.g. 'A.' matches 'A.1.2')
    if (prefix.length <= 2 && base.charAt(0) === prefix.charAt(0)) return true;
  }
  return false;
}

export function buildReadingPlan(
  matches: Array<{
    alias: string;
    unitName: string;
    unit: IndexUnit;
    matchedKeywords: string[];
    ontoMatch?: boolean;
  }>,
  /** Rank ordering of index aliases by relevance.
   *  E.g. ['phya','sema','ont'] → phya gets meta=1, sema=2, ont=3 */
  indexRanking: string[],
  /** Optional: query keywords for heading keyword-resonance */
  queryKeywords?: string[],
  /** Optional: ontological role for heading subject/conditions resonance */
  onto?: OntoRole,
  /** Optional: full index registry for cross-index $ref resolution */
  indexRegistry?: IndexRegistry,
  /** Optional: reading intent for territory derivation */
  intent?: string,
): ReadingPlan {
  // Derive expected section territory from top indices + onto + intent
  const expectedPrefixes = deriveExpectedPrefixes(indexRanking, onto, intent);

  // Detect query dimension (structural vs behavioral) from keywords
  const dimension = queryKeywords ? detectDimension(queryKeywords) : 'mixed' as QueryDimension;

  // Phase 1: Collect all chain entries with scores
  const allEntries: ScoredChain[] = [];

  for (const match of matches) {
    const metaRank = indexRanking.indexOf(match.alias);
    const metaWeight = metaRank >= 0 ? metaRank + 1 : indexRanking.length + 1;
    const ontoBonus = match.ontoMatch ? ONTO_BONUS : 0;

    collectFromUnit(match.unit, match.alias, match.unitName, metaWeight, ontoBonus, allEntries, new Set(), queryKeywords, onto, indexRegistry, expectedPrefixes, dimension, intent);
  }

  const totalBefore = allEntries.length;

  // Phase 2: Sort by score ascending
  allEntries.sort((a, b) => a.score - b.score);

  // Phase 3: Deduplicate by chain address (keep first = lowest score)
  const dedupMap = new Map<string, ScoredChain>();
  for (const entry of allEntries) {
    if (!dedupMap.has(entry.address)) {
      dedupMap.set(entry.address, entry);
    }
  }
  let chains = Array.from(dedupMap.values());
  const dedupedCount = totalBefore - chains.length;

  // Phase 4: Subsume (remove child addresses when parent covers them)
  const beforeSubsume = chains.length;
  chains = applySubsumption(chains);
  const subsumedCount = beforeSubsume - chains.length;

  // Phase 5: Re-sort after subsumption
  chains.sort((a, b) => a.score - b.score);

  // Phase 6: Group into tiers
  const tiers = buildTiers(chains);

  // Phase 7: Collect unit abstracts
  const unitAbstracts: Array<{ unitName: string; abstract: string }> = [];
  for (const match of matches) {
    if (match.unit.abstract) {
      unitAbstracts.push({ unitName: match.unitName, abstract: match.unit.abstract });
    }
  }

  return {
    chains,
    tiers,
    unitAbstracts: unitAbstracts.length > 0 ? unitAbstracts : undefined,
    stats: {
      totalUnits: matches.length,
      totalChainsBefore: totalBefore,
      totalChainsAfter: chains.length,
      dedupedCount,
      subsumedCount,
    },
  };
}

// ─── Internal helpers ───────────────────────────────────────────────

/** Recursively collect chain entries from a unit, following $ref inline */
function collectFromUnit(
  unit: IndexUnit,
  alias: string,
  unitName: string,
  metaWeight: number,
  ontoBonus: number,
  out: ScoredChain[],
  visitedRefs: Set<string>,
  queryKeywords?: string[],
  onto?: OntoRole,
  indexRegistry?: IndexRegistry,
  expectedPrefixes?: Set<string>,
  dimension: QueryDimension = 'mixed',
  intent?: string,
): void {
  if (!unit.seq) return;

  const kwLower = queryKeywords?.map(k => k.toLowerCase()) ?? [];
  // For multi-word keywords, also match individual words (≥3 chars) so that
  // "domain model" matches heading containing "domain" even without literal substring.
  const kwTokens: string[] = [];
  for (const kw of kwLower) {
    kwTokens.push(kw);  // full phrase
    if (kw.includes(' ')) {
      for (const w of kw.split(/\s+/)) {
        if (w.length >= 3 && !kwTokens.includes(w)) kwTokens.push(w);
      }
    }
  }

  for (const entry of unit.seq) {
    if (!entry || typeof entry !== 'object') continue;

    // Internal $ref entry — resolve to referenced unit's chains within same index
    if ('$ref' in entry && typeof entry.$ref === 'string') {
      const refPath = entry.$ref as string;  // e.g. "/typeSerialization"
      if (visitedRefs.has(refPath)) continue;
      visitedRefs.add(refPath);

      if (indexRegistry) {
        const refUnit = resolveInternalRef(refPath, alias, indexRegistry);
        if (refUnit) {
          // Recurse into referenced unit with REF_PENALTY applied via higher metaWeight
          collectFromUnit(refUnit, alias, `${unitName}→${refPath.replace(/^\//, '')}`, metaWeight + REF_PENALTY, ontoBonus, out, visitedRefs, queryKeywords, onto, indexRegistry, undefined, dimension, intent);
        }
      }
      continue;
    }

    if (!Array.isArray(entry.chain) || entry.chain.length === 0) continue;

    // External cross-index ref: chain addresses starting with "$alias/unitName"
    // e.g. ["$bhva/methodNormatives"] → resolve to that unit's real chain addresses
    const realChains: string[] = [];
    const refChains: Array<{ addr: string; refAlias: string; refUnitName: string }> = [];

    for (const addr of entry.chain) {
      if (addr.startsWith('$') && indexRegistry) {
        const parsed = parseExternalRef(addr);
        if (parsed) {
          refChains.push({ addr, refAlias: parsed.alias, refUnitName: parsed.unitName });
        } else {
          realChains.push(addr);  // Malformed $-addr, keep as-is
        }
      } else {
        realChains.push(addr);
      }
    }

    const heading = extractHeadingLabel(entry);
    const headingLower = heading.toLowerCase();

    // 2D heading pair bonus: onto-pair match + dimension alignment.
    // Works for all heading levels (H1–H6), enabling tier promotion
    // for T3/T4 chains whose headings match the query's onto pair.
    const pairBonus = headingPairBonus(headingLower, onto, dimension);

    // Direct keyword match in heading (independent of onto).
    // Uses kwTokens which includes individual words from multi-word keywords
    // so "domain model" matches heading containing "domain".
    const hasFallbackHeading = headingLower.startsWith('order ');
    const hasKeywordMatch = !hasFallbackHeading && kwTokens.length > 0 &&
      kwTokens.some(kw => headingLower.includes(kw));
    const keywordResonance = hasKeywordMatch ? KEYWORD_RESONANCE : 0;

    // Irrelevance penalty: heading matches NONE of the query keywords.
    // Applied only when query has 2+ keywords (multi-subject questions like
    // "new + binder") to push non-subject chains (e.g. invoke) down.
    // Skip for fallback headings ("Order N") — no real heading text to match.
    const irrelevancePenalty = !hasFallbackHeading && !hasKeywordMatch && kwLower.length >= 2
      ? KEYWORD_IRRELEVANCE : 0;

    // Content tag bonus: enumTag/normTag alignment with query
    const tagBonus = contentTagBonus(entry, onto, dimension, intent);

    const baseScore = metaWeight * META_WEIGHT + entry.Order * ORDER_WEIGHT
      - ontoBonus - pairBonus - keywordResonance - tagBonus + irrelevancePenalty;

    // Emit real chain addresses at normal score + territory penalty
    for (const addr of realChains) {
      const inTerr = !expectedPrefixes || expectedPrefixes.size === 0 || isInTerritory(addr, expectedPrefixes);
      const score = baseScore + (inTerr ? 0 : TERRITORY_PENALTY);
      out.push({
        address: addr,
        score,
        indexAlias: alias,
        unitName,
        order: entry.Order,
        isRef: false,
        heading,
        territory: inTerr ? 'in' : 'out',
      });
    }

    // Resolve external $ref chain addresses and emit expanded chains with REF_PENALTY
    for (const ref of refChains) {
      const refIndex = indexRegistry?.get(ref.refAlias);
      if (!refIndex) {
        // Unresolvable: emit as-is (will show [$alias] tag in plan)
        out.push({
          address: ref.addr,
          score: baseScore + REF_PENALTY * META_WEIGHT,
          indexAlias: ref.refAlias,
          unitName: ref.refUnitName,
          order: entry.Order,
          isRef: true,
          heading: `$ref: ${ref.addr}`,
          territory: 'out',
        });
        continue;
      }

      const refUnit = refIndex[ref.refUnitName];
      if (!refUnit?.seq) {
        out.push({
          address: ref.addr,
          score: baseScore + REF_PENALTY * META_WEIGHT,
          indexAlias: ref.refAlias,
          unitName: ref.refUnitName,
          order: entry.Order,
          isRef: true,
          heading: `$ref: ${ref.addr}`,
          territory: 'out',
        });
        continue;
      }

      // Expand referenced unit's chains with REF_PENALTY
      const refKey = `${ref.refAlias}/${ref.refUnitName}`;
      if (visitedRefs.has(refKey)) continue;
      visitedRefs.add(refKey);

      collectFromUnit(
        refUnit, ref.refAlias, ref.refUnitName,
        metaWeight + REF_PENALTY, ontoBonus,
        out, visitedRefs, queryKeywords, onto, indexRegistry, expectedPrefixes, dimension, intent
      );
    }
  }
}

// ─── Content tag scoring ────────────────────────────────────────────

/** Map enumTag/normTag categories to query dimensions */
const ENUM_TO_DIM: Record<string, QueryDimension> = {
  normative: 'behavioral',   // normative rules are behavioral aspect
  behavioral: 'behavioral',
  structural: 'structural',
  example: 'mixed',           // examples are dimension-neutral
  identity: 'structural',     // identity/designation is structural
};

const NORM_TO_DIM: Record<string, QueryDimension> = {
  behavioral: 'behavioral',
  structural: 'structural',
  declarative: 'structural',  // declarations are structural
  semantic: 'behavioral',     // semantic enforcement is behavioral
};

/** Intent values that signal "list/enumerate" queries */
const LIST_INTENTS = new Set(['normative_rules', 'list', 'enumerate']);
/** Intent values that request examples */
const EXAMPLE_INTENTS = new Set(['canonical_example']);

/**
 * Compute bonus from content tags (enumTag, normTag) alignment
 * with query dimension, onto, and intent.
 */
function contentTagBonus(
  entry: SeqEntry,
  onto: OntoRole | undefined,
  dimension: QueryDimension,
  intent: string | undefined,
): number {
  let bonus = 0;

  // enumTag scoring
  const et = entry.enumTag as string | undefined;
  if (et) {
    // Intent alignment: "list normative rules" + enumTag=normative
    if (intent && LIST_INTENTS.has(intent) && et === 'normative') {
      bonus += ENUM_INTENT_BONUS;
    } else if (intent && EXAMPLE_INTENTS.has(intent) && et === 'example') {
      bonus += ENUM_INTENT_BONUS;
    }
    // Dimension alignment: structural enum + structural query
    const enumDim = ENUM_TO_DIM[et];
    if (enumDim && dimension !== 'mixed' && enumDim === dimension) {
      bonus += ENUM_DIM_BONUS;
    }
  }

  // normTag scoring
  const nt = entry.normTag as string | undefined;
  if (nt) {
    // Dimension alignment
    const normDim = NORM_TO_DIM[nt];
    if (normDim && dimension !== 'mixed' && normDim === dimension) {
      bonus += NORM_DIM_BONUS;
    }
    // onto=WHEN + any normTag → mild boost (norms answer "when does X apply?")
    if (onto === 'WHEN') {
      bonus += NORM_ONTO_BONUS;
    }
  }

  return bonus;
}

// ─── Cross-reference resolution helpers ─────────────────────────────

/** Resolve an internal $ref like "/typeSerialization" to the unit in the same index */
function resolveInternalRef(refPath: string, sourceAlias: string, registry: IndexRegistry): IndexUnit | undefined {
  const unitName = refPath.replace(/^\//, '');
  const index = registry.get(sourceAlias);
  return index?.[unitName];
}

/** Parse an external $alias/unitName address */
function parseExternalRef(addr: string): { alias: string; unitName: string } | undefined {
  // Format: "$bhva/methodNormatives" → alias="bhva", unitName="methodNormatives"
  const match = addr.match(/^\$([a-z]+)\/(.+)$/);
  if (!match) return undefined;
  return { alias: match[1], unitName: match[2] };
}

/** Extract heading label from a seq entry */
function extractHeadingLabel(entry: SeqEntry): string {
  for (let l = 1; l <= 6; l++) {
    const key = `H${l}`;
    if (key in entry && typeof entry[key] === 'string') {
      return entry[key] as string;
    }
  }
  if ('Note' in entry && typeof entry.Note === 'string' && entry.Note.length > 0) {
    return entry.Note;
  }
  return `Order ${entry.Order}`;
}

/** Extract heading level (1-6) from a seq entry. Returns 0 if no H-tag. */
function extractHeadingLevel(entry: SeqEntry): number {
  for (let l = 1; l <= 6; l++) {
    const key = `H${l}`;
    if (key in entry && typeof entry[key] === 'string') {
      return l;
    }
  }
  return 0;
}

/** 
 * Apply subsumption: if a broader address is present, remove narrower ones.
 * 
 * Rules:
 * - "2.5.3/all" subsumes "2.5.3", "2.5.3/A.", "2.5.3/(A)-(C)"
 * - "2.5.3/(A)-(F)" subsumes "2.5.3/(B)-(D)"
 * - "2.5.3" (heading+first para) does NOT subsume "2.5.3/A." (different extractions)
 */
function applySubsumption(chains: ScoredChain[]): ScoredChain[] {
  // Collect all base+suffix combos
  const allAddresses = new Set(chains.map(c => c.address));
  
  // Build a set of "/all" bases for quick lookup
  const allBases = new Set<string>();
  for (const addr of allAddresses) {
    if (addr.endsWith('/all')) {
      allBases.add(addr.replace(/\/all$/, ''));
    }
  }

  return chains.filter(chain => {
    const addr = chain.address;
    
    // Never remove /all entries — they are the broadest
    if (addr.endsWith('/all')) return true;

    // Parse base
    const slashIdx = addr.indexOf('/');
    const base = slashIdx >= 0 ? addr.substring(0, slashIdx) : addr;
    const suffix = slashIdx >= 0 ? addr.substring(slashIdx + 1) : '';

    // If "base/all" exists and this is a child of that base → subsumed
    if (allBases.has(base) && suffix !== '') {
      return false;
    }

    // If this is a bare section number (no suffix) and "base/all" exists → subsumed
    if (suffix === '' && allBases.has(base)) {
      return false;
    }

    return true;
  });
}

/** Group chains into tiers based on score boundaries */
function buildTiers(chains: ScoredChain[]): ReadingTier[] {
  const tiers: ReadingTier[] = TIER_BOUNDARIES.map(b => ({
    tier: b.tier,
    label: b.label,
    groups: new Map<string, ScoredChain[]>(),
  }));

  for (const chain of chains) {
    const tier = tiers.find(t => {
      const boundary = TIER_BOUNDARIES.find(b => b.tier === t.tier)!;
      return chain.score <= boundary.max;
    }) ?? tiers[tiers.length - 1];

    // Group by file base (approximate: use section number prefix)
    const fileKey = guessFileKey(chain.address);
    const group = tier.groups.get(fileKey) ?? [];
    group.push(chain);
    tier.groups.set(fileKey, group);
  }

  // Remove empty tiers
  return tiers.filter(t => t.groups.size > 0);
}

/** Guess file grouping key from chain address (e.g. "2.5.6/A." → "2.5", "B.4.2" → "B") */
function guessFileKey(addr: string): string {
  const base = addr.split('/')[0];
  // Annex: starts with uppercase letter
  if (/^[A-Z]\./.test(base)) return base.charAt(0);
  // Section: take first two segments (e.g. "2.5.6" → "2.5")
  const parts = base.split('.');
  if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
  return parts[0];
}

// ─── Formatting ─────────────────────────────────────────────────────

/** Format a reading plan as concise text output for the agent */
export function formatReadingPlan(plan: ReadingPlan): string {
  const lines: string[] = [];

  const outOfTerrCount = plan.chains.filter(c => c.territory === 'out').length;
  lines.push('═══ READING PLAN ═══');
  lines.push(`Units: ${plan.stats.totalUnits} | Chains: ${plan.stats.totalChainsBefore} → ${plan.stats.totalChainsAfter} (deduped: ${plan.stats.dedupedCount}, subsumed: ${plan.stats.subsumedCount}${outOfTerrCount > 0 ? `, territory-demoted: ${outOfTerrCount}` : ''})`);

  // Show unit abstracts if available
  if (plan.unitAbstracts && plan.unitAbstracts.length > 0) {
    lines.push('');
    for (const ua of plan.unitAbstracts) {
      lines.push(`  ⤷ [${ua.unitName}] ${ua.abstract}`);
    }
  }
  lines.push('');

  for (const tier of plan.tiers) {
    lines.push(`─── Tier ${tier.tier}: ${tier.label} ───`);
    
    for (const [fileKey, chains] of tier.groups) {
      const addrs = chains.map(c => {
        const tag = c.territory === 'out' ? ' ⚠' : '';
        return c.address + tag;
      }).join(', ');
      lines.push(`  [${fileKey}] ${addrs}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/** Extract flat list of chain addresses from a plan, ordered by score */
export function planToChainList(plan: ReadingPlan): string[] {
  return plan.chains.map(c => c.address);
}

/** Extract chain addresses for a specific tier */
export function tierChains(plan: ReadingPlan, tierNum: number): string[] {
  const tier = plan.tiers.find(t => t.tier === tierNum);
  if (!tier) return [];
  const chains: string[] = [];
  for (const group of tier.groups.values()) {
    for (const c of group) {
      chains.push(c.address);
    }
  }
  return chains;
}

/** Build a map from chain address → tier number for tier-tagging in output */
export function chainTierMap(plan: ReadingPlan): Map<string, number> {
  const map = new Map<string, number>();
  for (const tier of plan.tiers) {
    for (const group of tier.groups.values()) {
      for (const chain of group) {
        map.set(chain.address, tier.tier);
      }
    }
  }
  return map;
}
