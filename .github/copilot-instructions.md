

<attachment filePath=".github/agents/elia-language/specification_struct.json"> # specification structure, indices registry, search protocol, ontological mappings
<attachment filePath="tools/spec-reader/indexes/aspect_index.json"> # aspect index registry (routes to 13 indices: 7 manual + 6 auto-generated)
<attachment filePath=".github/agents/elia-language/definitions.els"> # concept definitions: section, aspect, canvas, paragraph, etc.


# general thinking rules
- think in chat with russian language
- response in dialog in russian until ask another
- write in markdown with english language 
- write citated technical terms in backticks (or explanations in italics if no exact term)

# subagent rules
- when invoking subagents (runSubagent), ALWAYS include in the prompt: "Think and reason in Russian (думай на русском). Write all file content in English."
- this applies to ALL subagent types — they do NOT inherit copilot-instructions automatically

# Tooling-first rule

When a task requires **>5 iterative cycles** working with the same file or structure (e.g. fixing grammar rules, auditing spec sections, batch-editing examples):

1. **Before starting**, propose building a CLI navigation/query tool first. Explain the expected cost saving.
2. If the user **agrees** — build the tool, then proceed with the task.
3. If the user **declines** — proceed without the tool, no further reminders.

Rationale: reading large structured files (like Elia.g4, 2000+ lines) through grep/read_file costs ~1650 tokens per iteration. A CLI tool reduces this to ~200 tokens — pays for itself after 3 iterations. The grammar-reader tool saved ~$5-6 but was built after the work was done instead of before.

# Spec version

At the start of every conversation, call `spec_version` (no parameters) to get the current spec version, date, and change log. Include the version in your first response.

# Copilot Instructions

# how to read the definition in *.els files:

1. Comments

* If a line starts with `#` → **ignore the line**.
* Comments never affect meaning.

2. Definition Block

A definition is a single block that contains fields in **logical order**:

* `name`
* `version`
* `explained as`
* `enforced`
* optional `constraints`

No other fields define meaning.

3. Explanation (Primary Meaning)
* The explanation **always starts** with `explained as`.
* It defines **the meaning of the definition**.
* It may include:
  * examples
  * rationale
  * references to norms
* The explanation is the **only source of semantic meaning**.

4. Enforcement (Context Only)

* The enforcement section **always starts** with `enforced`.
* It lists related aspects.
* Enforcement:
  * **adds context**
  * **does NOT add or change meaning**
* Use enforcement only to understand **where the definition applies**.

5. Mandatory Reading Order

Always process fields in this order:

1. `name`
2. `explained as`
3. `enforced`
4. `constraints` (if present)

Never change this order.

6. Scope Rule

* The explanation applies **globally** to:

  * the definition itself
  * all aspects listed in `enforced`
* **Do not reinterpret** the explanation per aspect.

7. Constraints (Rules and Limits)

* The constraints section **starts with** `constraints`.
* Constraints define **conditions or limits**.
* Each constraint has an **importance level**:

  * `MUST` / `MUST NOT`
  * `SHOULD` / `SHOULD NOT`
  * `MAY`

8. Conflict Resolution Rules

* `MUST` > `SHOULD` > `MAY`
* If two constraints conflict:
  * the higher importance level **wins**

* If a constraint conflicts with an enforced aspect:
  * `SHOULD` and `MAY` are **ignored**
  * only `MUST` may survive

9. Reserved Keywords (External Authority)

* If `enforced` or `constraints` mention known standards (e.g. GDPR, DORA, RFC):

  * Do **not interpret locally**
  * Do **not redefine**
  * Use the external standard as the **authoritative source**

# how to read the specification_struct.json file:
- File contains:
  a) `indices` — registry of 13 aspect index files with aliases and scope descriptions
  b) `searchProtocol` — pipeline for searching and extracting spec content via indices + patterns
  c) `sectionTitles` — section type classifiers with rg patterns and processing rules
  d) `ontological` — WHAT/WHY/HOW/WHEN mappings, node hierarchy
  e) `grammar` — quick reference for document structure (full map: structure_map.json)

# On-demand files (NOT auto-loaded — read only when needed):

Config files are in `.github/agents/elia-language/`.
Index files are in `tools/spec-reader/indexes/`.

