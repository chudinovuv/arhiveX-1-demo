# q_6 — A-006 — How does E.L.I.A. handle Base64 encoding in RAW String — is it a semantic transformation or transport encoding?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, Base64 encoding in RAW String is **strictly treated as transport encoding, not as semantic transformation**.

## Normative Requirements (§2.3.2.3.2)

The specification is explicit about this distinction:

1. **Transport-Only Nature**: "Base64 encoding **MUST be treated strictly as a transport encoding**, not as a semantic or structural transformation." (§2.3.2.3.2)

2. **No Semantic Interpretation**: "When RAW String carries Base64-encoded binary content, the encoded form **MUST NOT be interpreted as textual semantics** beyond encoding validity." (§2.3.2.3.2)

3. **Deterministic Decode Requirement**: "Base64-encoded RAW String **MUST preserve deterministic decode semantics**: identical encoded input MUST always yield identical binary output." (§2.3.2.3.2)

## Key Architectural Constraints

**Explicit Operations Only**: "Any decoding, validation, or size enforcement **MUST be performed explicitly by the governing data interface**; RAW String itself **MUST NOT** perform implicit decoding." (§2.3.2.3.2)

**No Authority Bypass**: "Base64 encoding **MUST NOT be used to bypass block or stream size limits**; decoded binary size **MUST** comply with all applicable physical constraints defined for the target type." (§2.3.2.3.2)

**Passive Transport**: "Base64 content **MUST NOT introduce executable semantics, control signals, or behavioral intent** and **MUST remain a passive transport representation**." (§2.3.2.3.2)

## Implementation Implications

The specification requires that Base64 handling must:
- Conform to declared Base64 profiles for padding, alphabet, and line-breaks
- Maintain encoding validity without implicit interpretation
- Preserve the boundary between data movement and data interpretation (§2.3.2.2)
- Be governed by explicit data interface contracts rather than automatic conversion

This design ensures that Base64 remains a pure transport mechanism while preserving E.L.I.A.'s core principle of explicit semantic boundaries and controlled data transformation.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 35
- tokens_out: 502
- tokens_total: 537
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 14.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_6_naive.md
