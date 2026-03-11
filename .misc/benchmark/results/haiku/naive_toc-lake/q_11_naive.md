# q_11 — B-001 — What specific integer types does the E.L.I.A. Integral class define and what are their bit widths?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Integral Class Type Definitions

According to the specification, **Section 2.1.1 — Integral Class** defines the integral type family. However, the **specific integer types and their bit widths are not provided in the loaded sections** of the specification.

## What is Specified

The specification indicates that:

1. **§2.1.1 Integral Class** exists and establishes a normative class for integral types (§2.1.1.1 Designation, §2.1.1.2 Normative properties, §2.1.1.3 Semantic role)

2. **§2.0.9 Primitive Type Aliases** addresses integral aliases (§2.0.9.2 "Integral aliases"), suggesting that named aliases like `int8`, `int16`, `int32`, `int64`, `uint8`, etc. are defined

3. **§2.1.9 Binary Encoding Rules for Primitives** includes **§2.1.9.2 "Integer encoding"**, which defines how integers are encoded canonically

4. The **Table of Contents summary** notes that **§2.1 Primitive Types** covers `int8–int64` (among other primitives)

## Answer

**The detailed specification of integral types and their exact bit widths is in §2.1.1 and §2.0.9.2, which are not included in the loaded specification sections.** To obtain the authoritative list of integral types, bit widths, signedness, value ranges, and encoding rules, you must consult the full text of those sections directly.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 365
- tokens_total: 397
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 5.6
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_11_naive.md
