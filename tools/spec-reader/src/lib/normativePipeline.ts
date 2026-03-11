/**
 * Normative-Driven Pipeline (NDP)
 *
 * Uses RFC 2119 keywords (MUST, SHOULD, MAY, etc.) extracted from the top-matched
 * unit's T1 content as pipeline control signals:
 *
 *   MUST        → aggressive enrichment (weight ×3)
 *   MUST NOT    → aggressive filtering (negative keywords, demote units)
 *   SHOULD      → priority enrichment (weight ×2)
 *   SHOULD NOT  → moderate filtering (soft demote, −score penalty)
 *   MAY         → conditional enrichment (only if T2 is sparse)
 *
 * The pipeline reads the full section(s) of the top unit, parses every line
 * for normative statements, extracts meaningful terms from each, and produces
 * enrichment/filter sets that the scoring engine can apply.
 */

import type { IndexUnit, OntoRole, SeqEntry, ChainAddress } from './types.js';
import { extractNormatives, type NormativeEntry } from './textExtractor.js';

// ─── Types ──────────────────────────────────────────────────────────

export type NormativeLevel = 'MUST' | 'MUST_NOT' | 'SHOULD' | 'SHOULD_NOT' | 'MAY';

export interface NormativeTerm {
  /** The extracted term (lowercased) */
  term: string;
  /** Normative level that governs this term */
  level: NormativeLevel;
  /** Weight multiplier for scoring: positive = enrich, negative = demote */
  weight: number;
}

export interface NdpResult {
  /** Terms to add to enrichment with positive weight */
  enrichTerms: Array<{ term: string; weight: number }>;
  /** Terms to use as negative signals (demote matching units) */
  filterTerms: Array<{ term: string; weight: number }>;
  /** MAY-terms: only used if T2 is sparse */
  conditionalTerms: Array<{ term: string; weight: number }>;
  /** Raw normative entries for diagnostic trace */
  rawEntries: NormativeEntry[];
  /** Trace string for debug output */
  trace: string;
}

// ─── Constants ──────────────────────────────────────────────────────

/** Weight multipliers per normative level */
const MUST_WEIGHT = 3;
const SHOULD_WEIGHT = 2;
const MAY_WEIGHT = 1;
const MUST_NOT_PENALTY = -3;
const SHOULD_NOT_PENALTY = -1;

/** Max terms per normative level to prevent flooding */
const MAX_MUST_TERMS = 10;
const MAX_SHOULD_TERMS = 8;
const MAX_MAY_TERMS = 5;
const MAX_FILTER_TERMS = 15;

/**
 * Stop-words excluded from normative term extraction.
 * These are structural/grammatical words that don't carry domain meaning.
 */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'be', 'been', 'being',
  'was', 'were', 'will', 'shall', 'should', 'may', 'can',
  'must', 'not', 'do', 'does', 'did', 'has', 'have', 'had',
  'it', 'its', 'this', 'that', 'these', 'those',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from',
  'and', 'or', 'but', 'if', 'when', 'where', 'which', 'who',
  'as', 'no', 'any', 'all', 'each', 'every', 'only',
  'same', 'other', 'such', 'than', 'more', 'most',
  'also', 'already', 'always', 'never', 'either', 'neither',
  'both', 'yet', 'still', 'even', 'just', 'so', 'too',
  'however', 'therefore', 'thus', 'hence', 'otherwise',
  'whether', 'nor', 'without', 'within', 'through', 'between',
  'above', 'below', 'before', 'after', 'during', 'until',
  'about', 'into', 'out', 'up', 'down', 'over', 'under',
  'using', 'used', 'uses', 'use', 'declared', 'declare',
  'form', 'once', 'created', 'given', 'make', 'made',
  'produce', 'produced', 'result', 'results',
  'defined', 'define', 'defines', 'applied', 'apply',
  'expressed', 'contain', 'contains',
  'encode', 'perform', 'invoke', 'introduce', 'depend', 'emit', 'interact',
  'reference', 'evaluate', 'reshape', 'project',
]);

/**
 * RFC 2119 modal keywords — filtered even from backtick/bold terms.
 * These are normative markers, not domain terms.
 */
const RFC2119_MODALS = new Set([
  'must', 'must not', 'shall', 'shall not',
  'should', 'should not', 'may', 'required',
  'recommended', 'not recommended', 'optional',
]);

// ─── Normative level classifier ─────────────────────────────────────

/**
 * Classify an RFC 2119 keyword string into a NormativeLevel.
 */
