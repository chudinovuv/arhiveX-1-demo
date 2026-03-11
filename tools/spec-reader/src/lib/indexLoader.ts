import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import type { IndexFile, IndexRegistryEntry, IndexUnit, SeqEntry, HeadingInfo, OntoRole } from './types.js';

/** Strips BOM from string if present */
function stripBom(s: string): string {
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
}

/** Pattern to strip section/annex number prefix from heading title */
const HEADING_NUMBER_RE = /^[A-Z0-9][\d.]*\s+/;

export class IndexLoader {
  private indices = new Map<string, IndexFile>();
  private registry: IndexRegistryEntry[] | null = null;
  private readonly indexDir: string;

  constructor(specRoot: string) {
    this.indexDir = resolve(specRoot, 'tools', 'spec-reader', 'indexes');
  }

  /** Load the index registry (aspect_index.json) */
  async loadRegistry(): Promise<IndexRegistryEntry[]> {
    if (this.registry) return this.registry;
    const raw = await readFile(join(this.indexDir, 'aspect_index.json'), 'utf-8');
    const parsed = JSON.parse(stripBom(raw));
    this.registry = (Array.isArray(parsed) ? parsed : parsed.indices) as IndexRegistryEntry[];
    return this.registry;
  }

  /** Load a specific index file by alias (phya, sema, ont, desa) or filename */
  async loadIndex(aliasOrFile: string): Promise<IndexFile> {
    const cached = this.indices.get(aliasOrFile);
    if (cached) return cached;

    const registry = await this.loadRegistry();
    const entry = registry.find(e => e.alias === aliasOrFile || e.file === aliasOrFile);
    const filename = entry ? entry.file : aliasOrFile;

    const raw = await readFile(join(this.indexDir, filename), 'utf-8');
    const data = JSON.parse(stripBom(raw)) as IndexFile;
    this.indices.set(aliasOrFile, data);
    if (entry) this.indices.set(entry.alias, data);
    return data;
  }

  /** Load all indices */
  async loadAllIndices(): Promise<Map<string, IndexFile>> {
    const registry = await this.loadRegistry();
    for (const entry of registry) {
      await this.loadIndex(entry.alias);
    }
    return this.indices;
  }

