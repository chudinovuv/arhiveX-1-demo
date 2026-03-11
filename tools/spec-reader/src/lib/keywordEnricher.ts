import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { glob } from 'fs/promises';
import type { IndexFile } from './types.js';

// ─── Types ──────────────────────────────────────────────────────────

/** A term-definition entry from a T&D table */
export interface TermEntry {
  term: string;
  definition: string;
  /** Words extracted from the definition for matching */
  definitionWords: Set<string>;
  /** Source chain address (e.g. "2.0.1/table-1") */
  source: string;
}

/** Enrichment result */
export interface EnrichedKeywords {
  /** Original user keywords */
  original: string[];
  /** Expanded keywords after enrichment */
  expanded: string[];
  /** Trace: which source contributed each new keyword */
  trace: Array<{ keyword: string; source: string; reason: string }>;
}

// ─── Stop words (not useful for search) ─────────────────────────────

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'must', 'not', 'no',
  'and', 'or', 'but', 'if', 'then', 'else', 'when', 'where', 'how',
  'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those',
  'it', 'its', 'they', 'them', 'their', 'we', 'our', 'you', 'your',
  'he', 'she', 'his', 'her', 'my', 'me', 'i',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as',
  'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'between', 'under', 'over', 'up', 'down', 'out', 'off', 'about',
  'than', 'so', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'any', 'only', 'own',
  'same', 'also', 'very', 'just', 'because', 'once', 'here', 'there',
  'e.g.', 'i.e.', 'etc', 'via', 'within', 'without', 'across',
  'new', 'used', 'using', 'defined', 'based', 'given', 'per',
]);

// ─── Keyword Enricher class ─────────────────────────────────────────

export class KeywordEnricher {
  private terms: TermEntry[] = [];
  private indices: Map<string, IndexFile> = new Map();
  /** Flat set of all index keywords (lowercase) — used for T&D cross-reference */
  private allIndexKeywords: Set<string> = new Set();
  private initialized = false;

  constructor(private specRoot: string) {}

  /** Initialize: parse T&D tables from spec files */
  async init(indices: Map<string, IndexFile>): Promise<void> {
    if (this.initialized) return;
    this.indices = indices;

    const currentDir = resolve(this.specRoot, 'current');
    // Parse T&D tables from all known locations in the spec
    const tdChains = [
      { file: '1_0_design_principles.md', section: '1.0' },
      { file: '2_0_system_type_overview.md', section: '2.0.1' },
      { file: '2_4_specialized_types.md', section: '2.4' },
      { file: '2_7_0_semantic_types.md', section: '2.7.0' },
      { file: '6_0_domain_driven_flow_design.md', section: '6.0' },
      { file: 'annex_b_type_metadata.md', section: 'B.1.1' },
    ];

    for (const td of tdChains) {
      const filePath = join(currentDir, td.file);
      try {
        const content = await readFile(filePath, 'utf-8');
        const entries = parseTermsTable(content, td.section);
        this.terms.push(...entries);
      } catch {
        // File not found — skip
      }
    }

    // Build flat keyword set for T&D ↔ index cross-reference
    this.buildIndexKeywordSet();

    this.initialized = true;
  }

  /** Build allIndexKeywords from all loaded indices */
  private buildIndexKeywordSet(): void {
    this.allIndexKeywords.clear();
    for (const [, index] of this.indices) {
      for (const [, unit] of Object.entries(index)) {
        if (unit?.keywords) {
          for (const kw of unit.keywords) {
            this.allIndexKeywords.add(kw.toLowerCase());
          }
        }
      }
    }
  }

  /**
   * Enrich keywords using three strategies:
   * 
   * Phase 1: T&D expansion — if a keyword appears as a term, extract related concepts from its definition
   * Phase 2: Co-occurrence — find keywords that co-occur with input keywords across index units  
   * Phase 3: Waterfall — matched units' keywords that appear in ≥2 units → confirmed related concepts
   */
  enrich(inputKeywords: string[]): EnrichedKeywords {
    const original = inputKeywords.map(k => k.toLowerCase());
    const expanded = new Set(original);
    const trace: EnrichedKeywords['trace'] = [];

    // Phase 1: T&D expansion
    for (const kw of original) {
      const relatedFromTD = this.expandFromTerms(kw);
      for (const { word, source } of relatedFromTD) {
        if (!expanded.has(word)) {
          expanded.add(word);
          trace.push({ keyword: word, source, reason: `T&D: "${kw}" definition contains "${word}"` });
        }
      }
    }

    // Phase 2: Co-occurrence from index keywords
    const cooccurring = this.findCooccurring(original);
    for (const { keyword: coKw, source } of cooccurring) {
      if (!expanded.has(coKw)) {
        expanded.add(coKw);
        trace.push({ keyword: coKw, source, reason: `co-occurrence in index unit` });
      }
    }

    // Phase 3: Waterfall — second pass with expanded set, keep only confirmed
    const confirmed = this.waterfallConfirm(original, Array.from(expanded));
    const finalSet = new Set(original);
    for (const { keyword: cfKw, source } of confirmed) {
      if (!finalSet.has(cfKw)) {
        finalSet.add(cfKw);
        // Keep only trace entries for confirmed keywords
        const existingTrace = trace.find(t => t.keyword === cfKw);
        if (existingTrace) {
          existingTrace.reason += ' [confirmed by waterfall]';
        }
      }
    }

    // Also add Phase 1 T&D words that weren't in waterfall
    // (T&D is authoritative — always keep)
    for (const t of trace) {
      if (t.reason.startsWith('T&D:')) {
        finalSet.add(t.keyword);
      }
    }

    return {
      original,
      expanded: Array.from(finalSet),
      trace: trace.filter(t => finalSet.has(t.keyword)),
    };
  }

