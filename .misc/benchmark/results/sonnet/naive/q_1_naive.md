# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the fixed string type is a **primitive type** with specific capacity and serialization characteristics.

## Fixed String Type Definition

According to §2.2.0.4 (String Type Hierarchy), `fixed string[N]` is a **primitive type** where:

- **Capacity constraint**: 1 ≤ N < 1024 bytes (§2.2.0.4)
- **Size semantics**: The capacity N is **declared at definition time** and cannot be changed (§2.2.0.4)
- **Category**: Classified as a primitive type, not a block type (§2.2.0.4)

## Capacity Constraint Mechanism

The capacity constraint for `fixed string[N]` works as follows:

1. **Fixed at declaration**: The size N is "declared at definition time" and represents a fixed capacity (§2.2.0.4)

2. **No auto-scaling**: The specification explicitly states "**No** — size is fixed at declaration" for auto-scaling behavior (§2.2.0.4)

3. **Upper bound**: The maximum capacity is strictly less than 1024 bytes (§2.2.0.4)

4. **Lower bound**: The minimum capacity is 1 byte (§2.2.0.4)

## Serialization Characteristics

The fixed string type has unique serialization properties:

- **Serialization format**: "Exactly N bytes, zero-filled" (§2.2.0.4)
- **Encoding**: UTF-8 with zero-padding (§2.2.0.4)  
- **Length prefix**: No length prefix is used (§2.2.0.4)
- **Fixed layout**: Suitable for "fixed-layout records and protocol headers" (§2.2.0.4)

## Distinction from Other String Types

The specification emphasizes that `fixed string[N]` is distinct from other string types:

- Unlike `string[N]` (opaque block type) which uses length-prefixed, variable serialization
- Unlike `string` (unbounded) which can auto-promote to Stream type
- **Explicit conversion required**: "Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**" (§2.2.0.4)

The fixed string type is designed for scenarios requiring predictable, fixed-size textual data with deterministic memory layout and serialization behavior.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 595
- tokens_total: 623
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 13.4
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_1_naive.md
