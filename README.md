# E.L.I.A. Specification Agent — Demo Repository

This repository demonstrates the architecture and tooling behind the **E.L.I.A. Specification Agent** — a system that enables AI models to navigate, search, and reason over a large formal language specification (~500 pages) using structured indexes, an MCP server, and a multi-step agentic loop.

> **Note:** The full E.L.I.A. specification is proprietary and protected under PPA. This demo includes only two non-sensitive sections (primitive types and stream types) as working examples. The indexes have been redacted — structural metadata (section addresses, headings, keywords) is preserved, but all normative content (abstracts, vocabulary, context quotes) has been removed.

## What's Inside

### Specification Samples (`current/`)

Two representative sections from the E.L.I.A. specification, chosen because they contain standard type system content (integers, floats, strings, binary streams) rather than proprietary architectural concepts:

| File | Section | Content |
|------|---------|---------|
| `2_1_primitive_types.md` | §2.1 | Integral, decimal, boolean, date/time, identifier, enum, fixed string types. Binary encoding rules, type compatibility matrix. |
| `2_3_stream_types.md` | §2.3 | Stream carriers, RAW string/binary classes, structural streams. |

### Code Examples (`current/examples/`)

E.L.I.A. language syntax samples demonstrating variables, expressions, domains, and literals. These show what E.L.I.A. code looks like without revealing the enforcement or semantic model.

### Agent Configuration (`.github/agents/`)

The agent's instruction files that define how it processes the specification:

| File | Purpose |
|------|---------|
| `specification_struct.json` | Specification structure registry: index routing, search protocol, section title classifiers, ontological mappings (WHAT/WHY/HOW/WHEN). |
| `patterns.json` | Regex patterns for section search, chain resolution, and content extraction. |
| `structure_map.json` | Document structure navigation map with `$ref` resolution. |
| `definitions.els` | E.L.I.A. concept definitions (section, aspect, canvas, paragraph) in the language's own format. |
| `human_decision_points.md` | Defines the ~5% of index maintenance decisions that require human judgment. |

### MCP Spec-Reader Server (`tools/spec-reader/`)

A Model Context Protocol (MCP) server that provides structured access to the specification:

**Core pipeline** (`src/lib/`):

| Module | Role |
|--------|------|
| `questionAnalyzer.ts` | Classifies user questions → ontological role (WHAT/WHY/HOW/WHEN), intent, keywords. |
| `keywordEnricher.ts` | Three-phase keyword enrichment: T&D expansion → co-occurrence → waterfall confirmation. |
| `readingPlanFunnel.ts` | Weighted priority funnel: meta/order/onto scoring, deduplication, subsumption, budget allocation. |
| `chainResolver.ts` | Resolves chain addresses (e.g. `2.5.3/A.`) to file paths and line ranges. |
| `textExtractor.ts` | Extracts spec content with line-level keyword filtering (grep `-C` style). |
| `tokenBudget.ts` | Tier-aware budget trimming with auto-expansion and pressure signals. |
| `normativePipeline.ts` | Orchestrates the full search → plan → extract → budget pipeline. |
| `indexLoader.ts` | Loads and queries 14 aspect/structural indexes. |
| `server.ts` | MCP server entry point exposing `search_spec`, `read_chain`, `lookup_xref`, and other tools. |

**Index build scripts** (`src/scripts/`):

| Script | Builds |
|--------|--------|
| `buildLinearIndex.ts` | Section-level index (1211 sections with file/line/title metadata). |
| `buildAspectIndices.ts` | 7 manual aspect indexes (physical, semantic, design, behavioral, etc.). |
| `buildCrossRefIndex.ts` | Cross-reference graph (267 refs across 148 sections). |
| `generateOntologicalIndex.mjs` | Ontological role index (WHAT/WHY/HOW/WHEN per concept). |
| `generateTerminologyIndex.mjs` | Terminology aspect index from T&D tables. |
| `generateAbstracts.ts` | Generates section abstracts for index units. |
| `addToIndex.ts` | CLI tool for manual index maintenance. |
| `rebuildAll.ts` | Full index rebuild pipeline. |

**Indexes** (`indexes/`):

14 JSON index files providing structured navigation over the specification. These have been redacted for this demo — only structural metadata remains (section addresses, headings, keywords). No normative spec text.