  /** Max index-xref keywords per T&D entry */
  private static readonly MAX_IDX_PER_ENTRY = 8;
  /** Max total Phase 1 keywords (backtick + bold + idx combined) */
  private static readonly MAX_PHASE1_TOTAL = 15;

  /** Phase 1: Find related words from T&D definitions.
   *  Matches by term name OR by definition content (keyword appears in the definition text).
   *  After backtick/bold extraction, also cross-references definition text against index keywords.
   *  Caps: MAX_IDX_PER_ENTRY per definition, MAX_PHASE1_TOTAL overall. */
  private expandFromTerms(keyword: string): Array<{ word: string; source: string }> {
    const results: Array<{ word: string; source: string }> = [];
    const kwLower = keyword.toLowerCase();
    const seen = new Set<string>();

    for (const entry of this.terms) {
      if (results.length >= KeywordEnricher.MAX_PHASE1_TOTAL) break;

      const termLower = entry.term.toLowerCase();
      const defLower = entry.definition.toLowerCase();

      // Match by term name (existing) OR by definition content (new)
      const matchesTerm = termLower === kwLower || termLower.includes(kwLower) || kwLower.includes(termLower);
      const matchesDef = kwLower.length >= 4 && defLower.includes(kwLower);

      if (!matchesTerm && !matchesDef) continue;

      // Extract backtick-quoted and bold phrases (uncapped — these are high-signal)
      const phrases = extractSignificantPhrases(entry.definition);
      for (const phrase of phrases) {
        if (results.length >= KeywordEnricher.MAX_PHASE1_TOTAL) break;
        if (phrase !== kwLower && !STOP_WORDS.has(phrase) && !seen.has(phrase)) {
          seen.add(phrase);
          results.push({ word: phrase, source: `T&D:${entry.source}/${entry.term}` });
        }
      }

      // Cross-reference: extract index keywords found in definition text.
      // Only multi-word phrases or long single terms (>10 chars) to avoid noise.
      // Capped at MAX_IDX_PER_ENTRY per definition entry.
      let idxCount = 0;
      for (const ik of this.allIndexKeywords) {
        if (idxCount >= KeywordEnricher.MAX_IDX_PER_ENTRY) break;
        if (results.length >= KeywordEnricher.MAX_PHASE1_TOTAL) break;
        const isMultiWord = ik.includes(' ');
        const isLongTerm = ik.length > 10;
        if ((isMultiWord || isLongTerm) && ik !== kwLower && !seen.has(ik) && defLower.includes(ik)) {
          seen.add(ik);
          results.push({ word: ik, source: `T&D:${entry.source}/${entry.term}[idx]` });
          idxCount++;
        }
      }
    }

    return results;
  }

  /** Phase 2: Find keywords that co-occur with input keywords in index units */
  private findCooccurring(inputKeywords: string[]): Array<{ keyword: string; source: string }> {
    const results: Array<{ keyword: string; source: string }> = [];
    const inputSet = new Set(inputKeywords);
    // Count how many input keywords each index keyword co-occurs with
    const cooccurrenceCount = new Map<string, { count: number; sources: string[] }>();

    for (const [alias, index] of this.indices) {
      for (const [unitName, unit] of Object.entries(index)) {
        if (!unit?.keywords) continue;
        const unitKws = unit.keywords.map(k => k.toLowerCase());

        // Check how many input keywords this unit matches
        const matchedInput = inputKeywords.filter(ik =>
          unitKws.some(uk => uk.includes(ik))
        );

        // If unit matches ≥2 input keywords, its other keywords are candidates
        if (matchedInput.length >= 2) {
          for (const uk of unitKws) {
            if (!inputSet.has(uk)) {
              const existing = cooccurrenceCount.get(uk) ?? { count: 0, sources: [] };
              existing.count++;
              existing.sources.push(`${alias}/${unitName}`);
              cooccurrenceCount.set(uk, existing);
            }
          }
        }
      }
    }

    // Keep keywords that appear in ≥2 multi-match units
    for (const [kw, { count, sources }] of cooccurrenceCount) {
      if (count >= 2) {
        results.push({ keyword: kw, source: sources[0] });
      }
    }

    return results;
  }

