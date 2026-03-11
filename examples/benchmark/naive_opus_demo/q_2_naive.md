# q_2 — A-002 — How does RAW Binary stream encoding work in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, RAW Binary streams have specific encoding characteristics:

## RAW Binary Stream Encoding

According to **§2.3.3 RAW Binary Class**, RAW Binary represents "large or streaming binary data" that is semantically defined as a stream surface rather than a materialized block value.

### Key Encoding Properties:

1. **Binary Integrity** (§2.3.3.3):
   - "RAW Binary **MUST preserve binary payload integrity** across streaming and transport boundaries"
   - "RAW Binary **MUST support incremental consumption and validation** without requiring full payload materialization"

2. **Size Constraints** (§2.3.3.3):
   - "RAW Binary **MUST enforce a maximum materialized in-memory size of 2,147,483,647 bytes (~2 GiB)**" when explicitly converted to a bounded block
   - This limit is "normatively dictated by backward-compatibility requirements with existing programming language runtimes"

3. **Stream Nature** (§2.3.3):
   - RAW Binary is "treated strictly as a **stream surface**, not as a materialized value"
   - "It MUST be consumed, validated, classified, and enforced through data interfaces"

4. **No Structure** (§2.3.3.3):
   - "RAW Binary **MUST NOT expose structure, ordering semantics, or interpretation beyond raw byte delivery**"
   - "RAW Binary **MUST NOT encode behavior, control flow, or execution semantics**"

5. **Semantic Data Binding** (§2.3.3.4):
   - "Upon binding, the semantic data interface **MUST treat RAW Binary as a non-structural, opaque stream surface**"
   - "The semantic data interface **MUST expose only binary stream operations**, limited to sequential read, forward-only consume, stream forwarding, or controlled write/append"

### Type Registry Encoding:

The specification notes (§2.3.3) that "The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry**", but the actual type codes are not provided in the loaded sections.

### Key Distinction:

RAW Binary is fundamentally a **transport surface** (§2.3.3.2), not a semantic or structural model. It separates "binary data custody from semantic interpretation and execution intent" and enables "audit-safe handling of large binary artefacts while preserving determinism and enforcement visibility."

The encoding must preserve determinism at the protocol level (§2.3.0.2) even when payload delivery is chunked or incremental, but the specific binary encoding format details would be found in ANNEX A — Type Registry, which was not included in the loaded sections.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 24
- tokens_out: 652
- tokens_total: 676
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 26.9
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_2_naive.md
