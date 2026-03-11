# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, there are strict compatibility rules for block types that generally **prohibit** direct assignment between different block types.

## Key Compatibility Constraints

### String Type Hierarchy Restrictions (§2.2.0.4)
The specification explicitly states that **implicit coercion between different string tiers is forbidden**:

- `fixed string[N]` (primitive type)
- `string[N]` (opaque block type) 
- `string` (unbounded block/stream type)

**Explicit conversion MUST be used** when moving values between these string tiers (§2.2.0.4).

### Opaque Block Type Restrictions (§2.2.1.2)
Opaque blocks have severe limitations on operations:

1. They **MUST NOT expose internal structure, iteration, slicing, or field-level access** beyond raw byte equality (§2.2.1.2, property 1)
2. They **MUST support only bitwise equality comparison and cryptographic hashing** - no ordering, arithmetic, or semantic comparison operations are permitted (§2.2.1.2, property 2)
3. **Endianness (`beN`, `leN`) MUST be explicitly declared** and **MUST NOT be inferred or reinterpreted implicitly** (§2.2.1.2, property 3)

### Structural Block Immutability (§2.2.2.0.2)
Structural containers have additional restrictions:
- They **MUST be immutable after construction** - no in-place mutation is permitted (§2.2.2.0.2, property 1)
- Field layout, ordering, and typing **MUST be explicitly declared** (§2.2.2.0.2, property 3)

## Block-to-Stream Auto-Promotion Rules

The specification does define automatic promotion scenarios, but these are **type re-qualification** rather than assignment compatibility:

### Auto-promotion Block→Stream (§2.2.0.2, property 5)
This occurs when:
- Size exceeds 2²⁶-1 bytes
- Binding to data interface over stream
- Unbounded cardinality into collection/dictionary
- Declaration is not sealed with block statement

### Conditional Stream→Block (§2.2.0.2, property 6)
Only possible for block-materialized by design types with:
- Full materialization bounded
- Explicit policy resolution
- Security context preservation

## Conclusion

Block types in E.L.I.A. have **very limited assignment compatibility**. Direct assignment between different block type classes is generally prohibited, requiring explicit conversion operations. The main exception is the automatic promotion/demotion between block and stream representations of the same underlying type when size or interface constraints are triggered, but this represents a change in materialization strategy rather than true type compatibility.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 658
- tokens_total: 689
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 17.9
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_18_naive.md
