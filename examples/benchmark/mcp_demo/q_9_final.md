# Final: Q9 — A-009 (A-009)

## Question
How does semantic data binding work for structural streams in E.L.I.A.?

## Answer

## Semantic Data Binding for Structural Streams in E.L.I.A.

**Semantic data binding** for structural streams establishes how streams are exposed, constrained, and operated upon at domain boundaries through a **Data Interface**. The process is governed by metadata flags and type registry constraints.

### Core Binding Mechanism (§2.3.1.4)

The binding process follows these steps:

1. **IS_STRUCTURED Flag Evaluation**: At bind-time, the binding evaluates **Bit 7** (`IS_STRUCTURED`) from the **Type Metadata Envelope**. This flag determines whether the stream is treated as structurally interpretable (capable of CRUD operations) or as opaque binary data (sequential access only).

2. **Structured vs. Opaque Handling**:
   - If `IS_STRUCTURED = 1`: the semantic data interface **MAY generate CRUD-capable method surface** (Create, Read, Update, Delete), including field-level projections and schema-aware validation.
   - If `IS_STRUCTURED = 0`: the interface exposes **only raw sequential access semantics** (read, stream, forward-only consume).

3. **No Implicit Structure**: Structural capability **MUST be derived exclusively from metadata flags and declared type registry entries** — never inferred from payload content or carrier format heuristics.

### Structural Stream Specifics (§2.3.4.2)

For structural streams specifically (arrays, dictionaries, collections), semantic binding **MUST follow §2.3.1.4** with additional CRUD mapping rules:

- **Collections with structured elements** → key-addressable CRUD (logical identifiers, not raw bytes)
- **Collections with opaque elements** → index-addressable CRUD only
- **Dictionaries** → key-addressable CRUD (dictionary key = canonical identifier)
- **Arrays (1-D, structured elements)** → key-addressable CRUD if a stable key exists; otherwise index-addressable
- **Multi-dimensional arrays** → cell-by-cell sequential streams with deterministic lexicographic coordinate ordering

### Key Constraints

- **No implicit structure inference** — all structural capability must be explicitly declared.
- **Type identity preservation** — the `SIZE_LIMITED_26BIT` flag is cleared for structural streams; the `TYPE_HASH` and element/key/value types are preserved after Block→Stream promotion.
- **Regeneration on metadata change** — any change to the `IS_STRUCTURED` flag or type binding **MUST invalidate and regenerate** the semantic interface surface.
- **Non-behavioral** — structural streams remain non-behavioral (no control flow, logic, or mutation authority).

The binding process ensures that structured data can be safely incremented, validated, and enforced at domain boundaries while maintaining audit safety and preventing unauthorized capability escalation (§2.3.1.4, §2.3.4.2).
