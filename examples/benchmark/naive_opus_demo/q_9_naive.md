# q_9 — A-009 — How does semantic data binding work for structural streams in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, semantic data binding for structural streams follows a specific set of rules that determine how streams are exposed and operated upon. Here's how it works:

## Core Binding Rules

According to §2.3.4.2, semantic binding for structural streams **MUST follow Section 2.3.1.4**, which establishes that:

1. The binding process **MUST evaluate Bit 7** (`IS_STRUCTURED`) from the Type Metadata Envelope at bind-time (§2.3.1.4)
2. If `IS_STRUCTURED = 1`, the semantic data interface **MAY generate a CRUD-capable method surface**
3. The exact surface **MUST be constrained by the bound type class** and its declared iterability as defined in ANNEX A and refined by flags in ANNEX B

## Deterministic CRUD Mapping

The specification defines **minimum deterministic CRUD mapping** for different structural stream types (§2.3.4.2):

### Collection Types:
- **Structured elements**: MUST expose **key-addressable CRUD semantics**, where the key is an interface-declared logical identifier
- **Opaque elements**: MUST expose **index-addressable CRUD semantics only** (read/write/append by ordinal index)

### Dictionary:
- **MUST be exposed as a collection of documents** where the dictionary key is the canonical key-addressable identifier
- **MUST expose CRUD by key** and MUST NOT remap keys into index-based addressing

### Arrays:
- **Single-dimension array (structured elements)**: MAY expose key-addressable CRUD if a stable key can be derived; otherwise falls back to index-based access
- **Single-dimension array (opaque elements)**: MUST expose index-addressable CRUD only
- **Multi-dimensional arrays**: MUST be exposed as **sequential cell-by-cell streams** with deterministic traversal order (e.g., for 2D: iterate `i` outer, then `j` inner)

## Key Constraints

The specification emphasizes several important constraints (§2.3.4.0.2):

1. Structural streams **MUST preserve the schema identity** (`TYPE_HASH`) and declared element/key/value types after Block→Stream promotion
2. The `SIZE_LIMITED_26BIT` flag **MUST be set to 0** for all structural stream realizations
3. Structural streams **MUST support sequential, forward-only traversal** with deterministic element ordering
4. They **MUST remain non-behavioral**: no control flow, logic, or mutation authority is permitted

## Binding Context

According to §2.3.4.0, structural streams are promoted from block form when:
- They originate from a stream source (memory, file, external producer)
- They participate in a **data interface** (§2.3.4.0.3)
- They exceed the 26-bit block size limit

The semantic data interface **MUST NOT generate CRUD operations that imply random access, mutation, or decomposition beyond what is declared** by the type class, iterability flags, and materialization rules (§2.3.4.2, point 8).

This binding mechanism ensures that structural streams maintain their semantic identity while providing appropriate access patterns based on their underlying type characteristics.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 756
- tokens_total: 781
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 31.9
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_9_naive.md
