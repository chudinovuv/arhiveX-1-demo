# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification content, I cannot find any specific performance optimization guidelines for inline vs external primitives. The specification sections provided (§2.2 through §2.3.4) focus on Block Types and Stream Types, but do not contain information about primitive type performance optimization strategies or guidelines for choosing between inline and external primitive representations.

The specification does discuss some performance characteristics in §2.2.4.2 Performance Implications, but this section specifically addresses Block Types performance characteristics, not primitives:

- Block values are "single-allocation artefacts" with no element-level allocation
- They enable zero-copy transport and direct cryptographic processing
- Size limits prevent pathological memory pressure

However, these guidelines apply to Block Types rather than primitive types, and do not address the inline vs external primitive optimization question you're asking about.

To get accurate information about primitive performance optimization guidelines in E.L.I.A., you would need access to other sections of the specification that specifically cover primitive types and their performance characteristics.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 230
- tokens_total: 258
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.4
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_9_naive.md
