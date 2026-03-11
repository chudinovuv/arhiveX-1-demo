/**
 * linearIndex.ts — Runtime search over the linear section index.
 *
 * Loaded by the MCP server to power the `fulltext_search` tool.
 * The underlying linear_index.json is produced by scripts/buildLinearIndex.ts.
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';

/* ── Index shape (mirrors generator output) ────────────────────────── */

interface ParagraphEntry {
  chain: string;
  marker: string;
  markerType: 'aspect' | 'seq' | 'prop';
  title: string;
  line: number;
  vocab: string[];
}

interface SectionEntry {
  file: string;
  title: string;
  level: number;
  line: number;
  vocab: string[];
  paragraphs?: ParagraphEntry[];
}

interface LinearIndexData {
  meta: {
    generated: string;
    fileCount: number;
    sectionCount: number;
    paragraphCount: number;
    termCount: number;
  };
  sections: Record<string, SectionEntry>;
  reverseMap: Record<string, Record<string, string[]>>;
  termIndex: Record<string, string[]>;
}

/* ── Public types ──────────────────────────────────────────────────── */

export interface FulltextMatch {
  /** Section or paragraph chain address */
  sectionId: string;
  file: string;
  title: string;
  level: number;
  line: number;
  matchedTerms: string[];
  score: number;
  /** Aspect index alias → unit names */
  aspects: Record<string, string[]>;
  /** If this is a paragraph match, the parent section id */
  parentSection?: string;
  /** Paragraph marker type if paragraph-level match */
  markerType?: 'aspect' | 'seq' | 'prop';
}

export interface LinearIndexMeta {
  generated: string;
  fileCount: number;
  sectionCount: number;
  paragraphCount: number;
  termCount: number;
}

/* ── Searcher ──────────────────────────────────────────────────────── */

export class LinearIndexSearcher {
  private data: LinearIndexData | null = null;
  private readonly indexPath: string;

  constructor(specRoot: string) {
    this.indexPath = resolve(
      specRoot, 'tools', 'spec-reader', 'indexes', 'linear_index.json',
    );
  }

  /** Load index from disk (cached after first call) */
  async load(): Promise<void> {
    if (this.data) return;
    const raw = await readFile(this.indexPath, 'utf-8');
    const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
    this.data = JSON.parse(clean) as LinearIndexData;
  }