| File | Location | When to read | How |
|------|----------|-------------|-----|
| `patterns.json` | agents | Need rg pattern for search/extraction | `read_file` the specific key (e.g. `section.search`, `helpers.chainToFile`) |
| `structure_map.json` | agents | Need to validate document structure or list nesting | `read_file` — contains $ref navigation map |
| `physical_aspect_index.json` | indexes | Query about data types, serialization, materialization | `read_file` — find unit by keyword |
| `semantic_aspect_index.json` | indexes | Query about semantic types, interfaces, domains, delegates | `read_file` — find unit by keyword |
| `ontologic_aspect_index.json` | indexes | Query about design principles, type system overview, classification | `read_file` — find unit by keyword |
| `design_aspect_index.json` | indexes | Query about design decisions, architectural patterns | `read_file` — find unit by keyword |
| `behavioral_aspect_index.json` | indexes | Query about behavioral norms, diagnostics, compilation phases | `read_file` — find unit by keyword |
| `philosophical_aspect_index.json` | indexes | Query about philosophical foundations, meaning-first | `read_file` — find unit by keyword |
| `block_syntax_aspect_index.json` | indexes | Query about block syntax constructs §3 (domain, module, using, follow, invoke, method, etc.) | `read_file` — find unit by keyword |
| `ontological_role_index.json` | indexes | Query routing by WHAT/WHY/HOW/WHEN — find best concept×role unit | `read_file` — find unit by keyword+onto |

**Rules:**
1. NEVER load an aspect index unless the query requires it. Use `indices.files[].scope` to pick the right one.
2. Load at most ONE aspect index per query. If unsure which — use `rg -i '^#{1,4}\s+.*{KEYWORD}' current/*.md` first to locate the file, then pick the matching index.
3. For `@patterns:` references in specification_struct.json — read the referenced key from patterns.json, do not load the entire file.
4. For structure validation — read structure_map.json.

# Reading plan (deduplication before extraction)

When a query matches multiple index units, ALWAYS build a **reading plan** before extracting text:

1. **Collect** — gather all chain addresses from all matched units (e.g. `["2.5.3", "2.5.3/A.", "2.2.0.2", "2.5.3"]`).
2. **Deduplicate** — remove exact duplicates of the same chain address.
3. **Subsume** — if both a parent and a child address are present, keep only the broader one:
   - `2.5.3/all` subsumes `2.5.3`, `2.5.3/A.`, `2.5.3/(A)-(C)`.
   - `2.5.3` (heading + first paragraph) does NOT subsume `2.5.3/A.` (they are different extractions).
   - `2.5.3/(A)-(F)` subsumes `2.5.3/(B)-(D)`.
4. **Group by file** — sort remaining addresses by resolved file to minimize file reads.
5. **Read once** — read each file region exactly once; share extracted text across all units that referenced it.

This prevents redundant reads and reduces token cost when units overlap (common for cross-referenced types).

## Weighted priority funnel

When building the reading plan, assign a **weighted priority** to each chain entry to control reading order and deduplication precedence.

**Weight levels:**

| Source | Weight | Meaning |
|--------|--------|---------|
| Meta (aspect index origin) | **30×** | Which index the unit belongs to. The index that best matches the query intent gets highest meta-priority. |
| Order (position in seq) | **10×** | The `Order` field within the unit's `seq` array. Lower Order = more foundational. |
| $ref (cross-reference) | **2×** | Entries that are `$ref` links to other units/indices. Supplementary, not primary. |
| Onto bonus | **−15** | Applied when the unit's ontological role matches the `onto` parameter. Promotes onto-matched chains across all tiers. |
| Admissibility demotion | **+20** | Applied to constraint/admissibility matrix units (e.g. `desa/syntaxLevelConstraints`) when they appear via $ref and the query is not explicitly about admissibility. See rule below. |
| Design-index demotion | **+15** | Applied to cross-cutting `desa` units when a HOW-Code query targets a specific construct type. See rule below. |

**Admissibility rule:**

