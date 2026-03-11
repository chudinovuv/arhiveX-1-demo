# q_15 — B-005 — How are temporal (Date/Time) values encoded at the binary level in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification content, temporal (Date/Time) values and their binary encoding are **not covered** in the sections provided.

The specification sections I have access to focus on:
- Block Types (§2.2) - including opaque blocks and structural blocks
- Stream Types (§2.3) - including stream carriers, RAW string/binary, and structural streams
- Binary encoding rules for Block Types (§2.2.4)

However, temporal/date-time types would likely be covered in other sections of the specification that are not included in the provided content, such as:
- Primitive types (referenced as §2.1 but not provided)
- The Type Registry (referenced as **ANNEX A** in §2.2.4 and throughout)
- Type Metadata Envelope (referenced as **ANNEX B**)

The specification does reference that exact "type code," "physical size," "value range," and "measurement or counting semantics" for all type classes are "normatively defined in **ANNEX A — Type Registry**" (§2.2.1, §2.3.1, §2.3.2, §2.3.3), which would be where temporal type encoding would be specified.

To get information about temporal value binary encoding in E.L.I.A., you would need to consult the sections on primitive types and the Type Registry annex, which are not included in the provided specification content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 331
- tokens_total: 360
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.9
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_15_naive.md