  /**
   * Fulltext search across spec sections.
   *
   * Scoring:
   *   - Exact token hit in termIndex:  +3
   *   - Multi-word phrase hit:         +5
   *   - Distinct-term coverage bonus:  ×10 per unique term
   */
  async search(query: string, maxResults = 10): Promise<FulltextMatch[]> {
    await this.load();
    const d = this.data!;

    // Tokenise
    const tokens = query
      .toLowerCase()
      .split(/[\s,;]+/)
      .map(t => t.replace(/[^a-z0-9_\-]/g, ''))
      .filter(t => t.length >= 2);

    if (tokens.length === 0) return [];

    // Build multi-word phrases (bigrams + full query)
    const phrases: string[] = [];
    if (tokens.length >= 2) {
      phrases.push(tokens.join(' '));
      if (tokens.length >= 3) {
        for (let i = 0; i < tokens.length - 1; i++) {
          phrases.push(`${tokens[i]} ${tokens[i + 1]}`);
        }
      }
    }

    // Accumulator
    const scores = new Map<string, { terms: Set<string>; pts: number }>();

    function hit(sid: string, term: string, pts: number) {
      let e = scores.get(sid);
      if (!e) { e = { terms: new Set(), pts: 0 }; scores.set(sid, e); }
      e.terms.add(term);
      e.pts += pts;
    }

    // 1. Exact token matches
    for (const tok of tokens) {
      const sids = d.termIndex[tok];
      if (sids) for (const sid of sids) hit(sid, tok, 3);
    }

    // 2. Phrase matches (coherence bonus)
    for (const phrase of phrases) {
      const sids = d.termIndex[phrase];
      if (sids) for (const sid of sids) hit(sid, phrase, 5);
    }

    // Rank: coverage × 10 + raw points
    const ranked = [...scores.entries()]
      .map(([sid, { terms, pts }]) => ({
        sid,
        matchedTerms: [...terms],
        rank: terms.size * 10 + pts,
      }))
      .sort((a, b) => b.rank - a.rank)
      .slice(0, maxResults);

    return ranked.map(r => {
      // Check if this is a section or a paragraph chain address
      const sec = d.sections[r.sid];
      if (sec) {
        // Direct section match
        return {
          sectionId: r.sid,
          file: sec.file,
          title: sec.title,
          level: sec.level,
          line: sec.line,
          matchedTerms: r.matchedTerms,
          score: r.rank,
          aspects: d.reverseMap[r.sid] ?? {},
        };
      }

      // Paragraph chain: "2.7.3.3.4/C." → parent "2.7.3.3.4"
      const slashIdx = r.sid.indexOf('/');
      if (slashIdx > 0) {
        const parentId = r.sid.substring(0, slashIdx);
        const parentSec = d.sections[parentId];
        if (parentSec) {
          // Find the paragraph entry
          const para = parentSec.paragraphs?.find(p => p.chain === r.sid);
          return {
            sectionId: r.sid,
            file: parentSec.file,
            title: para?.title ?? r.sid,
            level: parentSec.level,
            line: para?.line ?? parentSec.line,
            matchedTerms: r.matchedTerms,
            score: r.rank,
            aspects: d.reverseMap[r.sid] ?? d.reverseMap[parentId] ?? {},
            parentSection: parentId,
            markerType: para?.markerType,
          };
        }
      }

      // Fallback
      return {
        sectionId: r.sid,
        file: 'unknown',
        title: r.sid,
        level: 0,
        line: 0,
        matchedTerms: r.matchedTerms,
        score: r.rank,
        aspects: d.reverseMap[r.sid] ?? {},
      };
    });
  }

  /** Return sections that belong to a specific file */
  async sectionsInFile(filename: string): Promise<Array<{ id: string; title: string; level: number; line: number }>> {
    await this.load();
    const d = this.data!;
    return Object.entries(d.sections)
      .filter(([, sec]) => sec.file === filename)
      .map(([id, sec]) => ({ id, title: sec.title, level: sec.level, line: sec.line }))
      .sort((a, b) => a.line - b.line);
  }

  /** Reverse-map a section to aspect units */
  async sectionAspects(sectionId: string): Promise<Record<string, string[]>> {
    await this.load();
    return this.data!.reverseMap[sectionId] ?? {};
  }

  /** Get index metadata */
  async getMeta(): Promise<LinearIndexMeta | null> {
    await this.load();
    return this.data?.meta ?? null;
  }

