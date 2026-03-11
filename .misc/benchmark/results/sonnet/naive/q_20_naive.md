# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find explicit normative rules that comprehensively govern semantic type compatibility. The specification sections provided focus on Block Types (§2.2) and Stream Types (§2.3), but do not contain dedicated sections on type compatibility rules.

However, I can identify several relevant normative constraints that relate to type compatibility:

## String Type Compatibility Rules

The specification establishes strict separation between string representations in §2.2.0.4:

- **Explicit conversion required**: "Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**" (§2.2.0.4)

This indicates that semantic type compatibility between different string types is explicitly prohibited - they are treated as incompatible types requiring explicit conversion.

## Block-Stream Type Boundaries

The specification defines auto-promotion rules that affect type compatibility:

- **Auto-promotion conditions**: Block types can auto-promote to Stream types under specific conditions, including size limits (§2.2.0.2, normative property 5)
- **Promotion restrictions**: Records "**MUST NOT** transition to Stream representation" and must generate errors if exceeding size limits (§2.2.0.2, normative property 7)

## Type Identity Preservation

For structural streams:
- "A structural stream **MUST preserve the schema identity** (`TYPE_HASH`) and declared element/key/value types of the underlying derived type after Block→Stream promotion" (§2.3.4.0.2)

## Missing Coverage

The provided specification sections do not contain:
- General type compatibility matrices
- Coercion rules between primitive types
- Interface compatibility rules
- Subtyping relationships
- Generic type parameter compatibility

**Note**: The specification references "**ANNEX A — Type Registry**" and "**ANNEX B — Type Metadata Envelope**" multiple times, which likely contain the comprehensive type compatibility rules, but these annexes are not included in the provided content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 23
- tokens_out: 473
- tokens_total: 496
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 11.1
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_20_naive.md
