# q_5 — A-005 — What is the semantic role of the Identifiers class and what specific types does it include?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the **Identifiers Class** is defined in §2.1.5 with the following semantic role and types:

## Semantic Role (§2.1.5.3)

The Identifiers Class serves as **stable, immutable reference anchors** within the semantic and technical architecture. Specifically, they:

1. **Provide deterministic identity resolution** across domain boundaries, temporal changes, and distributed system contexts
2. **Enable stable referencing** of semantic constructs, technical artefacts, and external entities without dependency on mutable naming schemes
3. **Act as canonical keys** for enforcement, audit, and traceability systems where identity stability is critical
4. **Support cross-system interoperability** by providing globally resolvable identity tokens

## Specific Types Included

While the specification doesn't provide an exhaustive list in the available sections, §2.1.5 indicates that the Identifiers Class includes **globally unique, immutable identity tokens**. Based on the normative properties (§2.1.5.2) and syntax examples (§2.1.5.4.3), the class includes:

- **GUID/UUID types** - globally unique identifiers
- **RIID (Resource Identity IDs)** - mentioned in §3.21.6 as having specific literal syntax
- **Other immutable reference tokens** that provide stable identity anchoring

## Key Properties (§2.1.5.2)

The specification establishes that identifier types must be:
- **Globally unique and immutable** once assigned
- **Deterministically comparable** for equality
- **Stable across system boundaries** and temporal changes
- **Non-interpretable as semantic content** - they are pure identity anchors, not meaningful data

The Identifiers Class is positioned as a foundational primitive type category that enables the language's broader semantic architecture by providing reliable identity references that persist across all system boundaries and evolutionary changes.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 439
- tokens_total: 464
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 12.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_5_naive.md
