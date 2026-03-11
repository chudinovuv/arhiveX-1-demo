// agent-loop.js — Agentic tool-use loop for Claude API
import Anthropic from '@anthropic-ai/sdk';

const DEFAULT_MODEL = 'claude-sonnet-4-20250514';
const MAX_TURNS = 20;

/**
 * @typedef {Object} ToolCall
 * @property {string} name
 * @property {Record<string, any>} input
 * @property {string} result
 * @property {number} resultChars
 */

/**
 * @typedef {Object} AgentResult
 * @property {string} answer — final text answer
 * @property {ToolCall[]} toolCalls — all tool calls made
 * @property {number} tokensIn — input tokens (from API usage)
 * @property {number} tokensOut — output tokens (from API usage)
 * @property {number} iterations — number of tool calls
 */

/**
 * Run agentic loop: send question to Claude, handle tool calls until final answer.
 *
 * @param {Object} opts
 * @param {Anthropic} opts.client — Anthropic client
 * @param {string} opts.systemPrompt — system prompt for this mode
 * @param {string} [opts.systemPrefix] — optional large static prefix (cached separately)
 * @param {string} opts.question — user question text
 * @param {Array<{name: string, description: string, input_schema: object}>} opts.tools — tool definitions
 * @param {(name: string, input: Record<string, any>) => string | Promise<string>} opts.executeTool — tool executor
 * @param {boolean} [opts.dryRun] — if true, don't call API, return mock
 * @returns {Promise<AgentResult>}
 */
export async function runAgentLoop({ client, systemPrompt, systemPrefix, question, tools, executeTool, model, tokenBudget, dryRun = false }) {
  if (dryRun) {
    return {
      answer: '[DRY RUN] No API call made.',
      toolCalls: [],
      tokensIn: 0,
      tokensOut: 0,
      iterations: 0,
    };
  }

  /** @type {ToolCall[]} */
  const allToolCalls = [];
  let totalTokensIn = 0;
  let totalTokensOut = 0;
  let totalCacheRead = 0;
  let totalCacheCreation = 0;

  // Build initial messages
  /** @type {Anthropic.MessageParam[]} */
  const messages = [
    { role: 'user', content: question },
  ];

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const response = await client.messages.create({
      model: model || DEFAULT_MODEL,
      max_tokens: 4096,
      system: [
        ...(systemPrefix ? [{ type: 'text', text: systemPrefix, cache_control: { type: 'ephemeral' } }] : []),
        { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
      ],
      tools,
      messages,
    });

    // Track tokens
    totalTokensIn += response.usage?.input_tokens ?? 0;
    totalTokensOut += response.usage?.output_tokens ?? 0;
    totalCacheRead += response.usage?.cache_read_input_tokens ?? 0;
    totalCacheCreation += response.usage?.cache_creation_input_tokens ?? 0;

    // Check stop reason
    if (response.stop_reason === 'end_turn' || response.stop_reason !== 'tool_use') {
      // Final answer — extract text blocks
      const answerText = response.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');

      return {
        answer: answerText,
        toolCalls: allToolCalls,
        tokensIn: totalTokensIn,
        tokensOut: totalTokensOut,
        cacheRead: totalCacheRead,
        cacheCreation: totalCacheCreation,
        iterations: allToolCalls.length,
      };
    }

    // Handle tool_use blocks
    const toolUseBlocks = response.content.filter(b => b.type === 'tool_use');

    // Add assistant message with all content blocks (text + tool_use)
    messages.push({ role: 'assistant', content: response.content });

    // Execute each tool and build tool_result blocks
    const toolResults = [];
    for (const block of toolUseBlocks) {
      const startTime = Date.now();
      let result;
      try {
        result = await Promise.resolve(executeTool(block.name, block.input));
      } catch (err) {
        result = `Tool error: ${err.message}`;
      }
      const elapsed = Date.now() - startTime;

      const resultStr = typeof result === 'string' ? result : JSON.stringify(result);

      allToolCalls.push({
        name: block.name,
        input: block.input,
        result: resultStr,
        resultChars: resultStr.length,
      });

      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: resultStr,
      });

      console.error(`  [tool] ${block.name} → ${resultStr.length} chars (${elapsed}ms)`);
    }

    // Add tool results as user message
    messages.push({ role: 'user', content: toolResults });

    // Budget cap: if total input tokens exceed tokenBudget, force final answer
    if (tokenBudget && totalTokensIn > tokenBudget) {
      console.error(`  [budget] ${totalTokensIn} tokens > budget ${tokenBudget} — forcing final answer`);
      messages.push({ role: 'user', content: '[SYSTEM] Token budget exceeded. Provide your best answer NOW based on the information gathered so far. Do not make any more tool calls.' });

      const finalResp = await client.messages.create({
        model: model || DEFAULT_MODEL,
        max_tokens: 4096,
        system: [
          ...(systemPrefix ? [{ type: 'text', text: systemPrefix, cache_control: { type: 'ephemeral' } }] : []),
          { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
        ],
        tools,
        messages,
      });

      totalTokensIn += finalResp.usage?.input_tokens ?? 0;
      totalTokensOut += finalResp.usage?.output_tokens ?? 0;
      totalCacheRead += finalResp.usage?.cache_read_input_tokens ?? 0;
      totalCacheCreation += finalResp.usage?.cache_creation_input_tokens ?? 0;

      const answerText = finalResp.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');

      return {
        answer: answerText,
        toolCalls: allToolCalls,
        tokensIn: totalTokensIn,
        tokensOut: totalTokensOut,
        cacheRead: totalCacheRead,
        cacheCreation: totalCacheCreation,
        iterations: allToolCalls.length,
        budgetCapped: true,
      };
    }
  }

  // If we exhausted turns — return what we have
  return {
    answer: '[MAX TURNS REACHED] Agent did not produce a final answer.',
    toolCalls: allToolCalls,
    tokensIn: totalTokensIn,
    tokensOut: totalTokensOut,
    iterations: allToolCalls.length,
  };
}


