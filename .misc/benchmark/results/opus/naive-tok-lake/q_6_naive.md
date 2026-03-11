# q_6 — A-006 — How does E.L.I.A. encode boolean values at the binary level, and what are the normative constraints?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, boolean values are encoded at the binary level according to the following normative rules:

## Boolean Encoding (§2.1.9.4)

Boolean values are encoded as **exactly 1 byte (8 bits)** with these strict constraints:

1. **TRUE**: Must be encoded as `0x01`
2. **FALSE**: Must be encoded as `0x00`
3. **Any other byte value is invalid** and must be rejected by parsers

## Normative Constraints

According to §2.1.9.4 and §2.1.3 (Boolean Class), the following constraints apply:

1. **Fixed Size**: Boolean values MUST always occupy exactly 1 byte, regardless of context or platform (§2.1.9.4)

2. **Strict Binary Values**: Only two valid representations exist - no "truthy" or "falsy" interpretations are permitted (§2.1.9.4)

3. **Parser Obligations**: Per §2.1.9.9, parsers MUST:
   - Reject any boolean byte value that is not exactly `0x00` or `0x01`
   - Fail deterministically with a typed error suitable for audit
   - Not attempt to interpret or coerce invalid values

4. **No Semantic Ambiguity**: The boolean type supports only equality comparison and logical operations (AND, OR, NOT) - no arithmetic or ordering operations are permitted (§2.1.3)

5. **Envelope Context**: When serialized within the Type Metadata Envelope (referenced in §2.1.9), boolean values follow the standard envelope structure with CATEGORY = Primitive (§2.1.9)

This encoding ensures deterministic, platform-independent representation of boolean values across all E.L.I.A. implementations.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 420
- tokens_total: 452
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 13.9
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_6_naive.md
