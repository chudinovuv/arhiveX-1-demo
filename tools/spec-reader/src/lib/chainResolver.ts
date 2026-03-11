import { resolve, join } from 'path';
import { readdir } from 'fs/promises';
import type { ChainAddress } from './types.js';

/**
 * Resolves chain addresses to file paths and parses suffixes.
 */
export class ChainResolver {
  private readonly currentDir: string;
  private fileList: string[] | null = null;
  private readonly _unresolvedChains: Set<string> = new Set();

  constructor(specRoot: string) {
    this.currentDir = resolve(specRoot, 'current');
  }

  /** Chain bases that could not be resolved to any file */
  get unresolvedChains(): string[] {
    return [...this._unresolvedChains];
  }

  /** Reset unresolved tracking (call before a new query cycle) */
  clearUnresolved(): void {
    this._unresolvedChains.clear();
  }

  /** Cache the file listing */
  private async getFileList(): Promise<string[]> {
    if (!this.fileList) {
      this.fileList = await readdir(this.currentDir);
    }
    return this.fileList;
  }

  /** Parse a chain address string into structured form */
  parseChainAddress(raw: string): ChainAddress {
    // Split on first /
    const slashIdx = raw.indexOf('/');
    if (slashIdx === -1) {
      return { base: raw, suffixType: 'none', raw };
    }

    const base = raw.slice(0, slashIdx);
    const suffix = raw.slice(slashIdx + 1);

    // /all or /All — case-insensitive
    if (/^all$/i.test(suffix)) {
      return { base, suffixType: 'all', raw };
    }

    // /A.-D. — aspect range
    const aspectRange = suffix.match(/^([A-Z])\.-([A-Z])\.$/);
    if (aspectRange) {
      return {
        base, suffixType: 'aspect-range',
        rangeStart: aspectRange[1], rangeEnd: aspectRange[2], raw,
      };
    }

    // /A. — single aspect
    const aspect = suffix.match(/^([A-Z])\.$/);
    if (aspect) {
      return {
        base, suffixType: 'aspect',
        suffixValue: aspect[1], raw,
      };
    }

    // /(A)-(F) — paragraph range
    const paraRange = suffix.match(/^\(([A-Z])\)-\(([A-Z])\)$/);
    if (paraRange) {
      return {
        base, suffixType: 'paragraph-range',
        rangeStart: paraRange[1], rangeEnd: paraRange[2], raw,
      };
    }

    // /(B) — single paragraph
    const para = suffix.match(/^\(([A-Z])\)$/);
    if (para) {
      return {
        base, suffixType: 'paragraph',
        suffixValue: para[1], raw,
      };
    }

    // /table-N
    const table = suffix.match(/^table-(\d+)$/);
    if (table) {
      return {
        base, suffixType: 'table',
        suffixValue: table[1], raw,
      };
    }

    // /block-N
    const block = suffix.match(/^block-(\d+)$/);
    if (block) {
      return {
        base, suffixType: 'block',
        suffixValue: block[1], raw,
      };
    }

    // Unknown suffix — treat as no suffix
    return { base, suffixType: 'none', raw };
  }

  /**
   * Resolve a chain base (e.g. "2.7.3", "B.2.1") to a file path.
   *
   * Logic:
   * - If first char is a letter → annex file: annex_{letter}_*.md
   * - If first char is a digit → document file: find longest matching digit prefix
   */
  async resolveFile(chainBase: string): Promise<string | null> {
    const files = await this.getFileList();
    const firstChar = chainBase.charAt(0);

    if (/[A-Z]/i.test(firstChar)) {
      // Annex: letter + optional sub-number → annex_{letter}[_{num}]_*.md
      // Chain "D1.3" → prefix "d", subNum "1" → matches annex_d_1_*.md
      // Chain "D.3"  → prefix "d", no subNum → matches annex_d_*.md but NOT annex_d_1_*.md
      const annexMatch = chainBase.match(/^([A-Za-z])(\d+)?[.]/);
      const letter = firstChar.toLowerCase();
      if (annexMatch && annexMatch[2]) {
        // Sub-annex: e.g. D1 → annex_d_1_
        const subNum = annexMatch[2];
        const prefix = `annex_${letter}_${subNum}_`;
        const match = files.find(f => f.startsWith(prefix) && f.endsWith('.md'));
        return match ? join(this.currentDir, match) : null;
      } else {
        // Primary annex: e.g. D → annex_d_ but NOT annex_d_\d (which is a sub-annex)
        const prefix = `annex_${letter}_`;
        const match = files.find(f =>
          f.startsWith(prefix) && f.endsWith('.md') && !/^annex_[a-z]_\d/.test(f)
        );
        // Fallback: if no non-sub-annex match, allow any match for the letter
        if (match) return join(this.currentDir, match);
        const fallback = files.find(f => f.startsWith(prefix) && f.endsWith('.md'));
        return fallback ? join(this.currentDir, fallback) : null;
      }
    }

    // Document: chain "2.7.3" → try "2_7_3_", then "2_7_0_", then "2_7_", etc.
    const parts = chainBase.split('.');

    // Special case: section 0.x → introduction.md
    if (parts[0] === '0') {
      const match = files.find(f => f === 'introduction.md');
      return match ? join(this.currentDir, match) : null;
    }

    // Try progressively shorter prefixes (min 2 segments to avoid
    // single-digit prefix matching wrong files, e.g. "2_" → "2_1_...")
    const minLen = Math.min(2, parts.length);
    for (let len = parts.length; len >= minLen; len--) {
      const prefix = parts.slice(0, len).join('_') + '_';
      const match = files.find(f => f.startsWith(prefix) && f.endsWith('.md'));
      if (match) {
        return join(this.currentDir, match);
      }
    }

    // Try with _0_ appended (generic section file)
    for (let len = parts.length; len >= minLen; len--) {
      const prefix = parts.slice(0, len).join('_') + '_0_';
      const match = files.find(f => f.startsWith(prefix) && f.endsWith('.md'));
      if (match) {
        return join(this.currentDir, match);
      }
    }

    // Track unresolved chain for missing-content reporting
    this._unresolvedChains.add(chainBase);
    return null;
  }

  /**
   * Expand range addresses into individual addresses.
   * E.g. aspect-range A-D → [A., B., C., D.]
   */
  expandRange(addr: ChainAddress): string[] {
    if (addr.suffixType === 'aspect-range' && addr.rangeStart && addr.rangeEnd) {
      const start = addr.rangeStart.charCodeAt(0);
      const end = addr.rangeEnd.charCodeAt(0);
      const result: string[] = [];
      for (let c = start; c <= end; c++) {
        result.push(`${addr.base}/${String.fromCharCode(c)}.`);
      }
      return result;
    }

    if (addr.suffixType === 'paragraph-range' && addr.rangeStart && addr.rangeEnd) {
      const start = addr.rangeStart.charCodeAt(0);
      const end = addr.rangeEnd.charCodeAt(0);
      const result: string[] = [];
      for (let c = start; c <= end; c++) {
        result.push(`${addr.base}/(${String.fromCharCode(c)})`);
      }
      return result;
    }

    return [addr.raw];
  }
}
