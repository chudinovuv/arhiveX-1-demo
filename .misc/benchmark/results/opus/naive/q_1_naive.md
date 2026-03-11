# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the fixed string type is a **primitive type** that is part of the String Type Hierarchy (§2.2.0.4).

## Fixed String Type Definition

The fixed string type is declared as `fixed string[N]` where N represents the capacity constraint (§2.2.0.4).

## Capacity Constraint Mechanics

The capacity constraint for fixed strings works as follows:

1. **Fixed Size Constraint**: The capacity N is declared at definition time and must satisfy `1 ≤ N < 1024 bytes` (§2.2.0.4)

2. **Immutable Capacity**: The size is **fixed at declaration** and cannot be changed - there is **no auto-scaling** permitted (§2.2.0.4)

3. **Exact Serialization**: The serialized representation is **always exactly N bytes**, using UTF-8 encoding with zero-padding to fill the declared capacity (§2.2.0.4)

4. **No Length Prefix**: Unlike other string types, fixed strings have **no length prefix** in their serialization format (§2.2.0.4)

## Distinguishing Characteristics

The specification emphasizes that `fixed string[N]` is **normatively distinct** from other string types:

- **vs. `string[N]`** (opaque block): Fixed strings are primitives with exact N-byte serialization, while `string[N]` uses variable-length with length prefixes and can hold up to N bytes
- **vs. `string` (unbounded)**: Fixed strings cannot auto-scale and have a much smaller maximum size (1024 bytes vs 2^26-1 bytes for blocks)

## Intended Use Case

Fixed strings are described as "suitable for fixed-layout records and protocol headers" (§2.2.0.4), indicating they're designed for scenarios requiring predictable, exact-size text fields rather than variable-length content.

The specification also mandates that "explicit conversion **MUST** be used when moving values between string tiers" and that "implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**" (§2.2.0.4).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 516
- tokens_total: 544
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 12.9
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_1_naive.md
