import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { resolve, join } from 'path';
import { readFile } from 'fs/promises';
import {
  IndexLoader,
  ChainResolver,
  assembleTape,
  formatTape,
  formatMultipleTapes,
  clearFileCache,
  extractText,
  initExtractor,
  buildReadingPlan,
  formatReadingPlan,
  planToChainList,
  tierChains,
  chainTierMap,
  KeywordEnricher,
  filterByKeywords,
  buildKeywordPatterns,
  LinearIndexSearcher,
  extractCodeBlocks,
  extractReferences,
  extractTables,
  extractNormatives,
  formatNormatives,
  applyBudget,
  estimateTokens,
  DEFAULT_BUDGET,
  type DetailLevel,
  XRefLoader,
  runNdp,
  applyNdpScoring,
  filterNoise,
  THRESHOLDS,
  analyzeQuestion,
  buildDescriptors,
  CONSTRUCT_ANCHOR,
} from './lib/index.js';
import type { SeqEntry, OntoRole } from './lib/types.js';

// Spec root — resolved relative to this file's location
// Expected layout: tools/spec-reader/dist/server.js → spec root is ../../..
const SPEC_ROOT = resolve(import.meta.dirname, '..', '..', '..');

const loader = new IndexLoader(SPEC_ROOT);
const resolver = new ChainResolver(SPEC_ROOT);
const enricher = new KeywordEnricher(SPEC_ROOT);
const linearSearcher = new LinearIndexSearcher(SPEC_ROOT);
const xrefLoader = new XRefLoader(SPEC_ROOT);

const server = new McpServer({
  name: 'elia-spec-reader',
  version: '0.4.1',
});

// ─── Tool: search_spec ──────────────────────────────────────────────

