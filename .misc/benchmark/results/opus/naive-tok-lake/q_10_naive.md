# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the explicit conversion rules between non-numeric primitive types:

## Explicit Conversion Rules for Non-Numeric Primitives (§2.1.10.2.3)

### Boolean Conversions:
- **From `bool`**: Can convert to `string` only
- **To `bool`**: No conversions allowed from other types

### Character Conversions:
- **From `char`**: Can convert to `string` only
- **To `char`**: Can convert from `string` (must be single character)

### String Conversions:
- **From `fixed string[N]`**: Can convert to:
  - `string` (unbounded)
  - `char` (if N=1)
- **To `fixed string[N]`**: Can convert from:
  - `string` (must fit in N bytes)
  - `char` (if N=1)

### Date/Time Conversions:
- **From `date`**: Can convert to `datetime` or `string`
- **From `datetime`**: Can convert to `date` (truncates time) or `string`
- **From `time`**: Can convert to `string` only
- **To temporal types from `string`**: Requires valid ISO 8601 format

### Identifier Conversions:
- **From `guid`**: Can convert to `string` only
- **From `riid`**: Can convert to `string` only
- **To identifiers**: No conversions allowed from other types

### Enum Conversions:
- **From `enum`**: Can convert to `string` (label) or underlying integral type
- **To `enum`**: Can convert from integral types (must be valid value)

## Important Constraints (§2.1.10.2.3):

1. **All conversions must be explicit** - no implicit coercion between these types
2. **String conversions preserve exact representation** - no normalization
3. **Failed conversions must generate compile-time or runtime errors**
4. **Conversion between unrelated types (e.g., `bool` to `date`) is forbidden**
5. **The `non-value` type cannot be converted to or from any other type**

## String Type Hierarchy Note (§2.2.0.4):
The specification distinguishes between three string representations that **MUST NOT be conflated**:
- `fixed string[N]` (primitive, §2.1.8)
- `string[N]` (bounded opaque block)
- `string` (unbounded, can auto-promote to stream)

Explicit conversion **MUST** be used when moving between these string tiers - implicit coercion is forbidden.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 631
- tokens_total: 659
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 18.2
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_10_naive.md
