# q_4 — A-004 — What implicit type conversions are allowed between numeric primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Implicit Type Conversions Between Numeric Primitives in E.L.I.A.

According to the specification, **E.L.I.A. does not permit implicit type conversions between numeric primitives**. Instead, the language requires **explicit conversion**.

## Normative Statement

Section **2.1.10.1 — Fundamental Principles** establishes:

> Implicit coercion between distinct primitive types is **forbidden**. All conversions between primitives **MUST be explicit**.

This principle is reinforced in **Section 2.2.0.4 — String Type Hierarchy**, which applies the same strict rule to string tiers:

> Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**.

## Scope of the Rule

The specification indicates that numeric primitive compatibility is governed by **Section 2.1.10.2 — Primitive Type Compatibility Matrix**, which defines:

- **Assignment (Implicit)** — permitted cases (if any)
- **Explicit Conversion – Numeric Types** — required forms

However, the detailed compatibility matrix content itself is **not loaded in the available specification text**, so the precise enumeration of which implicit assignments (if any) are permitted cannot be stated with certainty from the sections provided.

## Design Rationale

This strict conversion policy aligns with E.L.I.A.'s core principles:

1. **Explicit Semantic Boundaries (§1.3)** — conversions are semantic operations that must be made visible.
2. **Determinism by Construction (§1.2)** — eliminating implicit coercion removes ambiguity and hidden behavior.
3. **Concern Separation (§1.4)** — type conversions are explicit semantic contracts, not automatic machinery.

**Recommendation:** Consult **Section 2.1.10.2 — Primitive Type Compatibility Matrix** for the authoritative specification of numeric conversion rules, as the detailed rules are normatively defined there but not included in the provided excerpt.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 481
- tokens_total: 508
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 6.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_4_naive.md
