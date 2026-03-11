# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find any information about binary encoding rules for primitive types or an inline threshold.

The specification only covers **binary encoding rules for Block Types** in §2.2.4, which states that:

- All block values **MUST be serialized using the Envelope model** defined in **ANNEX B — Type Metadata Envelope** (§2.2.4)
- The Envelope **MUST encode** CATEGORY = Block, the concrete TYPE_CODE, applicable FORMAT_FLAGS, and the declared or effective block length (§2.2.4)
- Block payload bytes **MUST follow immediately after the Envelope** without padding or platform-dependent headers (§2.2.4)

However, the specification explicitly notes that it "intentionally does not exhaustively specify serialization mechanics, security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry**" (§2.2, §2.3).

The sections covering primitive types are not included in the provided specification content, and no "inline threshold" concept is mentioned anywhere in the available text. To get the complete binary encoding rules for primitive types and information about any inline threshold, you would need to consult the missing sections of the specification, particularly the primitive types section and the referenced annexes.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 314
- tokens_total: 344
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 9.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_2_naive.md