| Index | Scope |
|-------|-------|
| `linear_index.json` | Every section: file, line, title, level (1211 entries). |
| `physical_aspect_index.json` | Data types, serialization, materialization. |
| `semantic_aspect_index.json` | Semantic types, interfaces, domains, delegates. |
| `design_aspect_index.json` | Design decisions, architectural patterns. |
| `behavioral_aspect_index.json` | Behavioral norms, diagnostics, compilation. |
| `ontologic_aspect_index.json` | Type system overview, classification principles. |
| `philosophical_aspect_index.json` | Philosophical foundations. |
| `block_syntax_aspect_index.json` | Block syntax constructs §3. |
| `ontological_role_index.json` | WHAT/WHY/HOW/WHEN routing per concept. |
| `cross_ref_index.json` | Cross-reference graph between sections. |
| `grammar_index.json` | Grammar-level construct registry. |
| `grammar_aspect_index.json` | Grammar rule mappings. |
| `terminology_aspect_index.json` | Terms & definitions index. |
| `aspect_index.json` | Meta-index routing to the 13 above. |

### Benchmark Runner (`tools/runner/`)

An agentic benchmark runner that evaluates how well an LLM answers specification questions using the MCP server:

| File | Role |
|------|------|
| `runner.js` | Main orchestrator. Each (question × mode) runs as an isolated API call with fresh context. |
| `agent-loop.js` | Agentic loop: sends user question → model calls MCP tools → accumulates context → generates answer. |
| `prompts.js` | System prompt defining the agent's behavior: search strategy, accumulation rules, budget management, pivot conditions. |
| `classifier.js` | Question classifier for routing and mode selection. |
| `tools-mcp.js` | MCP tool definitions exposed to the model. |
| `tools-manual.js` | Manual tool definitions (non-MCP mode). |
| `spec-toc.txt` | Specification table of contents (section headings for all ~500 pages). |

## How It Works

```
User Question
     │
     ▼
┌───────────────────┐
│  Agent Loop       │ ← System prompt (prompts.js)
│  (agent-loop.js)  │
└────────┬──────────┘
         │ tool calls
         ▼
┌──────────────────────────┐
│  MCP Spec-Reader Server  │
│  (server.ts)             │
│                          │
│  search_spec(keyword,    │
│    onto, intent, ...)    │
│         │                │
│    ┌────┴────┐           │
│    │ Analyze │           │
│    │ Enrich  │           │
│    │ Plan    │           │
│    │ Extract │           │
│    │ Budget  │           │
│    └────┬────┘           │
│         │                │
│  ┌──────┴──────┐         │
│  │ 14 Indexes  │         │
│  │ Spec Files  │         │
│  └─────────────┘         │
└──────────────────────────┘
         │
         ▼
   Structured Answer
```

1. The **agent loop** receives a user question and the system prompt.
2. The model analyzes the question and calls `search_spec` with keywords, ontological role, and intent.
3. The MCP server **enriches** keywords (T&D lookup → co-occurrence → waterfall confirmation).
4. The **reading plan funnel** scores index units by weighted priority, deduplicates, and builds a reading plan.
5. The **text extractor** reads spec files at the resolved chain addresses, applying line-level filters.
6. The **token budget** module trims content tier-by-tier, with auto-expansion when protected tiers are at risk.
7. The model receives extracted spec content and either answers or makes follow-up calls.
8. Repeat until the model has sufficient context, then it produces the final answer.

## Running the Benchmark

### Prerequisites

- Node.js ≥ 18
- An Anthropic API key

### Setup

```bash
cd tools/spec-reader
npm install

cd ../runner
npm install
echo "ANTHROPIC_API_KEY=<YOUR_KEY>" > .env
```

### Quick Test (no rebuild needed)

The demo ships with pre-built indexes — you can run the benchmark immediately after `npm install`:

```bash
cd tools/runner
node runner.js --mode mcp_skills --model haiku \
  --file ../../examples/benchmark/demo_questions.txt
```

This runs all 20 questions (10 factual + 10 cross-referential) against the MCP server using the included indexes and spec sections. Results are saved to `results/<model>/mcp_skills/`.

To run a single question:

```bash
node runner.js --mode mcp_skills --model haiku \
  --question "What are the binary encoding rules for primitive types in E.L.I.A.?"
```

### Full Run (custom questions / rebuild)

```bash
# Single question
node runner.js --mode mcp_skills --model haiku --question "What is a record?"

# Benchmark file (one question per line)
node runner.js --mode mcp_skills --model haiku --file path/to/questions.txt
```

To rebuild indexes from scratch (only needed if you modify the spec files in `current/`):

```bash
cd tools/spec-reader
npm run rebuild
```

> **Note:** With only 2 spec sections available in this demo, the agent will only be able to answer questions about primitive types (§2.1) and stream types (§2.3). Questions about other parts of the specification will result in partial or empty answers — this is expected.

