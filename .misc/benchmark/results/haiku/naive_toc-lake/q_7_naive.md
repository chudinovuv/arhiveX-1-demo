# q_7 — A-007 — What are the normative properties of the Date/Time class in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Normative Properties of the Date/Time Class

Based on the E.L.I.A. specification, the **Date/Time Class** is defined as a primitive type category. However, the detailed normative properties section for this class (§2.1.4) is **not included in the loaded specification content**.

## What Is Available

The specification includes the following structural references for Date/Time (§2.1.4):

- **§2.1.4.1** — Designation (purpose and role)
- **§2.1.4.2** — Normative properties (detailed rules)
- **§2.1.4.3** — Semantic role (function within the type system)

## What Is Not Available

The **full text** of §2.1.4.2 (Normative properties) and the associated encoding rules, constraints, and syntax sections are listed in the table of contents but not loaded in the current specification excerpt.

## Inference from Context

From the broader specification structure, Date/Time types would be expected to:

1. Be **primitive types** subject to the encoding rules in §2.1.9 (Binary Encoding Rules for Primitives)
2. Support **canonical serialization** via the Type Metadata Envelope (ANNEX B)
3. Participate in **type compatibility and conversion rules** defined in §2.1.10
4. Be eligible for use in **primitive type aliases** (§2.0.9)

---

**To obtain the complete normative properties of Date/Time, you will need to consult the full specification text at §2.1.4.2.**

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 369
- tokens_total: 397
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 4.1
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_7_naive.md
