# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my analysis of the provided E.L.I.A. specification, I cannot find specific information about how integer values are encoded in binary according to E.L.I.A. encoding rules.

The specification sections provided focus on:
- Block types (§2.2) and their encoding rules (§2.2.4)
- Stream types (§2.3) and their classes
- Opaque blocks, structural blocks, and stream carriers

While §2.2.4 establishes **Binary Encoding Rules for Block Types**, it primarily addresses:
- Envelope-based serialization requirements (§2.2.4)
- Endianness rules for `beN` (big-endian) and `leN` (little-endian) binary blocks (§2.2.4)
- UTF-8 encoding for textual blocks (§2.2.4)

However, integer types appear to be classified as **primitive types** rather than block types, and the primitive types section is not included in the provided specification content. The specification references that exact type codes, physical sizes, and encoding semantics are "normatively defined in **ANNEX A — Type Registry**" (§2.2.1.4.3, §2.3.1.3), but this annex is not provided.

To get the authoritative answer about integer encoding rules in E.L.I.A., you would need to consult:
1. The primitive types section (likely §2.1)
2. **ANNEX A — Type Registry** 
3. **ANNEX B — Type Metadata Envelope**

These sections would contain the normative definitions for integer type codes, binary representation, and encoding semantics.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 385
- tokens_total: 410
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.9
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_13_naive.md
