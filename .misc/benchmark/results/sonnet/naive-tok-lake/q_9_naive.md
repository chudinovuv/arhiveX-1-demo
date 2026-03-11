# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on §2.1.9.10 Performance Implications, E.L.I.A. defines a performance optimization guideline that distinguishes between inline and external primitives based on a 48-bit threshold:

## Inline Primitives (≤ 48 bits) - §2.1.9.10.1

**Optimization approach:** These primitives should be **embedded directly within the envelope structure** rather than stored as separate payload sections.

**Rationale:** For small primitives, the overhead of payload indirection exceeds the benefits of separation, making direct embedding more efficient.

## External Primitives (> 48 bits) - §2.1.9.10.2  

**Optimization approach:** These primitives should be stored as **separate payload sections** referenced by the envelope.

**Rationale:** Larger primitives benefit from payload separation to avoid envelope bloat and enable more efficient memory management.

## Normative Recommendation - §2.1.9.10.3

The specification provides a **normative recommendation** for this optimization guideline, meaning implementations should follow this 48-bit threshold rule to ensure consistent performance characteristics across different E.L.I.A. runtimes and platforms.

This optimization is particularly important because it affects:
- Memory layout efficiency
- Serialization/deserialization performance  
- Cache locality
- Overall runtime performance predictability

The 48-bit boundary appears to be chosen as an optimal balance point where the cost of indirection becomes worthwhile for larger primitive values.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 341
- tokens_total: 370
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 9.5
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_9_naive.md
