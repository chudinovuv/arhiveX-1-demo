# q_19 — B-009 — What are the derived type compatibility rules for Record and Array in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot provide the specific derived type compatibility rules for Record and Array because the detailed normative constraints, declaration rules, and syntax for these derived types are not included in the current content.

The specification repeatedly references that these details are covered in other sections:

- For **Record**: §2.2.2 mentions that "Detailed normative constraints, declaration rules, and syntax for record as derived structural types are specified in Section 2.5 Derived Types — Record and should be consulted in conjunction with this section."

- For **Array**: §2.2.2 and §2.3.4 state that "Detailed normative constraints, declaration rules, and syntax for arrays as derived structural types are specified in Section 2.5 Derived Types — Array/Derived Array and should be consulted in conjunction with this section."

What I can tell you from the current specification is:

1. **Records are non-scalable by design** (§2.2.0.2) and "MUST NOT transition to Stream representation" and "MUST NOT exceed 2^26 − 1 bytes"

2. **Arrays are derived types** that are "block-materialized by default" (§2.2.2) but can transition to Stream representation under certain conditions (§2.3.4)

3. Both Record and Array belong to the **Structural block class** (§2.2.2) and "MUST be immutable after construction" with "no in-place mutation permitted" (§2.2.2.0.2)

To get the complete derived type compatibility rules, you would need access to **Section 2.5 Derived Types**, which is not included in the provided specification content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 393
- tokens_total: 419
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.5
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_19_naive.md
