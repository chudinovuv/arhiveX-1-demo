# Render: Q5 — A-005 (A-005)

## Extracted Content

### search_spec({"keyword":"Identifiers class","onto":"WHAT","intent":"semantic_role","maxUnits":2,"filter":true,"budget":3500,"verbose":"none","tier":"adaptive","autoExpand":true})
```
No units found for keywords: identifiers class
```

### search_spec({"keyword":"Identifiers","onto":"WHAT","intent":"semantic_role","maxUnits":3,"filter":true,"budget":3500,"verbose":"none","tier":"adaptive","autoExpand":true})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.5
# 2.1.5 Identifiers Class
Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

Γû╕ [T1] 2.1.5.4.1/all
### 2.1.5.4.1 Declaration (normative)

Γû╕ [T1] 2.1.5.4.2/all
### 2.1.5.4.2 AST Grammar

Γû╕ [T2] 2.1.5.4.3/all
### 2.1.5.4.3 Canonical Syntax
  [...]

- RFC 4122 (UUID / GUID)
- ISO/IEC 9834-8 (Registration of object identifiers — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

Γû╕ [T2] 2.1.5.2/all
## 2.1.5.2 Normative properties

1. Identifiers **MUST be immutable** for their entire lifetime and **MUST NOT** be reused for different entities.
2. Identifiers **MUST be treated as opaque values**; no semantic meaning, ordering, or structure MAY be inferred unless explicitly declared by the identifier type.
3. Identifiers **MUST serialize canonically** and preserve identity across transport, persistence, replay, and cryptographic operations.
4. Identifiers **MUST be comparable only for equality** unless an explicit ordering semantic is defined by the identifier type.
5. Identifiers **MUST NOT** encode business state, timestamps, versioning, or control information.
6. Implicit conversion between different identifier types **MUST NOT** be permitted; any conversion MUST be explicit and type-safe.
7. Identifiers **MUST support only bitwise equality comparison and cryptographic hashing operations**. No arithmetic, ordering, range, or semantic comparison operations are permitted.



[... TRUNCATED — 520 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 540/3500 tokens, trimmed from 520]
```

### read_chain({"chains":["2.1.5"],"detail":"detailed","budget":5000})
```
Γû╕ 2.1.5
# 2.1.5 Identifiers Class
Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

[Tokens: ~121]
```

### read_chain({"chains":["2.1.5/all"],"detail":"detailed","budget":6000})
```
Γû╕ 2.1.5/all
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

## Budget
- Tool calls: 4
- Total response chars: 6449
