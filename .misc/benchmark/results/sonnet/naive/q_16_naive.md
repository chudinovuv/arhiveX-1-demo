# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification sections, I cannot find specific information about how identifier values (guid, riid) are encoded in binary format.

The specification sections provided cover:
- Block types (§2.2) including opaque blocks and structural blocks
- Stream types (§2.3) including stream carriers, RAW String, RAW Binary, and structural streams
- Binary encoding rules for block types (§2.4)

However, none of these sections specifically define `guid` or `riid` types or their binary encoding format.

The specification does reference that exact type codes, physical size, value range, and encoding semantics are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope** (as mentioned in §2.2.1.3, §2.3.1.3, and other sections), but these annexes are not included in the provided content.

To answer your question about guid and riid binary encoding, I would need access to:
- ANNEX A — Type Registry (for type codes and encoding rules)
- ANNEX B — Type Metadata Envelope (for interpretation rules)
- Or sections specifically covering primitive identifier types

The current specification sections do not contain the normative definitions for identifier type binary encoding.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 296
- tokens_total: 324
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_16_naive.md
