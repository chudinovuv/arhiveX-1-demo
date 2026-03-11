# q_17 — B-007 — What parser obligations does E.L.I.A. define for primitive type binary decoding?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Parser Obligations for Primitive Type Binary Decoding

The E.L.I.A. specification defines normative parser obligations for primitive type binary decoding in **§2.1.9.9 — Parser Obligations**, which comprises two sub-sections:

## 2.1.9.9.1 Parsing Algorithm (Normative)

The specification mandates a deterministic parsing algorithm that parsers **MUST** implement when decoding primitive type binaries. The detailed algorithm is normatively defined in this section, though the full algorithmic details are not reproduced in the loaded specification excerpt.

## 2.1.9.9.2 Validation Error Conditions (Normative)

Parsers **MUST enforce strict validation** and reject any input that violates declared type constraints. The specification explicitly identifies this section as containing **normative validation error conditions** that trigger parser rejection.

## Related Obligations

The specification also establishes **§2.1.9.9 — Semantic Guarantees**, which defines what guarantees the parser **MUST provide** to downstream consumers after successful decoding.

Additionally, **§2.1.9.10 — Performance Implications** establishes normative recommendations for parser implementation strategies, including optimization guidelines (§2.1.9.10.3) that distinguish between:

- **Inline primitives (≤ 48 bits)** (§2.1.9.10.1)
- **External primitives (> 48 bits)** (§2.1.9.10.2)

---

**Note:** The complete algorithmic specification and validation rule details are defined normatively in §2.1.9.9 but are not fully reproduced in the loaded excerpt. Consult the full specification document for the exhaustive parsing algorithm and error condition catalog.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 407
- tokens_total: 433
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 4.6
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_17_naive.md
