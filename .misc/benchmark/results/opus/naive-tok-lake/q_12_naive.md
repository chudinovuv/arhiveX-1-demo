# q_12 — B-002 — What normative properties govern the Decimal/floating class in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the specification, the normative properties governing the Decimal/floating class are found in **§2.1.2.2**:

1. **Finite representation requirement** - Values MUST be finite; infinity and NaN are forbidden (§2.1.2.2, property 1)

2. **IEEE 754 compliance for floating types** - `float32` and `float64` MUST follow IEEE 754 binary format (§2.1.2.2, property 2)

3. **Fixed-precision decimal semantics** - `decimal64` and `decimal128` MUST implement fixed-precision decimal arithmetic, not binary floating-point approximations (§2.1.2.2, property 3)

4. **Deterministic rounding** - All rounding operations MUST be deterministic and explicitly declared (§2.1.2.2, property 4)

5. **No implicit type conversions** - Conversions between integral, floating-point, and decimal types MUST be explicit (§2.1.2.2, property 5)

6. **Canonical serialization** - Floating and decimal types MUST serialize canonically without precision loss or ambiguity (§2.1.2.2, property 6)

The specification emphasizes that these types are designed for **measurable, calculable values requiring fractional precision** (§2.1.2.1) and serve as **canonical representations of real-world quantities, financial values, and scientific measurements** (§2.1.2.3).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 348
- tokens_total: 375
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 11.4
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_12_naive.md
