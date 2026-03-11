# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find explicit normative rules governing semantic type compatibility. The specification sections provided focus on Block Types (§2.2) and Stream Types (§2.3), but do not contain dedicated sections on type compatibility rules.

However, I can identify several normative constraints that relate to type compatibility from the available content:

## Block-Stream Type Boundaries

**Auto-promotion rules** (§2.2.0.2) establish that:
- Block types **MUST auto-promote to Stream** when size exceeds 2^26-1 bytes (§2.2.0.2, property 5)
- This promotion is a "re-qualification of type from block to stream types with losing all normative properties mandatory to block types" (§2.2.0.2, property 5)

## String Type Hierarchy Compatibility

**Explicit conversion requirements** (§2.2.0.4) mandate that:
- "Explicit conversion **MUST** be used when moving values between string tiers"
- "Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**" (§2.2.0.4, property 4)

## Structural Type Preservation

**Schema identity preservation** (§2.3.4.0.2) requires that:
- "A structural stream **MUST preserve the schema identity** (`TYPE_HASH`) and declared element/key/value types of the underlying derived type after Block→Stream promotion" (§2.3.4.0.2, property 1)

## Cross-References to Missing Sections

The specification references several sections that would likely contain comprehensive type compatibility rules:
- **ANNEX A — Type Registry** (referenced throughout)
- **ANNEX B — Type Metadata Envelope** (referenced throughout) 
- **Section 2.5 — Derived Types** (referenced in §2.2.2, §2.3.4)

The complete normative rules for semantic type compatibility appear to be defined in sections not included in the provided specification content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 23
- tokens_out: 481
- tokens_total: 504
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 10.9
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_20_naive.md
