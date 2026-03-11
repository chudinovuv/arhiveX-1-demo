# q_14 — B-004 — What is the canonical binary encoding for floating-point and decimal values in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification, I cannot find any information about the canonical binary encoding for floating-point and decimal values.

The specification sections provided (§2.2 Blocks and §2.3 Stream Types) focus on:

- Block types for opaque or structurally fixed data payloads (§2.2)
- Stream types for sequential, potentially unbounded data carriers (§2.3)
- Binary encoding rules specifically for Block Types (§2.2.4)

However, floating-point and decimal values appear to be primitive types that would be covered in a different section of the specification (likely §2.1 Primitive Types, which is referenced in §2.2.0.4 but not included in the provided content).

The only encoding information available in the provided sections relates to:
- Block type envelope encoding (§2.2.4)
- Endianness for binary blocks (`beN` uses big-endian, `leN` uses little-endian per §2.2.4)
- UTF-8 encoding for string payloads (§2.2.4)
- Base64 encoding rules (§2.2.4)

To answer your question about floating-point and decimal binary encoding, I would need access to the primitive types section of the specification or the relevant annexes that define the canonical encoding rules for these numeric types.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 317
- tokens_total: 345
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.9
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_14_naive.md
