# q_14 — B-004 — What is the canonical binary encoding for floating-point and decimal values in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the canonical binary encoding for floating-point and decimal values is defined in **§2.1.9.3 Floating-point and decimal encoding**:

## Floating-point Encoding

**Binary32 and Binary64** follow **IEEE 754-2019** standard (§2.1.9.3):
- **float32**: IEEE 754 binary32 format
- **float64**: IEEE 754 binary64 format

The specification states: "Floating-point values (binary32, binary64) **MUST be encoded in IEEE 754 format**" (§2.1.9.3).

## Decimal Encoding

**Decimal values** use a **scaled integer representation** (§2.1.9.3):

1. **Encoding format**: Two-part structure
   - **Significand**: Stored as a **two's complement signed integer**
   - **Scale**: Implicit based on the decimal type's precision

2. **Serialization rules**:
   - The significand is encoded as a **variable-length signed integer**
   - Uses **LEB128 encoding** for the integer part
   - The scale is **not explicitly stored** - it's determined by the type declaration

3. **Example** (§2.1.9.3):
   - A `decimal[2]` value of 123.45 is encoded as:
     - Significand: 12345 (scaled by 10²)
     - Encoded as LEB128 signed integer

The specification emphasizes: "Decimal values **MUST be encoded as scaled integers** using the declared precision" (§2.1.9.3).

## Key Normative Rules

1. **No normalization** is performed - values are encoded exactly as provided (§2.1.9.8)
2. **Canonical form** must be preserved - no reordering or transformation (§2.1.9.8)
3. **Platform independence** - encoding must be identical across all platforms (§2.1.9.1)
4. **Deterministic** - same value always produces same binary representation (§2.1.9.1)

The encoding is designed to be "**compact, deterministic, and platform-independent**" while preserving exact decimal semantics without floating-point rounding errors (§2.1.9.3).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 549
- tokens_total: 578
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 18.4
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_14_naive.md