export function classifyNormative(keyword: string): NormativeLevel {
  const upper = keyword.toUpperCase().replace(/\s+/g, ' ').trim();
  if (upper === 'MUST NOT' || upper === 'SHALL NOT') return 'MUST_NOT';
  if (upper === 'MUST' || upper === 'SHALL' || upper === 'REQUIRED') return 'MUST';
  if (upper === 'SHOULD NOT' || upper === 'NOT RECOMMENDED') return 'SHOULD_NOT';
  if (upper === 'SHOULD' || upper === 'RECOMMENDED') return 'SHOULD';
  return 'MAY'; // MAY, OPTIONAL
}

// ─── Term extraction from normative lines ───────────────────────────

/**
 * Backtick-quoted term: `action`, `flow`, `inline`, etc.
 * These are the highest-quality terms — explicit language construct references.
 */
const BACKTICK_TERM_RE = /`([a-zA-Z][a-zA-Z0-9_ ]*)`/g;

/**
 * Bold terms: **deterministic**, **side-effect free**, etc.
 * Secondary quality — emphasis markers often carry domain meaning.
 * Includes hyphens and spaces for compound terms.
 */
const BOLD_TERM_RE = /\*\*([a-zA-Z][a-zA-Z0-9_ -]*)\*\*/g;

/**
 * Extract meaningful terms from a normative statement line.
 * Priority: backtick-quoted > bold > bare nouns/compound terms.
 */
