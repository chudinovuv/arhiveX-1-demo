// dump.js — Save benchmark answer dumps to files
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';

const RESULTS_ROOT = resolve(import.meta.dirname, '..', '..', '.misc', 'benchmark', 'results');

/**
 * Save a Manual mode answer dump.
 * @param {Object} opts
 * @param {string} opts.model — model slug (e.g. 'sonnet')
 * @param {number} opts.n — sequential question number
 * @param {string} opts.qid — question ID (e.g. 'A-010')
 * @param {string} opts.questionText — full question text
 * @param {import('./agent-loop.js').AgentResult} opts.result — agent result
 * @param {number} opts.wallTimeSec — elapsed wall time in seconds
 */
export function saveManualDump({ model, n, qid, questionText, result, wallTimeSec, subDir = 'manual', runnerVersion, runId }) {
  const filePath = resolve(RESULTS_ROOT, model, subDir, `q_${n}_${subDir}.md`);
  mkdirSync(dirname(filePath), { recursive: true });

  const grepCalls = result.toolCalls.filter(c => c.name === 'grep_search');
  const readCalls = result.toolCalls.filter(c => c.name === 'read_file');
  const listCalls = result.toolCalls.filter(c => c.name === 'list_files');

  let content = `# q_${n} — ${qid} — ${questionText}\n\n`;

  // Search strategy
  content += `## Search Strategy\n`;
  content += `- grep patterns tried: ${grepCalls.map(c => JSON.stringify(c.input.query)).join(', ') || '(none)'}\n`;
  const filesRead = [...new Set(readCalls.map(c => c.input.filePath))];
  content += `- files identified: ${filesRead.join(', ') || '(none)'}\n\n`;

  // Read operations
  content += `## Read Operations\n`;
  for (let i = 0; i < result.toolCalls.length; i++) {
    const tc = result.toolCalls[i];
    content += `### Call ${i + 1}: ${tc.name}\n`;
    content += `- params: ${JSON.stringify(tc.input)}\n`;
    content += `- result_chars: ${tc.resultChars}\n\n`;
  }

  // Raw content extracted
  content += `## Raw Content Extracted\n`;
  for (const tc of result.toolCalls) {
    content += `### ${tc.name}(${JSON.stringify(tc.input)})\n`;
    content += '```\n';
    content += tc.result.slice(0, 10000);
    if (tc.result.length > 10000) content += `\n... (${tc.result.length - 10000} chars truncated)`;
    content += '\n```\n\n';
  }

  // Answer
  content += `## Answer\n${result.answer}\n\n`;

  // Metrics
  content += `## Metrics\n`;
  content += `- iterations: ${result.iterations}\n`;
  content += `- tokens_in: ${result.tokensIn}\n`;
  content += `- tokens_out: ${result.tokensOut}\n`;
  content += `- tokens_total: ${result.tokensIn + result.tokensOut}\n`;
  content += `- cache_read: ${result.cacheRead || 0}\n`;
  content += `- cache_creation: ${result.cacheCreation || 0}\n`;
  content += `- wall_time_sec: ${wallTimeSec.toFixed(1)}\n`;
  content += `- model: ${model}\n`;
  content += `- runner: v${runnerVersion || 'unknown'}\n`;
  content += `- run_id: ${runId || 'unknown'}\n`;
  content += `- saved_to: ${model}/${subDir}/q_${n}_${subDir}.md\n`;

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Save an MCP mode answer dump.
 * @param {Object} opts
 * @param {string} opts.model
 * @param {number} opts.n
 * @param {string} opts.qid
 * @param {string} opts.questionText
 * @param {import('./agent-loop.js').AgentResult} opts.result
 * @param {number} opts.wallTimeSec
 */
export function saveMcpDump({ model, n, qid, questionText, result, wallTimeSec, subDir = 'mcp', runnerVersion, runId }) {
  const filePath = resolve(RESULTS_ROOT, model, subDir, `q_${n}_${subDir}.md`);
  mkdirSync(dirname(filePath), { recursive: true });

  let content = `# q_${n} — ${qid} — ${questionText}\n\n`;

  // Phase info (for mcp2 mode)
  const phases = result.phases || {};
  if (phases.facets) {
    content += `## Classification\n`;
    for (const [i, f] of phases.facets.entries()) {
      content += `### Facet ${i}\n`;
      content += `- keywords: ${JSON.stringify(f.keywords)}\n`;
      content += `- onto: ${f.onto}\n`;
      content += `- intent: ${f.intent}\n`;
      content += `- indexRanking: ${JSON.stringify(f.indexRanking)}\n\n`;
    }
    if (phases.directChains?.length) {
      content += `- directChains: ${JSON.stringify(phases.directChains)}\n\n`;
    }
  } else if (phases.classification) {
    // Legacy flat format
    content += `## Classification\n`;
    content += `- keywords: ${JSON.stringify(phases.classification.keywords)}\n`;
    content += `- onto: ${phases.classification.onto}\n`;
    content += `- intent: ${phases.classification.intent}\n`;
    content += `- indexRanking: ${JSON.stringify(phases.classification.indexRanking)}\n`;
    content += `- directChains: ${JSON.stringify(phases.classification.directChains)}\n\n`;
  }
  if (phases.planChains) {
    content += `## Loading\n`;
    content += `- chains: ${phases.planChains.length} (cached: ${phases.cachedHits ?? 0})\n`;
    content += `- content: ${phases.loadedChars ?? 0} chars\n`;
    content += `- addresses: ${phases.planChains.join(', ')}\n`;
    if (phases.reserveChains?.length) {
      content += `- reserve_t34: ${phases.reserveChains.join(', ')}\n`;
    }
    content += '\n';
  }

  // MCP Calls
  content += `## MCP Calls\n`;
  for (let i = 0; i < result.toolCalls.length; i++) {
    const tc = result.toolCalls[i];
    content += `### Call ${i + 1}: ${tc.name}\n`;
    content += `- params: ${JSON.stringify(tc.input)}\n`;
    content += `- response_chars: ${tc.resultChars}\n\n`;
  }

  // Raw MCP output
  content += `## Raw MCP Output\n`;
  for (const tc of result.toolCalls) {
    content += `### ${tc.name}(${JSON.stringify(tc.input)})\n`;
    content += '```\n';
    content += tc.result.slice(0, 10000);
    if (tc.result.length > 10000) content += `\n... (${tc.result.length - 10000} chars truncated)`;
    content += '\n```\n\n';
  }

  // Answer
  content += `## Answer\n${result.answer}\n\n`;

  // Metrics
  content += `## Metrics\n`;
  const calls = result.calls || {};
  content += `- calls_total: ${result.iterations}\n`;
  content += `- calls_llm: ${calls.llm ?? '?'}\n`;
  content += `- calls_search: ${calls.search ?? '?'}\n`;
  content += `- calls_read: ${calls.read ?? '?'}\n`;
  content += `- retries: ${calls.retries ?? 0}\n`;
  content += `- tokens_in: ${result.tokensIn}\n`;
  content += `- tokens_out: ${result.tokensOut}\n`;
  content += `- tokens_total: ${result.tokensIn + result.tokensOut}\n`;
  content += `- cache_read: ${result.cacheRead || 0}\n`;
  content += `- cache_creation: ${result.cacheCreation || 0}\n`;
  content += `- wall_time_sec: ${wallTimeSec.toFixed(1)}\n`;
  content += `- model: ${model}\n`;
  content += `- runner: v${runnerVersion || 'unknown'}\n`;
  content += `- run_id: ${runId || 'unknown'}\n`;
  content += `- saved_to: ${model}/${subDir}/q_${n}_${subDir}.md\n`;

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}


/**
 * Save a Naive mode answer dump (spec-in-context, no tools, single call).
 */
export function saveNaiveDump({ model, n, qid, questionText, result, wallTimeSec, subDir, specFiles, runnerVersion, runId }) {
  const filePath = resolve(RESULTS_ROOT, model, subDir, `q_${n}_${subDir}.md`);
  mkdirSync(dirname(filePath), { recursive: true });

  let content = `# q_${n} — ${qid} — ${questionText}\n\n`;

  content += `## Spec Files Pre-loaded (in context)\n`;
  content += specFiles.map(f => `- ${f}`).join('\n') + '\n\n';

  const loadedViaTools = (result.toolCalls || [])
    .filter(tc => tc.name === 'read_spec_file')
    .map(tc => tc.input?.filename)
    .filter(Boolean);
  if (loadedViaTools.length > 0) {
    content += `## Files Loaded via Tool (on demand)\n`;
    content += loadedViaTools.map(f => `- ${f} (${(result.toolCalls.find(tc => tc.input?.filename === f)?.resultChars || '?')} chars)`).join('\n') + '\n\n';
  }

  content += `## Answer\n${result.answer}\n\n`;

  content += `## Metrics\n`;
  content += `- mode: naive (spec-in-context, no tools)\n`;
  content += `- iterations: ${result.iterations || 1}\n`;
  content += `- tool_calls: ${(result.toolCalls || []).length}\n`;
  content += `- tokens_in: ${result.tokensIn}\n`;
  content += `- tokens_out: ${result.tokensOut}\n`;
  content += `- tokens_total: ${result.tokensIn + result.tokensOut}\n`;
  content += `- cache_read: ${result.cacheRead || 0}\n`;
  content += `- cache_creation: ${result.cacheCreation || 0}\n`;
  content += `- wall_time_sec: ${wallTimeSec.toFixed(1)}\n`;
  content += `- model: ${model}\n`;
  content += `- runner: v${runnerVersion || 'unknown'}\n`;
  content += `- run_id: ${runId || 'unknown'}\n`;
  content += `- saved_to: ${model}/${subDir}/q_${n}_${subDir}.md\n`;

  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}


// ─── 4-Artifact Mode (plan / render / final / bench) ────────────────

function extractSearchParams(toolCalls) {
  const first = toolCalls.find(tc => tc.name === 'search_spec');
  if (!first) return null;
  const p = first.input || {};
  return {
    keywords: Array.isArray(p.keyword) ? p.keyword : [p.keyword].filter(Boolean),
    onto: p.onto || '?',
    intent: p.intent || 'full',
    indexRanking: p.indexRanking || [],
    params: p,
  };
}

function parseUnitsFromResponse(text) {
  const units = [];
  const re = /▸ \[T(\d)\] ([\w./()[\]\-–]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    units.push({ tier: `T${m[1]}`, addr: m[2] });
  }
  return units;
}

/**
 * Save 4 artifacts: plan, render, final, bench.
 * @returns {{ plan: string, render: string, final: string, bench: string }}
 */
export function save4ArtifactDump({ model, n, qid, questionText, topic, result, wallTimeSec, subDir, runnerVersion, runId, benchContent }) {
  const dir = resolve(RESULTS_ROOT, model, subDir);
  mkdirSync(dir, { recursive: true });

  const paths = {
    plan:   resolve(dir, `q_${n}_plan.md`),
    render: resolve(dir, `q_${n}_render.md`),
    final:  resolve(dir, `q_${n}_final.md`),
    bench:  resolve(dir, `q_${n}_bench.md`),
  };

  const topicLabel = topic || qid;
  const searchParams = extractSearchParams(result.toolCalls);
  const searchCalls = result.toolCalls.filter(tc => tc.name === 'search_spec');
  const readCalls = result.toolCalls.filter(tc => tc.name === 'read_chain');
  const xrefCalls = result.toolCalls.filter(tc => tc.name === 'lookup_xref');

  // ── Plan ──
  let plan = `# Plan: Q${n} — ${topicLabel} (${qid})\n\n`;
  plan += `## Query\n`;
  if (searchParams) {
    plan += `- Keywords: ${JSON.stringify(searchParams.keywords)}\n`;
    plan += `- Onto: ${searchParams.onto}\n`;
    plan += `- Intent: ${searchParams.intent}\n`;
    if (searchParams.indexRanking.length) plan += `- indexRanking: ${JSON.stringify(searchParams.indexRanking)}\n`;
    const { keyword, onto, intent, indexRanking, ...otherParams } = searchParams.params;
    if (Object.keys(otherParams).length) plan += `- Parameters: ${Object.entries(otherParams).map(([k,v]) => `${k}=${v}`).join(', ')}\n`;
  } else {
    plan += `- (no search_spec calls detected)\n`;
  }
  plan += `\n## MCP Calls Summary\n`;
  plan += `- search_spec: ${searchCalls.length}\n`;
  plan += `- read_chain: ${readCalls.length}\n`;
  plan += `- lookup_xref: ${xrefCalls.length}\n`;
  plan += `- total: ${result.toolCalls.length}\n`;

  if (searchCalls.length > 0) {
    const units = parseUnitsFromResponse(searchCalls[0].result);
    if (units.length > 0) {
      plan += `\n## Reading Plan\n`;
      const byTier = {};
      for (const u of units) {
        (byTier[u.tier] ??= []).push(u.addr);
      }
      for (const [tier, addrs] of Object.entries(byTier).sort()) {
        plan += `- ${tier}: ${addrs.join(', ')}\n`;
      }
    }
  }

  if (searchCalls.length > 1) {
    plan += `\n## All Search Calls\n`;
    for (let i = 0; i < searchCalls.length; i++) {
      plan += `### Call ${i + 1}\n`;
      plan += `- params: ${JSON.stringify(searchCalls[i].input)}\n`;
      plan += `- response_chars: ${searchCalls[i].resultChars}\n\n`;
    }
  }

  plan += `\n## Observations\n`;
  plan += `- Agent used ${result.iterations} tool calls in ${wallTimeSec.toFixed(1)}s\n`;
  plan += `- Tokens: ${result.tokensIn} in + ${result.tokensOut} out = ${result.tokensIn + result.tokensOut} total\n`;
  plan += `- Cache: read=${result.cacheRead || 0}, creation=${result.cacheCreation || 0}\n`;

  writeFileSync(paths.plan, plan, 'utf-8');

  // ── Render ──
  let render = `# Render: Q${n} — ${topicLabel} (${qid})\n\n`;
  render += `## Extracted Content\n\n`;
  for (const tc of result.toolCalls) {
    render += `### ${tc.name}(${JSON.stringify(tc.input)})\n`;
    render += '```\n';
    const maxChars = 15000;
    render += tc.result.slice(0, maxChars);
    if (tc.result.length > maxChars) render += `\n... (${tc.result.length - maxChars} chars truncated)`;
    render += '\n```\n\n';
  }
  render += `## Budget\n`;
  render += `- Tool calls: ${result.toolCalls.length}\n`;
  render += `- Total response chars: ${result.toolCalls.reduce((s, tc) => s + tc.resultChars, 0)}\n`;

  writeFileSync(paths.render, render, 'utf-8');

  // ── Final ──
  let final = `# Final: Q${n} — ${topicLabel} (${qid})\n\n`;
  final += `## Question\n${questionText}\n\n`;
  final += `## Answer\n\n${result.answer}\n`;

  writeFileSync(paths.final, final, 'utf-8');

  // ── Bench (skeleton — scored separately or via benchContent) ──
  let bench;
  if (benchContent) {
    bench = benchContent;
  } else {
    const catMap = { A: 'factual', B: 'cross-referential', C: 'abstract', D: 'normative' };
    const totalChars = result.toolCalls.reduce((s, tc) => s + tc.resultChars, 0);
    bench = `# Q${n} Bench Card — ${qid}\n\n`;
    bench += `## Classification\n`;
    bench += `- **Category**: ${qid[0]} (${catMap[qid[0]] || '?'})\n`;
    bench += `- **Construct**: ?\n`;
    bench += `- **Onto**: ${searchParams?.onto || '?'}\n`;
    bench += `- **Intent**: ${searchParams?.intent || '?'}\n`;
    bench += `- **Code-relevant**: No\n\n`;
    bench += `## Scoring\n\n`;
    bench += `| Field | Value |\n|-------|-------|\n`;
    bench += `| **Question** | ${questionText} |\n`;
    bench += `| **Answer** | (pending scoring) |\n`;
    bench += `| **Accuracy** | ?/5 |\n`;
    bench += `| **Completeness** | ?/5 |\n`;
    bench += `| **Noise** | ?/5 |\n`;
    bench += `| **Verdict** | PENDING |\n`;
    bench += `| **Difficulty** | ? |\n\n`;
    bench += `## Normative Sources\n\n`;
    bench += `| § | Description | Role |\n|---|-------------|------|\n`;
    bench += `| ? | ? | Primary |\n\n`;
    bench += `## MCP Tool Performance\n\n`;
    bench += `| Field | Value |\n|-------|-------|\n`;
    bench += `| **MCP calls** | ${result.toolCalls.length} |\n`;
    bench += `| **Routing** | ? |\n`;
    bench += `| **Top match** | ? |\n`;
    bench += `| **Auto-Expand** | ? |\n`;
    bench += `| **Fallback** | None |\n`;
    bench += `| **Data reuse** | None |\n`;
    bench += `| **Data sufficiency** | ? |\n\n`;
    bench += `## Token Metrics\n\n`;
    bench += `| Field | Value |\n|-------|-------|\n`;
    bench += `| **Budget** | ? |\n`;
    bench += `| **Render tokens** | ~${Math.round(totalChars / 4)} |\n`;
    bench += `| **Supplementary tokens** | 0 |\n`;
    bench += `| **Total spec tokens** | ~${Math.round(totalChars / 4)} |\n`;
    bench += `| **Chains read / rejected** | ? / ? |\n`;
    bench += `| **Cache** | read: ${result.cacheRead || 0} / write: ${result.cacheCreation || 0} |\n\n`;
    bench += `## Key Evidence\n- (pending scoring)\n\n`;
    bench += `## Observations\n- (pending scoring)\n\n`;
    bench += `## Key Insight\n(pending scoring)\n`;
  }

  writeFileSync(paths.bench, bench, 'utf-8');

  return paths;
}