  /** Phase 3: Waterfall confirmation — second search with expanded keywords,
   *  keep only keywords that appear in units matching ≥2 of the ORIGINAL keywords */
  private waterfallConfirm(
    original: string[],
    expanded: string[],
  ): Array<{ keyword: string; source: string }> {
    const confirmed: Array<{ keyword: string; source: string }> = [];

    for (const [alias, index] of this.indices) {
      for (const [unitName, unit] of Object.entries(index)) {
        if (!unit?.keywords) continue;
        const unitKws = unit.keywords.map(k => k.toLowerCase());

        // Unit must match ≥2 original keywords
        const matchedOriginal = original.filter(ok =>
          unitKws.some(uk => uk.includes(ok))
        );
        if (matchedOriginal.length < 2) continue;

        // Any expanded keyword present in this unit is confirmed
        for (const ek of expanded) {
          if (!original.includes(ek) && unitKws.some(uk => uk.includes(ek))) {
            confirmed.push({ keyword: ek, source: `${alias}/${unitName}` });
          }
        }
      }
    }

    // Deduplicate
    const seen = new Set<string>();
    return confirmed.filter(c => {
      if (seen.has(c.keyword)) return false;
      seen.add(c.keyword);
      return true;
    });
  }
}

// ─── Parsing helpers ────────────────────────────────────────────────

/** Parse markdown table rows into TermEntry objects */
export function parseTermsTable(content: string, sectionId: string): TermEntry[] {
  const entries: TermEntry[] = [];
  const lines = content.split('\n');

  let inTable = false;
  let headerParsed = false;
  let termCol = -1;
  let defCol = -1;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect table start: header row with | that contains "Term" column
    if (trimmed.startsWith('|') && !inTable) {
      // Check if this is a T&D header row (must contain "Term")
      if (/\bTerm\b/i.test(trimmed)) {
        inTable = true;
        // Parse column positions (handle Definition, Description, Definintion typo)
        const cells = splitTableRow(trimmed);
        termCol = cells.findIndex(c => /term/i.test(c));
        defCol = cells.findIndex(c => /defin|descri/i.test(c));
        if (termCol < 0) termCol = 0;
        if (defCol < 0) defCol = 1;
        continue;
      }
    }

    // Skip separator row
    if (inTable && /^\|[\s-:|]+\|$/.test(trimmed)) {
      headerParsed = true;
      continue;
    }

    // Parse data rows
    if (inTable && headerParsed && trimmed.startsWith('|')) {
      const cells = splitTableRow(trimmed);
      if (cells.length > Math.max(termCol, defCol)) {
        const rawTerm = cells[termCol].replace(/\*\*/g, '').trim();
        const rawDef = cells[defCol].replace(/\*\*/g, '').trim();

        if (rawTerm && rawDef) {
          entries.push({
            term: rawTerm,
            definition: rawDef,
            definitionWords: new Set(
              extractWords(rawDef).filter(w => !STOP_WORDS.has(w))
            ),
            source: `${sectionId}/table`,
          });
        }
      }
      continue;
    }

    // End of table
    if (inTable && headerParsed && !trimmed.startsWith('|') && trimmed !== '') {
      inTable = false;
      headerParsed = false;
    }
  }

  return entries;
}

/** Split a table row into cells */
function splitTableRow(line: string): string[] {
  return line.split('|')
    .map(c => c.trim())
    .filter((_, i, arr) => i > 0 && i < arr.length); // Remove first/last empty
}

/** Extract lowercase words from text */
function extractWords(text: string): string[] {
  return text
    .replace(/`[^`]+`/g, ' ')   // Remove inline code
    .replace(/\*\*[^*]+\*\*/g, match => match.replace(/\*\*/g, '')) // Unbold
    .replace(/[^a-zA-Z0-9-]/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2);
}

/**
 * Extract significant phrases from a definition.
 * Only returns backtick-quoted terms and bold phrases — NOT plain words.
 * This prevents noise from generic definition text.
 */
function extractSignificantPhrases(definition: string): string[] {
  const phrases: string[] = [];

  // Extract backtick-quoted terms (e.g. `rule`, `action`, `flow`)
  const codeMatches = definition.match(/`([^`]+)`/g);
  if (codeMatches) {
    for (const m of codeMatches) {
      const term = m.replace(/`/g, '').toLowerCase().trim();
      if (term.length > 1 && !STOP_WORDS.has(term)) {
        phrases.push(term);
      }
    }
  }

  // Extract bold phrases (e.g. **physical properties**)
  const boldMatches = definition.match(/\*\*([^*]+)\*\*/g);
  if (boldMatches) {
    for (const m of boldMatches) {
      const term = m.replace(/\*\*/g, '').toLowerCase().trim();
      // Only multi-word bold phrases or known type-system terms
      if (term.length > 3 && !STOP_WORDS.has(term)) {
        phrases.push(term);
      }
    }
  }

  // Do NOT extract plain words — too noisy

  // Deduplicate
  return [...new Set(phrases)];
}
