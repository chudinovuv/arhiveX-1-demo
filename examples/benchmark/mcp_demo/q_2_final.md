# Final: Q2 — A-002 (A-002)

## Question
How does RAW Binary stream encoding work in E.L.I.A.?

## Answer

---

## RAW Binary Stream Encoding in E.L.I.A.

**RAW Binary** is a stream surface type designed to handle large or streaming binary data that cannot be efficiently represented as bounded blocks (§2.3.3).

### Core Characteristics

RAW Binary encoding is defined by the following principles:

1. **Stream-based, not materialized**: RAW Binary is semantically a **stream surface**, not a materialized block value. It must be consumed incrementally without requiring full payload materialization (§2.3.3/A).

2. **Opaque binary transport**: It provides no structure interpretation beyond raw byte delivery. The encoding **MUST NOT expose structure, ordering semantics, or interpretation** beyond raw byte delivery (§2.3.3.3, item 3).

3. **Incremental processing**: RAW Binary **MUST support incremental consumption and validation** without materializing the entire payload (§2.3.3.3, item 2).

4. **Integrity preservation**: The encoding **MUST preserve binary payload integrity** across streaming and transport boundaries (§2.3.3.3, item 1).

### Semantic Data Binding Rules

When bound to semantic data interfaces, RAW Binary follows strict rules (§2.3.3.4):

- It **MUST be treated as a non-structural, opaque stream surface** regardless of container format or transport protocol
- The interface **MUST expose only binary stream operations** (sequential read, forward-only consume, stream forwarding, controlled write/append)
- No CRUD semantics, record-level accessors, field projections, or iteration-based operations are generated
- RAW Binary **MUST NOT be iterable or structurally decomposable**

### Materialization Constraints

When RAW Binary is explicitly converted to a bounded block type, the conversion **MUST enforce size limits, integrity checks, and declared encoding constraints** (§2.3.3.3, item 4). Specifically:

- **Maximum in-memory size: 2,147,483,647 bytes (~2 GiB)** when converted to a bounded block. This limit exists for backward-compatibility with C#/.NET, C++, and comparable platforms where signed 32-bit indexing constraints are standard (§2.3.3.3, item 5).

### Use Cases

RAW Binary encoding is intended for:
- Media streams
- Large files
- Encrypted blobs
- Telemetry feeds
- Externally produced binary payloads with streaming or incremental processing requirements