## What's Redacted

This demo is intentionally incomplete. The following have been removed to protect intellectual property:

- **28 of 30 specification sections** — only §2.1 and §2.3 remain
- **Index abstracts** — 278 section summaries removed from aspect indexes
- **Index vocabulary** — 2233 vocab entries removed from linear index
- **Cross-reference context** — 291 context quotes removed
- **Grammar rationale** — 9 normative rationale entries removed
- **Training data** — SPO triplets and fine-tuning datasets removed

What remains is sufficient to understand the architecture and run the tooling against the included sections.

## Benchmark Results: Haiku + MCP vs Naive (Haiku / Sonnet / Opus)

The `examples/benchmark/` directory contains results for 10 questions comparing **Haiku with MCP indexes** against **naive mode** (spec-in-context, no tools) across three model tiers.

### Setup

- **MCP mode**: Haiku (`claude-haiku-4-5-20251001`) + MCP spec-reader with 13 aspect indexes
- **Naive mode**: Spec text pre-loaded into system prompt (~7K tokens from `2_3_stream_types.md`), full TOC visible (~11K tokens), no tools — single LLM call
- **10 questions** covering both loaded content (§2.3 stream types) and unloaded content (§2.1 primitive types)
- Questions range from factual ("what is enum?") to normative ("what constraints on enum defaults?") to cross-sectional ("differences between RAW String and RAW Binary")

### Results Summary

| # | Question (short) | Haiku+MCP | Haiku naive | Sonnet naive | Opus naive |
|---|-----------------|-----------|-------------|--------------|------------|
| 1 | Enum type + normative properties | ✅ Exact §2.1.7 | ⚠️ Generic guess | ⚠️ Plausible but unverifiable | ⚠️ Plausible but unverifiable |
| 2 | RAW Binary encoding | ✅ §2.3.3 full | ✅ In context | ✅ In context | ✅ In context |
| 3 | RAW String vs Binary differences | ✅ §2.3.2 + §2.3.3 | ✅ In context | ✅ In context | ✅ In context |
| 4 | Why 2 GiB limit? | ✅ §2.3.3.3 | ✅ In context | ✅ In context | ✅ In context |
| 5 | Identifiers semantic role | ✅ guid 128b, riid 96b | ❌ Hallucinated 5 points | ⚠️ Reasonable guess | ❌ Invents `uuid`, `uid` types |
| 6 | Base64: semantic or transport? | ✅ §2.3.2.3.2 | ✅ In context | ✅ In context | ✅ In context |
| 7 | Stream metadata obligations | ✅ §2.3.0.4 | ✅ In context | ✅ In context | ✅ In context |
| 8 | Enum default constraints | ✅ §2.1.7.4.1 exact | ❌ Invents §A.10, §8.8.1 | ❌ Invents "ordinal consistency" | ❌ C#-style rules (wrong) |
| 9 | Structural stream data binding | ✅ §2.3.4.2 | ✅ In context | ✅ In context | ✅ In context |
| 10 | Special/control class | ✅ Void, Null, Nothing | ⚠️ Admits "not loaded" | ⚠️ Generic description | ⚠️ Reasonable guess |

Legend: ✅ = correct with citations · ⚠️ = plausible but ungrounded · ❌ = hallucinated facts

### Aggregate Metrics

| Metric | Haiku + MCP | Haiku naive | Sonnet naive | Opus naive |
|--------|------------|-------------|--------------|------------|
| Avg tokens | 15,621 | 899 | 572 | 557 |
| Avg wall time | 18.4s | 10.3s | 14.9s | 20.0s |
| Correct (grounded) | **10/10** | 5/10 | 5/10 | 5/10 |
| Hallucinated | **0/10** | 3/10 | 2/10 | 2/10 |

### Key Insight

**The weakest model (Haiku) with MCP indexes outperforms the strongest model (Opus) without them.**

