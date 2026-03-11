# q_6 — A-006 — How does E.L.I.A. encode boolean values at the binary level, and what are the normative constraints?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification, **boolean values and their binary encoding are not covered in the sections provided**.

The specification sections you've shared focus on:
- **Block Types** (§2.2) - covering opaque blocks, structural blocks, and binary encoding rules for block types
- **Stream Types** (§2.3) - covering stream carriers, RAW string/binary classes, and structural streams

However, boolean values would typically be classified as **primitive types**, which are referenced but not detailed in these sections. The specification mentions in §2.2.0.4 that `fixed string[N]` is a "primitive type (§2.1.8)", indicating that primitive types are covered in Section 2.1, which is not included in the provided content.

The binary encoding rules in §2.2.4 specifically address "Binary Encoding Rules for **Block Types**" and state that "All block values **MUST be serialized using the Envelope model**" (§2.2.4), but this would not apply to primitive boolean values.

To answer your question about boolean binary encoding and normative constraints, I would need access to:
- Section 2.1 (Primitive Types)
- ANNEX A (Type Registry) 
- ANNEX B (Type Metadata Envelope)

These sections are referenced throughout the provided specification but are not included in the content you've shared.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 321
- tokens_total: 352
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.3
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_6_naive.md