When a HOW-query matches both a construct-syntax unit (bsyn) and an admissibility-constraint unit (desa/syntaxLevelConstraints, desa/syntaxLevelConstraints $ref chains), apply the admissibility demotion penalty (+20) to the constraint unit unless:
- The query keywords explicitly contain "admissibility", "admissible", "allowed", "permitted", "contextual restriction", or "semantic gate"
- The query `onto` is `WHEN` (conditions/triggers naturally pair with admissibility)

This ensures that "how to declare a variable" returns variable syntax forms first, not the block-level constraint matrix.

**Design-index demotion rule (HOW-Code):**

A query is classified as **HOW-Code** when the user asks about concrete syntax/body of a specific construct type (detected from original, pre-enrichment keywords matching `<type> + syntax/body` or `define <type>`).

When a HOW-Code query is detected:
1. Apply the design-index demotion penalty (+15) to **all cross-cutting units from `desa` and `ont`** (syntaxAndAST, syntaxLevelConstraints, flowResilience, securityDesign, etc.)
2. Apply off-target construct demotion to units that don't mention the target construct type
3. Do **NOT** demote construct-specific units (e.g. `desa/classDesign`, `desa/actionDesign`, `desa/delegateIntegration`) — these remain at normal priority
4. Target construct detection uses **original keywords only** (pre-enrichment) to prevent enrichment-added keywords like "module body" from making "module" an unintended target
5. The demotion does NOT apply when:
   - The query keywords explicitly contain "design", "architecture", "pattern", or "constraint matrix"
   - The query `onto` is `WHY` (design rationale naturally lives in desa/ont)

The 11 construct types recognized for HOW-Code: `domain`, `module`, `definition`, `record`, `interface`, `event`, `rule`, `action`, `flow`, `class`, `delegate`.

This ensures that "action syntax" or "конструкции в action body" returns `phya/action_type` (with §8.8.8) and `bsyn/actionSyntax` before `desa/syntaxAndAST`.

# Grammar / Code-relevance separation

## Aspect boundary principle

Grammar and syntax keywords (`<type> syntax`, `<type> body`, `define <type>`) live **exclusively in `bsyn`** (block_syntax_aspect_index). Other aspect indices (phya, sema, desa, ont, bhva, phla) contain only semantic, design, and normative keywords — never grammar-specific ones.

This separation ensures that:
- Normative queries ("what is a rule?") don't pull in syntax/grammar noise
- Syntax queries ("rule body constructs") route through `bsyn` + `onma/*_how`
- Enrichment stays clean — no cross-construct keyword pollution from `<type> body` in phya/desa

## Code-relevance gate

When classifying a user's question, determine **code-relevance** — whether the answer requires grammar/syntax/declaration details or only normative/semantic content.

**Code-relevant signals** (any of these → include bsyn):
- Keywords: `code`, `syntax`, `structure`, `declaration`, `body`, `grammar`, `construct`, `define`, `declare`
- Intent: `grammar`, `declaration`  
- Onto: `HOW` combined with a specific construct type
- User asks for examples, code samples, or "how to write/declare"

**Normative-only signals** (none of the above → exclude bsyn):
- Keywords: concept names without syntax terms (e.g. "rule", "domain", "enforcement")
- Intent: `normative_rules`, `semantic_role`
- Onto: `WHAT`, `WHY`
- User asks "what is", "why does", "explain the purpose of"

## Query formulation strategy

| User question type | `onto` | `indexRanking` | `intent` | Include bsyn? |
|-------------------|--------|----------------|----------|---------------|
| "Что такое rule?" | WHAT | `["phya","sema","ont"]` | `semantic_role` | ❌ No |
| "Зачем нужен delegate?" | WHY | `["ont","phla","desa"]` | `full` | ❌ No |
| "Как объявить action?" | HOW | `["bsyn","onma","phya"]` | `declaration` | ✅ Yes |
| "Какие конструкции в action body?" | HOW | `["bsyn","onma","phya"]` | `grammar` | ✅ Yes |
| "Нормативные правила для flow" | WHAT | `["bhva","phya","sema"]` | `normative_rules` | ❌ No |
| "Полная справка по class" | — | auto | `full` | ✅ Yes (full = all aspects) |
| "Покажи пример delegate" | HOW | `["bsyn","onma"]` | `canonical_example` | ✅ Yes |

## Keyword formulation rules

When constructing the `keyword` array for `search_spec`, follow these rules:

### 1. Preserve phrasal concepts — do NOT split compound terms

A **phrasal concept** is a multi-word term that denotes a single idea. Splitting it into separate keywords causes each word to match independently, distorting unit ranking.

| User question | ❌ Wrong keywords | ✅ Correct keywords | Why |
|--------------|-------------------|---------------------|-----|
| "What is a delegate trust boundary?" | `["delegate", "trust boundary", "enforcement"]` | `["delegate trust boundary", "enforcement architecture"]` | `delegate` alone dominates ranking → all units about delegate internals, enforcement architecture falls to T4 |
| "How does cross-border enforcement work?" | `["cross-border", "enforcement", "delegate"]` | `["cross-border enforcement", "enforcement pipeline"]` | `cross-border enforcement` is one mechanism, not two concepts |
| "What is the four-layer authority model?" | `["four", "layer", "authority", "model"]` | `["four-layer model", "domain authority"]` | Splitting destroys the concept entirely |
| "Explain admission control rope semantics" | `["admission", "control", "rope", "semantics"]` | `["admission control", "rope semantics"]` | Two phrasal concepts, each preserved |

**Detection rule:** If the user's question contains a multi-word noun phrase (NP) that functions as a single technical term — keep it as one keyword string. Indicators:
- Hyphenated compound: `cross-border`, `four-layer`, `trust-boundary`
- Modifier + head that names a specific mechanism: `admission control`, `trust boundary`, `enforcement pipeline`, `normative class`
- Term appears as a unit in T&D tables or index unit keywords

### 2. Balance concept diversity across keywords

Ensure keywords cover **different semantic dimensions** of the question, not synonyms of the same concept.

| User question | ❌ Low diversity | ✅ High diversity |
|--------------|-----------------|------------------|
| "How is delegate trust boundary enforced?" | `["delegate", "trust boundary", "enforcement"]` — all 3 converge on delegate | `["delegate trust boundary", "enforcement pipeline", "cross-border"]` — delegate concept + enforcement architecture + boundary mechanism |
| "What is a surrogate and why does it exist?" | `["surrogate", "evolution", "enforcement"]` — surrogate + generic terms | `["surrogate", "enforcement continuity", "semantic placeholder"]` — what it is + why it exists + what role it plays |

**Rule:** After formulating keywords, check — do ≥2 keywords point to the **same** index unit cluster? If yes, merge them into one phrasal keyword and add a keyword targeting a **different** aspect of the question.

### 3. Lead with the architectural concept, not the construct name

When the question is about a **principle or mechanism** that involves a specific construct, make the principle the primary keyword.

| Question focus | Primary keyword | Secondary keyword |
|---------------|----------------|-------------------|
| Trust boundary **principle** | `"trust boundary"` | `"delegate"` |
| Enforcement **pipeline** | `"enforcement pipeline"` | `"follow"` |
| Authority **model** | `"domain authority"` | `"four-layer model"` |
| Admissibility **gate** | `"admission control"` | `"follow"`, `"requires"` |

## Full aspect reference

When the user asks for a **complete reference** on a construct (e.g. "дай всё про action", "полная справка по module"), include **all** aspect layers:
1. Physical/semantic type definition (phya/sema)
2. Design rationale (desa)
3. Grammar and syntax (bsyn)
4. Examples (from `current/examples/`)

Use `intent: "full"` and omit `indexRanking` to let auto-ranking work across all indices.

**Algorithm:**

1. **Score each chain entry** — `effectivePriority = metaWeight × 30 + order × 10 - (ontoMatch ? 15 : 0) + (isRef ? 2 : 0) + (admissibilityDemotion ? 20 : 0) + (designDemotion ? 15 : 0)`
   - `metaWeight`: rank of the source aspect index for this query (1 = best match, 2 = secondary, etc.)
   - `order`: the `Order` value from the seq entry
   - `ontoMatch`: true if the unit's onto role matches the query's `onto` parameter
   - `isRef`: true if the entry is a `$ref` cross-reference

2. **Sort all chain entries** by `effectivePriority` ascending (lowest = read first, highest importance).

3. **Deduplicate by chain address** — when the same chain address appears with different priorities, keep the entry with the **lowest** (highest-importance) priority score and discard the rest.

