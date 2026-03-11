# q_4 — A-004 — What implicit type conversions are allowed between numeric primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, **NO implicit type conversions are allowed between numeric primitives**.

According to §2.1.10.1 Fundamental Principles:
> "1. **No implicit type conversion** — The language **forbids all implicit type conversions**. Every type transformation **MUST be explicit** via casting operators or conversion functions."

This is reinforced in §2.1.10.2.1 Assignment (Implicit):
> "**No implicit conversion is permitted**. Assignment requires **exact type match** or **explicit conversion**."

The specification provides a clear example:
```
let x: int32 = 42;
let y: int64 = x;        # ERROR: No implicit conversion
let z: int64 = int64(x); # OK: Explicit conversion
```

For numeric types specifically, §2.1.10.2.2 states:
> "Numeric primitives **MUST use explicit conversion** even when the conversion is lossless"

This means that even safe conversions (like int32 to int64, or float32 to float64) require explicit casting. The language takes a strict approach where **all type conversions must be explicitly stated in the code**, with no exceptions for numeric types.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 289
- tokens_total: 316
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 11.5
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_4_naive.md
