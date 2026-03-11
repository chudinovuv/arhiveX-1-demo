import { readFile } from 'fs/promises';
import { join, resolve } from 'path';

// ─── Types ──────────────────────────────────────────────────────────

export type XRefType = 'section' | 'standard' | 'url' | 'person';

export interface XRefEntry {
  type: XRefType;
  target: string;
  context: string;
  line: number;
}

export interface XRefSection {
  file: string;
  title: string;
  refs: XRefEntry[];
}

export interface XRefMeta {
  alias: string;
  generated: string;
  version: string;
  fileCount: number;
  sectionCount: number;
  totalRefs: number;
  refsByType: Record<string, number>;
}

export interface XRefIndex {
  meta: XRefMeta;
  sections: Record<string, XRefSection>;
}

/** Scored cross-reference for reading plan integration */
export interface ScoredXRef {
  /** Source section that contains the reference */
  fromSection: string;
  /** Target address (section number or standard name) */
  target: string;
  /** Reference type */
  type: XRefType;
  /** Score — lower = higher priority */
  score: number;
  /** Context snippet from the source text */
  context: string;
  /** Source file */
  file: string;
  /** Line in source file */
  line: number;
}

// ─── Weight constants ───────────────────────────────────────────────

/** Per refType penalty added to the base score */
const REF_TYPE_WEIGHTS: Record<XRefType, number> = {
  section: 0,
  standard: 5,
  url: 10,
  person: 10,
};

// ─── Loader ─────────────────────────────────────────────────────────

export class XRefLoader {
  private data: XRefIndex | null = null;
  private readonly filePath: string;

  constructor(specRoot: string) {
    this.filePath = join(
      resolve(specRoot, 'tools', 'spec-reader', 'indexes'),
      'cross_ref_index.json',
    );
  }

  /** Load the cross-reference index (lazy, cached) */
  async load(): Promise<XRefIndex> {
    if (this.data) return this.data;
    const raw = await readFile(this.filePath, 'utf-8');
    this.data = JSON.parse(raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw) as XRefIndex;
    return this.data;
  }

  /** Get index metadata */
  async getMeta(): Promise<XRefMeta> {
    const data = await this.load();
    return data.meta;
  }

  /**
   * Look up outgoing cross-references from one or more sections.
   *
   * @param sections  Section numbers to look up (e.g. ["2.7.3", "8.1"])
   * @param metaRank  The metaRank for scoring (typically: matched aspect indices count + 1)
   * @param refTypes  Optional filter — only return refs of these types
   * @returns Scored cross-references sorted by score ascending
   */
  async lookup(
    sections: string[],
    metaRank: number,
    refTypes?: XRefType[],
  ): Promise<ScoredXRef[]> {
    const data = await this.load();
    const results: ScoredXRef[] = [];

    for (const sectionId of sections) {
      const section = data.sections[sectionId];
      if (!section) continue;

      for (const ref of section.refs) {
        if (refTypes && !refTypes.includes(ref.type)) continue;

        const typeWeight = REF_TYPE_WEIGHTS[ref.type] ?? 10;
        // Score: META_WEIGHT(30) × metaRank + typeWeight
        // (Using same META_WEIGHT=30 as readingPlanFunnel)
        const score = 30 * metaRank + typeWeight;

        results.push({
          fromSection: sectionId,
          target: ref.target,
          type: ref.type,
          score,
          context: ref.context,
          file: section.file,
          line: ref.line,
        });
      }
    }

    // Sort by score, then by target
    results.sort((a, b) => a.score - b.score || a.target.localeCompare(b.target));
    return results;
  }

  /**
   * Find all sections that reference a given target (reverse lookup).
   * E.g. "which sections reference 2.7.3?" or "who mentions GDPR?"
   */
  async reverseLookup(target: string): Promise<ScoredXRef[]> {
    const data = await this.load();
    const results: ScoredXRef[] = [];
    const targetLower = target.toLowerCase();

    for (const [sectionId, section] of Object.entries(data.sections)) {
      for (const ref of section.refs) {
        if (ref.target.toLowerCase() === targetLower) {
          results.push({
            fromSection: sectionId,
            target: ref.target,
            type: ref.type,
            score: 0, // Reverse lookup doesn't use scoring
            context: ref.context,
            file: section.file,
            line: ref.line,
          });
        }
      }
    }

    return results;
  }

  /**
   * Expand a section to include its xref targets as chain addresses.
   * Returns only "section" type refs (internal spec links).
   */
  async expandToChains(sections: string[]): Promise<string[]> {
    const data = await this.load();
    const chains: string[] = [];
    const seen = new Set<string>();

    for (const sectionId of sections) {
      const section = data.sections[sectionId];
      if (!section) continue;

      for (const ref of section.refs) {
        if (ref.type === 'section' && !seen.has(ref.target)) {
          seen.add(ref.target);
          chains.push(ref.target);
        }
      }
    }

    return chains;
  }
}
