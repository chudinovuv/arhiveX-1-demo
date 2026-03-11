# 2.3 Stream Types

Stream types represent **sequential, potentially unbounded data carriers** designed for controlled input/output, transport, and incremental processing of data that cannot or must not be fully materialized as bounded blocks. Streams form a distinct semantic category with explicit enforcement, interface, and lifecycle constraints.

> This section establishes the normative scope and intent of Stream Types, defining their ontological role and core constraints within the type system. It intentionally does not exhaustively specify serialization mechanics, security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.
> **See also:** Stream type compilation errors — **ANNEX G** §G.5. Stream enforcement at domain boundary — **Section 8.7**. Syntax-level constraints for streams — **Section 8.8**.
## 2.3.0.1 Designation

1. represent **sequential data flow** whose full materialization is unsafe, inefficient, or semantically invalid;
2. enable controlled handling of **large payloads, continuous data, and externally produced artefacts**;
3. provide explicit I/O boundaries governed by data interfaces, admission rules, and enforcement policies;
4. support incremental consumption, back-pressure, and boundary validation without violating determinism.

## 2.3.0.2 Normative properties

1. Stream types **MUST NOT be materialized as bounded block values** unless explicitly converted via a data interface with size validation and enforcement.
2. Stream types **MUST be consumed sequentially** and **MUST NOT** expose random access, mutation, or in-place traversal semantics.
3. Streams **MUST be governed by a data interface** defining admissible operations, access mode, and enforcement constraints.
4. Streams **MUST NOT encode semantic meaning beyond ordered data delivery** and **MUST NOT introduce execution authority or behavior**.
5. Serialization determinism **MUST be preserved at the protocol level**, even when payload delivery is chunked or incremental.
6. By default the stream type is limited to 2^48 bytes and always has `SIZE_LIMITED_26BIT`  set to 0.

## 2.3.0.3 Semantic role

1. Streams act as **controlled I/O surfaces**, separating semantic data models from physical data transport.
2. They enable safe interaction with external systems, files, and long-lived data sources without collapsing them into in-memory structures.
3. Streams enforce a clear boundary between **data movement** and **data interpretation**, ensuring that enforcement and validation remain explicit and inspectable.

## 2.3.0.4 Stream Metadata and Interface Obligations

1. Every stream value **MUST be associated with a governing data interface** that declares admissible operations, access mode (read-only / writable), and enforcement scope.
2. Stream metadata **MUST allow unknown or open-ended length**; any declared length **MAY be advisory** and **MUST NOT imply full materialization**.
3. Chunking, segmentation, or incremental delivery **MUST be treated as a transport concern** and **MUST NOT affect semantic interpretation** of the stream payload.
4. A data interface **MUST explicitly declare** whether and how a stream MAY be materialized into a bounded block, including size limits and validation rules.
5. Any stream materialization **MUST be an explicit, observable operation** subject to enforcement, audit, and failure semantics.
6. In the absence of an explicit materialization contract, streams **MUST be treated as non-materializable by default**.

# 2.3.1 Stream carriers class

Stream carriers represent **potentially unbounded, sequential data exchange formats** intended for transport of large payloads, continuous data, or externally produced artefacts that cannot or must not be fully materialized as in-memory blocks. Streams are used as controlled I/O surfaces and are always governed by data interfaces, enforcement, and classification rules.

**A. Stream carriers** preserve serialization determinism at the protocol level while allowing incremental processing, back-pressure, and boundary enforcement. (self-contained formats / long payloads): `DIC`, `JSON`, `XML`, `YAML`

> Reference reading of ANNEX A for more carrier types such `binary`, `text`, `toml`, `csv`, `avro`, `protobuf`, `msgpack`, `bson`, `ion`, `parquet`, `orc`

## 2.3.1.1 Designation

1. represent **self-describing, schema-aware streaming carriers** where structure is embedded in the stream format itself;
2. enable interoperability with **external producers and consumers** that emit or consume standardized structured streams;
3. provide a transport form where **schema and ordering semantics are intrinsic to the carrier**, not imposed by the receiving domain.

