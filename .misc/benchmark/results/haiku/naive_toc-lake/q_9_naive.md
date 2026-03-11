# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Performance Optimization Guideline: Inline vs External Primitives

According to **§2.1.9.10 — Performance Implications**, E.L.I.A. defines a normative recommendation that distinguishes between two categories of primitives based on their bit-width:

## Guideline Definition

**§2.1.9.10.1 — Inline primitives (≤ 48 bits)**
Primitives of 48 bits or smaller are classified as **inline primitives**. These are optimized for efficient encoding and should be handled as compact, single-allocation values suitable for high-throughput scenarios.

**§2.1.9.10.2 — External primitives (> 48 bits)**
Primitives exceeding 48 bits are classified as **external primitives**. These require multi-allocation handling or external reference strategies and have different performance characteristics.

## Normative Recommendation

**§2.1.9.10.3 — Optimization guideline (normative recommendation)**
The specification states there is a **"Optimization guideline (normative recommendation)"** at this section, but the specification document provided does not include the detailed text of this guideline itself—only the structural heading.

## Inference from Context

Based on the structural classification, the guideline appears intended to recommend:

1. **Inline primitives (≤48 bits)** should be preferred for performance-critical code paths due to their compact representation and single-allocation model.

2. **External primitives (>48 bits)** should be used where semantic correctness requires them, but with awareness that they may incur higher allocation and traversal costs.

This aligns with the broader design principle stated in **§2.1.9.10** that primitives are designed with **"predictable, low-overhead handling"** as a core objective.

---

**Note:** For the complete text of §2.1.9.10.3, consult the full specification document, as the guideline text itself is not reproduced in the provided extract.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 461
- tokens_total: 490
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 5.6
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_9_naive.md
