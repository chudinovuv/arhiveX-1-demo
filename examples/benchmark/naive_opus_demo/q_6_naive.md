# q_6 — A-006 — How does E.L.I.A. handle Base64 encoding in RAW String — is it a semantic transformation or transport encoding?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
According to the E.L.I.A. specification, Base64 encoding in RAW String is strictly a **transport encoding**, not a semantic transformation.

The specification is explicit about this in §2.3.2.3.2 (Base64 String), which states:

1. "Base64 encoding **MUST be treated strictly as a transport encoding**, not as a semantic or structural transformation." (§2.3.2.3.2, item 1)

2. "When RAW String carries Base64-encoded binary content, the encoded form **MUST NOT be interpreted as textual semantics** beyond encoding validity." (§2.3.2.3.2, item 2)

3. "Base64 content **MUST NOT introduce executable semantics, control signals, or behavioral intent** and **MUST remain a passive transport representation**." (§2.3.2.3.2, item 7)

The specification further clarifies that:
- Any decoding, validation, or size enforcement **MUST be performed explicitly by the governing data interface** (§2.3.2.3.2, item 5)
- RAW String itself **MUST NOT** perform implicit decoding (§2.3.2.3.2, item 5)
- Base64 encoding **MUST NOT be used to bypass block or stream size limits** (§2.3.2.3.2, item 6)

This aligns with the broader principle that RAW String "acts as a **textual transport surface**, not as a semantic data model" (§2.3.2.2, item 1) and "separates **text custody and movement** from **text interpretation and domain meaning**" (§2.3.2.2, item 2).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 35
- tokens_out: 399
- tokens_total: 434
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 14.1
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_6_naive.md