4. Proceed with subsumption, grouping, and extraction as described above.

# Keyword enrichment algorithm

The MCP `search_spec` tool auto-enriches keywords before searching (controlled by `enrich` param, default: `true`).

## Three-phase pipeline

1. **Phase 1 — T&D expansion**: For each input keyword, look up its term in the E.L.I.A. Terms & Definitions tables (`2.0.1/table-1`, `B.1.1/table-1`). Extract backtick-quoted terms and **bold** phrases from the definition text. These become candidate expansions.

2. **Phase 2 — Co-occurrence**: Find index units that match ≥2 input keywords. Extract all *other* keywords from those units (stop-words excluded). These become co-occurrence candidates.

3. **Phase 3 — Waterfall confirmation**: Run a second pass over matched units. Keep only candidate keywords that actually appear in units matching ≥2 of the *expanded* keyword set. This eliminates noise.

## Example

Input: `block, derived, stream`
→ Phase 1 adds nothing (no exact T&D match)
→ Phase 2 finds `record`, `block type`, `derived type` from co-occurring units
→ Phase 3 confirms all 3
→ Output: `block, derived, stream, record, block type, derived type`

# Line filtering (grep -C style)

When `filter` parameter is passed to `search_spec`:
- `filter: true` — auto-builds regex patterns from search keywords
- `filter: "<regex>"` — uses custom regex pattern

For each extracted section, only matching lines + structural markers (headings, aspect markers, paragraph markers) + `contextLines` (default: 2) are returned. Skipped regions show `[...]`.

This typically reduces Tier 1 content from ~38K to ~13K tokens.

# search_spec parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `keyword` | string or string[] | required | Search keywords (1–5) |
| `onto` | enum | omit | Ontological question type: WHAT, WHY, HOW, WHEN. Boosts matching units first (soft filter). |
| `intent` | enum | `full` | Reading intent filter |
| `maxUnits` | number | 3 | Maximum matching units |
| `enrich` | boolean | `true` | Auto-enrich keywords via T&D + co-occurrence |
| `planOnly` | boolean | `false` | Return reading plan only (no content) |
| `tier` | number (1–4) | all | Read only specific tier |
| `indexRanking` | string[] | auto | Index alias priority ranking |
| `filter` | true or string | off | Line-level keyword/regex filter |
| `contextLines` | number (0–10) | 2 | Context window for line filter |
| `detail` | enum | `normal` | Detail level — controls which tiers are protected from trimming. `brief`=T1, `normal`=T1+T2, `detailed`=T1+T2+T3, `complete`=all tiers. |
| `autoExpand` | boolean | `false` | When true, server auto-expands budget to preserve protected tiers instead of returning BUDGET_PRESSURE. Ceiling: 20000. |

## Cross-reference lookup (lookup_xref)

The `lookup_xref` tool provides access to the cross-reference graph (`xref`, 267 refs across 148 sections).

**Modes:**
- **forward** (default): given section(s), return outgoing references (→ other sections, standards, URLs)
- **reverse**: given a target, find all sections that reference it ("who mentions GDPR?")

**Weight model (forward mode):**

| refType | Penalty | Rationale |
|---------|---------|-----------|
| section | +0 | Internal links, directly navigable via `read_chain` |
| standard | +5 | External standards (GDPR, RFC, ISO) — context only |
| url | +10 | External URLs — least actionable in spec context |
| person | +10 | Contact references — reserved |
| admissibility | +20 | Construct-admissibility matrices — supplementary unless explicitly queried |