// ─── Two-Phase Loop ─────────────────────────────────────────────────
// Phase 1a: Classify — single LLM call, no tools → JSON plan
// Phase 1b: Search — runner calls search_spec(planOnly) → parse chains
// Phase 2: Load — runner loads chains via MCP (no LLM)
// Phase 3: Answer — single LLM call with loaded content, no tools

const MAX_CHAINS = 25;
const MAX_ANSWER_RETRIES = 1;

/**
 * @typedef {Object} Facet
 * @property {string[]} keywords
 * @property {string} onto
 * @property {string} intent
 * @property {string[]} indexRanking
 */

/**
 * @typedef {Object} Classification
 * @property {Facet[]} facets
 * @property {string[]} directChains
 */

/**
 * Parse classifier JSON output from Phase 1a.
 * Supports both new facets format and legacy flat format (backward compat).
 * @param {string} text — LLM response text
 * @returns {Classification}
 */
function parseClassification(text) {
  const defaultFacet = { keywords: [], onto: 'WHAT', intent: 'full', indexRanking: [] };
  const defaultResult = { facets: [{ ...defaultFacet }], directChains: [] };

  let raw = null;

  // Try fenced JSON block
  const fenced = text.match(/```json\s*\n?([\s\S]*?)```/);
  if (fenced) {
    try { raw = JSON.parse(fenced[1]); } catch {}
  }

  // Try bare JSON object
  if (!raw) {
    const bare = text.match(/\{[\s\S]*(?:"facets"|"keywords")[\s\S]*\}/);
    if (bare) {
      try { raw = JSON.parse(bare[0]); } catch {}
    }
  }

  if (!raw) {
    console.error('  [phase1] WARNING: Could not parse classification JSON, using fallback');
    return defaultResult;
  }

  // New facets format
  if (raw.facets && Array.isArray(raw.facets)) {
    const facets = raw.facets.map(f => ({ ...defaultFacet, ...f })).filter(f => f.keywords.length > 0);
    return {
      facets: facets.length > 0 ? facets : [{ ...defaultFacet }],
      directChains: raw.directChains || [],
    };
  }

  // Legacy flat format — wrap into single facet
  return {
    facets: [{
      keywords: raw.keywords || [],
      onto: raw.onto || 'WHAT',
      intent: raw.intent || 'full',
      indexRanking: raw.indexRanking || [],
    }],
    directChains: raw.directChains || [],
  };
}

