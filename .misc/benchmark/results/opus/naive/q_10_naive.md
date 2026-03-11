# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification, I cannot find explicit conversion rules between non-numeric primitive types. The specification sections provided focus on Block Types (§2.2) and Stream Types (§2.3), but do not contain information about primitive types or their conversion rules.

However, the specification does mention some relevant constraints:

**String Type Conversions:**
According to §2.2.0.4, "Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**."

This indicates that:
- Conversions between different string types (`fixed string[N]`, `string[N]`, and unbounded `string`) require explicit conversion
- Implicit coercion between these string variants is prohibited

**General Conversion Principles:**
The specification emphasizes explicit conversions in several contexts:
- §2.3.2.3.1 states that "Any conversion from RAW String to bounded `string` **MUST be explicit**"
- §2.3.3.3 requires that "Any conversion from RAW Binary to a bounded block **MUST be explicit**"

To provide a complete answer about explicit conversion rules between non-numeric primitive types, I would need access to the sections of the specification that define primitive types (likely Section 2.1) and general type conversion rules, which are not included in the provided content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 334
- tokens_total: 361
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.7
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_10_naive.md