  /** Search all indices for units matching one or more keywords.
   *  A unit matches if at least one keyword hits unit.keywords or unitName words.
   *  Results are sorted by weighted score: original keywords × 3, enriched × 1.
   *  When `onto` is provided, units matching the ontological role are boosted (sorted first).
   *  When `originalKeywords` is provided, HOW-Code target construct detection uses
   *  only the original (pre-enrichment) keywords to avoid enrichment-driven misclassification. */
  async searchKeywords(keywords: string[], onto?: OntoRole, originalKeywords?: string[]): Promise<Array<{
    alias: string;
    unitName: string;
    unit: IndexUnit;
    matchType: 'keyword' | 'unitName';
    matchedKeywords: string[];
    ontoMatch: boolean;
    weightedScore: number;
  }>> {
    // ⚠ SCORING MODEL — changing these constants requires:
    //   1. Recalculating index keyword weights (aspect index JSONs)
    //   2. Re-running benchmark_conceptual_10 to verify unit ranking
    //   3. Updating NDP sort order in normativePipeline.ts if tiebreaker logic changes
    const ORIGINAL_WEIGHT = 3;
    const ENRICHED_WEIGHT = 1;
    /** Cap enriched contribution to avoid flooding: max enriched score = origCount × CAP_MULT */
    const ENRICHED_CAP_MULT = 2;
    const origSet = new Set((originalKeywords ?? keywords).map(k => k.toLowerCase()));

    const results: Array<{
      alias: string;
      unitName: string;
      unit: IndexUnit;
      matchType: 'keyword' | 'unitName';
      matchedKeywords: string[];
      ontoMatch: boolean;
      weightedScore: number;
    }> = [];
    const kwList = keywords.map(k => k.toLowerCase());

    const registry = await this.loadRegistry();
    for (const entry of registry) {
      let index: IndexFile;
      try {
        index = await this.loadIndex(entry.alias);
      } catch {
        continue;
      }

      for (const [unitName, unit] of Object.entries(index)) {
        if (!unit || typeof unit !== 'object' || !Array.isArray(unit.keywords)) continue;

        const unitKws = unit.keywords.map(k => k.toLowerCase());
        const nameWords = splitUnitName(unitName).map(w => w.toLowerCase());

        const matched: string[] = [];
        let bestMatchType: 'keyword' | 'unitName' = 'unitName';

        for (const kw of kwList) {
          const inKws = unitKws.some(k => k.includes(kw));
          if (inKws) {
            matched.push(kw);
            bestMatchType = 'keyword';
            continue;
          }
          const inName = nameWords.some(w => w.includes(kw));
          if (inName) {
            matched.push(kw);
          }
        }

        // Must match at least one keyword
        if (matched.length > 0) {
          // Resolve onto: unit-level override > index default
          const unitOnto = unit.onto ?? entry.onto ?? [];
          const ontoMatch = onto ? unitOnto.includes(onto) : false;

          // Weighted score: original keywords count 3×, enriched 1× with cap
          let origCount = 0;
          let enrichCount = 0;
          for (const kw of matched) {
            if (origSet.has(kw)) origCount++;
            else enrichCount++;
          }
          const cappedEnrich = Math.min(enrichCount, Math.max(origCount, 1) * ENRICHED_CAP_MULT);
          const weightedScore = origCount * ORIGINAL_WEIGHT + cappedEnrich * ENRICHED_WEIGHT;

          results.push({
            alias: entry.alias, unitName, unit,
            matchType: bestMatchType,
            matchedKeywords: matched,
            ontoMatch,
            weightedScore,
          });
        }
      }
    }

    // ─── HOW-Code / HOW-Grammar demotion ────────────────────────────
    // Detect query type and apply ranking penalties to cross-cutting units
    // and off-target construct units.

    const CONSTRUCT_TYPES = [
      'domain', 'module', 'definition', 'record', 'interface',
      'event', 'rule', 'action', 'flow', 'class', 'delegate', 'method',
    ];

    const kwLower = keywords.map(k => k.toLowerCase());

    // Use original (pre-enrichment) keywords for target detection to prevent
    // enrichment from adding parasitic construct targets (e.g. "module body"
    // enriched into a "rule syntax" query should NOT make "module" a target).
    const targetKwLower = (originalKeywords ?? keywords).map(k => k.toLowerCase());

    // Detect exception keywords that suppress all demotions
    const hasExemptKeyword = kwLower.some(k =>
      ['design', 'architecture', 'pattern', 'constraint matrix'].includes(k));

    // HOW-Code: user asks about concrete syntax/body of a specific construct
    // e.g. "action syntax", "action body", "define action"
    const targetConstructs: string[] = [];
    if (!hasExemptKeyword && onto !== 'WHY') {
      for (const t of CONSTRUCT_TYPES) {
        const matches = targetKwLower.some(k =>
          k === `${t} syntax` || k === `${t} body` || k === `define ${t}`
          || (k === t && targetKwLower.some(k2 => k2 === 'syntax' || k2 === 'body'))
        );
        if (matches) targetConstructs.push(t);
      }
    }
    const isHowCode = targetConstructs.length > 0;

    // HOW-Grammar: user asks about grammar rules or ANTLR structure
    const GRAMMAR_TERMS = ['grammar', 'antlr', 'parser rule', 'lexer rule', 'bnf', 'ebnf', 'production rule', 'grammar rule'];
    const isHowGrammar = !hasExemptKeyword
      && onto !== 'WHY'
      && kwLower.some(k => GRAMMAR_TERMS.some(g => k.includes(g)));

    // Cross-cutting units always demoted during HOW-Code / HOW-Grammar
    const CROSS_CUTTING_UNITS = new Set([
      'syntaxAndAST', 'syntaxLevelConstraints', 'flowResilience',
      'securityDesign', 'observabilityDesign', 'errorDesign',
      'complianceDesign', 'flowOrchestration', 'capabilityDesign',
      'antiPatternGuide', 'surrogateDesign', 'designPrinciplesFoundation',
    ]);

    const demotionActive = isHowCode || isHowGrammar;

    /** Check if a unit is genuinely about any of the target constructs.
     *  Uses two signals:
     *  - Unit name contains the construct (e.g. 'method_type', 'methodSyntax')
     *  - Unit has the construct as an exact standalone keyword (e.g. 'method')
     *  Substring matches like 'method signature' in interfaceDesign do NOT count. */
    const unitMatchesTarget = (r: typeof results[0]): boolean => {
      if (targetConstructs.length === 0) return true;
      const unitKws = r.unit.keywords.map(k => k.toLowerCase());
      const unitNameLower = r.unitName.toLowerCase();
      return targetConstructs.some(t =>
        unitNameLower.includes(t) || unitKws.includes(t)
      );
    };

    /** Compute demotion penalty for a result entry */
    const getDemotion = (r: typeof results[0]): number => {
      if (!demotionActive) return 0;

      // Cross-cutting ont/desa units: heavy penalty
      if ((r.alias === 'ont' || r.alias === 'desa') && CROSS_CUTTING_UNITS.has(r.unitName)) {
        return 15;
      }

      // Off-target construct demotion: unit doesn't mention the target construct.
      // Penalty scales with how many enriched keywords the unit matches
      // (more parasitic matches → heavier penalty)
      if (isHowCode && !unitMatchesTarget(r)) {
        return Math.max(10, r.matchedKeywords.length);
      }

      return 0;
    };

    // Sort: onto-matching first (boost), then by keyword match count minus demotion.
    // Demoted units lose their onto-boost to prevent cross-cutting units
    // from outranking type-specific units in HOW-Code/Grammar queries.
    results.sort((a, b) => {
      const demA = getDemotion(a);
      const demB = getDemotion(b);
      if (onto) {
        // Effective onto: demoted units don't get boosted
        const ontoA = a.ontoMatch && demA === 0;
        const ontoB = b.ontoMatch && demB === 0;
        if (ontoA !== ontoB) return ontoA ? -1 : 1;
      }
      // Effective score: weighted keywords - demotion
      const scoreA = a.weightedScore - demA;
      const scoreB = b.weightedScore - demB;
      return scoreB - scoreA;
    });

    return results;
  }

  /** Convenience: single-keyword search */
  async searchKeyword(keyword: string) {
    const res = await this.searchKeywords([keyword]);
    return res.map(({ matchedKeywords, ...rest }) => rest);
  }

  /** Extract heading info from a seq entry */
  static extractHeading(entry: SeqEntry): HeadingInfo | null {
    for (let level = 1; level <= 6; level++) {
      const key = `H${level}`;
      if (key in entry && typeof entry[key] === 'string') {
        const rawTitle = entry[key] as string;
        const cleanTitle = rawTitle.replace(HEADING_NUMBER_RE, '');
        return { level, fieldName: key, rawTitle, cleanTitle };
      }
    }
    return null;
  }
}

/** Split unitName into words (camelCase → words, snake_case → words) */
function splitUnitName(name: string): string[] {
  // snake_case
  if (name.includes('_')) {
    return name.split('_').filter(Boolean);
  }
  // camelCase
  return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase().split('_').filter(Boolean);
}
