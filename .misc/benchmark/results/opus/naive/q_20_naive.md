# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find explicit sections that comprehensively define "semantic type compatibility" rules. However, the specification does establish several normative constraints that relate to type compatibility and semantic boundaries:

## Block-Stream Type Boundaries

The specification establishes strict rules governing when types can transition between block and stream representations:

**Auto-promotion Block→Stream** (§2.2.0.2): Block types must transition to stream representation when:
- Size exceeds 2^26-1 bytes
- Binding to data interface over stream
- Unbounded cardinality into collection/dictionary
- Declaration is not sealed with block statement

**Auto-promotion Stream→Block** (§2.2.0.2): Only possible for block-materialized by design types with full materialization bounded, explicit policy resolution, and security context preservation.

## Type Category Constraints

**Block Types** (§2.2.0.2): Must belong to a block class that explicitly defines permitted processing models, admissible operations, canonical serialization rules, and physical size constraints.

**Stream Types** (§2.3.0.2): Must be consumed sequentially, governed by data interfaces, and must not expose random access or mutation semantics.

## String Type Hierarchy Compatibility

The specification defines strict non-conflation rules for string types (§2.2.0.4):

- `fixed string[N]` (primitive): fixed capacity, no auto-scaling
- `string[N]` (opaque block): bounded capacity, no stream promotion
- `string` (unbounded): auto-promotes to Stream when exceeding block limits

**Explicit conversion must be used** when moving values between string tiers, as implicit coercion is forbidden.

## Structural Type Constraints

**Structural containers** (§2.2.2.0.2) must:
- Be immutable after construction
- Not introduce behavior or execution semantics
- Enforce declared key and value types
- Serialize canonically with deterministic field resolution

## Semantic Data Binding Rules

**Stream carriers** (§2.3.1.4) must evaluate the `IS_STRUCTURED` flag to determine compatibility:
- If `IS_STRUCTURED = 1`: May generate structured access methods
- If `IS_STRUCTURED = 0`: Must expose only raw sequential access

However, the specification notes that comprehensive semantic type compatibility rules, serialization mechanics, and cross-border transfer semantics are defined in **ANNEX A — Type Registry** and **ANNEX B — Type Metadata Envelope**, which are not included in the provided content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 23
- tokens_out: 586
- tokens_total: 609
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 15.9
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_20_naive.md