server.tool(
  'search_spec',
  `Search the E.L.I.A. specification by keyword. Finds matching index units, resolves chain addresses, extracts text from markdown files, and returns an ordered reading tape.

Intent filters:
- canonical_example → code examples only
- grammar → AST/syntax definitions
- normative_rules → normative requirements (MUST/SHOULD/MAY)
- semantic_role → purpose/meaning
- declaration → how to declare
- full → everything (default)

Ontological role (onto):
- WHAT → nature/identity ("what is X?")
- WHY → purpose/rationale ("why does X exist?")
- HOW → method/process ("how to use/declare X?")
- WHEN → conditions/timing ("when does X apply?")
When specified, matching units are boosted (sorted first) without excluding others.`,
  {
    keyword: z.union([z.string(), z.array(z.string()).min(1).max(5)])
      .describe('Search keyword (e.g. "envelope", "delegate", "stream")'),
    onto: z.enum(['WHAT', 'WHY', 'HOW', 'WHEN', 'WHERE']).optional()
      .describe('Ontological question type. Boosts units that answer this kind of question. WHAT=nature/identity, WHY=purpose/rationale, HOW=method/process, WHEN=conditions/timing.'),
    intent: z.enum(['canonical_example', 'grammar', 'normative_rules', 'semantic_role', 'declaration', 'full'])
      .default('full')
      .describe('Reading intent — filters which section types to include'),
    maxUnits: z.number().min(1).max(10).default(3)
      .describe('Maximum number of matching units to include in tape'),
    enrich: z.boolean().default(true)
      .describe('If true, auto-enrich keywords via T&D definitions and co-occurrence analysis before searching.'),
    planOnly: z.boolean().default(false)
      .describe('If true, return only the weighted reading plan without extracting text. Use for discovery and cost estimation.'),
    tier: z.union([z.number().min(1).max(4), z.literal('adaptive')]).optional()
      .describe('Tier filter. 1-4 = fixed tier. "adaptive" = read T1+T2, auto-expand to T3 if <3 chains in T1+T2 (T4 never auto-included). Omit to read all.'),
    indexRanking: z.array(z.string()).optional()
      .describe('Explicit ranking of index aliases by relevance, e.g. ["phya","sema","ont"]. First = best match. Auto-detected if omitted.'),
    narrow: z.boolean().default(true)
      .describe('When true, narrow broad chains to relevant paragraphs using linear-index keyword matching. Reduces extracted content to only the most relevant paragraphs per section.'),
    maxParasPerSection: z.number().min(1).max(20).default(5)
      .describe('Maximum paragraphs to keep per broad section when narrowing is active.'),
    filter: z.union([z.literal(true), z.string()]).optional()
      .describe('Line filter for extracted content. true = auto-filter by search keywords. String = custom regex pattern. Keeps matching lines + structural markers + context window.'),
    contextLines: z.number().min(0).max(10).default(2)
      .describe('Number of context lines around each matching line when filter is active.'),
    budget: z.number().min(1000).max(20000).optional()
      .describe('Token budget override. Default: 4000. When server returns BUDGET_PRESSURE with expandRecommended, retry with the suggested budget.'),
    detail: z.enum(['brief', 'normal', 'detailed', 'complete']).default('normal')
      .describe('Detail level — controls which tiers are protected from trimming. brief=T1 only, normal=T1+T2 (default), detailed=T1+T2+T3, complete=all tiers.'),
    autoExpand: z.boolean().default(false)
      .describe('When true, automatically expand budget to preserve protected tiers instead of returning BUDGET_PRESSURE. Ceiling: 20000 tokens.'),
    ndp: z.boolean().default(true)
      .describe('Normative-Driven Pipeline: use MUST/SHOULD/MAY from top unit to refine enrichment and scoring.'),
    qa: z.boolean().default(false)
      .describe('Question Analysis mode. When true, treats `keyword` as a natural-language question, embeds it via MiniLM, and matches against unit description vectors to find the best concepts. Overrides keyword-based unit search — the QA-matched units replace index keyword matches. Enrichment, onto, and NDP still apply on top.'),
    verbose: z.enum(['none', 'minimal', 'normal', 'debug']).default('normal')
      .describe('Verbosity of trace output. none=content only, minimal=compact plan+content, normal=all traces+plan+content, debug=everything including NDP trace.'),
  },
  async ({ keyword, intent, maxUnits, enrich, planOnly, tier, indexRanking, onto, narrow, maxParasPerSection, filter, contextLines, budget, detail, autoExpand, ndp, qa, verbose }) => {
    try {
      const rawKeywords = Array.isArray(keyword) ? keyword : [keyword];

      // ─── QA mode: embed question → match unit descriptors ──────
      // Must run BEFORE enrichment so QA-derived keywords replace the
      // natural-language question before enrichment tries to expand them.
      let qaInfo = '';
      let qaOnto = onto;
      let qaAnalysis: Awaited<ReturnType<typeof analyzeQuestion>> | null = null;
      let effectiveRawKeywords = rawKeywords;
      if (qa) {
        const allIndices = await loader.loadAllIndices();
        const registry = await loader.loadRegistry();
        qaAnalysis = await analyzeQuestion(rawKeywords.join(' '), allIndices, registry);
        qaInfo = `\n═══ QA ANALYSIS ═══\n${qaAnalysis.trace}\n`;
        // Use QA-suggested onto if agent didn't provide one
        if (!onto && qaAnalysis.suggestedOnto) {
          qaOnto = qaAnalysis.suggestedOnto;
        }
        // Replace keywords with QA-suggested keywords
        if (qaAnalysis.suggestedKeywords.length > 0) {
          effectiveRawKeywords = qaAnalysis.suggestedKeywords.slice(0, 5);
          qaInfo += `QA keyword override: [${rawKeywords.join(', ')}] → [${effectiveRawKeywords.join(', ')}]\n`;
        }
        // Concept-anchor: preserve construct name as keyword so searchKeywords can find it
        if (qaAnalysis.detectedConstructs.length > 0) {
          for (const construct of qaAnalysis.detectedConstructs.slice(0, 1)) {
            if (!effectiveRawKeywords.some(k => k.toLowerCase() === construct)) {
              effectiveRawKeywords.push(construct);
              qaInfo += `Anchor keyword preserved: "${construct}"\n`;
            }
          }
        }
      }

      // Keyword enrichment (operates on QA-derived keywords when qa=true)
      let keywords = effectiveRawKeywords;
      let enrichmentInfo = '';
      if (enrich) {
        const allIndices = await loader.loadAllIndices();
        await enricher.init(allIndices);
        const enriched = enricher.enrich(effectiveRawKeywords);
        keywords = enriched.expanded;
        if (enriched.expanded.length > enriched.original.length) {
          const added = enriched.expanded.filter(k => !enriched.original.includes(k));
          enrichmentInfo = `\nEnriched: ${enriched.original.join(', ')} → +[${added.join(', ')}]`;
          if (enriched.trace.length > 0) {
            enrichmentInfo += '\nTrace:';
            for (const t of enriched.trace.slice(0, 10)) {
              enrichmentInfo += `\n  ${t.keyword} ← ${t.reason}`;
            }
          }
          enrichmentInfo += '\n';
        }
      }

      let matches = await loader.searchKeywords(keywords, qaOnto ?? onto, effectiveRawKeywords);

      // If QA mode active, re-rank matches using QA similarity as tiebreaker
      if (qaAnalysis) {
        const qaUnitScores = new Map(
          qaAnalysis.matches.map(m => [`${m.alias}/${m.unitName}`, m.similarity])
        );
        // Boost keyword matches that also scored high in QA
        for (const m of matches) {
          const qaSim = qaUnitScores.get(`${m.alias}/${m.unitName}`) ?? 0;
          if (qaSim > 0) {
            // Add up to 9 points of QA boost (sim 0.5 → +4.5, sim 1.0 → +9)
            m.weightedScore += Math.round(qaSim * 9);
          }
        }
        // Re-sort with boosted scores
        matches.sort((a, b) => {
          if (qaOnto) {
            if (a.ontoMatch !== b.ontoMatch) return a.ontoMatch ? -1 : 1;
          }
          return b.weightedScore - a.weightedScore;
        });
      }

      if (matches.length === 0) {
        return {
          content: [{ type: 'text', text: `No units found for keywords: ${keywords.join(', ')}${qaInfo}` }],
        };
      }

      // ─── NDP: Normative-Driven Pipeline ───────────────────────────
      let ndpInfo = '';
      if (ndp && matches.length > 0) {
        try {
          const topUnit = matches[0];
          const t1Chains = topUnit.unit.seq
            .filter((s: SeqEntry) => s.Order <= 2)
            .flatMap((s: SeqEntry) => s.chain)
            .slice(0, 5);

          if (t1Chains.length > 0) {
            const textParts: string[] = [];
            for (const addr of t1Chains) {
              const parsed = resolver.parseChainAddress(addr);
              const filePath = await resolver.resolveFile(parsed.base);
              if (filePath) {
                const fullParsed = resolver.parseChainAddress(parsed.base + '/all');
                const block = await extractText(filePath, fullParsed);
                if (block?.text) textParts.push(block.text);
              }
            }
            if (textParts.length > 0) {
              const sectionText = textParts.join('\n\n');
              const ndpResult = runNdp(sectionText, effectiveRawKeywords);
              if (ndpResult.enrichTerms.length > 0 || ndpResult.filterTerms.length > 0) {
                ndpInfo = ndpResult.trace;
                matches = applyNdpScoring(matches, ndpResult);
              }
            }
          }
        } catch {
          // NDP is best-effort — if it fails, continue without it
        }
      }

      // ─── Concept-anchor: guarantee type-definition slot ───────────
      if (qaAnalysis?.detectedConstructs?.length) {
        for (const construct of qaAnalysis.detectedConstructs.slice(0, 1)) {
          const anchor = CONSTRUCT_ANCHOR[construct];
          if (!anchor) continue;

          // Check if anchor is already in top maxUnits
          const topN = matches.slice(0, maxUnits);
          const alreadyPresent = topN.some(m =>
            m.alias === anchor.alias && m.unitName === anchor.unitName
          );
          if (alreadyPresent) {
            qaInfo += `Anchor: ${anchor.alias}/${anchor.unitName} already in top-${maxUnits}\n`;
            continue;
          }

          // Try to find in full matches list
          const anchorIdx = matches.findIndex(m =>
            m.alias === anchor.alias && m.unitName === anchor.unitName
          );

          if (anchorIdx >= 0) {
            // Found but ranked too low — promote to last slot
            const [anchorMatch] = matches.splice(anchorIdx, 1);
            matches.splice(maxUnits - 1, 0, anchorMatch);
            qaInfo += `Anchor: promoted ${anchor.alias}/${anchor.unitName} from #${anchorIdx + 1} → #${maxUnits}\n`;
          } else {
            // Not in matches at all — load from index and inject
            const allIndices = await loader.loadAllIndices();
            const indexData = allIndices.get(anchor.alias);
            if (indexData && indexData[anchor.unitName]) {
              const unit = indexData[anchor.unitName];
              const registry = await loader.loadRegistry();
              const entry = registry.find(e => e.alias === anchor.alias);
              const unitOnto = unit.onto ?? entry?.onto ?? [];
              const effectiveOnto = qaOnto ?? onto;
              const ontoMatch = effectiveOnto ? unitOnto.includes(effectiveOnto) : false;

              const syntheticMatch = {
                alias: anchor.alias,
                unitName: anchor.unitName,
                unit,
                matchType: 'keyword' as const,
                matchedKeywords: [construct],
                ontoMatch,
                weightedScore: 3,
              };

              if (matches.length >= maxUnits) {
                matches.splice(maxUnits - 1, 0, syntheticMatch);
              } else {
                matches.push(syntheticMatch);
              }
              qaInfo += `Anchor: injected ${anchor.alias}/${anchor.unitName} (construct: "${construct}")\n`;
            }
          }
        }
      }

      // Limit matched units
      const limited = matches.slice(0, maxUnits);

      // Match ranking trace (debug verbose only)
      const debugMatchInfo = verbose === 'debug'
        ? '\nMatch ranking:\n' + matches.slice(0, Math.max(maxUnits + 3, 6)).map((m, i) =>
          `  ${i < maxUnits ? '→' : ' '} #${i+1} [${m.alias}/${m.unitName}] ws=${m.weightedScore} onto=${m.ontoMatch} kw=[${m.matchedKeywords.join(',')}]`
        ).join('\n') + '\n'
        : '';

      // Determine index ranking: use provided or auto-detect from match frequency
      const ranking = indexRanking ?? autoRankIndices(limited, onto);

      // Build onto-boost annotation for the reading plan output
      const ontoInfo = onto
        ? `\nOnto boost: ${onto} — ${limited.filter(m => m.ontoMatch).length}/${limited.length} units match\n`
        : '';

      // Ensure index registry is loaded for $ref resolution and territory
      const indexRegistry = await loader.loadAllIndices();

      // Build the weighted reading plan (funnel)
      const plan = buildReadingPlan(limited, ranking, effectiveRawKeywords, onto, indexRegistry, intent);

      // Plan-only mode: return the plan without reading content
      if (planOnly) {
        const output = qaInfo + enrichmentInfo + debugMatchInfo + ontoInfo + formatReadingPlan(plan);
        return {
          content: [{ type: 'text', text: output }],
        };
      }

      // Determine which chains to read
      let chainsToRead: string[];
      let tierNote = '';
      if (tier === 'adaptive') {
        // Adaptive: T1+T2, expand to T3 if insufficient
        const t12 = [...tierChains(plan, 1), ...tierChains(plan, 2)];
        if (t12.length < 3) {
          const t3 = tierChains(plan, 3);
          chainsToRead = [...t12, ...t3];
          if (t3.length > 0) tierNote = `[adaptive: T1+T2 had ${t12.length} chains → expanded to T3 (+${t3.length})]\n`;
        } else {
          chainsToRead = t12;
        }
      } else if (tier) {
        chainsToRead = tierChains(plan, tier);
      } else {
        chainsToRead = planToChainList(plan);
      }

      if (chainsToRead.length === 0) {
        const output = formatReadingPlan(plan);
        return {
          content: [{ type: 'text', text: `No chains in requested tier.\n\n${output}` }],
        };
      }

      // ─── MiniLM relevance gate: remove guaranteed noise ─────────
      // T1/T2 chains are protected — the funnel already ranked them carefully.
      // Gate applies only to T3/T4 where noise risk is highest.
      let relevanceInfo = '';
      const preTierMap = chainTierMap(plan);
      const headingMap = new Map(plan.chains.map(c => [c.address, c.heading]));
      const gateEntries = chainsToRead
        .map(addr => ({ address: addr, heading: headingMap.get(addr) ?? addr }))
        .filter(e => {
          const t = preTierMap.get(e.address) ?? 4;
          if (t <= 2) return false; // T1/T2: bypass gate
          return e.heading !== e.address && !e.heading.startsWith('Order ');
        });
      if (gateEntries.length > 0) {
        const originalQuery = qa ? rawKeywords.join(' ') : effectiveRawKeywords.join(' ');
        const { kept, rejected } = await filterNoise(originalQuery, gateEntries);
        if (rejected.length > 0) {
          const keptAddrs = new Set(kept.map(k => k.address));
          // T1/T2 always kept + T3/T4 that passed gate
          chainsToRead = chainsToRead.filter(addr =>
            (preTierMap.get(addr) ?? 4) <= 2 || keptAddrs.has(addr)
          );
          relevanceInfo = `\nRelevance gate: ${rejected.length} T3/T4 chains rejected (sim < ${THRESHOLDS.REJECT})\n` +
            rejected.map(r => `  ✗ ${r.address} [${r.similarity.toFixed(3)}] ${r.heading}`).join('\n') + '\n';
        }
      }

      // Narrow broad chains to relevant paragraphs
      let finalChains = chainsToRead;
      let narrowInfo = '';
      if (narrow) {
        const narrowed = await linearSearcher.narrowChains(chainsToRead, keywords, maxParasPerSection);
        finalChains = narrowed.chains;
        if (narrowed.trace.length > 0) {
          const traceLines = narrowed.trace.map(t =>
            `  ${t.base}: ${t.totalParagraphs} paras → ${t.matchedParagraphs} matched → ${t.kept} kept${t.narrowed ? ' (narrowed)' : ''}`
          );
          narrowInfo = `\nNarrowing: ${chainsToRead.length} chains → ${finalChains.length} chains\n${traceLines.join('\n')}\n`;
        }
      }

      // Read content via chain resolver
      clearFileCache();
      resolver.clearUnresolved();
      const results: string[] = [];

      // ─── Verbose-aware trace assembly ───────────────────────────
      // none:    content only
      // minimal: compact plan (unit names + T1 chains) + content
      // normal:  enrichment + onto + narrowing + full plan + content
      // debug:   everything including NDP trace
      if (verbose === 'debug' || verbose === 'normal') {
        if (qaInfo) results.push(qaInfo);
        if (enrichmentInfo) results.push(enrichmentInfo);
        if (debugMatchInfo) results.push(debugMatchInfo);
        if (ontoInfo) results.push(ontoInfo);
        if (relevanceInfo) results.push(relevanceInfo);
        // contentGateInfo is added after post-read filtering below
      }
      if (verbose === 'debug') {
        if (ndpInfo) results.push(ndpInfo);
      }
      if (verbose === 'debug' || verbose === 'normal') {
        if (narrowInfo) results.push(narrowInfo);
        if (tierNote) results.push(tierNote);
        results.push(formatReadingPlan(plan));
      } else if (verbose === 'minimal') {
        if (tierNote) results.push(tierNote);
        // Compact plan: just unit names and T1 chain addresses
        const compactLines: string[] = ['Plan:'];
        const t1 = plan.tiers.find(t => t.tier === 1);
        if (t1) {
          for (const [, chains] of t1.groups) {
            for (const c of chains) {
              compactLines.push(`  ${c.unitName}: ${c.address}`);
            }
          }
        }
        results.push(compactLines.join('\n'));
      }
      // verbose === 'none' → no traces at all

      results.push('');
      results.push('═══ CONTENT ═══');

      // Build line filter patterns if requested
      const filterPatterns = filter
        ? (filter === true
          ? buildKeywordPatterns(keywords)
          : [new RegExp(filter, 'i')])
        : null;

      const applyFilter = (text: string): string =>
        filterPatterns ? filterByKeywords(text, filterPatterns, contextLines) : text;

      // ─── Build section-base → tier map for narrowed/expanded addresses ───
      // preTierMap has plan-level addresses (e.g. "3.10/all"), but after
      // narrowing these become paragraph-level (e.g. "3.10", "3.10/B.").
      // Build a base-section lookup so children inherit parent tier.
      const baseTierMap = new Map<string, number>();
      for (const [addr, tier] of preTierMap.entries()) {
        baseTierMap.set(addr, tier);
        // Also map the base section (strip /all, /A., /(A)-(C) etc.)
        const slashIdx = addr.indexOf('/');
        if (slashIdx > 0) {
          const base = addr.slice(0, slashIdx);
          // Keep the minimum (highest-priority) tier for each base
          const existing = baseTierMap.get(base);
          if (existing === undefined || tier < existing) {
            baseTierMap.set(base, tier);
          }
        }
      }

      /** Resolve tier for any chain address (exact → base-section fallback) */
      const resolveTier = (addr: string): number => {
        const exact = baseTierMap.get(addr);
        if (exact !== undefined) return exact;
        // Strip suffix to find base section
        const slashIdx = addr.indexOf('/');
        if (slashIdx > 0) {
          const base = addr.slice(0, slashIdx);
          return baseTierMap.get(base) ?? 4;
        }
        return 4;
      };

      // ─── Read content + collect T3/T4 for content gate ─────────
      interface ReadSection { addr: string; text: string; tier: number }
      const readSections: ReadSection[] = [];

      for (const addr of finalChains) {
        // Tier from plan — expanded/narrowed children inherit parent's tier
        const parentTier = resolveTier(addr);
        const parsed = resolver.parseChainAddress(addr);
        if (parsed.suffixType === 'aspect-range' || parsed.suffixType === 'paragraph-range') {
          const expanded = resolver.expandRange(parsed);
          for (const expandedRaw of expanded) {
            const expandedParsed = resolver.parseChainAddress(expandedRaw);
            const filePath = await resolver.resolveFile(expandedParsed.base);
            if (!filePath) {
              readSections.push({ addr: expandedRaw, text: `[MISSING_CONTENT: ${expandedParsed.base}]`, tier: parentTier });
              continue;
            }
            const block = await extractText(filePath, expandedParsed);
            readSections.push({ addr: expandedRaw, text: block?.text ?? '[not found]', tier: parentTier });
          }
        } else {
          const filePath = await resolver.resolveFile(parsed.base);
          if (!filePath) {
            readSections.push({ addr, text: `[MISSING_CONTENT: ${parsed.base}]`, tier: parentTier });
            continue;
          }
          const block = await extractText(filePath, parsed);
          readSections.push({ addr, text: block?.text ?? '[not found]', tier: parentTier });
        }
      }

      // Content gate disabled (scoreContentRelevance not available in demo)

      // Compute pre-filter token estimate for sufficiency signal
      const preFilterTokens = readSections.reduce(
        (sum, s) => sum + estimateTokens(s.text), 0,
      );

      // Assemble final output from read sections (skip MISSING_CONTENT entries)
      for (const section of readSections) {
        if (section.text.startsWith('[MISSING_CONTENT:')) continue;
        results.push(`▸ [T${section.tier}] ${section.addr}\n${applyFilter(section.text)}\n`);
      }

      // Append missing-content summary
      const missingChains = resolver.unresolvedChains;
      if (missingChains.length > 0) {
        results.push(`\n─── MISSING CONTENT ───`);
        results.push(`The following sections have no backing file in current/. Content is absent — skip these chains.`);
        for (const chain of missingChains) {
          results.push(`  ✗ ${chain}`);
        }
        results.push('');
      }

      const raw = results.join('\n');
      const budgeted = applyBudget(raw, {
        budget: budget ?? DEFAULT_BUDGET,
        detail: detail as DetailLevel,
        autoExpand,
        context: autoExpand ? { plan, keywords, onto: onto as OntoRole | undefined } : undefined,
      });

      // Rule-of-thirds sufficiency signal: if >33.33% of content was
      // filtered/trimmed, the delivered portion already covers the query.
      const trimRatio = preFilterTokens > 0
        ? 1 - (budgeted.tokens / preFilterTokens)
        : 0;
      const sufficientHint = trimRatio > 1 / 3
        ? ` [SUFFICIENT: ${Math.round(trimRatio * 100)}% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]`
        : '';

      let meta: string;
      if (budgeted.expandedFrom) {
        meta = `\n[AUTO_EXPANDED: ${budgeted.expandedFrom} → ${budgeted.budget} to preserve ${detail} content. ${budgeted.trimmed ? `Trimmed from ${budgeted.originalTokens}` : `Tokens: ~${budgeted.tokens}`}]${sufficientHint}`;
      } else if (budgeted.trimmed) {
        meta = budgeted.pressure?.expandRecommended
          ? `\n[Budget: ${budgeted.tokens}/${budgeted.budget} tokens, trimmed from ${budgeted.originalTokens}. EXPAND RECOMMENDED → budget:${budgeted.pressure.suggestedBudget}]${sufficientHint}`
          : `\n[Budget: ${budgeted.tokens}/${budgeted.budget} tokens, trimmed from ${budgeted.originalTokens}]${sufficientHint}`;
      } else {
        meta = `\n[Tokens: ~${budgeted.tokens}]${sufficientHint}`;
      }
      return {
        content: [{ type: 'text', text: budgeted.text + meta }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Index onto-affinity: which indices are closest to each onto role ────
// Hierarchy per WHY: onto > architecture > design > enforce > types
// Hierarchy per HOW: syntax > design > types > ontology
// Hierarchy per WHAT: types > terms > ontology > design
// Hierarchy per WHEN: behavioral > design > ontology > types
const INDEX_ONTO_AFFINITY: Record<string, Record<string, number>> = {
  WHY:   { phla: 3, ont: 3, onma: 2, sema: 1, desa: 0, phya: 0, bsyn: 0, bhva: 0, grma: 0, trma: 0, grix: 0 },
  HOW:   { bsyn: 3, grma: 3, desa: 3, bhva: 1, onma: 1, phya: 0, sema: 0, ont: 0, phla: 0, trma: 0, grix: 2 },
  WHAT:  { phya: 3, sema: 3, trma: 2, onma: 1, ont: 1, desa: 0, bsyn: 0, bhva: 0, grma: 0, phla: 0, grix: 1 },
  WHEN:  { bhva: 3, desa: 1, onma: 1, ont: 0, phya: 0, sema: 0, bsyn: 0, grma: 0, phla: 0, trma: 0, grix: 0 },
  WHERE: { desa: 3, bhva: 3, onma: 2, bsyn: 1, phya: 1, sema: 0, ont: 0, phla: 0, grma: 0, trma: 0, grix: 1 },
};

/** Extract construct names from keyword array (fallback when QA analysis is off) */
function detectConstructsFromKeywords(keywords: string[]): string[] {
  const CONSTRUCTS = ['domain', 'module', 'definition', 'record', 'interface',
    'event', 'rule', 'action', 'flow', 'class', 'delegate', 'method',
    'binder', 'inline', 'surrogate', 'enforcement', 'explanation', 'enum', 'error'];
  const found: string[] = [];
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    for (const c of CONSTRUCTS) {
      if (lower.includes(c) && !found.includes(c)) found.push(c);
    }
  }
  return found;
}

/** Auto-rank index aliases by match count + onto-affinity boost.
 *  When onto is provided, each index gets an affinity bonus (0-3) added
 *  to its match count. This ensures ontological indices rank above
 *  architectural ones for WHY queries, even with fewer matched units. */
function autoRankIndices(matches: Array<{ alias: string }>, onto?: string): string[] {
  const counts = new Map<string, number>();
  for (const m of matches) {
    counts.set(m.alias, (counts.get(m.alias) ?? 0) + 1);
  }
  const affinityMap = onto ? INDEX_ONTO_AFFINITY[onto] : undefined;
  return Array.from(counts.entries())
    .sort((a, b) => {
      const scoreA = a[1] + (affinityMap?.[a[0]] ?? 0);
      const scoreB = b[1] + (affinityMap?.[b[0]] ?? 0);
      return scoreB - scoreA;
    })
    .map(([alias]) => alias);
}

// ─── Extract filter helper ──────────────────────────────────────────

function applyExtract(text: string, extract?: 'code' | 'table' | 'refs' | 'normative'): string {
  if (!extract) return text;

  switch (extract) {
    case 'code': {
      const blocks = extractCodeBlocks(text);
      if (!blocks.length) return '[no code blocks found]';
      return blocks.map(b => {
        const langTag = b.lang ? ` (${b.lang})` : '';
        return `\`\`\`${b.lang}\n${b.content}\n\`\`\``;
      }).join('\n\n');
    }
    case 'table': {
      const tables = extractTables(text);
      if (!tables.length) return '[no tables found]';
      return tables.map(t => t.raw).join('\n\n');
    }
    case 'refs': {
      const refs = extractReferences(text);
      if (!refs.length) return '[no references found]';
      const grouped = new Map<string, string[]>();
      for (const r of refs) {
        const list = grouped.get(r.type) ?? [];
        list.push(r.target);
        grouped.set(r.type, list);
      }
      const lines: string[] = [];
      for (const [type, targets] of grouped) {
        const unique = [...new Set(targets)];
        lines.push(`${type}: ${unique.join(', ')}`);
      }
      return lines.join('\n');
    }
    case 'normative': {
      const norms = extractNormatives(text);
      return formatNormatives(norms);
    }
  }
}

// ─── Tool: read_chain ───────────────────────────────────────────────

server.tool(
  'read_chain',
  `Read spec content by chain address(es). Resolves addresses directly to markdown text without index lookup.

Examples:
  "2.7.3" → heading + first paragraph of section 2.7.3
  "B.2/A." → aspect A in section B.2
  "2.5.1/all" → entire section 2.5.1
  "B.8/(A)-(F)" → paragraphs A through F in section B.8
  "A.7/table-1" → first table in section A.7

Extract modes:
  extract: "code"      → only fenced code blocks (grammar, examples)
  extract: "table"     → only markdown tables
  extract: "refs"      → only references (section, web, person)
  extract: "normative" → only MUST/SHALL/SHOULD/MAY statements (RFC 2119)
  omit extract         → full text (default)`,
  {
    chains: z.array(z.string()).min(1).max(20)
      .describe('Chain addresses to resolve (e.g. ["2.7.3", "B.2/A.", "A.7/table-1"])'),
    extract: z.enum(['code', 'table', 'refs', 'normative']).optional()
      .describe('Filter extracted content: code = fenced blocks, table = tables, refs = references, normative = MUST/SHALL/SHOULD/MAY statements'),
    budget: z.number().min(1000).max(20000).optional()
      .describe('Token budget override. Default: 4000.'),
    detail: z.enum(['brief', 'normal', 'detailed', 'complete']).default('normal')
      .describe('Detail level — controls which tiers are protected from trimming. brief=T1 only, normal=T1+T2 (default), detailed=T1+T2+T3, complete=all tiers.'),
    autoExpand: z.boolean().default(false)
      .describe('When true, automatically expand budget to preserve protected tiers. Ceiling: 20000 tokens.'),
  },
  async ({ chains, extract, budget, detail, autoExpand }) => {
    try {
      clearFileCache();
      resolver.clearUnresolved();
      const results: string[] = [];

      for (const rawAddr of chains) {
        const parsed = resolver.parseChainAddress(rawAddr);

        // Expand ranges
        if (parsed.suffixType === 'aspect-range' || parsed.suffixType === 'paragraph-range') {
          const expanded = resolver.expandRange(parsed);
          for (const expandedRaw of expanded) {
            const expandedParsed = resolver.parseChainAddress(expandedRaw);
            const filePath = await resolver.resolveFile(expandedParsed.base);
            if (!filePath) {
              results.push(`[MISSING_CONTENT: ${expandedParsed.base}]`);
              continue;
            }
            const block = await extractText(filePath, expandedParsed);
            results.push(`▸ ${expandedRaw}\n${applyExtract(block?.text ?? '[not found]', extract)}\n`);
          }
        } else {
          const filePath = await resolver.resolveFile(parsed.base);
          if (!filePath) {
            results.push(`[MISSING_CONTENT: ${parsed.base}]`);
            continue;
          }
          const block = await extractText(filePath, parsed);
          results.push(`▸ ${rawAddr}\n${applyExtract(block?.text ?? '[not found]', extract)}\n`);
        }
      }

      // Filter out inline MISSING_CONTENT markers; append summary instead
      const filteredResults = results.filter(r => !r.startsWith('[MISSING_CONTENT:'));
      const missingChainsRC = resolver.unresolvedChains;
      if (missingChainsRC.length > 0) {
        filteredResults.push(`\n─── MISSING CONTENT ───`);
        filteredResults.push(`The following sections have no backing file in current/. Content is absent — skip these chains.`);
        for (const chain of missingChainsRC) {
          filteredResults.push(`  ✗ ${chain}`);
        }
        filteredResults.push('');
      }

      const raw = filteredResults.join('\n');
      const budgeted = applyBudget(raw, {
        budget: budget ?? DEFAULT_BUDGET,
        detail: detail as DetailLevel,
        autoExpand,
      });

      // Rule-of-thirds sufficiency signal for read_chain
      const trimRatio = budgeted.originalTokens > 0
        ? 1 - (budgeted.tokens / budgeted.originalTokens)
        : 0;
      const sufficientHint = trimRatio > 1 / 3
        ? ` [SUFFICIENT: ${Math.round(trimRatio * 100)}% trimmed — remaining content covers the query.]`
        : '';

      let meta: string;
      if (budgeted.expandedFrom) {
        meta = `\n[AUTO_EXPANDED: ${budgeted.expandedFrom} → ${budgeted.budget} to preserve ${detail} content. ${budgeted.trimmed ? `Trimmed from ${budgeted.originalTokens}` : `Tokens: ~${budgeted.tokens}`}]${sufficientHint}`;
      } else if (budgeted.trimmed) {
        meta = `\n[Budget: ${budgeted.tokens}/${budgeted.budget} tokens, trimmed from ${budgeted.originalTokens}]${sufficientHint}`;
      } else {
        meta = `\n[Tokens: ~${budgeted.tokens}]${sufficientHint}`;
      }
      return {
        content: [{ type: 'text', text: budgeted.text + meta }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Tool: list_units ───────────────────────────────────────────────

server.tool(
  'list_units',
  'List index units matching a keyword. Returns unit names, keywords, and chain overview without extracting text. Use for discovery before search_spec.',
  {
    keyword: z.union([z.string(), z.array(z.string()).min(1).max(5)])
      .describe('Search keyword'),
  },
  async ({ keyword }) => {
    try {
      const keywords = Array.isArray(keyword) ? keyword : [keyword];
      const matches = await loader.searchKeywords(keywords);

      if (matches.length === 0) {
        return {
          content: [{ type: 'text', text: `No units found for keywords: ${keywords.join(', ')}` }],
        };
      }

      const lines: string[] = [];
      for (const m of matches) {
        const chains = m.unit.seq
          .filter((e): e is SeqEntry => typeof e === 'object' && e !== null && 'chain' in e)
          .flatMap(e => e.chain ?? []);

        lines.push(`● ${m.unitName} (${m.alias}, via ${m.matchType})`);
        if (m.unit.abstract) lines.push(`  ⤷ ${m.unit.abstract}`);
        lines.push(`  keywords: ${m.unit.keywords.join(', ')}`);
        lines.push(`  chains: ${chains.slice(0, 8).join(', ')}${chains.length > 8 ? ` ... +${chains.length - 8}` : ''}`);
        lines.push('');
      }

      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Tool: fulltext_search ───────────────────────────────────────────

server.tool(
  'fulltext_search',
  `Fulltext search across all spec sections by vocabulary terms.
Returns matching sections with their bold/backtick terms, titles, file locations,
and reverse-mapped aspect index units.

Use for broad discovery: "which sections talk about trust boundaries?" or
"find all sections mentioning canonical form".

Scoring: exact token hits + multi-word phrase coherence + distinct-term coverage.`,
  {
    query: z.string().min(2)
      .describe('Search terms, space-separated (e.g. "trust boundary", "canonical form", "delegate enforcement")'),
    maxResults: z.number().min(1).max(50).default(10)
      .describe('Maximum sections to return (default 10)'),
  },
  async ({ query, maxResults }) => {
    try {
      const results = await linearSearcher.search(query, maxResults);

      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `No sections found for: "${query}"` }],
        };
      }

      const meta = await linearSearcher.getMeta();
      const lines: string[] = [];

      if (meta) {
        lines.push(`[index: ${meta.sectionCount} sections, ${(meta as any).paragraphCount ?? '?'} paragraphs, ${meta.termCount} terms]`);
        lines.push('');
      }

      for (const r of results) {
        const paraTag = r.parentSection ? ` ← §${r.parentSection}` : '';
        const typeTag = r.markerType ? ` [${r.markerType}]` : '';
        lines.push(`§ ${r.sectionId}${typeTag} — ${r.title}${paraTag}`);
        lines.push(`  file: ${r.file}:${r.line}  (score ${r.score})`);
        lines.push(`  matched: ${r.matchedTerms.join(', ')}`);

        const aspects = Object.entries(r.aspects);
        if (aspects.length > 0) {
          const aspStr = aspects
            .map(([alias, units]) => `${alias}: ${units.join(', ')}`)
            .join(' | ');
          lines.push(`  → ${aspStr}`);
        }

        lines.push('');
      }

      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Tool: lookup_xref ──────────────────────────────────────────────

server.tool(
  'lookup_xref',
  `Look up cross-references for spec sections. Two modes:

Forward lookup (default): Given section number(s), return all outgoing references
(links to other sections, external standards like GDPR/RFC/ISO, URLs).
Use after search_spec to discover related sections.

Reverse lookup: Given a target (section number or standard name),
find all sections that reference it.
Use to answer "who mentions GDPR?" or "which sections link to 2.7.3?"

Weight model:
  section refs: base priority (no penalty)
  standard refs: +5 penalty (external, less navigable)
  url/person refs: +10 penalty

Results are sorted by score (lower = higher priority).`,
  {
    sections: z.array(z.string()).min(1).max(20)
      .describe('Section numbers or targets to look up (e.g. ["2.7.3", "8.1"] or ["GDPR"])'),
    mode: z.enum(['forward', 'reverse']).default('forward')
      .describe('forward = outgoing refs FROM sections; reverse = find sections that REFERENCE the target'),
    refType: z.array(z.enum(['section', 'standard', 'url', 'person'])).optional()
      .describe('Filter by reference type(s). Omit to include all types.'),
    expand: z.boolean().default(false)
      .describe('When true, also return the xref section targets as chain addresses (for piping into read_chain).'),
  },
  async ({ sections, mode, refType, expand }) => {
    try {
      const lines: string[] = [];

      if (mode === 'reverse') {
        // Reverse lookup — find all sections referencing the target
        for (const target of sections) {
          const refs = await xrefLoader.reverseLookup(target);
          if (refs.length === 0) {
            lines.push(`⊘ No sections reference "${target}"`);
            continue;
          }
          lines.push(`◀ "${target}" is referenced by ${refs.length} section(s):`);
          for (const r of refs) {
            lines.push(`  §${r.fromSection} [${r.type}] ${r.file}:${r.line}`);
            lines.push(`    ${r.context}`);
          }
          lines.push('');
        }
      } else {
        // Forward lookup — outgoing refs from sections
        // metaRank: xref always last — use a high rank
        const meta = await xrefLoader.getMeta();
        const metaRank = 10; // Well after any aspect index rank

        const refs = await xrefLoader.lookup(sections, metaRank, refType as any);
        if (refs.length === 0) {
          lines.push(`⊘ No outgoing references from sections: ${sections.join(', ')}`);
        } else {
          // Group by source section
          const grouped = new Map<string, typeof refs>();
          for (const r of refs) {
            const group = grouped.get(r.fromSection) ?? [];
            group.push(r);
            grouped.set(r.fromSection, group);
          }

          for (const [sectionId, sectionRefs] of grouped) {
            lines.push(`▶ §${sectionId} — ${sectionRefs.length} outgoing ref(s):`);
            for (const r of sectionRefs) {
              lines.push(`  → ${r.target} [${r.type}, score=${r.score}]`);
              lines.push(`    ${r.context}`);
            }
            lines.push('');
          }

          // Summary
          const byType = new Map<string, number>();
          for (const r of refs) byType.set(r.type, (byType.get(r.type) ?? 0) + 1);
          const typeSummary = Array.from(byType.entries()).map(([t, c]) => `${t}:${c}`).join(', ');
          lines.push(`Total: ${refs.length} refs (${typeSummary})`);
        }

        // Expand: return chain addresses for section-type refs
        if (expand) {
          const chains = await xrefLoader.expandToChains(sections);
          if (chains.length > 0) {
            lines.push('');
            lines.push(`Chain addresses for read_chain: ${chains.join(', ')}`);
          }
        }
      }

      return {
        content: [{ type: 'text', text: lines.join('\n') }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Tool: analyze_question ─────────────────────────────────────────

server.tool(
  'analyze_question',
  `Analyze a natural-language question against the spec's concept space using MiniLM embeddings.
Embeds the full question and compares against pre-computed unit description vectors to find the best matching spec concepts.
Returns: ranked unit matches with similarity scores, suggested ontological role (WHAT/WHY/HOW/WHEN), and suggested keywords.
Use this to understand what the spec "thinks" a question is about before running search_spec.`,
  {
    question: z.string().min(3).describe('Natural-language question to analyze (e.g. "What is a delegate trust boundary and how is it enforced?")'),
  },
  async ({ question }) => {
    try {
      const allIndices = await loader.loadAllIndices();
      const registry = await loader.loadRegistry();
      const analysis = await analyzeQuestion(question, allIndices, registry);
      return {
        content: [{ type: 'text', text: analysis.trace }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Tool: spec_version ─────────────────────────────────────────────

server.tool(
  'spec_version',
  'Returns the current E.L.I.A. specification version, date, and change summary',
  {},
  async () => {
    try {
      const versionRaw = await readFile(join(SPEC_ROOT, 'current', 'version.txt'), 'utf-8');
      const lines = versionRaw.trim().split(/\r?\n/);
      const version = lines[0]?.trim() ?? 'unknown';
      const date = lines[1]?.trim() ?? 'unknown';

      let changes: string[] = [];
      try {
        const changesRaw = await readFile(join(SPEC_ROOT, 'current', 'changes.json'), 'utf-8');
        changes = JSON.parse(changesRaw);
      } catch {
        // changes.json is optional
      }

      const result = { version, date, changes };
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
        isError: true,
      };
    }
  },
);

// ─── Start ──────────────────────────────────────────────────────────

async function main() {
  await initExtractor(SPEC_ROOT);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('elia-spec-reader MCP server started');
}

main().catch(console.error);
