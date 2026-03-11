# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, block type compatibility rules are defined in **§2.1.10.3 Block Type Compatibility**, though the detailed rules are not fully loaded in the provided content. However, I can extract the key principles from the available sections:

## General Block Type Compatibility Principles

From **§2.1.10.1 Fundamental Principles**, block types follow these core rules:

1. **No implicit conversion between block classes** - Different block type classes (opaque vs structural) cannot be implicitly converted to each other

2. **Explicit conversion required** - Block types must use explicit conversion when moving between different representations

## String Type Hierarchy Rules (§2.2.0.4)

The specification provides explicit compatibility rules for string types as an example:

1. **`fixed string[N]`** (primitive type) - capacity declared at definition time, exactly N bytes serialized
2. **`string[N]`** (opaque block type) - bounded by declared N up to 26-bit limit  
3. **`string`** (unbounded, block-materialized by default) - auto-promotes to Stream when exceeding block limits

**Explicit conversion MUST be used** when moving values between these string tiers. **Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is forbidden** (§2.2.0.4).

## Block-Specific Constraints (§2.2.0.2)

Block types have these normative properties affecting compatibility:

1. **26-bit length limit** - All block values must comply with 2^26 - 1 bytes maximum size
2. **Block class membership** - Each block type must belong to a specific block class with defined processing model
3. **Immutability** - Block types must be immutable after materialization (§2.2.1.2, property 7)

## Opaque vs Structural Block Compatibility

From **§2.2.1 Opaque blocks class** and **§2.2.2 Structural block class**:

- **Opaque blocks** (bytes, beN, leN, base64, string) are treated as atomic black boxes
- **Structural blocks** (record, array, dictionary, collection) expose explicit structure
- These represent fundamentally different semantic categories and would require explicit conversion

## Cross-Reference Note

The specification indicates that complete block type compatibility rules are defined in **§2.1.10.3 Block Type Compatibility**, but this section is not fully available in the loaded content. The available content suggests that block types generally **cannot be implicitly assigned to each other** and require **explicit conversion operations** when compatibility is semantically valid.

The emphasis throughout the specification is on **explicit, deterministic type handling** rather than permissive implicit conversions, which aligns with E.L.I.A.'s design principles of semantic explicitness and determinism by construction.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 669
- tokens_total: 701
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 17.4
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_18_naive.md
