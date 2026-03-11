# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the **fixed string type** is a primitive type with specific capacity and serialization constraints.

## Definition and Classification

The `fixed string[N]` type is defined as a **primitive type** (§2.1.8, §2.2.0.4) with the following characteristics:

- **Category**: Primitive (not a block type)
- **Capacity**: Declared at definition time with `1 ≤ N < 1024 bytes` (§2.2.0.4)
- **Encoding**: UTF-8 with zero-padding (§2.2.0.4)

## Capacity Constraint Mechanism

The capacity constraint works as follows:

1. **Fixed Size Declaration**: The capacity `N` must be specified at type declaration and cannot be changed (§2.2.0.4)

2. **Size Limits**: The constraint `1 ≤ N < 1024 bytes` is enforced, meaning:
   - Minimum: 1 byte
   - Maximum: 1023 bytes (§2.2.0.4)

3. **Serialization Behavior**: 
   - Always serialized as exactly `N` bytes (§2.2.0.4)
   - UTF-8 encoded content with zero-padding to fill the declared size
   - No length prefix (unlike variable-length strings) (§2.2.0.4)

4. **No Auto-scaling**: Fixed strings have "**No** — size is fixed at declaration" for auto-scaling behavior (§2.2.0.4)

## Distinction from Other String Types

The specification establishes three distinct string representations (§2.2.0.4):

| Type | Category | Max size | Serialization | Auto-scale |
|------|----------|----------|---------------|------------|
| `fixed string[N]` | Primitive | 1 ≤ N < 1024 bytes | Exactly N bytes, zero-filled | **No** — size is fixed |
| `string[N]` | Opaque block | N ≤ 2^26 − 1 bytes | Length-prefixed, variable | **No** — bounded by N |
| `string` (unbounded) | Block/Stream | Up to 2^26 − 1 as block | Length-prefixed, variable | **Yes** — auto-promotes to Stream |

## Usage Context

Fixed strings are "suitable for fixed-layout records and protocol headers" (§2.2.0.4), making them ideal for:
- Binary protocol fields with fixed positions
- Database columns with fixed width requirements  
- Network packet headers where exact byte alignment is required

The capacity constraint ensures predictable memory layout and serialization size, which is essential for these use cases where exact byte positioning and alignment are critical.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 658
- tokens_total: 687
- cache_read: 0
- cache_creation: 32176
- wall_time_sec: 15.9
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_1_naive.md
