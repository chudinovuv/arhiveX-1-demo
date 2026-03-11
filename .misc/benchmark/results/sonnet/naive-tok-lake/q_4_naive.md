# q_4 — A-004 — What implicit type conversions are allowed between numeric primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, **no implicit type conversions are allowed between numeric primitives**. The language requires explicit conversion for all numeric type transitions.

## Fundamental Principle

Per §2.1.10.1 **Fundamental Principles**:

> "E.L.I.A. **does not support implicit type conversion** between different primitive types. All conversions between primitive types **must be explicit**."

## Numeric Type Compatibility Matrix

According to §2.1.10.2.1 **Assignment (Implicit)**, the compatibility matrix shows that **all numeric primitive assignments require explicit conversion**:

- **Integral types** (`int8`, `int16`, `int32`, `int64`, `uint8`, `uint16`, `uint32`, `uint64`) - No implicit conversions between any integral types
- **Floating-point types** (`float32`, `float64`) - No implicit conversions between floating-point types  
- **Decimal types** (`decimal64`, `decimal128`) - No implicit conversions between decimal types
- **Cross-category** (integral ↔ floating-point ↔ decimal) - No implicit conversions across numeric categories

## Explicit Conversion Requirements

Per §2.1.10.2.2 **Explicit Conversion — Numeric Types**:

> "All numeric conversions **must be performed using explicit cast syntax** or conversion functions. The compiler **must reject** any attempt at implicit numeric conversion."

## Normative Rules

§2.1.10.6 **Normative Rules** reinforces this:

1. "**No implicit conversions** are permitted between primitive types"
2. "All type transitions **must be explicitly declared** by the programmer"
3. "The compiler **must enforce** explicit conversion requirements at compile time"

## Design Rationale

This strict approach aligns with E.L.I.A.'s design principles of **explicit semantic boundaries** (§1.3) and **determinism by construction** (§1.2), ensuring that all numeric type transitions are intentional and auditable rather than implicit compiler decisions.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 481
- tokens_total: 508
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 11.2
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_4_naive.md
