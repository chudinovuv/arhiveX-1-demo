# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification, there are **no explicit performance optimization guidelines for inline vs external primitives** mentioned in the sections provided.

The specification does include some performance-related information, but it focuses on **Block Types** rather than primitive inlining strategies:

## Available Performance Guidance

**Block Types Performance Characteristics** (§2.2.4.2):
- Block values are "single-allocation artefacts" with no element-level allocation or traversal required
- They enable "zero-copy transport where permitted by the runtime"
- They provide "superior cache locality and predictable latency" compared to structural containers
- They minimize allocation count and avoid schema traversal

However, this guidance is specifically about Block Types vs structural containers (record, array), not about inline vs external primitive optimization strategies.

## Missing Information

The provided specification sections (§2.2 Blocks and §2.3 Stream Types) do not contain:
- Guidelines for when to inline primitives vs externalize them
- Performance trade-offs between different primitive placement strategies
- Compiler optimization hints for primitive handling
- Memory layout recommendations for primitive types

The performance optimization guidelines for inline vs external primitives would likely be found in other sections of the specification not included in this excerpt, such as sections covering primitive types (§2.1), compiler directives, or performance optimization annexes.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 306
- tokens_total: 334
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 9.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_9_naive.md
