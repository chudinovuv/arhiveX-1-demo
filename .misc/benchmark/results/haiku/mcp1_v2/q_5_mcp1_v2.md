# q_5 — A-005 — What is the semantic role of the Identifiers class and what specific types does it include?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":"Identifiers class","onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2}
- response_chars: 46

### Call 2: fulltext_search
- params: {"query":"Identifiers class","maxResults":10}
- response_chars: 1549

### Call 3: read_chain
- params: {"chains":["2.1.5"],"budget":3500,"autoExpand":true}
- response_chars: 494

### Call 4: read_chain
- params: {"chains":["2.1.5/all"],"budget":3500,"autoExpand":true}
- response_chars: 3669

### Call 5: search_spec
- params: {"keyword":["guid","riid","identifier types"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2}
- response_chars: 286

## Raw MCP Output
### search_spec({"keyword":"Identifiers class","onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2})
```
No units found for keywords: identifiers class
```

### fulltext_search({"query":"Identifiers class","maxResults":10})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.1.5 — Identifiers Class
  file: 2_1_primitive_types.md:168  (score 26)
  matched: identifiers, class
  → trma: identifiersClass

§ 2.1.7.1 — Designation
  file: 2_1_primitive_types.md:272  (score 13)
  matched: identifiers

§ 2.4.3.6 — Serialization and Packaging
  file: 2_4_specialized_types.md:626  (score 13)
  matched: identifiers

§ 2.4.3.6/B. [aspect] — Other identifiers ← §2.4.3.6
  file: 2_4_specialized_types.md:644  (score 13)
  matched: identifiers

§ 8.7.4 — Dictionary and Collection Streams
  file: 8_0_resilience_model.md:922  (score 13)
  matched: identifiers
  → ont: persistenceAndStreams | desa: streamDesign | onma: stream_how

§ 8.7.4/B. [aspect] — Collection streams ← §8.7.4
  file: 8_0_resilience_model.md:934  (score 13)
  matched: identifiers
  → onma: stream_how

§ E.4/A. [aspect] — Concrete rule instances, identifiers, and market-specific semantics are defined  ← §E.4
  file: annex_e_normative_classes.md:427  (score 13)
  matched: identifiers
  → ont: normativeClasses

§ E.4 — Non-Normative Note
  file: annex_e_normative_classes.md:425  (score 13)
  matched: identifiers
  → ont: normativeClasses

§ 1.0.2 — Foundational design principles
  file: 1_0_design_principles.md:55  (score 13)
  matched: class
  → ont: meaningFirst

§ 1.2 — Determinism by Construction
  file: 1_0_design_principles.md:158  (score 13)
  matched: class
  → sema: definition | ont: meaningFirst | desa: designPrinciplesFoundation | phla: permissibilityFirst | onma: typeSystem_why

```

### read_chain({"chains":["2.1.5"],"budget":3500,"autoExpand":true})
```
▸ 2.1.5
# 2.1.5 Identifiers Class
Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

[Tokens: ~120]
```

### read_chain({"chains":["2.1.5/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.5/all
# 2.1.5 Identifiers Class

Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

- (a) `guid` represents a globally unique identifier with well-known external interoperability and has a **fixed width of 128 bits (16 bytes)**.
- (b) `riid` represents a **runtime-independent identifier** defined **exclusively within E.L.I.A.**, preserving **determinism, compactness, and canonical serialization** across heterogeneous runtimes, and has a **fixed width of 96 bits (12 bytes)**. `riid` has no external standard mapping and MUST NOT be implicitly converted to or from other identifier formats.

## 2.1.5.1 Designation

1. provide a **stable identity handle** for correlation and reference across domains, records, and streams;
2. enable **deduplication and idempotency** without relying on value semantics;
3. support **audit traceability and evidence linking** across time and system boundaries;
4. act as **opaque identity anchors**, not as descriptive or behavioral carriers.

## 2.1.5.2 Normative properties

1. Identifiers **MUST be immutable** for their entire lifetime and **MUST NOT** be reused for different entities.
2. Identifiers **MUST be treated as opaque values**; no semantic meaning, ordering, or structure MAY be inferred unless explicitly declared by the identifier type.
3. Identifiers **MUST serialize canonically** and preserve identity across transport, persistence, replay, and cryptographic operations.
4. Identifiers **MUST be comparable only for equality** unless an explicit ordering semantic is defined by the identifier type.
5. Identifiers **MUST NOT** encode business state, timestamps, versioning, or control information.
6. Implicit conversion between different identifier types **MUST NOT** be permitted; any conversion MUST be explicit and type-safe.
7. Identifiers **MUST support only bitwise equality comparison and cryptographic hashing operations**. No arithmetic, ordering, range, or semantic comparison operations are permitted.

## 2.1.5.3 Semantic role

1. Identifiers act as **pure identity references**, not as data descriptors or control signals.
2. They enable **referential integrity** across records, streams, events, and audit artefacts.
3. Identifiers participate in validation, enforcement, serialization, and audit semantics **only as identity tokens** and **do not introduce authority, behavior, or decision logic**.

## 2.1.5.4 Syntax

### 2.1.5.4.1 Declaration (normative)

[TBD]

### 2.1.5.4.2 AST Grammar

> The AST grammar defined below is intentionally **representational**, not implementation-exhaustive. Its purpose is to identify and formalize the **essential syntactic nodes and structural relationships** required to construct a valid Identifier, rather than to mirror the exact grammar used by any specific compiler or runtime provider.

[TBD]

### 2.1.5.4.3 Canonical Syntax

[TBD]


**Standards reference:**

- RFC 4122 (UUID / GUID)
- ISO/IEC 9834-8 (Registration of object identifiers — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.




[Tokens: ~914]
```

### search_spec({"keyword":["guid","riid","identifier types"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2})
```

═══ CONTENT ═══

[... TRUNCATED — 4 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 24/3500 tokens, trimmed from 4] [SUFFICIENT: 64% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

## Answer
Кажется, предыдущего вызова read_chain было достаточно. У меня есть полная информация об Identifiers class. Отвечаю на основе накопленной информации.

## Semantic Role of the Identifiers Class

The **Identifiers Class** serves as a foundational primitive type class in E.L.I.A. with a highly specific semantic role as **pure identity references** (§2.1.5.3). 

### Primary Semantic Functions:

1. **Stable Identity Anchors**: Identifiers provide stable, opaque identity values used for correlation, reference, deduplication, and audit traceability across domains, records, and streams (§2.1.5.1).

2. **Referential Integrity**: They enable referential integrity across records, streams, events, and audit artifacts, acting solely as identity tokens without introducing authority, behavior, or decision logic (§2.1.5.3).

3. **Opaque Identity Carriers**: Identifiers carry **no embedded semantics** beyond pure identity and explicitly MUST NOT encode business meaning, temporal ordering, or behavior (§2.1.5).

### Specific Types Included:

The Identifiers Class contains exactly **two primitive types** (§2.1.5):

#### 1. `guid` Type
- **Purpose**: Globally unique identifier with external interoperability
- **Size**: Fixed width of **128 bits (16 bytes)**
- **Standards**: Aligned with RFC 4122 (UUID/GUID)
- **Scope**: Global uniqueness with well-known external standards support

#### 2. `riid` Type  
- **Purpose**: **Runtime-independent identifier** defined exclusively within E.L.I.A.
- **Size**: Fixed width of **96 bits (12 bytes)**
- **Characteristics**: Preserves determinism, compactness, and canonical serialization across heterogeneous runtimes
- **Scope**: E.L.I.A.-internal only, with no external standard mapping and explicit prohibition of implicit conversion to/from other identifier formats

### Key Normative Constraints:

Both types must be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. They support only bitwise equality comparison and cryptographic hashing operations, with no arithmetic, ordering, or semantic comparison operations permitted (§2.1.5.2).

## Metrics
- calls_total: 5
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 9468
- tokens_out: 1656
- tokens_total: 11124
- cache_read: 90282
- cache_creation: 0
- wall_time_sec: 30.1
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_5_mcp1_v2.md
