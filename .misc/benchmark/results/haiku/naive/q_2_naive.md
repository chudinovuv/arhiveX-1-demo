# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find information about binary encoding rules for primitive types or an inline threshold.

The specification only covers **Binary Encoding Rules for Block Types** in §2.2.4, which defines encoding rules specifically for Block Types, not primitive types. According to §2.2.4, Block Types must be serialized using the Envelope model defined in ANNEX B, with specific rules for:

- CATEGORY = Block
- Concrete TYPE_CODE 
- FORMAT_FLAGS
- Block length encoding
- Canonical byte order for different block types

However, the specification does not include:
1. Binary encoding rules for primitive types
2. Any mention of an "inline threshold"
3. The referenced ANNEX A (Type Registry) or ANNEX B (Type Metadata Envelope) that would contain the detailed encoding specifications

The specification notes in §2.2.4 that "The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**", but these annexes are not included in the provided content.

To answer your question about primitive type encoding rules and inline thresholds, I would need access to the complete specification including the missing annexes and primitive type sections.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 311
- tokens_total: 341
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.4
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_2_naive.md
