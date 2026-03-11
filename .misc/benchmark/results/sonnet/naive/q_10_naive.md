# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification provided, I cannot find explicit conversion rules between non-numeric primitive types. The specification sections provided focus on Block Types (§2.2) and Stream Types (§2.3), but do not include the section on primitive types that would contain these conversion rules.

However, the specification does mention some relevant constraints regarding string type conversions in §2.2.0.4:

**String Type Hierarchy Conversion Rules:**
- Explicit conversion **MUST** be used when moving values between string tiers (§2.2.0.4)
- Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden** (§2.2.0.4)

**Stream to Block Conversion:**
- Any conversion from RAW String to bounded `string` **MUST be explicit** and **MUST enforce size limits and encoding validity** (§2.3.2.3.1)
- Any conversion from RAW Binary to a bounded block **MUST be explicit** and **MUST enforce size limits, integrity checks, and declared encoding constraints** (§2.3.3.3)

The specification indicates that primitive types would be covered in a different section (likely §2.1, which is referenced but not included in the provided content). The explicit conversion rules between non-numeric primitive types would be normatively defined in that missing section of the specification.

To get the complete answer about explicit conversion rules between non-numeric primitive types, you would need to consult §2.1 of the E.L.I.A. specification, which covers primitive types but was not included in the provided content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 373
- tokens_total: 400
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.4
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_10_naive.md
