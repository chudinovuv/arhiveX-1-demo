# Final: Q5 — A-005 (A-005)

## Question
What is the semantic role of the Identifiers class and what specific types does it include?

## Answer

Perfect! Now I have all the information needed. Let me provide a comprehensive answer.

---

## Semantic Role of the Identifiers Class (§2.1.5)

The **Identifiers class** serves as a foundational semantic primitive for stable, opaque identity management in E.L.I.A. It has four core semantic roles:

1. **Pure identity references** — Identifiers act as pure identity tokens, not data descriptors or control signals. They carry **no embedded semantics** beyond identity itself.

2. **Referential integrity** — They enable referential integrity across records, streams, events, and audit artefacts, ensuring stable correlation and reference across domain boundaries.

3. **Correlation and deduplication** — They provide stable identity handles for correlation and reference across domains, records, and streams, enabling deduplication and idempotency without relying on value semantics.

4. **Audit traceability** — They support audit traceability and evidence linking across time and system boundaries, acting as opaque identity anchors in validation, enforcement, serialization, and audit semantics.

## Specific Types Included

The Identifiers class comprises **two concrete types**:

- **(a) `guid`** — A **globally unique identifier** with well-known external interoperability. It has a **fixed width of 128 bits (16 bytes)** and maps to external standards like RFC 4122 (UUID/GUID).

- **(b) `riid`** — A **runtime-independent identifier** defined exclusively within E.L.I.A. It preserves determinism, compactness, and canonical serialization across heterogeneous runtimes, with a **fixed width of 96 bits (12 bytes)**. It has no external standard mapping and MUST NOT be implicitly converted to or from other identifier formats.

**Key normative constraint:** Implicit conversion between different identifier types is prohibited; any conversion must be explicit and type-safe (§2.1.5.2, rule 6).
