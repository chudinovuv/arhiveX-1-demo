# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification provided, I cannot find any specific information about how identifier values such as `guid` or `riid` are encoded in binary format.

The specification sections provided focus on:
- Block types (§2.2) including opaque blocks and structural blocks
- Stream types (§2.3) including stream carriers, RAW string, RAW binary, and structural streams
- Binary encoding rules for block types (§2.4)

However, none of these sections contain normative definitions for `guid` or `riid` identifier types, nor do they specify their binary encoding format.

The specification does reference that exact type codes, physical size, value range, and encoding semantics are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope** (referenced in §2.2.1.3, §2.3.1.3, and other sections), but these annexes are not included in the provided content.

To answer your question about how identifier values are encoded in binary, I would need access to:
- **ANNEX A — Type Registry** for the specific type definitions and codes
- **ANNEX B — Type Metadata Envelope** for encoding interpretation rules
- Potentially the primitive types section (§2.1) which is referenced but not provided

The current specification content does not contain sufficient information to determine the binary encoding format for `guid` or `riid` identifiers.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 329
- tokens_total: 357
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.1
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_16_naive.md
