# q_6 — A-006 — How does E.L.I.A. encode boolean values at the binary level, and what are the normative constraints?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification provided, I cannot find any information about how boolean values are encoded at the binary level or their normative constraints.

The specification sections provided focus exclusively on:
- **Block Types** (§2.2) - covering opaque blocks and structural blocks
- **Stream Types** (§2.3) - covering stream carriers, RAW string/binary classes, and structural streams

Boolean values would typically be classified as primitive types, but the primitive types section is not included in the provided specification content. The specification does reference that binary encoding rules are defined in **ANNEX A — Type Registry** and **ANNEX B — Type Metadata Envelope** (as mentioned in §2.2.4), but these annexes are not provided.

To answer your question about boolean encoding and normative constraints, I would need access to:
1. The primitive types section (likely §2.1)
2. **ANNEX A — Type Registry** 
3. **ANNEX B — Type Metadata Envelope**

These sections would contain the normative definitions for boolean type codes, physical size, value representation, and binary encoding rules.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 257
- tokens_total: 288
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 5.8
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_6_naive.md
