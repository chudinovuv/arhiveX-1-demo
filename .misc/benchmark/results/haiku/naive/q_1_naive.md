# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the `fixed string[N]` type is a **primitive type** with specific capacity constraints that distinguish it from other string representations.

## Type Classification and Capacity

According to §2.2.0.4 (String Type Hierarchy), `fixed string[N]` is categorized as a **primitive type** with a capacity constraint of `1 ≤ N < 1024 bytes`. This means:

- Minimum capacity: 1 byte
- Maximum capacity: 1023 bytes (less than 1024)
- The capacity `N` must be declared at definition time

## Key Characteristics

The specification in §2.2.0.4 establishes that `fixed string[N]`:

1. **Fixed-size serialization**: The serialized representation is always exactly N bytes (UTF-8, zero-padded)
2. **No length prefix**: Unlike other string types, it doesn't use a length prefix in serialization
3. **No auto-scaling**: The size is fixed at declaration and cannot be changed
4. **Zero-padding**: If the actual string content is shorter than N bytes, it's zero-padded to reach exactly N bytes

## How Capacity Constraint Works

The capacity constraint operates at the **declaration level**:

- The value `N` must be specified when declaring the type
- The constraint `1 ≤ N < 1024` is enforced at compile time
- Once declared, the capacity cannot be modified
- All instances of that `fixed string[N]` type will have exactly N bytes in their serialized form

## Distinction from Other String Types

Per §2.2.0.4, `fixed string[N]` is distinct from:
- `string[N]` (opaque block type with variable-length UTF-8 and length prefix)
- `string` (unbounded, block-materialized by default, can auto-promote to Stream)

The specification notes that **explicit conversion must be used** when moving values between these different string tiers, as **implicit coercion is forbidden**.

## Use Cases

According to §2.2.0.4, `fixed string[N]` is suitable for "fixed-layout records and protocol headers" where a predictable, fixed-size binary representation is required.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 524
- tokens_total: 552
- cache_read: 0
- cache_creation: 13400
- wall_time_sec: 12.0
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_1_naive.md
