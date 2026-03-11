# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification provided, I cannot find specific details about how integer values are encoded in binary. The specification sections I have access to focus on Block Types (§2.2) and Stream Types (§2.3), but do not contain information about primitive integer encoding rules.

The specification does mention in §2.2.4 that "All block values **MUST be serialized using the Envelope model** defined in **ANNEX B — Type Metadata Envelope**" and references canonical byte order rules for certain block types:

- `beN` blocks **MUST use big-endian** encoding (§2.2.4)
- `leN` blocks **MUST use little-endian** encoding (§2.2.4)

However, these refer specifically to binary block types (`beN` and `leN`), not to primitive integer values.

The specification also states that "The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**" (§2.2.1, §2.2.2, §2.3.1, §2.3.2, §2.3.3).

To get the specific binary encoding rules for integer values, you would need to consult:
- **ANNEX A — Type Registry** for the normative integer type definitions
- **ANNEX B — Type Metadata Envelope** for the encoding mechanics
- The primitive types section (likely §2.1, which is not included in the provided content)

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 376
- tokens_total: 401
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.0
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_13_naive.md
