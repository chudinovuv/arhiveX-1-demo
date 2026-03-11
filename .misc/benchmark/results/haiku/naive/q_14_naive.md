# q_14 — B-004 — What is the canonical binary encoding for floating-point and decimal values in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find any information about the canonical binary encoding for floating-point and decimal values. 

The specification sections provided (§2.2 Blocks and §2.3 Stream Types) focus on:

- Block types for opaque or structurally fixed data payloads (§2.2)
- Stream types for sequential, potentially unbounded data carriers (§2.3)
- Binary encoding rules for Block Types in general (§2.2.4)

However, these sections do not contain specific information about floating-point or decimal value encoding formats, precision requirements, byte order, or standardization references (such as IEEE 754 for floating-point numbers).

The specification mentions that detailed type codes, physical sizes, value ranges, and encoding semantics are defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope** (referenced in §2.2.1.4.3, §2.3.1.3, and other sections), but these annexes are not included in the provided content.

To answer your question about floating-point and decimal binary encoding, I would need access to the primitive types section (likely §2.1) and the referenced annexes that contain the normative encoding specifications.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 290
- tokens_total: 318
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_14_naive.md
