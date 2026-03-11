# q_3 — A-003 — How does E.L.I.A. distinguish between null, void, and nothing — what are the normative differences?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# E.L.I.A. Null, Void, and Nothing: Normative Distinctions

The specification provided does **not contain a complete normative definition** of the semantic or implementation distinctions between `null`, `void`, and `nothing`. However, I can identify what is explicitly stated:

## What the Specification Says

### `nothing` — Non-Value Semantic Marker

The only explicit normative reference is in **ANNEX A.10.1 — Non-Value Semantic Marker: `nothing` (Normative)**:

> `nothing` is defined as a **"Non-Value Semantic Marker"** in the Type Registry, but the specification does not provide the detailed normative definition of this marker in the loaded sections.

The table of contents lists this section as normative, but **the detailed text is not included in the loaded specification content**.

### `null` and `void` — Absent from Loaded Sections

The specification mentions these terms in:

- **§2.1.6 Special/control Class** — which covers special and control types
- **§3.21.5 Null and Special Literals** — which discusses syntax for null and special literals

However, **the normative text of these sections is not loaded**, so I cannot provide authoritative distinctions.

## What Can Be Inferred

From the **Table of Contents structure** and design principles, the language appears to distinguish between:

1. **`nothing`** — explicitly positioned as a **non-value marker** (semantic absence, not a value), separate from traditional null semantics
2. **`null`** — likely a traditional null/nil value (absent instance of a type)
3. **`void`** — likely indicates absence of a return value or no meaningful result (common in behavioral types like methods or flows)

## Recommendation

To obtain the normative distinctions between `null`, `void`, and `nothing`, you must consult:

1. **§2.1.6 — Special/control Class** (normative properties and semantic role)
2. **§3.21.5 — Null and Special Literals** (syntax and normative rules)
3. **ANNEX A.10.1 — Non-Value Semantic Marker: `nothing`** (normative definition)

These sections are referenced in the table of contents as **normative** but are **not included in the provided specification text**.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 543
- tokens_total: 575
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 6.5
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_3_naive.md
