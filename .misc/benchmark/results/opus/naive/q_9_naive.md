# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my review of the provided E.L.I.A. specification sections, there are no explicit performance optimization guidelines for inline vs external primitives discussed in the content provided.

The specification does include some performance-related information in §2.2.4.2 (Performance Implications), but this section focuses specifically on Block Types performance characteristics, not primitive type optimization strategies. It discusses:

- Block values being "single-allocation artefacts" with no element-level allocation or traversal required
- Efficient equality, hashing, encryption, and transport operations over contiguous memory regions
- Zero-copy transport capabilities where permitted by the runtime
- Comparison of Block Types to structural containers in terms of allocation count, schema traversal, and cache locality

However, the provided sections do not contain information about:
- Inline vs external primitive storage strategies
- Performance guidelines for primitive type placement
- Optimization recommendations for primitive vs derived type usage

It's possible this information exists in other sections of the E.L.I.A. specification that were not included in the provided content, such as sections on primitive types (which would likely be in §2.1) or implementation guidelines that may appear in other parts of the specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 262
- tokens_total: 290
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.8
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_9_naive.md
