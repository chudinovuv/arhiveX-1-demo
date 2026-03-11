# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
According to the E.L.I.A. specification, integer values are encoded in binary following these rules:

## Integer Encoding Rules (§2.1.9.2)

1. **Encoding Format**: All integers are encoded using **two's complement representation** in **little-endian byte order**.

2. **Size-based Encoding**:
   - Integers use the **minimal number of bytes** required to represent the value
   - The encoder must select the smallest integer type that can hold the value

3. **Type-specific Byte Sizes**:
   - `int8`: 1 byte
   - `int16`: 2 bytes  
   - `int32`: 4 bytes
   - `int64`: 8 bytes

4. **Signed Extension**: When decoding, values must be **sign-extended** to match the target type's width.

5. **Overflow Handling**: Encoding a value that exceeds the type's range must be **rejected with an overflow error**.

## Additional Encoding Context

Per §2.1.9 (Binary Encoding Rules for Primitives), these integer encoding rules are part of a larger canonical encoding system where:

- All encodings must be **deterministic and canonical** (§2.1.9.1)
- The encoding follows an **Envelope model** defined in ANNEX B
- Integers ≤ 48 bits can be encoded inline for performance optimization (§2.1.9.10.1)
- Integers > 48 bits require external encoding with additional overhead (§2.1.9.10.2)

The specification emphasizes that these encoding rules ensure **platform-independent, deterministic serialization** that produces identical byte sequences across all compliant implementations.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 398
- tokens_total: 424
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 13.8
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_13_naive.md