## 2.3.1.2 Normative properties

1. Stream carriers **MUST preserve the native structural and ordering semantics** of their declared format (e.g. JSON object/array rules, XML element ordering).
2. Stream carriers **MUST NOT require full materialization** to validate structural well-formedness; incremental validation **MAY** be applied.
3. Stream carriers **MUST NOT introduce domain-specific semantic interpretation** beyond the carrier format itself.
4. Any schema validation, semantic mapping, or enrichment **MUST be performed outside the stream carrier**, via explicit data interfaces or transformation flows.

## 2.3.1.3 Semantic role

1. Stream carriers act as **neutral structured transport envelopes**, not as domain models.
2. They form the boundary layer between **external data representation** and **internal semantic models**.
3. Stream carriers enable audit-safe ingestion and emission of structured data without collapsing transport concerns into domain semantics.

**A. Standards reference:**

- RFC 8259 (JSON)
- W3C XML 1.0 / 1.1 (XML)
- YAML 1.2 Specification
- RFC 8949 (CBOR — conceptual alignment for streaming binary formats)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

## 2.3.1.4 Semantic Data Binding

Semantic binding of stream carriers to a **semantic data interface** establishes how the stream is exposed, constrained, and operated upon at the domain boundary.

1. When a stream carrier is bound to a semantic data interface, the binding process **MUST evaluate Bit 7** (`IS_STRUCTURED`) from the **Type Metadata Envelope** associated with the stream.

2. If `IS_STRUCTURED = 1`, the stream **MUST be treated as structurally interpretable**, and the semantic data interface **MAY generate structured access methods**, including but not limited to **CRUD-like operations**, field-level projections, and schema-aware validation flows, strictly according to the declared schema and enforcement rules.

3. If `IS_STRUCTURED = 0`, the stream **MUST be treated as opaque binary data**, and the semantic data interface **MUST expose only raw sequential access semantics**, such as read, stream, forward-only consume, or transport, **without generating CRUD or structural operations**.

4. The evaluation of `IS_STRUCTURED` **MUST occur at bind-time**, prior to interface materialization, method surface generation, or enforcement graph construction.

5. A semantic data interface **MUST NOT infer structure implicitly** from payload content, carrier format, or heuristics; structural capability **MUST be derived exclusively from metadata flags and declared type registry entries**.

6. Any change in the `IS_STRUCTURED` flag or underlying type binding **MUST invalidate and regenerate** the semantic interface surface to prevent semantic drift or unauthorized capability escalation.

7. When `IS_STRUCTURED = 1`, the availability, scope, and shape of generated CRUD semantics **MUST be determined** by the bound data type class and its declared iterability and cardinality characteristics, as normatively defined in **ANNEX A — Type Registry** and refined by structural and behavioral flags in **ANNEX B — Type Metadata Envelope**. The semantic data interface MUST NOT expose CRUD operations that are incompatible with the underlying type’s iteration model, multiplicity, or structural constraints.
## 2.3.1.5 Syntax

Stream carrier types do not define their own declaration syntax. Their syntactic surface is determined by:

1. The **carrier format** (`DIC`, `JSON`, `XML`, `YAML`, `TOML`, etc.), whose structure is governed by the corresponding external standard or language-defined format specification.
2. The **Data Interface** declaration, which binds a stream carrier to a semantic surface and governs access, enforcement, and operation generation. See **Section 2.7.2 — Data Interface** for the normative declaration grammar and canonical examples.

> **Note:** `DIC` (Document Information Container) is a native binary key–value stream format defined as a stream carrier in **ANNEX A.6** (TYPE_CODE `0x03`). It is used as the canonical serialization format for `dictionary` derived types (see **Section 2.5.7.1 — Serialization Semantics**).


# 2.3.2 RAW String Class

RAW String represents a **specialized stream type** for large or unbounded textual data that must be processed and transported as a stream rather than as a bounded block. While it MAY be incrementally processed and buffered in memory, it is semantically defined as a stream surface rather than a materialized value. It is intended for documents, logs, external text artefacts, and payloads whose size or production characteristics make full in-memory block materialization unsafe or undesirable.