Base score: `META_WEIGHT(30) × metaRank(10) + typePenalty` → xref results always rank below primary index matches.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sections` | string[] | required | Section numbers or targets (1–20) |
| `mode` | enum | `forward` | `forward` or `reverse` |
| `refType` | string[] | all | Filter: `section`, `standard`, `url`, `person` |
| `expand` | boolean | `false` | Return section-type targets as chain addresses for `read_chain` |

**Workflow:** `search_spec` → find primary sections → `lookup_xref` forward → discover related → `read_chain` to read them.

## Ontological funnel variator (onto)

The `onto` parameter adds a second search dimension — the **ontological question type**:

| Role | Meaning | Natural question | Boosted indices |
|------|---------|------------------|-----------------|
| `WHAT` | Nature / identity | "что такое X?" | phya, sema, trma |
| `WHY` | Purpose / rationale | "зачем нужен X?" | phla, ont, desa |
| `HOW` | Method / process | "как объявить X?" | bsyn, grma, desa, bhva |
| `WHEN` | Conditions / timing | "когда применять X?" | bhva, desa |

**How it works:**
1. Each index has a default `onto` in `aspect_index.json` (e.g. phya → WHAT, grma → HOW)
2. Some units have an explicit `onto` override when they differ from their index default (20 units total)
3. When `onto` is specified, MCP boosts matching units first (soft sort), non-matching units still appear after
4. Agent classifies the user's question to determine both `keyword` and `onto`, sends both to MCP

# Response size budget

The agent MUST keep every response **under 4 000 tokens** (spec content + commentary combined).

## Auto-reduction pipeline (agent acts on its own first)

When a `search_spec` or `read_chain` call returns content that would push the response over budget, the agent MUST self-reduce **before** involving the user. Apply these strategies in order, stopping as soon as the response fits:

1. **Apply `filter: true`** — re-run the same query with line-level keyword filter enabled. Typical saving: ~60-80 %.
2. **Switch to `extract` mode** — re-run `read_chain` with `extract: "code"`, `"table"`, or `"refs"` (whichever matches the user's intent). Typical saving: ~50-70 %.
3. **Lower `maxUnits`** — reduce from current value toward 1. Each dropped unit saves one full section.
4. **Request a single `tier`** — if the query used all tiers, re-run with `tier: 1` (primary definitions only).
5. **Use `planOnly: true`** — retrieve just the reading plan (chain addresses + titles) without section text.

## User options (only if auto-reduction is insufficient)

If the content is still over budget after step 5, offer the user **three options**:

| Option | What happens |
|--------|-------------|
| **Condensed** | Agent summarizes key points from the extracted content in ≤3 000 tokens. |
| **Full read** | Agent sends the complete spec content as-is, budget waived. |
| **Direct spec link** | Agent provides the exact file path(s) and line range(s) (e.g. `current/2_5_derived_types.md#L120-L185`) so the user can read the spec directly. No spec text in the response. |

## Budget pressure signal (server-driven expansion)

The MCP server performs **tier-aware budget trimming** — it drops low-priority tiers bottom-up before truncating protected content. Which tiers are "protected" depends on the `detail` parameter:

| `detail` | Protected tiers | What's preserved |
|----------|----------------|------------------|
| `brief` | T1 | Core definitions only |
| `normal` (default) | T1 + T2 | Core + normative properties |
| `detailed` | T1 + T2 + T3 | + registry, cross-refs, matrices |
| `complete` | all | No trimming |

When protected content is lost, the server injects a **pressure signal** into the response:

```
[BUDGET_PRESSURE: 3 sections dropped (T1:1, T2:2), ~850 tokens lost. Protected content (T1+T2) lost. Suggested budget: 5500.]
```

And the tool response metadata includes:

```
[Budget: 3200/4000 tokens, trimmed from 5800. EXPAND RECOMMENDED → budget:5500]
```

### `autoExpand` — automatic budget expansion

When `autoExpand: true`, the server handles budget expansion automatically:
1. First pass: apply budget → detect that protected tiers are being dropped
2. Calculate minimum budget to preserve protected tiers (+10% headroom)
3. Re-run with expanded budget (ceiling: 20000)
4. Return result with metadata: `[AUTO_EXPANDED: 2500 → 3470 to preserve detailed content]`

The agent does NOT need to re-call — expansion happens server-side in a single tool call.

### Agent reaction protocol (when `autoExpand: false`)

1. **Detect** — after every `search_spec` / `read_chain` call, check for `BUDGET_PRESSURE` or `EXPAND RECOMMENDED` in the response text.
2. **Evaluate** — if the signal is present AND the user's question requires the dropped content (check tier counts):
   - **Re-call** the same tool with `budget: <suggestedBudget>` parameter (min: 1000, max: 20000).
   - Do NOT re-call if only unprotected tiers were dropped.
3. **Report** — if budget was expanded, mention it briefly: "расширил бюджет до N токенов для полного ответа".
4. **Fallback** — if `suggestedBudget` > 20000, fall through to the User Options below.

