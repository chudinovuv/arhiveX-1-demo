# q_19 — B-009 — What are the derived type compatibility rules for Record and Array in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the derived type compatibility rules for Record and Array:

## Record Compatibility Rules (§2.1.10.4.1)

**Structural Compatibility:**
- Records are compatible if they have **identical field names, types, and declaration order**
- Field-by-field assignment is permitted only between structurally identical records
- **No implicit conversion** between records with different schemas

**Assignment Rules:**
- Direct assignment requires **exact structural match**
- **No coercion or adaptation** is permitted between different record types
- Each record type maintains its own distinct identity

## Array and Typed Array Compatibility Rules (§2.1.10.4.2)

**Element Type Compatibility:**
- Arrays are compatible if their **element types are assignment-compatible**
- Standard primitive compatibility rules apply to array elements
- Array dimensions and bounds must be **structurally equivalent**

**Assignment Rules:**
- **Direct assignment** permitted between arrays of compatible element types
- **Explicit conversion required** for non-compatible element types
- Array bounds and dimensionality must match exactly

**Size Transition Behavior:**
- Arrays automatically promote from **Block to Stream** representation when exceeding the **2^26-1 byte limit** (§2.2.0.2, §2.3.4.0.2)
- This promotion **preserves schema identity and element type constraints**
- The `SIZE_LIMITED_26BIT` flag is cleared during promotion

## Cross-Type Compatibility (§2.1.10.4)

**Record ↔ Array:**
- **No implicit conversion** between records and arrays
- **Explicit conversion required** for any cross-type assignment
- Each maintains distinct structural semantics

## Normative Enforcement (§2.1.10.6)

Both record and array compatibility is **enforced at compile-time** with the following requirements:
1. **Structural validation** must occur before assignment
2. **Type safety** is guaranteed through static analysis
3. **Runtime type checks** supplement compile-time validation
4. **Cross-reference validation** ensures referential integrity

These rules ensure that derived types maintain their semantic contracts while providing controlled interoperability where structurally appropriate.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 508
- tokens_total: 535
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 14.1
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_19_naive.md
