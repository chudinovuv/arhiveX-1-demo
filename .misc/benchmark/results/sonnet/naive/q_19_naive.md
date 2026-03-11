# q_19 — B-009 — What are the derived type compatibility rules for Record and Array in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
I cannot find information about derived type compatibility rules for Record and Array in the provided specification content. 

The specification mentions that:

- Records are **derived types** that are **block-materialized by default** and **MUST NOT exceed** the 2^26-1 byte limit (§2.2.2)
- Arrays are **derived types** and are **block-materialized by default** with auto-promotion to Stream representation when size limits are exceeded (§2.2.2, §2.3.4)

However, the detailed normative constraints, declaration rules, and syntax for both records and arrays are explicitly referenced as being specified in **Section 2.5 Derived Types**, which is not included in the provided specification content.

The specification states:
- For records: "Detailed normative constraints, declaration rules, and syntax for record as derived structural types are specified in Section 2.5 Derived Types — Record" (§2.2.2)
- For arrays: "Detailed normative constraints, declaration rules, and syntax for arrays as derived structural types are specified in Section 2.5 Derived Types — Array/Derived Array" (§2.2.2)

To answer your question about derived type compatibility rules, I would need access to Section 2.5 of the specification, which contains the authoritative definitions for these derived types.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 302
- tokens_total: 328
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 6.6
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_19_naive.md