### `budget` parameter

Both `search_spec` and `read_chain` accept an optional `budget` parameter (number, 1000–20000). When omitted, the default is 4000 tokens. Use it to expand or restrict the response window per-call.

Both tools also accept `detail` and `autoExpand` parameters with the same semantics described above.

### Tier markers

Section markers in responses now include tier tags: `▸ [T1] 2.5.3`, `▸ [T2] A.1`, `▸ [T3] D.1.3`, `▸ [T4] B.1.1`. Tiers 1-2 are core content; tiers 3-4 are supplementary. Use this for quick visual priority assessment.

## Exceptions

- The user explicitly asks for full text (e.g. "дай полный текст секции", "give me everything") → send full, skip pipeline.
- The user asks for a reading plan or outline → use `planOnly: true`, no budget concern.

# Heading validation rules (H-title convention)

All markdown `#` headings in `current/*.md` MUST follow the section-number convention.
Code blocks (fenced with ```) are excluded — `#` inside code is a comment, not a heading.

## VALID headings

| Level | Pattern | Example |
|-------|---------|---------|
| H1/H2 + section number | `^#{1,2}\s+\d` | `# 8.0`, `## 8.1.1` |
| H1/H2 + annex number | `^#{1,2}\s+[A-Z]\.\d` | `## A.6`, `# B.1` |
| H1/H2 + plain text (no letter marker) | `^#{1,2}\s+[A-Z][^.]` or `^#{1,2}\s+[A-Z]{2,}` | `# Terms and Definitions`, `## ANNEX C` |
| H3–H6 + section number | `^#{3,6}\s+\d` | `### 2.7.2.4.3` |
| H3–H6 + annex number | `^#{3,6}\s+[A-Z]\.\d` | `### A.7.1` |

## INVALID headings (violations)

| Code | Pattern | Example | Fix |
|------|---------|---------|-----|
| A | H1/H2 with letter marker: `^#{1,2}\s+[A-Z]\.\s` | `## A. Module...` | → `## 8.0.1 Module...` (assign section number) |
| B | H3+ without number: `^#{3,6}\s+[^0-9A-Z]` | `#### Why inline exists` | → `**Why inline exists**` (demote to bold paragraph) |
| C | H3+ with bold wrapping: `^#{3,6}\s+\*\*[A-Z]\.` | `#### **A. Primary...**` | → `**A. Primary...**` (remove `####`, keep bold) |
| D | H3+ with letter-only marker: `^#{3,6}\s+[A-Z]\.\s` (no digit after) | `#### A. Consequence 1` | → `**A. Consequence 1 — ...**` (demote to bold paragraph) |
| E | Numbered but bold-wrapped: `^#{3,6}\s+\*\*\d` | `### **2.7.4.3.4 ...**` | → `### 2.7.4.3.4 ...` (keep `###`, remove `**`) |

## Note: `3_0_block_syntax.md` — has examples in `current/examples/`

# Grammar Reading Tool

When working with `grammar/Elia.g4` (ANTLR v4 combined grammar), use the CLI tool instead of reading .g4 manually:

```
node tools/grammar-reader/grammar-query.js <command> [args]
```

| Command | What it does |
|---------|-------------|
| `deps <rule>` | Direct dependencies (→ sub-rules and tokens) |
| `refs <rule>` | Reverse dependencies (← who calls this rule) |
| `path <from> <to>` | Shortest path between two rules |
| `rule <name>` | Full rule text with line numbers |
| `first <rule>` | Approximate FIRST set (start tokens) |
| `impact <rule>` | Transitive reverse closure (all affected rules) |
| `tree <rule> [depth]` | Expansion tree (default depth: 3) |
| `chain <rule>` | All paths from compilationUnit to a rule |
| `summary` | All 240 rules with dep/ref counts |

**Workflow for debugging parser errors:**
1. `chain <rule>` — how do we reach the error context?
2. `rule <name>` — what does the rule look like?
3. `first <rule>` — what tokens are expected here?
4. `deps <rule>` — what sub-rules are involved?
5. `impact <rule>` — what will break if I change this?

Static index: `tools/grammar-reader/grammar-index.json` (regenerate: `node grammar-query.js index`)