/**
 * Parse chain addresses from search_spec(planOnly) output.
 * Extracts from Tier-grouped lines: [prefix] addr1, addr2, ...
 * @param {string} planText — search_spec planOnly response
 * @param {number} maxTier — max tier to include (1-4)
 * @returns {string[]}
 */
function parseReadingPlan(planText, maxTier = 2) {
  const chains = [];
  let currentTier = 0;

  for (const line of planText.split('\n')) {
    // Detect tier markers: ─── Tier 1: Core definitions ───
    const tierMatch = line.match(/Tier (\d)/);
    if (tierMatch) {
      currentTier = parseInt(tierMatch[1]);
      continue;
    }

    // Skip if above maxTier
    if (currentTier > maxTier && currentTier > 0) continue;

    // Extract chain addresses from bracket-prefixed lines
    // Format:   [2.7] 2.7/table-1, 2.7.3, 2.7.3/(A)-(C), ...
    const contentMatch = line.match(/^\s+\[[\w$.]+\]\s+(.+)/);
    if (contentMatch) {
      const addresses = contentMatch[1]
        .split(/,\s*/)
        .map(a => a.trim())
        .filter(a => a && !a.startsWith('$')); // filter out $ref entries
      chains.push(...addresses);
    }
  }

  return [...new Set(chains)]; // dedup
}

/**
 * Run two-phase loop: LLM classify → search → load → answer.
 * Phase 1a: LLM call with TOC → JSON classification
 * Phase 1b: runner calls search_spec(planOnly) → parse chains
 * Phase 2: 1 MCP call (read_chain)
 * Phase 3: 1 LLM call (answer with loaded content)
 *
 * @param {Object} opts
 * @param {Anthropic} opts.client
 * @param {string} opts.planPrompt — system prompt for Phase 1a (classification)
 * @param {string} opts.answerPrompt — system prompt for Phase 3 (answer)
 * @param {string} opts.question
 * @param {string} opts.specToc — Table of Contents text
 * @param {(name: string, input: Record<string, any>) => string | Promise<string>} opts.executeTool
 * @param {(chains: string[]) => Promise<Map<string, string>>} opts.loadChains — loads chain content via MCP
 * @param {Map<string, string>} [opts.sectionCache] — cross-question cache
 * @returns {Promise<AgentResult>}
 */
