# q_5 — A-005 — What is the semantic role of the Identifiers class and what specific types does it include?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Semantic Role and Types of the Identifiers Class

## Semantic Role

According to **§2.1.5.1 — Designation**, the Identifiers class serves the following semantic roles:

1. **Uniqueness and Reference** — Identifiers provide deterministic, globally or contextually unique markers for entities, artefacts, and cross-boundary references within and across domains.

2. **Semantic Authority and Traceability** — Identifier types anchor semantic identity to verifiable, immutable representations, enabling audit trails, enforcement binding, and deterministic resolution across system boundaries.

3. **Deterministic Cross-Domain Communication** — Identifiers act as stable carriers of reference semantics, ensuring that identity remains invariant and resolvable across multiple domains, runtime contexts, and serialization boundaries.

4. **Evidence and Enforcement Coupling** — Identifiers form a foundational substrate for enforcement graphs, evidence trails, and audit fixation by providing deterministic, reproducible reference points that do not decay or become ambiguous during system evolution.

Per **§2.1.5.3**, Identifiers enable **safe reference semantics** and form the basis for **deterministic, auditable interaction** at semantic boundaries.

## Specific Types Included

The specification defines the Identifiers class in **§2.1.5**, but the full enumeration of specific identifier types is **not exhaustively detailed in the loaded sections**. However, based on references throughout the specification, the class includes:

1. **GUID** (Globally Unique Identifier) — referenced in **§3.21.6 — GUID and RIID Literals** as a standardized universal identifier type.

2. **RIID** (Runtime Instance Identifier) — referenced in **§3.21.6** and throughout the specification as an identifier tied to definition identity and semantic contracts (see **§2.7.1.3.4 — Definition Identity (riid Layout)**).

3. **Version** — treated as a specialized identifier type (defined in **§2.4.3**) used for marking semantic evolution and compatibility.

The **complete normative registry of Identifier subtypes, their encoding rules, and cardinality constraints** is defined in **ANNEX A — Type Registry** (not fully loaded), which should be consulted for the exhaustive type catalogue.

---

**Cross-reference:** For syntax and literal representation, see **§3.21.6 — GUID and RIID Literals**. For binary encoding, see **§2.1.9.6 — Identifier encoding**.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 574
- tokens_total: 599
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 7.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_5_naive.md
