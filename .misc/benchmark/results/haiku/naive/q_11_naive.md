# q_11 — B-001 — What specific integer types does the E.L.I.A. Integral class define and what are their bit widths?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on my review of the provided E.L.I.A. specification content, I cannot find any section that defines the specific integer types or their bit widths for the Integral class.

The specification sections provided (§2.2 Blocks and §2.3 Stream Types) do not contain information about integral/integer types. While there are references to:

- A 26-bit length constraint for blocks (§2.2.0.2)
- Fixed-size big-endian and little-endian binary blocks (`beN` and `leN` types) in the opaque blocks class (§2.2.1)
- Integer literals in AST grammar (§2.2.1.4.2)

None of these sections actually define the specific integer types or their bit widths that would be part of an Integral class.

The integral types would likely be defined in the primitive types section (which appears to be §2.1 based on the string type hierarchy reference in §2.2.0.4), but that section is not included in the provided specification content.

To answer your question about specific integer types and their bit widths, I would need access to the section that defines primitive types, particularly the Integral class specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 275
- tokens_total: 306
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 6.5
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_11_naive.md