export async function runTwoPhaseLoop({
  client, planPrompt, answerPrompt, question,
  specToc, executeTool, loadChains, sectionCache = new Map(), model,
}) {
  const allToolCalls = [];
  let totalTokensIn = 0;
  let totalTokensOut = 0;
  let totalCacheRead = 0;
  let totalCacheCreation = 0;

  // Detailed metrics counters
  let llmCalls = 0;      // LLM API calls (classify + answer + retries)
  let mcpSearch = 0;      // search_spec calls
  let mcpRead = 0;        // read_chain batch calls
  let answerRetries = 0;  // NEED_MORE retries
  const phaseStartMs = Date.now();

  // ═══ PHASE 1a: Classify — LLM call with TOC ═══
  console.error('  [phase1a] Classifying with LLM...');
  const classifyResp = await client.messages.create({
    model: model || DEFAULT_MODEL,
    max_tokens: 1024,
    system: [
      { type: 'text', text: planPrompt, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `\n═══ TABLE OF CONTENTS ═══\n${specToc}`, cache_control: { type: 'ephemeral' } },
    ],
    messages: [{ role: 'user', content: question }],
  });

  totalTokensIn += classifyResp.usage?.input_tokens ?? 0;
  totalTokensOut += classifyResp.usage?.output_tokens ?? 0;
  totalCacheRead += classifyResp.usage?.cache_read_input_tokens ?? 0;
  totalCacheCreation += classifyResp.usage?.cache_creation_input_tokens ?? 0;
  llmCalls++;

  const classifyText = classifyResp.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
  const plan = parseClassification(classifyText);
  for (const [i, f] of plan.facets.entries()) {
    console.error(`  [phase1a] facet${i}: keywords=[${f.keywords.join(', ')}] onto=${f.onto} intent=${f.intent} ranking=[${f.indexRanking.join(',')}]`);
  }
  if (plan.directChains.length) console.error(`  [phase1a] directChains=[${plan.directChains.join(', ')}]`);

  // ═══ PHASE 1b: Search — one search_spec per facet ═══
  let chains = [...(plan.directChains || [])];
  const rawPlans = [];      // raw plan text per facet (for tier recovery)
  let reserveChains = [];   // T3/T4 chains — fallback pool for NEED_MORE

  for (const [i, facet] of plan.facets.entries()) {
    if (facet.keywords.length === 0) continue;

    console.error(`  [phase1b] Searching facet ${i}...`);
    const kw = facet.keywords.slice(0, 5);
    const searchParams = {
      keyword: kw.length === 1 ? kw[0] : kw,
      onto: facet.onto,
      intent: facet.intent,
      planOnly: true,
      verbose: 'none',
      budget: 2000,
    };
    if (facet.indexRanking?.length) searchParams.indexRanking = facet.indexRanking;

    const searchResult = await executeTool('search_spec', searchParams);
    const searchStr = typeof searchResult === 'string' ? searchResult : JSON.stringify(searchResult);
    allToolCalls.push({ name: 'search_spec', input: searchParams, result: searchStr, resultChars: searchStr.length });
    mcpSearch++;
    rawPlans.push(searchStr);
    console.error(`  [phase1b] facet${i} search_spec → ${searchStr.length} chars`);

    const planChains = parseReadingPlan(searchStr, 2);
    const t34Chains = parseReadingPlan(searchStr, 4).filter(c => !planChains.includes(c));
    console.error(`  [phase1b] facet${i} parsed ${planChains.length} chains from T1+T2, ${t34Chains.length} reserve from T3+T4`);
    chains = [...new Set([...chains, ...planChains])];
    reserveChains = [...new Set([...reserveChains, ...t34Chains])];
  }

  // Prioritize chains by relevance to directChains
  const directBases = (plan.directChains || []).map(c => c.split('/')[0]);
  if (directBases.length > 0) {
    chains.sort((a, b) => {
      const aBase = a.split('/')[0];
      const bBase = b.split('/')[0];
      const aDirect = plan.directChains?.includes(a) ? 0 : directBases.some(db => aBase.startsWith(db)) ? 1 : 2;
      const bDirect = plan.directChains?.includes(b) ? 0 : directBases.some(db => bBase.startsWith(db)) ? 1 : 2;
      return aDirect - bDirect;
    });
  }

  // Cap chains to limit token usage
  if (chains.length > MAX_CHAINS) {
    console.error(`  [phase1b] Capping from ${chains.length} to ${MAX_CHAINS} chains`);
    chains = chains.slice(0, MAX_CHAINS);
  }

  console.error(`  [load] Total ${chains.length} chains: ${chains.slice(0, 8).join(', ')}${chains.length > 8 ? '...' : ''}`);

  // ═══ PHASE 2: Load — check cache, load missing via MCP ═══
  const missing = chains.filter(c => !sectionCache.has(c));
  if (missing.length > 0) {
    console.error(`  [load] Cache hit: ${chains.length - missing.length}, loading ${missing.length} new`);
    const loaded = await loadChains(missing);
    mcpRead += Math.ceil(missing.length / 20); // read_chain batches (batch size = 20)
    for (const [addr, text] of loaded) {
      sectionCache.set(addr, text);
    }
  } else if (chains.length > 0) {
    console.error(`  [load] All ${chains.length} chains from cache`);
  }

  // Build loaded content block
  const loadedContent = chains
    .filter(c => sectionCache.has(c))
    .map(c => `▸ ${c}\n${sectionCache.get(c)}`)
    .join('\n\n');

  const loadedTokens = Math.round(loadedContent.length / 4);
  console.error(`  [load] Content: ${loadedContent.length} chars (~${loadedTokens} tokens)`);

  // ═══ PHASE 3: Answer — single LLM call with loaded content ═══
  let answer = '';
  let retries = 0;
  let currentContent = loadedContent;

  while (retries <= MAX_ANSWER_RETRIES) {
    console.error(`  [phase3] Generating answer${retries > 0 ? ` (retry ${retries})` : ''}...`);
    const answerResp = await client.messages.create({
      model: model || DEFAULT_MODEL,
      max_tokens: 4096,
      system: [
        { type: 'text', text: answerPrompt, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: `\n═══ LOADED SPEC CONTENT ═══\n${currentContent}`, cache_control: { type: 'ephemeral' } },
      ],
      messages: [{ role: 'user', content: question }],
    });

    totalTokensIn += answerResp.usage?.input_tokens ?? 0;
    totalTokensOut += answerResp.usage?.output_tokens ?? 0;
    totalCacheRead += answerResp.usage?.cache_read_input_tokens ?? 0;
    totalCacheCreation += answerResp.usage?.cache_creation_input_tokens ?? 0;
    llmCalls++;

    answer = answerResp.content.filter(b => b.type === 'text').map(b => b.text).join('\n');

    // Check for NEED_MORE and retry with additional content
    const needMoreMatch = answer.match(/NEED_MORE:\s*(.*)/);
    if (!needMoreMatch || retries >= MAX_ANSWER_RETRIES) break;

    // Extract section numbers from NEED_MORE line
    const extraAddresses = needMoreMatch[1].match(/(?:§?\d[\d.]+|[A-Z]\.\d[\d.]*)/g) || [];
    const extraChains = extraAddresses.map(a => {
      const clean = a.replace(/^§/, '');
      return clean.includes('/') ? clean : `${clean}/all`;
    });

    if (extraChains.length === 0) break;

    // Also pull unused T3/T4 reserve chains from the original plan
    if (reserveChains.length > 0) {
      const unusedReserve = reserveChains.filter(c => !chains.includes(c));
      if (unusedReserve.length > 0) {
        console.error(`  [phase3] Adding ${unusedReserve.length} reserve chains from T3+T4: ${unusedReserve.slice(0, 5).join(', ')}${unusedReserve.length > 5 ? '...' : ''}`);
        extraChains.push(...unusedReserve);
        reserveChains = [];  // consumed
      }
    }

    console.error(`  [phase3] NEED_MORE: loading ${extraChains.length} extra chains: ${extraChains.join(', ')}`);
    const extraMissing = extraChains.filter(c => !sectionCache.has(c));
    if (extraMissing.length > 0) {
      const extraLoaded = await loadChains(extraMissing);
      for (const [addr, text] of extraLoaded) {
        sectionCache.set(addr, text);
      }
      mcpRead += Math.ceil(extraMissing.length / 20);
      allToolCalls.push({ name: 'read_chain (retry)', input: { chains: extraMissing }, result: `loaded ${extraLoaded.size} sections`, resultChars: 0 });
    }

    // Rebuild content with additional sections
    chains = [...new Set([...chains, ...extraChains])];
    currentContent = chains
      .filter(c => sectionCache.has(c))
      .map(c => `▸ ${c}\n${sectionCache.get(c)}`)
      .join('\n\n');

    const newTokens = Math.round(currentContent.length / 4);
    console.error(`  [phase3] Updated content: ${currentContent.length} chars (~${newTokens} tokens)`);
    retries++;
    answerRetries++;
  }

  // ═══ Cache prolongation: warm up planPrompt cache if question took >180s ═══
  const elapsedSec = (Date.now() - phaseStartMs) / 1000;
  if (elapsedSec > 180) {
    console.error(`  [cache] Question took ${elapsedSec.toFixed(0)}s — warming plan cache for next question`);
    try {
      const warmResp = await client.messages.create({
        model: model || DEFAULT_MODEL,
        max_tokens: 1,
        system: [
          { type: 'text', text: planPrompt, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: `\n═══ TABLE OF CONTENTS ═══\n${specToc}`, cache_control: { type: 'ephemeral' } },
        ],
        messages: [{ role: 'user', content: 'ping' }],
      });
      totalCacheRead += warmResp.usage?.cache_read_input_tokens ?? 0;
      console.error(`  [cache] Warmed: cache_read=${warmResp.usage?.cache_read_input_tokens ?? 0}`);
    } catch (err) {
      console.error(`  [cache] Warm-up failed: ${err.message}`);
    }
  }

  return {
    answer,
    toolCalls: allToolCalls,
    tokensIn: totalTokensIn,
    tokensOut: totalTokensOut,
    cacheRead: totalCacheRead,
    cacheCreation: totalCacheCreation,
    iterations: llmCalls + mcpSearch + mcpRead, // total calls (for backward compat)
    calls: { llm: llmCalls, search: mcpSearch, read: mcpRead, retries: answerRetries },
    phases: {
      facets: plan.facets,
      directChains: plan.directChains,
      planChains: chains,
      reserveChains: reserveChains.length > 0 ? reserveChains : undefined,
      rawPlans,
      cachedHits: chains.length - missing.length,
      loadedChars: currentContent.length,
      retries,
    },
  };
}


