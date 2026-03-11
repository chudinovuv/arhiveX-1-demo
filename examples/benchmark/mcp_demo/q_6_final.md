# Final: Q6 — A-006 (A-006)

## Question
How does E.L.I.A. handle Base64 encoding in RAW String — is it a semantic transformation or transport encoding?

## Answer

**E.L.I.A. treats Base64 encoding in RAW String strictly as a *transport encoding*, not as a semantic transformation.**

This is explicitly stated in §2.3.2.3.2 (Base64 String), which establishes seven normative rules:

### Transport Encoding (Not Semantic)
- Base64 **MUST be treated strictly as a transport encoding**, not as a semantic or structural transformation (§2.3.2.3.2, rule 1).
- When RAW String carries Base64-encoded binary content, the encoded form **MUST NOT be interpreted as textual semantics** beyond encoding validity (rule 2).

### Key Normative Constraints

1. **Deterministic decode semantics** (rule 3): Identical encoded input MUST always yield identical binary output.

2. **Explicit profile compliance** (rule 4): Padding rules, alphabet selection, and line-break handling MUST conform exactly to the declared Base64 profile and MUST NOT be inferred implicitly.

3. **No implicit decoding** (rule 5): Any decoding, validation, or size enforcement MUST be performed explicitly by the governing data interface; RAW String itself MUST NOT perform implicit decoding.

4. **No size-limit bypass** (rule 6): Base64 encoding MUST NOT be used to bypass block or stream size limits; decoded binary size MUST comply with all applicable physical constraints.

5. **Passive transport only** (rule 7): Base64 content MUST NOT introduce executable semantics, control signals, or behavioral intent and MUST remain a passive transport representation.

### Architectural Context

This aligns with the broader stream design principle (§2.3.0.4): **Chunking, segmentation, or incremental delivery MUST be treated as a transport concern and MUST NOT affect semantic interpretation** of the stream payload.

In summary: Base64 is a **pure transport envelope** for RAW String. All semantic meaning and type enforcement must be delegated to the governing data interface, not embedded in the encoding itself.