A. RAW String MUST be treated as a stream surface, not as a block value. It MUST NOT be implicitly converted into bounded `string` blocks without explicit materialization and validation.

> **Cross-reference:** For the normative distinction between `fixed string[N]` (primitive), `string[N]` (opaque block), and `string` (unbounded / stream-eligible), see **Section 2.2.0.4 — String Type Hierarchy**.

## 2.3.2.1 Designation

1. Represent **textual content whose size or production model exceeds bounded block constraints**;
2. Preserve **text encoding semantics** while allowing incremental consumption and boundary enforcement;
3. Act as a controlled ingestion and emission surface for externally produced textual artefacts.

## 2.3.2.2 Semantic role

1. RAW String acts as a **textual transport surface**, not as a semantic data model.
2. It separates **text custody and movement** from **text interpretation and domain meaning**.
3. RAW String enables audit-safe handling of large textual artefacts without collapsing them into memory-resident structures.

## 2.3.2.3 Normative properties

### 2.3.2.3.1 Regular String

1. RAW String **MUST preserve declared text encoding semantics** (e.g. UTF-8) across streaming boundaries.
2. RAW String **MUST allow incremental decoding and validation** without requiring full materialization.
3. RAW String **MUST NOT expose random access, mutation, or in-place transformation semantics**.
4. Any conversion from RAW String to bounded `string` **MUST be explicit** and **MUST enforce size limits and encoding validity**.
5. RAW String **MUST enforce a maximum materialized size of 2 147 483 647 bytes (~2 GiB)**. This limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory string and buffer representations are constrained by signed 32-bit indexing semantics. Exceeding this limit **MUST** result in validation failure or enforced truncation according to the governing data interface.
6. RAW String **MUST NOT introduce semantic interpretation beyond textual representation**.

### 2.3.2.3.2 Base64 String

1. Base64 encoding **MUST be treated strictly as a transport encoding**, not as a semantic or structural transformation.
2. When RAW String carries Base64-encoded binary content, the encoded form **MUST NOT be interpreted as textual semantics** beyond encoding validity.
3. Base64-encoded RAW String **MUST preserve deterministic decode semantics**: identical encoded input MUST always yield identical binary output.
4. Padding rules, alphabet selection, and line-break handling **MUST conform exactly to the declared Base64 profile** and **MUST NOT** be inferred implicitly.
5. Any decoding, validation, or size enforcement **MUST be performed explicitly by the governing data interface**; RAW String itself **MUST NOT** perform implicit decoding.
6. Base64 encoding **MUST NOT be used to bypass block or stream size limits**; decoded binary size **MUST** comply with all applicable physical constraints defined for the target type.
7. Base64 content **MUST NOT introduce executable semantics, control signals, or behavioral intent** and **MUST remain a passive transport representation**.



**A. Standards reference:**

