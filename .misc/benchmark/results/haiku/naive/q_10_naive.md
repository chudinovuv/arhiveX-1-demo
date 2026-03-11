# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the E.L.I.A. specification, I cannot find explicit conversion rules between non-numeric primitive types in the provided sections.

The specification does address some conversion constraints, but not comprehensive rules:

## String Type Conversions

According to §2.2.0.4, explicit conversion **MUST** be used when moving values between the three string tiers:
- `fixed string[N]` (primitive type)
- `string[N]` (opaque block type) 
- `string` (unbounded block/stream type)

The specification explicitly states that "Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**" (§2.2.0.4).

## Stream to Block Conversions

For stream types, the specification indicates:
- RAW String to bounded `string` conversion "**MUST be explicit** and **MUST enforce size limits and encoding validity**" (§2.3.2.3.1)
- RAW Binary to bounded block conversion "**MUST be explicit** and **MUST enforce size limits, integrity checks, and declared encoding constraints**" (§2.3.3.3)

## Missing Coverage

The provided sections focus on:
- Block types (§2.2)
- Stream types (§2.3) 
- Some string type hierarchy rules (§2.2.0.4)

However, they do not contain:
- Primitive type definitions or conversion rules
- Explicit conversion syntax or semantics between non-numeric primitives
- Comprehensive type coercion rules

The explicit conversion rules for non-numeric primitive types would likely be found in Section 2.1 (which covers primitive types) or other sections not included in the provided specification content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 404
- tokens_total: 431
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 10.0
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_10_naive.md