export function extractTermsFromLine(line: string): string[] {
  const terms: string[] = [];
  const seen = new Set<string>();

  /** Add a term — backtick/bold terms bypass stop-word filter but not RFC 2119 modals */
  const addMarked = (t: string) => {
    const lower = t.toLowerCase().trim();
    if (lower.length < 2) return;
    if (RFC2119_MODALS.has(lower)) return;
    if (seen.has(lower)) return;
    seen.add(lower);
    terms.push(lower);
  };

  /** Add a bare word — filtered by stop-word list */
  const addBare = (t: string) => {
    const lower = t.toLowerCase().trim();
    if (lower.length < 2) return;
    if (STOP_WORDS.has(lower)) return;
    if (seen.has(lower)) return;
    seen.add(lower);
    terms.push(lower);
  };

  // Phase 1: backtick terms (highest quality — never filtered)
  let m: RegExpExecArray | null;
  while ((m = BACKTICK_TERM_RE.exec(line)) !== null) {
    addMarked(m[1]);
  }
  BACKTICK_TERM_RE.lastIndex = 0;

  // Phase 2: bold terms (never filtered)
  while ((m = BOLD_TERM_RE.exec(line)) !== null) {
    addMarked(m[1]);
  }
  BOLD_TERM_RE.lastIndex = 0;

  // Phase 3: bare significant words (only if phases 1-2 found < 2 terms)
  if (terms.length < 2) {
    // Strip markdown formatting for bare word extraction
    const plain = line
      .replace(/`[^`]+`/g, '')
      .replace(/\*\*[^*]+\*\*/g, '')
      .replace(/\*[^*]+\*/g, '')
      .replace(/\[[^\]]+\]\([^)]+\)/g, '');
    // Extract compound terms with hyphen or multi-word
    const compounds = plain.match(/\b[a-zA-Z]+-[a-zA-Z]+(?:-[a-zA-Z]+)?\b/g);
    if (compounds) {
      for (const c of compounds) addBare(c);
    }
    // Extract remaining significant words (5+ chars, likely nouns)
    const words = plain.match(/\b[a-zA-Z]{5,}\b/g);
    if (words) {
      for (const w of words) addBare(w);
    }
  }

  return terms;
}

// ─── Main NDP function ──────────────────────────────────────────────

/**
 * Run the Normative-Driven Pipeline on the text content of the top-matched unit's
 * section(s). The text should be the full H2/H3 section read line-by-line.
 *
 * @param sectionText Full text of the top unit's primary section(s)
 * @param queryKeywords The original search keywords (to exclude from NDP output)
 * @returns NdpResult with enrichment, filter, and conditional term sets
 */
export function runNdp(sectionText: string, queryKeywords: string[]): NdpResult {
  const querySet = new Set(queryKeywords.map(k => k.toLowerCase()));
  const entries = extractNormatives(sectionText);

  const enrichMap = new Map<string, number>(); // term → max weight (positive)
  const filterMap = new Map<string, number>(); // term → penalty (negative)
  const conditionalMap = new Map<string, number>(); // MAY terms

  for (const entry of entries) {
    const level = classifyNormative(entry.keyword);
    const terms = extractTermsFromLine(entry.line);

    for (const term of terms) {
      // Skip terms that are already in the query (no value in re-enriching)
      if (querySet.has(term)) continue;

      switch (level) {
        case 'MUST':
          enrichMap.set(term, Math.max(enrichMap.get(term) ?? 0, MUST_WEIGHT));
          break;
        case 'MUST_NOT':
          filterMap.set(term, Math.min(filterMap.get(term) ?? 0, MUST_NOT_PENALTY));
          break;
        case 'SHOULD':
          enrichMap.set(term, Math.max(enrichMap.get(term) ?? 0, SHOULD_WEIGHT));
          break;
        case 'SHOULD_NOT':
          filterMap.set(term, Math.min(filterMap.get(term) ?? 0, SHOULD_NOT_PENALTY));
          break;
        case 'MAY':
          conditionalMap.set(term, Math.max(conditionalMap.get(term) ?? 0, MAY_WEIGHT));
          break;
      }
    }
  }

  // Sort by weight (highest first) and cap each bucket
  const enrichTerms = [...enrichMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_MUST_TERMS + MAX_SHOULD_TERMS)
    .map(([term, weight]) => ({ term, weight }));

  const filterTerms = [...filterMap.entries()]
    .sort((a, b) => a[1] - b[1]) // most negative first
    .slice(0, MAX_FILTER_TERMS)
    .map(([term, weight]) => ({ term, weight }));

  const conditionalTerms = [...conditionalMap.entries()]
    .filter(([term]) => !enrichMap.has(term) && !filterMap.has(term))
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_MAY_TERMS)
    .map(([term, weight]) => ({ term, weight }));

  // Build trace
  const traceLines: string[] = [];
  if (enrichTerms.length > 0) {
    traceLines.push(`  enrich: ${enrichTerms.map(t => `${t.term}(×${t.weight})`).join(', ')}`);
  }
  if (filterTerms.length > 0) {
    traceLines.push(`  filter: ${filterTerms.map(t => `${t.term}(${t.weight})`).join(', ')}`);
  }
  if (conditionalTerms.length > 0) {
    traceLines.push(`  conditional: ${conditionalTerms.map(t => t.term).join(', ')}`);
  }
  const trace = traceLines.length > 0
    ? `\nNDP (${entries.length} normatives → ${enrichTerms.length} enrich, ${filterTerms.length} filter, ${conditionalTerms.length} conditional):\n${traceLines.join('\n')}\n`
    : '';

  return {
    enrichTerms,
    filterTerms,
    conditionalTerms,
    rawEntries: entries,
    trace,
  };
}

// ─── Score adjustment ───────────────────────────────────────────────

/**
 * Apply NDP filter terms as a scoring penalty to unit match results.
 * Units whose keywords overlap with NDP filterTerms get demoted,
 * but only as a tiebreaker — weightedScore from indexLoader remains
 * the primary ranking signal.
 *
 * @param matches Array of index match results (will be re-sorted in place)
 * @param ndp The NDP result containing filterTerms
 * @returns The adjusted matches (same array, re-sorted)
 */
export function applyNdpScoring<T extends { unit: IndexUnit; matchedKeywords: string[]; weightedScore?: number; ontoMatch?: boolean }>(
  matches: T[],
  ndp: NdpResult,
): T[] {
  if (ndp.filterTerms.length === 0) return matches;

  const negativeSet = new Set(ndp.filterTerms.map(t => t.term));

  // Score each match: count how many of its keywords overlap with negative terms
  const penalties = new Map<T, number>();
  for (const match of matches) {
    let penalty = 0;
    for (const kw of match.unit.keywords) {
      const lower = kw.toLowerCase();
      if (negativeSet.has(lower)) {
        penalty += 1;
      }
      // Also check if any negative term is a substring of the keyword
      for (const neg of negativeSet) {
        if (lower.includes(neg) && lower !== neg) {
          penalty += 0.5;
        }
      }
    }
    penalties.set(match, penalty);
  }

  // Re-sort: ws desc → ontoMatch desc → NDP penalty asc.
  // ontoMatch preserves the semantic intent from indexLoader (onto-matching
  // units should not be displaced by non-matching ones due to NDP self-penalty).
  matches.sort((a, b) => {
    const wsA = (a as any).weightedScore ?? 0;
    const wsB = (b as any).weightedScore ?? 0;
    if (wsA !== wsB) return wsB - wsA;
    const ontoA = (a as any).ontoMatch ? 1 : 0;
    const ontoB = (b as any).ontoMatch ? 1 : 0;
    if (ontoA !== ontoB) return ontoB - ontoA;
    return (penalties.get(a) ?? 0) - (penalties.get(b) ?? 0);
  });

  return matches;
}