- ISO/IEC 10646 (Unicode code points)
- UTF-8 (RFC 3629)
- RFC 8259 (JSON string model — conceptual alignment)
- RFC 8949 (CBOR text string streaming — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

## 2.3.2.4 Semantic Data Binding

Semantic binding of **RAW String** to a semantic data interface **MUST follow the general binding rules defined in Section 2.3.1.4 — Semantic Data Binding** and applies the following specializations specific to this type.

1. Upon binding, the semantic data interface **MUST treat RAW String as a non-structural stream surface**, regardless of textual encoding or carrier format.

2. For RAW String, the semantic data interface **MUST expose only sequential binary or textual stream operations**, including read, forward-only consume, stream, or transport semantics.

3. The semantic data interface **MUST NOT generate CRUD semantics**, field-level accessors, record-oriented operations, or schema-driven projections for RAW String.

4. Any interpretation of textual content (parsing, decoding, schema application, or transformation into structured data) **MUST occur outside the stream binding**, via explicit transformation or materialization flows governed by the data interface.

5. RAW String **MUST NOT be treated as iterable structured data** for the purpose of semantic interface generation, even if its payload encodes structured formats (e.g. JSON, XML, CSV).

6. Any conversion of RAW String into structured or bounded block types **MUST be explicit**, enforce size and encoding constraints, and result in **a new type binding**, not an extension of the existing stream interface.

## 2.3.2.5 Syntax

RAW String does not define its own declaration syntax. As a stream surface, it is accessed exclusively through **Data Interface** bindings. See **Section 2.7.2 — Data Interface** for the normative declaration grammar and canonical examples.



# 2.3.3 RAW Binary Class

RAW Binary represents **large or streaming binary data** that cannot be safely or efficiently represented as bounded opaque blocks. While RAW Binary MAY be incrementally processed and buffered in memory, it is semantically defined as a stream surface rather than a materialized block value. It is intended for binary artefacts such as media streams, large files, encrypted blobs, telemetry feeds, or externally produced binary payloads whose size, origin, or lifecycle requires incremental processing.

A. RAW Binary is treated strictly as a **stream surface**, not as a materialized value. It MUST be consumed, validated, classified, and enforced through data interfaces and MUST NOT be implicitly converted into bounded block types without explicit materialization, size validation, and integrity checks.

## 2.3.3.1 Designation

1. represent **binary payloads whose size, continuity, or production model prevents safe block materialization**;
2. enable controlled transport and processing of **externally produced or long-lived binary data**;
3. provide a deterministic binary stream surface governed by interfaces and enforcement rules.

## 2.3.3.2 Semantic role

1. RAW Binary acts as a **pure binary transport surface**, not as a semantic or structural model.

2. It separates **binary data custody** from **semantic interpretation and execution intent**.

3. RAW Binary enables audit-safe handling of large binary artefacts while preserving determinism and enforcement visibility.

## 2.3.3.3 Normative properties

1. RAW Binary **MUST preserve binary payload integrity** across streaming and transport boundaries.
2. RAW Binary **MUST support incremental consumption and validation** without requiring full payload materialization.
3. RAW Binary **MUST NOT expose structure, ordering semantics, or interpretation beyond raw byte delivery**.
4. Any conversion from RAW Binary to a bounded block **MUST be explicit** and **MUST enforce size limits, integrity checks, and declared encoding constraints**.
5. RAW Binary **MUST enforce a maximum materialized in-memory size of 2 147 483 647 bytes (~2 GiB)** when explicitly converted to a bounded block. This limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory byte buffers and arrays are constrained by signed 32-bit indexing semantics.
6. RAW Binary **MUST NOT encode behavior, control flow, or execution semantics**.

**A. Standards reference:**

- RFC 8949 (CBOR byte string streaming — conceptual alignment)
- ISO/IEC 23001-7 (Common encryption — conceptual alignment for large binary payloads)
- POSIX I/O streams (conceptual model)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



## 2.3.3.4 Semantic Data Binding

> Semantic binding of **RAW Binary** to a semantic data interface **MUST follow the general binding rules defined in Section 2.3.1.4 — Semantic Data Binding** and the specialization rules defined in **Section 2.3.2.4 — Semantic Data Binding**.

1. Upon binding, the semantic data interface **MUST treat RAW Binary as a non-structural, opaque stream surface**, regardless of container format, encoding, or transport protocol.

2. For RAW Binary, the semantic data interface **MUST expose only binary stream operations**, limited to sequential read, forward-only consume, stream forwarding, or controlled write/append where permitted by the interface.

3. The semantic data interface **MUST NOT generate CRUD semantics**, record-level accessors, field projections, iteration-based operations, or any structure-aware method surface for RAW Binary.

4. RAW Binary **MUST NOT be treated as iterable or structurally decomposable data** for the purposes of semantic interface generation, even if higher-level structure may exist externally or be implied by file formats.

5. Any transformation of RAW Binary into structured or bounded block types **MUST be explicit**, enforcement-governed, and result in **a new type binding**, not an extension of the RAW Binary stream interface.

## 2.3.3.5 Syntax

RAW Binary does not define its own declaration syntax. As a stream surface, it is accessed exclusively through **Data Interface** bindings. See **Section 2.7.2 — Data Interface** for the normative declaration grammar and canonical examples.



# 2.3.4 Structural Stream class

Structural streams mainly represent **derived types** with **schema-defined, immutable data compositions** built from primitives and block values. They define explicit structure, typing, and layout, while remaining strictly non-behavioral. Structural containers are the primary carriers of **semantic data shape** within the system. 

**A. For all structural stream realizations, the SIZE_LIMITED_26BIT constraint flag is explicitly cleared (unset)**, as these types are not subject to block-size materialization limits once promoted to stream form.

**B. Structural stream types** include, but are not limited to, the following canonical forms:
1. `array` and `typed arrays`  — an ordered collection of homogeneous elements with explicit element type. Arrays are **derived types** and are **block-materialized by default**. **Independently of physical size**, an array **MUST be promoted to a Stream type** when:
   - (a) it is produced by a stream-originating function (e.g. `memory`, `file`, or equivalent external source);
   - (b) it is referenced or exposed via a **data interface**.

   Size-based promotion rules still apply: when the effective serialized size exceeds the 26-bit block limit, the array **MUST transition to Stream representation** automatically.

   **Note:** Detailed normative constraints, declaration rules, and syntax for arrays as derived structural types are specified in **Section 2.5 Derived Types — Array and Derived Array** and should be consulted in conjunction with this section.


2. `dictionary` — a key–value container with explicitly typed keys and values, used for associative access where field names are not fixed at design time. Dictionaries are **derived types** and are **block-materialized by default**. **Independently of size**, a dictionary **MUST become a Stream type** when:
   - (a) it is created by a stream-backed producer (e.g. file, memory, external I/O);
   - (b) it is bound to or referenced by a **data interface**.

   Exceeding the 26-bit size limit **also forces promotion to a Stream type**.

   **Note:** Detailed normative constraints, declaration rules, and syntax for dictionary as derived structural types are specified in **Section 2.5 Derived Types — Dictionary**  and should be consulted in conjunction with this section.


3. `collection` — a homogeneous, unordered container used to model sets or bags of elements without positional semantics. Collections are **derived types** that **default to block semantics**. A collection **MUST be promoted to a Stream type** when:
   - it originates from a streaming source (memory, file, or external producer);
   - it participates in a **data interface**.

   Additionally, collections **MUST scale into Stream types** once the physical size constraint (26-bit block limit) is exceeded.

   **Note:** Detailed normative constraints, declaration rules, and syntax for collection as derived structural types are specified in **Section 2.5 Derived Types — Collection**  and should be consulted in conjunction with this section.


**C. Normative cross-reference**\
Block materialization rules, size limits, and the `SIZE_LIMITED_26BIT` constraint are defined in **Section 2.2 — Block Types**. Schema identity, TYPE_HASH semantics, and derived-type envelope rules are defined in **ANNEX B — Type Metadata Envelope**. Structural stream promotion MUST be interpreted in conjunction with those sections.

## 2.3.4.0.1 Designation

1. Represent **schema-defined derived containers** (array, dictionary, collection) whose effective size or binding model requires stream-level processing;
2. preserve the **structural identity, element typing, and iteration contract** of the underlying derived type after promotion from block to stream;
3. enable **incremental consumption, back-pressure, and boundary enforcement** over structured data that cannot be safely materialized as a single bounded block;
4. act as the canonical stream-level realization of derived types governed by **Section 2.5 — Derived Types**, ensuring that promotion does not alter semantic obligations.

## 2.3.4.0.2 Normative properties

1. A structural stream **MUST preserve the schema identity** (`TYPE_HASH`) and declared element/key/value types of the underlying derived type after Block→Stream promotion.
2. The `SIZE_LIMITED_26BIT` flag **MUST be set to 0** for all structural stream realizations.
3. Structural streams **MUST NOT introduce new fields, operations, or behavioral semantics** beyond those declared by the underlying derived type.
4. Promotion to structural stream **MUST NOT alter** the iteration model, cardinality constraints, or enforcement bindings of the original block-materialized value.
5. A structural stream **MUST support sequential, forward-only traversal** with deterministic element ordering as defined by the underlying type class.
6. Structural streams **MUST remain non-behavioral**: no control flow, logic, or mutation authority is permitted at the stream level.

## 2.3.4.0.3 Syntax

Structural stream types do not define their own declaration syntax. The syntactic form is determined by the underlying derived type declaration (see **Section 2.5 — Derived Types** for array, collection, and dictionary grammar). Stream promotion is triggered by size constraints or **Data Interface** binding (see **Section 2.7.2 — Data Interface**).



## 2.3.4.1 Semantic Role

All structural stream types are **derived types by definition**. Their schema identity, inheritance rules, TYPE_HASH semantics, and normative constraints are specified in **Section 2.5 — Derived Types**, which MUST be consulted for the authoritative definition of their structural and semantic obligations.  

## 2.3.4.2 Semantic Data Binding

Semantic binding for structural streams **MUST follow Section 2.3.1.4 — Semantic Data Binding**, including evaluation of Bit 7 (`IS_STRUCTURED`) at bind-time. When `IS_STRUCTURED = 1`, the semantic data interface MAY generate a CRUD-capable method surface; however, the exact surface **MUST** be constrained by the bound type class and its declared iterability as defined in **ANNEX A — Type Registry** and refined by flags in **ANNEX B — Type Metadata Envelope**.

The following requirements define the **minimum deterministic CRUD mapping** for structural stream bindings.

1. **Collection (structured elements)** — If the element payload is **not an opaque Block** (i.e., elements are structurally interpretable derived values), the interface **MUST expose key-addressable CRUD semantics**, where the key is an interface-declared logical identifier (e.g., document id or canonical field projection) and **MUST NOT** be inferred from raw bytes.

2. **Collection (opaque elements)** — If the element payload is an **opaque Block** (non-decomposable at the type level), the interface **MUST expose index-addressable CRUD semantics** only (read/write/append by ordinal index), and **MUST NOT** expose key-based accessors.

3. **Dictionary** — A dictionary binding **MUST be exposed as a collection of documents** where the dictionary key is the canonical key-addressable identifier. The interface **MUST expose CRUD by key** and **MUST NOT** remap keys into index-based addressing.

4. **Single-dimension array (structured elements)** — A 1-D array whose element payload is **not an opaque Block** **MAY** be exposed with key-addressable CRUD semantics where a stable key can be derived from the declared element schema or an interface-declared projection. If such a key is not declared, the interface **MUST** fall back to index-addressable access.

5. **Single-dimension array (opaque elements)** — A 1-D array of opaque Block elements **MUST** be exposed with index-addressable CRUD semantics only.

6. **Typed array / nested array** — A typed array whose element is itself a nested array (or a fixed-rank array cell) **MUST** be exposed with index-addressable CRUD semantics at each dimension (i.e., CRUD by ordinal coordinates), unless an explicit key projection is declared for the outermost dimension.

7. **Multi-dimensional arrays (rank ≥ 2)** — Multi-dimensional arrays **MUST be exposed as sequential cell-by-cell streams** with deterministic traversal order. The generated `read` surface **MUST** define a stable coordinate order as follows:

   (a) **2-D**: iterate `i` outer, then `j` inner.

   (b) **3-D**: iterate `i` outer, then `j`, then `k` inner.

   (c) **4-D**: iterate `i` outer, then `j`, then `k`, then `l` inner.

   (d) **5-D**: iterate `i` outer, then `j`, then `k`, then `l`, then `m` inner.

   Higher ranks **MUST** extend this rule by adding the next coordinate as the innermost iterator, preserving a deterministic lexicographic coordinate ordering.

8. The semantic data interface **MUST NOT** generate CRUD operations that imply random access, mutation, or decomposition beyond what is declared by the type class, iterability flags, and materialization rules in **ANNEX A** and **ANNEX B**.

