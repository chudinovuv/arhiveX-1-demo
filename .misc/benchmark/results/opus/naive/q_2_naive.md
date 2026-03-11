# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the E.L.I.A. specification, I cannot find any information about binary encoding rules for primitive types or an inline threshold.

The specification only covers binary encoding rules for **Block Types** in §2.2.4, which states that:

- All block values **MUST be serialized using the Envelope model** defined in ANNEX B — Type Metadata Envelope (§2.2.4)
- The Envelope **MUST encode** the CATEGORY = Block, concrete TYPE_CODE, applicable FORMAT_FLAGS, and declared block length (§2.2.4)
- Block payload bytes **MUST follow immediately after the Envelope** without padding or platform-dependent headers (§2.2.4)

However, the provided specification sections (2.2 Blocks and 2.3 Stream Types) do not contain:
- Binary encoding rules for primitive types
- Any mention of an "inline threshold"
- Information about primitive type serialization

The specification does reference that exact type codes, physical sizes, and encoding rules are "normatively defined in **ANNEX A — Type Registry**" (§2.2.1.4.3, §2.3.1.3, etc.), but ANNEX A is not included in the provided content.

To answer your question about primitive type binary encoding and inline thresholds, I would need access to the primitive types section (likely §2.1) and ANNEX A — Type Registry, which are not present in the provided specification excerpts.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 339
- tokens_total: 369
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.9
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_2_naive.md