// ─── Naive Call ──────────────────────────────────────────────────────
// Single LLM call: full spec in system cache, question as user message, no tools.

/**
 * Run a single naive call: spec loaded into system, no tools.
 *
 * @param {Object} opts
 * @param {Anthropic} opts.client
 * @param {string} opts.specContent — full spec text to cache
 * @param {string} opts.question
 * @param {boolean} [opts.dryRun]
 * @returns {Promise<AgentResult>}
 */
export async function runNaiveCall({ client, specContent, specToc, excludedSummary, question, specDir, availableFiles, model, dryRun = false }) {
  if (dryRun) {
    return { answer: '[DRY RUN]', toolCalls: [], tokensIn: 0, tokensOut: 0, iterations: 0 };
  }

  let systemPrompt = `You are a specification analyst for the E.L.I.A. programming language.
Below is the full E.L.I.A. specification. Answer the user's question based ONLY on this content.
Cite spec section numbers (e.g. §2.5.3) for every claim. Write the answer in English.`;

  if (specToc) {
    systemPrompt += `\n\n## Full Table of Contents (all sections)\n${specToc}`;
  }
  if (excludedSummary) {
    systemPrompt += `\n\n## Sections NOT loaded (summary only — text not available)\n${excludedSummary}`;
  }

  const readSpecFileTool = {
    name: 'read_spec_file',
    description: 'Load a spec file that is NOT in the pre-loaded context. Use when you need content from an excluded section. Filename must be one of the available spec files (e.g. "3_0_block_syntax.md").',
    input_schema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'The markdown filename from current/ directory (e.g. "3_0_block_syntax.md")',
        },
      },
      required: ['filename'],
    },
  };

  const { readFileSync } = await import('node:fs');
  const { resolve } = await import('node:path');

  const fileSet = new Set(availableFiles || []);

  // ~22K tokens headroom (200K limit - ~178K base context). Budget for up to 2 files + messages/response.
  const MAX_FILE_CHARS = 40_000; // ~10K tokens per file

  function executeReadSpecFile(filename) {
    if (!fileSet.has(filename)) {
      return `Error: file "${filename}" not found. Available files: ${[...fileSet].join(', ')}`;
    }
    try {
      const full = readFileSync(resolve(specDir, filename), 'utf-8');
      if (full.length <= MAX_FILE_CHARS) return full;
      return full.slice(0, MAX_FILE_CHARS) + `\n\n[TRUNCATED: file is ${full.length} chars, showing first ${MAX_FILE_CHARS}. Answer based on what is shown.]`;
    } catch (e) {
      return `Error reading file: ${e.message}`;
    }
  }

  const allToolCalls = [];
  let totalTokensIn = 0;
  let totalTokensOut = 0;
  let totalCacheRead = 0;
  let totalCacheCreation = 0;
  let iterations = 0;

  const messages = [{ role: 'user', content: question }];

  while (iterations < 5) {
    iterations++;

    let response;
    try {
      response = await client.messages.create({
        model: model || DEFAULT_MODEL,
        max_tokens: 4096,
        system: [
          { type: 'text', text: specContent, cache_control: { type: 'ephemeral' } },
          { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
        ],
        tools: [],
        messages,
      });
    } catch (err) {
      if (err?.status === 400 && err?.error?.error?.message?.includes('too long')) {
        console.log(`    [naive] Context overflow (${err.error.error.message}). Answering with loaded content only.`);
        // Drop last tool results that caused overflow and ask model to answer without them
        messages.pop(); // remove tool_results
        messages.pop(); // remove assistant (tool_use)
        messages.push({ role: 'user', content: question + '\n\n[Note: additional files could not be loaded due to context size limits. Answer using only the spec content already available.]' });
        response = await client.messages.create({
          model: model || DEFAULT_MODEL,
          max_tokens: 4096,
          system: [
            { type: 'text', text: specContent, cache_control: { type: 'ephemeral' } },
            { type: 'text', text: systemPrompt, cache_control: { type: 'ephemeral' } },
          ],
          messages: [{ role: 'user', content: question + '\n\n[Note: the requested spec files could not be loaded due to context limits. Answer based on already loaded content and the Table of Contents.]' }],
        });
        totalTokensIn += response.usage?.input_tokens ?? 0;
        totalTokensOut += response.usage?.output_tokens ?? 0;
        totalCacheRead += response.usage?.cache_read_input_tokens ?? 0;
        totalCacheCreation += response.usage?.cache_creation_input_tokens ?? 0;
        const answerText = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n');
        return { answer: answerText, toolCalls: allToolCalls, tokensIn: totalTokensIn, tokensOut: totalTokensOut, cacheRead: totalCacheRead, cacheCreation: totalCacheCreation, iterations };
      }
      throw err;
    }

    totalTokensIn += response.usage?.input_tokens ?? 0;
    totalTokensOut += response.usage?.output_tokens ?? 0;
    totalCacheRead += response.usage?.cache_read_input_tokens ?? 0;
    totalCacheCreation += response.usage?.cache_creation_input_tokens ?? 0;

    // If stop_reason is not tool_use — extract answer and return
    if (response.stop_reason !== 'tool_use') {
      const answerText = response.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');

      return {
        answer: answerText,
        toolCalls: allToolCalls,
        tokensIn: totalTokensIn,
        tokensOut: totalTokensOut,
        cacheRead: totalCacheRead,
        cacheCreation: totalCacheCreation,
        iterations,
      };
    }

    // Handle tool calls
    const toolBlocks = response.content.filter(b => b.type === 'tool_use');
    const toolResults = [];

    for (const block of toolBlocks) {
      const result = executeReadSpecFile(block.input.filename);
      allToolCalls.push({
        name: block.name,
        input: block.input,
        result: result.slice(0, 200) + (result.length > 200 ? '...' : ''),
        resultChars: result.length,
      });
      toolResults.push({
        type: 'tool_result',
        tool_use_id: block.id,
        content: result,
      });
      console.log(`    [naive] read_spec_file("${block.input.filename}") → ${result.length} chars`);
    }

    // Append assistant response + tool results to conversation
    messages.push({ role: 'assistant', content: response.content });
    messages.push({ role: 'user', content: toolResults });
  }

  // Max iterations reached — extract whatever text we have
  return {
    answer: '[MAX_ITERATIONS] Naive loop hit 5 iteration limit.',
    toolCalls: allToolCalls,
    tokensIn: totalTokensIn,
    tokensOut: totalTokensOut,
    cacheRead: totalCacheRead,
    cacheCreation: totalCacheCreation,
    iterations,
  };
}
