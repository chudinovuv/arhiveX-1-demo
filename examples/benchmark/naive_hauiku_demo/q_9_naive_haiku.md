# q_9 — A-009 — How does semantic data binding work for structural streams in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, semantic data binding for structural streams works through a multi-layered evaluation process that determines what operations are exposed at the interface level.

## Core Binding Process

Structural streams follow the general semantic data binding rules defined in **§2.3.1.4 — Semantic Data Binding**, with specific refinements outlined in **§2.3.4.2 — Semantic Data Binding**.

The binding process begins with evaluating **Bit 7 (`IS_STRUCTURED`)** from the Type Metadata Envelope at bind-time. When `IS_STRUCTURED = 1`, the semantic data interface **MAY generate structured access methods** including CRUD-like operations, field-level projections, and schema-aware validation flows (§2.3.1.4).

## Minimum Deterministic CRUD Mapping

The specification defines a **minimum deterministic CRUD mapping** for structural stream bindings based on the underlying type and element characteristics (§2.3.4.2):

### Collection Bindings
- **Structured elements**: Interface **MUST expose key-addressable CRUD semantics** where the key is an interface-declared logical identifier, **NOT** inferred from raw bytes
- **Opaque elements**: Interface **MUST expose index-addressable CRUD semantics** only (read/write/append by ordinal index)

### Dictionary Bindings
Dictionary bindings **MUST be exposed as a collection of documents** where the dictionary key becomes the canonical key-addressable identifier. The interface **MUST expose CRUD by key** and **MUST NOT** remap keys into index-based addressing (§2.3.4.2).

### Array Bindings
- **Single-dimension arrays with structured elements**: **MAY** be exposed with key-addressable CRUD if a stable key can be derived from the declared element schema or interface projection; otherwise falls back to index-addressable access
- **Single-dimension arrays with opaque elements**: **MUST** be exposed with index-addressable CRUD only
- **Multi-dimensional arrays (rank ≥ 2)**: **MUST be exposed as sequential cell-by-cell streams** with deterministic traversal order following lexicographic coordinate ordering (§2.3.4.2)

## Key Constraints

1. **Schema Preservation**: Structural streams **MUST preserve the schema identity** (`TYPE_HASH`) and declared element/key/value types of the underlying derived type after Block→Stream promotion (§2.3.4.0.2)

2. **No Semantic Alteration**: The interface **MUST NOT** generate CRUD operations that imply capabilities beyond what is declared by the type class, iterability flags, and materialization rules defined in **ANNEX A** and **ANNEX B** (§2.3.4.2)

3. **Derived Type Foundation**: All structural stream types are **derived types by definition**, with their authoritative schema identity and normative constraints specified in **§2.5 — Derived Types** (§2.3.4.1)

The binding mechanism ensures that structural streams maintain their semantic contracts while enabling controlled access patterns appropriate to their underlying type structure and declared capabilities.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 723
- tokens_total: 748
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 21.1
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_9_naive.md
