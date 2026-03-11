#!/usr/bin/env node
// runner.js — Main benchmark orchestrator
// Isolation model: each (question × mode) = fresh API call, no shared context.
// Order: Manual first → MCP second (prevents MCP answer leaking into Manual).

const RUNNER_VERSION = '0.8';
const RUNNER_CHANGES = {
  '0.8': '--api-model flag: model registry (sonnet/haiku/opus), MODEL passed as parameter to agent-loop (no longer hardcoded)',
  '0.7': 'benchmark 0a4c: MCP avg 10.6/12 vs Naive avg 7.8/12 (+2.8), tier ordering as attention allocation, 5 naive failure modes identified',
  '0.6': 'detailed call metrics (llm/search/read), plan cache with T3/T4 reserve, cache prolongation on slow questions',
  '0.5': 'multi-facet decomposition, index registry in prompts, content saturation stop, mcp3 mode',
  '0.4': 'compact TOC v2, copilot-instructions cached in mcp mode',
  '0.3': 'mcp2 two-phase pipeline (classify→search→load→answer)',
  '0.2': 'mcp agent loop mode',
  '0.1': 'manual mode (grep + read_file)',
};
const RUNNER_GEN = Object.keys(RUNNER_CHANGES).length; // auto-increment folder suffix
import 'dotenv/config';
import Anthropic from '@anthropic-ai/sdk';
import { parseQuestions } from './questions.js';
import { SYSTEM_PROMPT_MCP, SYSTEM_PROMPT_MANUAL, SYSTEM_PROMPT_PLAN, SYSTEM_PROMPT_ANSWER } from './prompts.js';
import { MANUAL_TOOL_DEFS, executeManualTool } from './tools-manual.js';
import { startMcpServer, stopMcpServer, getMcpToolDefs, executeMcpTool } from './tools-mcp.js';
import { runAgentLoop, runTwoPhaseLoop, runNaiveCall } from './agent-loop.js';
import { saveManualDump, saveMcpDump, saveNaiveDump, save4ArtifactDump } from './dump.js';
import { readFileSync, mkdirSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── CLI args ───────────────────────────────────────────────────────

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const modeRaw = getArg('--mode');                // 'manual' | 'mcp' | explicit 'manual5' | 'mcp3' | undefined
// Auto-version: 'manual' → 'manual{GEN}', 'mcp' → 'mcp{GEN}'. Explicit versions pass through.
const modeFilter = modeRaw === 'manual' ? `manual${RUNNER_GEN}`
                 : modeRaw === 'mcp'    ? `mcp${RUNNER_GEN}`
                 : modeRaw;             // undefined | explicit 'manual5' | 'mcp3' | etc.
const questionsLimit = parseInt(getArg('--questions') ?? '0', 10) || Infinity;
const startFrom = parseInt(getArg('--start') ?? '1', 10);
const modelSlug = getArg('--model') ?? 'sonnet';
const questionsFile = getArg('--file');
const apiModelRaw = getArg('--api-model');
const fourArt = args.includes('--4art');
const onlyRaw = getArg('--only');
const onlySet = onlyRaw ? new Set(onlyRaw.split(',').map(n => parseInt(n.trim(), 10))) : null;
const seedBudget = parseInt(getArg('--seed-budget') ?? '0', 10) || 0;
const miniToc = args.includes('--mini-toc');

// ─── Model Registry ─────────────────────────────────────────────────
const MODEL_REGISTRY = {
  'sonnet':    'claude-sonnet-4-20250514',
  'sonnet46':  'claude-sonnet-4-6',
  'haiku':     'claude-haiku-4-5-20251001',
  'opus':      'claude-opus-4-20250514',
  'opus46':    'claude-opus-4-6',
  'opus45':    'claude-opus-4-5-20251101',
};

// Resolve --api-model: slug → API model ID, or pass through as-is
const apiModel = apiModelRaw
  ? (MODEL_REGISTRY[apiModelRaw] || apiModelRaw)
  : undefined; // undefined = use agent-loop default (sonnet)

function getArg(flag) {
  const idx = args.indexOf(flag);
  return idx >= 0 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

// ─── Main ───────────────────────────────────────────────────────────

async function main() {
  // Validate API key
  if (!dryRun && !process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY not set. Create a .env file or set the env var.');
    process.exit(1);
  }

  const client = dryRun ? null : new Anthropic();
  const questions = parseQuestions(questionsFile);

  console.log(`\n=== E.L.I.A. Benchmark Runner v${RUNNER_VERSION} ===`);
  console.log(`Changes: ${RUNNER_CHANGES[RUNNER_VERSION]}`);
  const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  console.log(`Run: ${runId}`);
  console.log(`Model: ${modelSlug}${apiModel ? ` (API: ${apiModel})` : ''}`);
  console.log(`Questions: ${questions.length} total, running ${Math.min(questionsLimit, questions.length - startFrom + 1)} (from #${startFrom})`);
  const outputDir = modeFilter
    ? `.misc/benchmark/results/${modelSlug}/${modeFilter}/`
    : `.misc/benchmark/results/${modelSlug}/{manual,mcp}/`;
  console.log(`Mode: ${modeFilter ?? 'both (manual first, mcp second)'}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Dry run: ${dryRun}`);
  console.log(`Isolation: full (each call = fresh API context, no leakage)\n`);

  // Create output directory upfront
  if (modeFilter) {
    mkdirSync(resolve(__dirname, '..', '..', '.misc', 'benchmark', 'results', modelSlug, modeFilter), { recursive: true });
  } else {
    mkdirSync(resolve(__dirname, '..', '..', '.misc', 'benchmark', 'results', modelSlug, 'manual'), { recursive: true });
    mkdirSync(resolve(__dirname, '..', '..', '.misc', 'benchmark', 'results', modelSlug, 'mcp'), { recursive: true });
  }

  // Start MCP server if needed
  const isManualMode = modeFilter && modeFilter.startsWith('manual');
  const isNaiveMode = modeFilter && modeFilter.startsWith('naive');
  const isMcpAgentMode = modeFilter && /^mcp[\d_a-z]*$/i.test(modeFilter) && !modeFilter.match(/^mcp[2-9]\d*$/);
  const isTwoPhaseMode = modeFilter && /^mcp[2-9]\d*$/.test(modeFilter);
  const needMcp = !modeFilter || isMcpAgentMode || isTwoPhaseMode;
  if (needMcp && !dryRun) {
    console.log('[setup] Starting MCP server...');
    await startMcpServer();
  }

  // Load copilot-instructions for mcp mode (cached as system prefix)
  let copilotInstructions = '';
  if (needMcp && !dryRun) {
    const ciPath = resolve(__dirname, '..', '..', '.github', 'copilot-instructions.md');
    copilotInstructions = readFileSync(ciPath, 'utf-8');
    console.log(`[setup] Loaded copilot-instructions: ${copilotInstructions.length} chars (~${Math.round(copilotInstructions.length / 4)} tokens)`);
  }

  // Two-phase modes use LLM classifier with TOC
  let specToc = '';
  if ((isTwoPhaseMode || isNaiveMode) && !dryRun) {
    const tocFile = isNaiveMode
      ? (miniToc ? 'spec-toc-mini.txt' : 'spec-toc.txt')
      : 'spec-toc-compact.txt';
    const tocPath = resolve(__dirname, tocFile);
    specToc = readFileSync(tocPath, 'utf-8');
    console.log(`[setup] Loaded TOC: ${tocFile} — ${specToc.length} chars (~${Math.round(specToc.length / 4)} tokens)`);
  }

  // Naive mode: load spec files into a single string
  const NAIVE_EXCLUDE = new Set([
    '3_0_block_syntax.md', '8_0_resilience_model.md',
    'annex_g_compilation_errors.md', 'annex_g_1_diagnostic_compilation_reaction_model.md',
    '2_8_data_type_functions.md', 'annex_c_semantic_type_configuration.md',
    'annex_d_1_compiler_enforcement_model.md', '6_0_domain_driven_flow_design.md',
    '2_4_specialized_types.md', 'annex_d_rule_normative_classes.md',
    '2_7_2_data_interface.md', '2_7_4_delegate.md',
    '2_0_system_type_overview.md', 'annex_e_normative_classes.md',
    '7_0_enforcement_compliance_architecture.md', '2_1_primitive_types.md',
    '3_0_grammar_block.md',
  ]);
  const NAIVE_EXCLUDED_SUMMARY = [
    '§2.0 System Type Overview — taxonomy: stream/block/inline/opaque/primitive, type categories, classification axes',
    '§2.1 Primitive Types — int8–int64, float32–float64, bool, char, enum, fixed string, non-value, encoding rules',
    '§2.4 Specialized Types — Any, Tuple, Version, Reference, ExpTree + Error/Event foundations',
    '§2.7.2 Data Interface — structural data contracts, category operations, DB/RPC drivers',
    '§2.7.4 Delegate — type-safe callable proxies, integration boundaries, retry/circuit breaker',
    '§2.8 Data Type Functions — sizeof, typeof, serialize, parse, read, write, validate, bind, project',
    '§3.0 Block Syntax — domain/module/using/follow/invoke/method/variable/inline/infer/control-flow/expressions/literals (~200 pages)',
    '§3.0.3 Grammar Primitives — block scope, comments, illustrative comments',
    '§6.0 Domain-Driven Flow Design — multi-layer DFD projection, integration classes, profiles',
    '§7.0 Enforcement & Compliance — pipeline, admission control, cross-border, audit coupling',
    '§8.0 Resilience Model — fault tolerance, error recovery, class vs record, streams, observability',
    'Annex C — Semantic type configuration tables (with parameters)',
    'Annex D — Rule normative classes (R0–R6), evaluation stages, dependency closure',
    'Annex D.1 — Compiler enforcement model',
    'Annex E — Normative classes catalog (business, nature, HUMINT/OSINT, market, boundary, evidence, audit)',
    'Annex G — Compilation error codes (type/derived/behavioral/semantic/syntax)',
    'Annex G.1 — Diagnostic/reaction model',
  ].join('\n');

  let naiveSpecContent = '';
  let naiveSpecFiles = [];
  const naiveSpecDir = resolve(__dirname, '..', '..', 'current');
  let naiveAllFiles = [];
  if (isNaiveMode && !dryRun) {
    const allMd = readdirSync(naiveSpecDir).filter(f => f.endsWith('.md')).sort();
    naiveAllFiles = allMd;
    naiveSpecFiles = allMd.filter(f => !NAIVE_EXCLUDE.has(f));
    console.log(`[setup] Naive mode: loading ${naiveSpecFiles.length} spec files (excluding ${NAIVE_EXCLUDE.size})`);
    const parts = [];
    for (const f of naiveSpecFiles) {
      const text = readFileSync(resolve(naiveSpecDir, f), 'utf-8');
      parts.push(`${'═'.repeat(60)}\nFILE: ${f}\n${'═'.repeat(60)}\n${text}`);
    }
    naiveSpecContent = parts.join('\n\n');
    console.log(`[setup] Naive spec content: ${naiveSpecContent.length} chars (~${Math.round(naiveSpecContent.length / 4)} tokens)`);
  }

  // Section cache for mcp2 (persists across questions)
  const sectionCache = new Map();

  const results = { manual: [], mcp: [] };
  let questionsProcessed = 0;

  // Token budget tracker: 1.33× rolling average (kicks in after 2 questions)
  // --seed-budget <avg>: pre-seed with known average (count=2) so cap is active from Q1
  const BUDGET_MULT = 1.33;
  const BUDGET_MIN_SAMPLES = 2;
  const budgetTracker = seedBudget
    ? { totalTokens: seedBudget * BUDGET_MIN_SAMPLES, count: BUDGET_MIN_SAMPLES }
    : { totalTokens: 0, count: 0 };
  if (seedBudget) console.log(`[setup] Budget seeded: avg=${seedBudget}, cap=${Math.round(seedBudget * BUDGET_MULT)}`);

  for (const q of questions) {
    if (onlySet && !onlySet.has(q.number)) continue;
    if (q.number < startFrom) continue;
    if (questionsProcessed >= questionsLimit) break;
    questionsProcessed++;

    console.log(`\n━━━ Q${q.number} (${q.qid}) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  ${q.text}\n`);

    // ── Manual mode (FIRST — clean, no MCP data in context) ──
    if (!modeFilter || isManualMode) {
      const manualDir = isManualMode ? modeFilter : 'manual';
      console.log(`  [${manualDir}] Starting...`);
      const manualStart = Date.now();

      const manualResult = await runAgentLoop({
        client,
        systemPrompt: SYSTEM_PROMPT_MANUAL,
        question: q.text,
        tools: MANUAL_TOOL_DEFS,
        executeTool: executeManualTool,
        model: apiModel,
        dryRun,
      });

      const manualWall = (Date.now() - manualStart) / 1000;
      const manualFile = saveManualDump({
        model: modelSlug,
        n: q.number,
        qid: q.qid,
        questionText: q.text,
        result: manualResult,
        wallTimeSec: manualWall,
        subDir: manualDir,
        runnerVersion: RUNNER_VERSION,
        runId,
      });

      results.manual.push({ n: q.number, qid: q.qid, ...summarize(manualResult, manualWall) });
      console.log(`  [${manualDir}] Done: ${manualResult.iterations} calls, ${manualResult.tokensIn}+${manualResult.tokensOut} tokens (cache: ${manualResult.cacheRead || 0}r/${manualResult.cacheCreation || 0}w), ${manualWall.toFixed(1)}s`);
      console.log(`  [${manualDir}] Saved: ${manualFile}`);
    }

    // ── MCP agent-loop mode (mcp1 or legacy mcp without number) ──
    if (!modeFilter || isMcpAgentMode) {
      const mcpDir = isMcpAgentMode ? modeFilter : 'mcp';
      console.log(`  [${mcpDir}] Starting...`);
      const mcpStart = Date.now();

      const mcpBudget = budgetTracker.count >= BUDGET_MIN_SAMPLES
        ? Math.round((budgetTracker.totalTokens / budgetTracker.count) * BUDGET_MULT)
        : undefined;
      if (mcpBudget) console.log(`  [budget] avg=${Math.round(budgetTracker.totalTokens / budgetTracker.count)}, cap=${mcpBudget} (${budgetTracker.count} samples)`);

      const mcpResult = await runAgentLoop({
        client,
        systemPrompt: SYSTEM_PROMPT_MCP,
        systemPrefix: copilotInstructions || undefined,
        question: q.text,
        tools: getMcpToolDefs(),
        executeTool: executeMcpTool,
        model: apiModel,
        tokenBudget: mcpBudget,
        dryRun,
      });

      const mcpWall = (Date.now() - mcpStart) / 1000;
      let mcpFile;
      if (fourArt) {
        const paths = save4ArtifactDump({
          model: modelSlug,
          n: q.number,
          qid: q.qid,
          questionText: q.text,
          result: mcpResult,
          wallTimeSec: mcpWall,
          subDir: mcpDir,
          runnerVersion: RUNNER_VERSION,
          runId,
        });
        mcpFile = `${Object.keys(paths).length} files (plan/render/final/bench)`;
      } else {
        mcpFile = saveMcpDump({
          model: modelSlug,
          n: q.number,
          qid: q.qid,
          questionText: q.text,
          result: mcpResult,
          wallTimeSec: mcpWall,
          subDir: mcpDir,
          runnerVersion: RUNNER_VERSION,
          runId,
        });
      }

      // Update budget tracker
      budgetTracker.totalTokens += mcpResult.tokensIn;
      budgetTracker.count++;

      results.mcp.push({ n: q.number, qid: q.qid, ...summarize(mcpResult, mcpWall) });
      const cappedTag = mcpResult.budgetCapped ? ' [CAPPED]' : '';
      console.log(`  [${mcpDir}] Done: ${mcpResult.iterations} calls, ${mcpResult.tokensIn}+${mcpResult.tokensOut} tokens (cache: ${mcpResult.cacheRead || 0}r/${mcpResult.cacheCreation || 0}w), ${mcpWall.toFixed(1)}s${cappedTag}`);
      console.log(`  [${mcpDir}] Saved: ${mcpFile}`);
    }

    // ── MCP two-phase mode (mcp2+: classify → search → load → answer) ──
    if (isTwoPhaseMode) {
      const subDir = modeFilter;
      console.log(`  [${subDir}] Starting...`);
      const mcp2Start = Date.now();

      // loadChains function — runner loads via MCP read_chain
      async function loadChains(chains) {
        const result = new Map();
        // Batch in groups of 20 (read_chain limit)
        for (let i = 0; i < chains.length; i += 20) {
          const batch = chains.slice(i, i + 20);
          const resp = await executeMcpTool('read_chain', { chains: batch, budget: 20000 });
          console.error(`  [read_chain] batch ${Math.floor(i/20)+1}: ${batch.length} chains → ${resp.length} chars`);
          // Parse response — split by ▸ markers
          const parts = resp.split(/(?=▸ )/);
          let parsed = 0;
          for (const part of parts) {
            const match = part.match(/^▸ (\S+)\n([\s\S]*)/);
            if (match) {
              result.set(match[1], match[2].trim());
              parsed++;
            }
          }
          console.error(`  [read_chain] parsed ${parsed}/${parts.length} sections`);
        }
        return result;
      }

      const mcp2Result = await runTwoPhaseLoop({
        client,
        planPrompt: SYSTEM_PROMPT_PLAN,
        answerPrompt: SYSTEM_PROMPT_ANSWER,
        question: q.text,
        specToc,
        executeTool: executeMcpTool,
        loadChains,
        sectionCache,
        model: apiModel,
      });

      const mcp2Wall = (Date.now() - mcp2Start) / 1000;
      const mcp2File = saveMcpDump({
        model: modelSlug,
        n: q.number,
        qid: q.qid,
        questionText: q.text,
        result: mcp2Result,
        wallTimeSec: mcp2Wall,
        subDir,
        runnerVersion: RUNNER_VERSION,
        runId,
      });

      results.mcp.push({ n: q.number, qid: q.qid, ...summarize(mcp2Result, mcp2Wall) });
      const phases = mcp2Result.phases || {};
      const c = mcp2Result.calls || {};
      console.log(`  [${subDir}] Done: ${c.llm || '?'}llm + ${c.search || '?'}search + ${c.read || '?'}read calls, ${mcp2Result.tokensIn}+${mcp2Result.tokensOut} tokens (cache: ${mcp2Result.cacheRead || 0}r/${mcp2Result.cacheCreation || 0}w), ${mcp2Wall.toFixed(1)}s`);
      console.log(`  [${subDir}] Chains: ${phases.planChains?.length ?? 0} (cached: ${phases.cachedHits ?? 0}), content: ${phases.loadedChars ?? 0} chars`);
      console.log(`  [${subDir}] Saved: ${mcp2File}`);
    }

    // ── Naive mode (full spec in context, no tools, single call) ──
    if (isNaiveMode) {
      const subDir = modeFilter;
      console.log(`  [${subDir}] Starting...`);
      const naiveStart = Date.now();

      const naiveResult = await runNaiveCall({
        client,
        specContent: naiveSpecContent,
        specToc,
        excludedSummary: miniToc ? '' : NAIVE_EXCLUDED_SUMMARY,
        question: q.text,
        specDir: naiveSpecDir,
        availableFiles: naiveAllFiles.filter(f => NAIVE_EXCLUDE.has(f)),
        model: apiModel,
        dryRun,
      });

      const naiveWall = (Date.now() - naiveStart) / 1000;
      const naiveFile = saveNaiveDump({
        model: modelSlug,
        n: q.number,
        qid: q.qid,
        questionText: q.text,
        result: naiveResult,
        wallTimeSec: naiveWall,
        subDir,
        specFiles: naiveSpecFiles,
        runnerVersion: RUNNER_VERSION,
        runId,
      });

      results.mcp.push({ n: q.number, qid: q.qid, ...summarize(naiveResult, naiveWall) });
      console.log(`  [${subDir}] Done: 1 call, ${naiveResult.tokensIn}+${naiveResult.tokensOut} tokens (cache: ${naiveResult.cacheRead || 0}r/${naiveResult.cacheCreation || 0}w), ${naiveWall.toFixed(1)}s`);
      console.log(`  [${subDir}] Saved: ${naiveFile}`);
    }
  }

  // Cleanup
  if (needMcp && !dryRun) {
    await stopMcpServer();
  }

  // Summary
  console.log(`\n=== Summary ===`);
  console.log(`Questions processed: ${questionsProcessed}`);

  if (results.manual.length > 0) {
    const avgTokens = avg(results.manual.map(r => r.tokensTotal));
    const avgIter = avg(results.manual.map(r => r.iterations));
    const avgWall = avg(results.manual.map(r => r.wallTimeSec));
    console.log(`Manual — avg tokens: ${avgTokens.toFixed(0)}, avg iterations: ${avgIter.toFixed(1)}, avg wall: ${avgWall.toFixed(1)}s`);
  }

  if (results.mcp.length > 0) {
    const avgTokens = avg(results.mcp.map(r => r.tokensTotal));
    const avgIter = avg(results.mcp.map(r => r.iterations));
    const avgWall = avg(results.mcp.map(r => r.wallTimeSec));
    const hasCalls = results.mcp.some(r => r.calls);
    if (hasCalls) {
      const avgLlm = avg(results.mcp.filter(r => r.calls).map(r => r.calls.llm));
      const avgSearch = avg(results.mcp.filter(r => r.calls).map(r => r.calls.search));
      const avgRead = avg(results.mcp.filter(r => r.calls).map(r => r.calls.read));
      console.log(`MCP    — avg tokens: ${avgTokens.toFixed(0)}, avg calls: ${avgIter.toFixed(1)} (llm:${avgLlm.toFixed(1)} search:${avgSearch.toFixed(1)} read:${avgRead.toFixed(1)}), avg wall: ${avgWall.toFixed(1)}s`);
    } else {
      console.log(`MCP    — avg tokens: ${avgTokens.toFixed(0)}, avg iterations: ${avgIter.toFixed(1)}, avg wall: ${avgWall.toFixed(1)}s`);
    }
  }

  console.log('\nDone.');
}

function summarize(result, wallTimeSec) {
  return {
    iterations: result.iterations,
    calls: result.calls || null,
    tokensIn: result.tokensIn,
    tokensOut: result.tokensOut,
    tokensTotal: result.tokensIn + result.tokensOut,
    cacheRead: result.cacheRead || 0,
    cacheCreation: result.cacheCreation || 0,
    wallTimeSec,
  };
}

function avg(arr) {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
