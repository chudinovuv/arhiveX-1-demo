# q_19 — B-009 — What are the derived type compatibility rules for Record and Array in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find detailed derived type compatibility rules specifically for Record and Array types. 

The specification mentions that both Record and Array are **derived types** that belong to the **Structural block class** (§2.2.2), but the detailed normative constraints, declaration rules, and syntax for these derived types are referenced to sections that are not included in the provided content:

- For **Record**: "Detailed normative constraints, declaration rules, and syntax for record as derived structural types are specified in Section 2.5 Derived Types — Record" (§2.2.2.A.1)

- For **Array**: "Detailed normative constraints, declaration rules, and syntax for arrays as derived structural types are specified in Section 2.5 Derived Types — Array/Derived Array" (§2.2.2.A.2)

The provided specification only covers sections 2.2 (Blocks) and 2.3 (Stream Types), but the detailed derived type compatibility rules would be found in **Section 2.5 — Derived Types**, which is not included in this excerpt.

What I can tell you from the available content is that both Record and Array:

1. Are **derived types** that are **block-materialized by default** (§2.2.2.A.1, §2.2.2.A.2)
2. **Must be immutable** after construction with no in-place mutation permitted (§2.2.2.0.2.1)
3. **Must not introduce behavior, execution semantics, or control flow** (§2.2.2.0.2.2)
4. Have **field layout, ordering, and typing that must be explicitly declared and serialize canonically** (§2.2.2.0.2.3)

For the complete derived type compatibility rules, you would need to consult Section 2.5 of the full specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 440
- tokens_total: 466
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.3
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_19_naive.md