  /**
   * Narrow broad chain addresses to relevant paragraphs using keyword matching.
   *
   * For each chain in the input:
   *   - If it's already specific (has /suffix like /A. or /(B)), keep as-is
   *   - If it's broad (section number only or /all), look up paragraphs in linear index
   *   - Score each paragraph's vocab against keywords
   *   - Return section heading chain + top-N matching paragraph chains
   *
   * @param chains  - chain addresses from reading plan
   * @param keywords - search keywords (lowercased)
   * @param maxParasPerSection - max paragraphs to keep per broad section (default 5)
   * @returns narrowed chain list with trace info
   */
  async narrowChains(
    chains: string[],
    keywords: string[],
    maxParasPerSection = 5,
  ): Promise<NarrowResult> {
    await this.load();
    const d = this.data!;
    const kws = keywords.map(k => k.toLowerCase());

    // ── Phase 0: collect ranges & build subsumption check ──────────
    const ranges = collectRanges(chains);
    const seen = new Set<string>();

    const emit = (c: string): boolean => {
      if (seen.has(c)) return false;       // dedup
      if (isSubsumedByRange(c, ranges)) return false; // range covers it
      seen.add(c);
      return true;
    };

    const output: string[] = [];
    const trace: NarrowTrace[] = [];

    for (const chain of chains) {
      // Already specific (incl. ranges) — keep, dedup, skip if subsumed
      if (chain.includes('/') && !chain.endsWith('/all')) {
        if (emit(chain)) output.push(chain);
        continue;
      }

      // Extract base section id
      const base = chain.replace(/\/all$/, '');
      const sec = d.sections[base];

      if (!sec || !sec.paragraphs || sec.paragraphs.length === 0) {
        // No paragraph data — keep original chain
        if (emit(chain)) output.push(chain);
        continue;
      }

      // Always keep the section heading
      if (emit(base)) output.push(base);

      // Score each paragraph by keyword overlap
      const scored: Array<{ chain: string; score: number; matched: string[] }> = [];

      for (const p of sec.paragraphs) {
        const vocabSet = new Set(p.vocab);
        const matched: string[] = [];
        let score = 0;

        for (const kw of kws) {
          if (vocabSet.has(kw)) {
            score += 3;
            matched.push(kw);
            continue;
          }
          for (const v of p.vocab) {
            if (v.includes(kw) || kw.includes(v)) {
              score += 1;
              matched.push(kw);
              break;
            }
          }
        }

        const titleLower = p.title.toLowerCase();
        for (const kw of kws) {
          if (titleLower.includes(kw) && !matched.includes(kw)) {
            score += 2;
            matched.push(kw);
          }
        }

        if (score > 0) {
          scored.push({ chain: p.chain, score, matched });
        }
      }

      // Sort by score, take top N, emit only non-subsumed / non-dup
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, maxParasPerSection);
      let kept = 0;

      for (const s of top) {
        if (emit(s.chain)) {
          output.push(s.chain);
          kept++;
        }
      }

      trace.push({
        base,
        totalParagraphs: sec.paragraphs.length,
        matchedParagraphs: scored.length,
        kept,
        narrowed: scored.length > top.length,
        topChains: top.map(t => `${t.chain} (${t.score}: ${t.matched.join(',')})`),
      });
    }

    return { chains: output, trace };
  }
}

/* ── Range subsumption helpers ──────────────────────────────────────── */

interface ParsedRange {
  base: string;
  startCode: number;
  endCode: number;
  format: 'seq' | 'aspect';   // (A)-(C) vs A.-C.
}

/** Extract range chains from a chain list */
function collectRanges(chains: string[]): ParsedRange[] {
  const out: ParsedRange[] = [];
  for (const c of chains) {
    // sequential range: base/(A)-(C)
    const seq = c.match(/^(.+?)\/\(([A-Za-z])\)-\(([A-Za-z])\)$/);
    if (seq) {
      out.push({ base: seq[1], startCode: seq[2].charCodeAt(0), endCode: seq[3].charCodeAt(0), format: 'seq' });
      continue;
    }
    // aspect range: base/A.-C.
    const asp = c.match(/^(.+?)\/([A-Za-z])\.-([A-Za-z])\.$/);
    if (asp) {
      out.push({ base: asp[1], startCode: asp[2].charCodeAt(0), endCode: asp[3].charCodeAt(0), format: 'aspect' });
    }
  }
  return out;
}

/** Check if a single chain is already covered by any collected range */
function isSubsumedByRange(chain: string, ranges: ParsedRange[]): boolean {
  for (const r of ranges) {
    if (r.format === 'seq') {
      // match base/(X) where X is single letter
      const m = chain.match(/^(.+?)\/\(([A-Za-z])\)$/);
      if (m && m[1] === r.base) {
        const code = m[2].charCodeAt(0);
        if (code >= r.startCode && code <= r.endCode) return true;
      }
    }
    if (r.format === 'aspect') {
      // match base/X.
      const m = chain.match(/^(.+?)\/([A-Za-z])\.$/);
      if (m && m[1] === r.base) {
        const code = m[2].charCodeAt(0);
        if (code >= r.startCode && code <= r.endCode) return true;
      }
    }
  }
  return false;
}

/* ── Narrow result types ───────────────────────────────────────────── */

export interface NarrowTrace {
  base: string;
  totalParagraphs: number;
  matchedParagraphs: number;
  kept: number;
  narrowed: boolean;
  topChains: string[];
}

export interface NarrowResult {
  chains: string[];
  trace: NarrowTrace[];
}
