# q_14 — B-004 — What is the canonical binary encoding for floating-point and decimal values in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find any information about the canonical binary encoding for floating-point and decimal values.

The specification sections provided (§2.2 Blocks and §2.3 Stream Types) focus on:

- Block types for opaque or structurally fixed data payloads (§2.2.0.1)
- Stream types for sequential, potentially unbounded data carriers (§2.3.0.1)
- Binary encoding rules for Block Types generally (§2.2.4)

However, the specification does not contain:
- Definitions of floating-point or decimal primitive types
- Their specific binary encoding formats
- IEEE 754 compliance requirements
- Endianness specifications for numeric types

The binary encoding rules in §2.2.4 only specify that "All block values **MUST be serialized using the Envelope model**" and that canonical byte order rules apply to `beN` (big-endian) and `leN` (little-endian) blocks, but these appear to be for fixed-size binary blocks rather than floating-point numbers.

The specification notes that exact type codes, physical sizes, and encoding semantics are "normatively defined in **ANNEX A — Type Registry**" (§2.2.1.4.3), which is not included in the provided content.

To answer your question about floating-point and decimal binary encoding, I would need access to the primitive types section and ANNEX A of the specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 338
- tokens_total: 366
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 9.2
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_14_naive.md
