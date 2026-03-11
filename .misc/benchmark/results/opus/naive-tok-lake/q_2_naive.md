# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the binary encoding rules for primitive types:

## Binary Encoding Rules for Primitives (§2.1.9)

### Core Encoding Principles (§2.1.9.1)
1. All primitive values **MUST be serialized using the Envelope model** defined in ANNEX B
2. The Envelope **MUST encode**:
   - CATEGORY = Primitive (00)
   - The concrete TYPE_CODE of the primitive
   - Applicable FORMAT_FLAGS (e.g., NULL_VALUE flag)
   - Value size and representation mode

### Inline Threshold (§2.1.9.10.1)
**Inline primitives are those ≤ 48 bits**

According to §2.1.9.10.1:
- **Inline primitives (≤ 48 bits)**: Value bytes are embedded directly within the Envelope itself
- This includes: `int8`, `int16`, `int32`, `uint8`, `uint16`, `uint32`, `float32`, `char`, `bool`
- These achieve **zero-copy deserialization** and minimal allocation overhead

### External Primitives (§2.1.9.10.2)
**External primitives are those > 48 bits**:
- `int64`, `uint64`, `float64`, `dec64`, `dec128`, `guid`, `datetime`, `duration`
- Value bytes follow immediately after the Envelope header
- Require one additional allocation per value

### Specific Encoding Rules

**Integer encoding (§2.1.9.2)**:
- Signed integers: two's complement representation
- Unsigned integers: direct binary representation
- Multi-byte integers: little-endian byte order

**Floating-point and decimal encoding (§2.1.9.3)**:
- `float32`/`float64`: IEEE 754 binary format
- `dec64`/`dec128`: IEEE 754-2008 decimal format

**Boolean encoding (§2.1.9.4)**:
- `false` = 0x00
- `true` = 0x01

**Temporal encoding (§2.1.9.5)**:
- `datetime`: 64-bit Unix timestamp (microseconds since epoch)
- `duration`: 64-bit signed microseconds

**Identifier encoding (§2.1.9.6)**:
- `guid`: 16 bytes, RFC 4122 binary format (canonical network order)

The specification emphasizes that this 48-bit threshold creates a natural optimization boundary where frequently-used small values can be handled with maximum efficiency.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 618
- tokens_total: 649
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 19.0
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_2_naive.md
