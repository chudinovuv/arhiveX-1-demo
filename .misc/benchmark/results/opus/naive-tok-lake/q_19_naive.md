# q_19 — B-009 — What are the derived type compatibility rules for Record and Array in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the derived type compatibility rules for Record and Array:

## Record Compatibility Rules

According to §2.1.10.4.1:

1. **Records are invariant** - exact structural match required:
   - All fields must match by name, type, and order
   - No implicit conversions between different record types
   - No structural subtyping or duck typing

2. **Assignment compatibility**:
   - Only identical record types can be assigned
   - Field-by-field initialization is permitted if each field type is compatible

3. **Explicit conversion**:
   - Between records requires explicit cast with validation
   - Must validate all field mappings

## Array Compatibility Rules

According to §2.1.10.4.2:

1. **Arrays are invariant by element type**:
   - `array<T>` is only compatible with `array<T>`, not `array<U>` even if T→U is valid
   - No covariance or contravariance

2. **Fixed vs variable arrays**:
   - Fixed arrays `T[N]` are distinct from variable arrays `array<T>`
   - Conversion requires explicit operation

3. **Typed arrays**:
   - Typed arrays (§2.5.3) maintain element type invariance
   - Multi-dimensional arrays preserve rank and dimension sizes

## Key Normative Properties

From §2.2.2.0.2 (Structural block class properties):
- **Records are non-scalable by design** and MUST NOT transition to Stream representation
- Records MUST NOT exceed 2^26 - 1 bytes; exceeding generates an error
- Arrays default to block-materialized but MUST auto-promote to Stream when exceeding 2^26 - 1 bytes

From §2.5.0.2 (Derived type rules):
- All derived types are **nominally typed, not structurally typed**
- Type identity is determined by declaration, not structure
- Inline declarations create distinct anonymous types

This means Record and Array types in E.L.I.A. follow strict nominal typing with no implicit structural compatibility or variance.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 500
- tokens_total: 527
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 19.1
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_19_naive.md
