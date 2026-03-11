# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the performance optimization guideline for inline vs external primitives is defined in **§2.1.9.10** and consists of the following:

## Performance Characteristics

**§2.1.9.10.1 Inline primitives (≤ 48 bits)**:
- Inline packing **eliminates indirection and pointer chasing**
- Enables **cache-line friendly data structures**
- Supports **branchless comparison and arithmetic**
- No allocation overhead

**§2.1.9.10.2 External primitives (> 48 bits)**:
- Single indirection to external storage
- Maintains **deterministic access patterns**
- Preserves value semantics despite physical separation

## Optimization Guideline (§2.1.9.10.3)

The normative recommendation states:

> **"Compilers and runtime implementations SHOULD optimize layout and access patterns based on the inline/external distinction, but MUST NOT expose this distinction through observable behavior or semantic differences."**

This means:
1. Implementations are encouraged to leverage the performance benefits of inline primitives
2. The optimization must be completely transparent - the semantic behavior must be identical regardless of whether a primitive is stored inline or externally
3. No observable differences in behavior, timing, or results should occur based on the storage strategy

The 48-bit threshold is the dividing line where primitives transition from inline to external storage, chosen to optimize for common primitive sizes while maintaining efficient memory layout.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 344
- tokens_total: 373
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 13.3
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_9_naive.md
