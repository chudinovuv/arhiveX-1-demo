# q_2 — A-002 — How does RAW Binary stream encoding work in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, RAW Binary stream encoding works as follows:

## Core Encoding Properties

RAW Binary streams **MUST preserve binary payload integrity across streaming and transport boundaries** (§2.3.3.3). The encoding operates at the **protocol level** rather than at the semantic level, meaning:

1. **Binary payload integrity** is maintained during incremental consumption and transport
2. **Deterministic serialization** is preserved even when delivery is chunked or incremental (§2.3.0.2)
3. The stream acts as a **pure binary transport surface** without introducing structural interpretation (§2.3.3.2)

## Size and Materialization Constraints

RAW Binary streams have specific size limitations:

- **Default stream limit**: 2^48 bytes with `SIZE_LIMITED_26BIT` set to 0 (§2.3.0.2)
- **Materialized in-memory limit**: 2,147,483,647 bytes (~2 GiB) when explicitly converted to bounded blocks (§2.3.3.3)

This 2 GiB limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes** including C#/.NET and C++ where byte buffers use signed 32-bit indexing (§2.3.3.3).

## Stream Surface Semantics

RAW Binary **MUST be treated strictly as a stream surface, not as a materialized value** (§2.3.3). This means:

- **Sequential consumption only** - no random access, mutation, or in-place transformation (§2.3.0.2)
- **Incremental processing** without requiring full payload materialization (§2.3.3.3)
- **No behavioral encoding** - must not encode control flow, execution semantics, or behavioral intent (§2.3.3.3)

## Data Interface Binding

When bound to semantic data interfaces, RAW Binary follows specific rules (§2.3.3.4):

- **Must be treated as non-structural, opaque stream surface** regardless of container format
- **Only binary stream operations** are exposed (sequential read, forward-only consume, stream forwarding)
- **No CRUD semantics** or structure-aware operations are generated
- **No structural decomposition** for interface generation, even if higher-level structure might exist externally

## Type Registry Integration

The exact **type code, physical size, value range, and measurement semantics** are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope** (§2.3.3.3). However, these annexes are not included in the provided specification text.

## Access Model

RAW Binary does not define its own declaration syntax and is accessed exclusively through **Data Interface** bindings as specified in **Section 2.7.2 — Data Interface** (§2.3.3.5).

The encoding preserves the principle that **binary data custody** is separated from **semantic interpretation and execution intent** (§2.3.3.2), ensuring audit-safe handling of large binary artefacts while maintaining determinism and enforcement visibility.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 24
- tokens_out: 726
- tokens_total: 750
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 21.1
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_2_naive.md
