# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find any specific information about how identifier values (guid, riid) are encoded in binary format.

The specification sections provided focus on:
- Block types (§2.2) including opaque blocks and structural blocks
- Stream types (§2.3) including stream carriers, RAW strings, RAW binary, and structural streams
- Binary encoding rules for block types (§2.2.4)

However, none of these sections contain specific details about `guid` or `riid` identifier types or their binary encoding format.

The specification does reference that exact type codes, physical sizes, value ranges, and encoding semantics are "normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**" (as mentioned in multiple sections like §2.2.1.3, §2.3.1.3, etc.), but these annexes are not included in the provided content.

To get the authoritative answer about guid and riid binary encoding, you would need to consult:
- **ANNEX A — Type Registry** for the specific type definitions
- **ANNEX B — Type Metadata Envelope** for encoding interpretation rules

The current specification sections do not contain sufficient information to answer your question about identifier binary encoding.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 297
- tokens_total: 325
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.2
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_16_naive.md