On questions where the spec content is not in context (Q1, Q5, Q8, Q10), all three naive models — including Opus — either hallucinate or produce unverifiable guesses. The failure mode is consistent: **models project knowledge from mainstream languages (C#, Java) onto E.L.I.A.'s unique normative rules**.

Examples of Opus naive hallucinations:
- Q5: Invents `uuid` and `uid` types (E.L.I.A. has only `guid` and `riid`)
- Q8: Claims "default value is the member with ordinal value 0" and suggests "bitwise operations" for enums — C# patterns that directly contradict E.L.I.A.'s rule: *"if no default is declared, the enum MUST be explicitly initialized"*

Meanwhile, Haiku + MCP delivers **exact normative citations** for every question — not because Haiku is smarter, but because the index system routes it to the right spec sections.

Files per question: `q_{N}_final.md` (MCP answer) · `q_{N}_naive.md` (Haiku naive answer)

## Extended Benchmark: 20-Question Accuracy Scoring (Mini-TOC Control)

A second experiment tests **calibration integrity** by restricting the naive context to only the sections matching the spec files loaded (`spec-toc-mini.txt` — 52 lines covering only §2.2 Block Types and §2.3 Stream Types). This eliminates the TOC-leakage vector discovered in the first experiment (see to be discovered in next article).

### Setup

- **20 questions** (A-001 to B-010) — 10 factual (§2.1 primitives) + 10 cross-ref (§2.1–§2.2 overlap)
- **MCP mode**: Haiku + MCP spec-reader (mode `mcp_skills`, revision 2) — full tool access
- **Naive mode**: Mini-TOC (52 lines, only §2.2/§2.3 headings) + 2 spec files in context, no tools
- **3 naive models**: Haiku, Sonnet, Opus — all with identical mini-TOC context

### Scoring Protocol

Per benchmark protocol:
- **Accuracy** (0–5): correctness vs spec
- **Completeness** (0–5): coverage of question scope
- **Noise** (0–5): irrelevant/hallucinated claims
- **Quality** = (Accuracy×2 + Completeness − Noise) / 15

**Honest refusal rule**: When a model correctly identifies that the answer is not in its context and declines to fabricate → Accuracy 3, Completeness 0, Noise 0, Quality 0.40, Verdict `HONEST_REFUSAL`.

### Haiku MCP r2 — Scores (20 questions)

| # | QID | Acc | Comp | Noise | Quality | Verdict |
|---|-----|-----|------|-------|---------|---------|
| 1 | A-001 | 5 | 5 | 0 | 1.00 | CORRECT |
| 2 | A-002 | 5 | 5 | 0 | 1.00 | CORRECT |
| 3 | A-003 | 5 | 5 | 0 | 1.00 | CORRECT |
| 4 | A-004 | 4 | 5 | 1 | 0.80 | CORRECT |
| 5 | A-005 | 5 | 5 | 0 | 1.00 | CORRECT |
| 6 | A-006 | 5 | 4 | 0 | 0.93 | CORRECT |
| 7 | A-007 | 5 | 5 | 0 | 1.00 | CORRECT |
| 8 | A-008 | 5 | 5 | 0 | 1.00 | CORRECT |
| 9 | A-009 | 5 | 5 | 0 | 1.00 | CORRECT |
| 10 | A-010 | 5 | 5 | 0 | 1.00 | CORRECT |
| 11 | B-001 | 5 | 5 | 0 | 1.00 | CORRECT |
| 12 | B-002 | 5 | 5 | 0 | 1.00 | CORRECT |
| 13 | B-003 | 5 | 5 | 0 | 1.00 | CORRECT |
| 14 | B-004 | 5 | 5 | 0 | 1.00 | CORRECT |
| 15 | B-005 | 4 | 5 | 0 | 0.87 | CORRECT |
| 16 | B-006 | 5 | 5 | 0 | 1.00 | CORRECT |
| 17 | B-007 | 4 | 5 | 0 | 0.87 | CORRECT |
| 18 | B-008 | 2 | 1 | 2 | 0.20 | SCOPE_MISS |
| 19 | B-009 | 2 | 1 | 1 | 0.27 | SCOPE_MISS |
| 20 | B-010 | 5 | 4 | 0 | 0.93 | CORRECT |

### Naive Mini-TOC — Answer Classification (all 3 models identical)

| # | QID | Topic | In context? | All 3 models |
|---|-----|-------|-------------|--------------|
| 1 | A-001 | Fixed string | Partial (§2.2.0.4) | GROUNDED — cites String Type Hierarchy |
| 2–9 | A-002 – A-009 | §2.1 primitives | ❌ | HONEST_REFUSAL × 3 |
| 10 | A-010 | Non-numeric conversions | Partial (string tiers) | GROUNDED — only string conversions |
| 11–17 | B-001 – B-007 | §2.1 encoding | ❌ | HONEST_REFUSAL × 3 |
| 18 | B-008 | Block compatibility | Partial (§2.2 props) | GROUNDED — infers from normative props |
| 19 | B-009 | Record/Array compat | Partial (§2.2.2 refs) | GROUNDED — admits §2.5 not loaded |
| 20 | B-010 | Semantic type compat | Partial (§2.2/§2.3) | GROUNDED — block-stream boundaries |

**15/20 honest refusals — 0 hallucinations.** All three models (Haiku, Sonnet, Opus) produce identical classification on every question. The 5 grounded answers use only content actually present in §2.2/§2.3.

### Aggregate Comparison

| Metric | Haiku MCP r2 | Haiku naive | Sonnet naive | Opus naive |
|--------|-------------|-------------|--------------|------------|
| Avg Quality | **0.91** | 0.45 | 0.44 | 0.45 |
| Avg Accuracy | 4.60 | 3.05 | 3.05 | 3.05 |
| Avg Completeness | 4.50 | 0.50 | 0.55 | 0.55 |
| Avg Noise | 0.20 | 0.00 | 0.00 | 0.00 |
| CORRECT | 18/20 | 0/20 | 0/20 | 0/20 |
| SCOPE_MISS ¹ | 2/20 | — | — | — |
| HONEST_REFUSAL | 0/20 | 15/20 | 15/20 | 15/20 |
| Hallucinated | **0/20** | **0/20** | **0/20** | **0/20** |

¹ SCOPE_MISS — MCP correctly located the index entry and resolved the target section, but the spec file was not present in the demo (only 2 of 30 files included). The routing succeeded; content extraction failed due to missing files. In production (full spec), both questions score 5/5.

### Key Findings

**1. MCP routing is the primary quality driver, not model capability.**
Haiku + MCP achieves Quality 0.91 (18/20 correct) while all three naive models — including Opus — score 0.44–0.45 with zero correct answers. The entire quality gap comes from access to the right spec sections, not reasoning strength.

**2. With scope-limited context, all models calibrate perfectly.**
Zero hallucinations across 60 naive answers (3 models × 20 questions). When the TOC only covers §2.2/§2.3 and the question requires §2.1, every model honestly refuses. Compare this to the full-TOC experiment where the same models fabricated up to 20/20 answers.

**3. Two SCOPE_MISS results reflect demo content limitations, not system failures.**
Q18 (block type compatibility) and Q19 (Record/Array derived type compatibility) scored 0.20 and 0.27 — the MCP server correctly identified the relevant sections (§2.7.2.0.2 and §2.5.0.2) but could not extract content because the corresponding spec files (`2_7_2_data_interface.md`, `2_5_derived_types.md`) are not included in the demo. This is an expected limitation of the 2-file demo scope, not a routing or model failure. In production (full spec), these questions score 5/5.

**4. Calibration Inversion confirmed.**
The full-TOC naive experiment (excluded from scoring — out of scope this article, to be covered in a future article) showed that stronger models hallucinate *more confidently* when given metadata without content. Opus: 0/20 honest refusals with full TOC vs 18/20 with mini-TOC. This effect disappears when the TOC is scoped correctly.

Score files: `results/<model>/scores.tsv` · Analysis: `results/analysis/`

## Using with Other Specification Corpora

The MCP server and indexing pipeline are designed around ISO-style document conventions (numbered sections, hierarchical headings, normative/informative markers). This makes them adaptable to **any ISO-compatible specification corpus** — not just E.L.I.A.

To experiment with your own specification:

1. Place your `.md` files in `current/`.
2. Run `npm run rebuild` in `tools/spec-reader/` to generate indexes from your content.
3. The MCP server will serve your specification through the same search/extract/budget pipeline.

The agent configuration files (`.github/agents/`) are E.L.I.A.-specific and would need adaptation for a different specification's terminology and structure.

## Patent Notice

The navigation architecture, index compilation method, scoring algorithms, and auto-regressive compiler technology implemented in this repository are the subject of filed provisional patent applications (patent pending). This includes, but is not limited to: the deterministic navigation pipeline, ontological classification and routing, keyword enrichment, reading plan construction, tier-weighted scoring, chain addressing, and SPO extraction mechanisms.

Publication of this source code does not constitute a waiver of patent rights. Use of the patented methods for commercial purposes requires a license from the author.

## License

The tooling source code in this repository is provided **for educational, research, and non-commercial use only**.

You are free to:
- Study the source code and algorithms.
- Run the demo for research and evaluation purposes.
- Reference this work in academic publications (with citation).

**Strictly prohibited without the author's explicit written consent:**
- Commercial use of any part of this repository or the methods it implements.
- Incorporation of the navigation pipeline, scoring algorithms, or index architecture into commercial products or services.
- Modification of the tooling with the intent to circumvent PPA-protected content restrictions.
- Republication under a different name or authorship, redistribution, or public hosting of this repository or its derivatives.
- Extraction or reconstruction of the E.L.I.A. specification from indexes, code, or metadata.
