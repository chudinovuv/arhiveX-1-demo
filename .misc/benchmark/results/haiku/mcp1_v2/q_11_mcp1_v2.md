# q_11 — B-001 — What specific integer types does the E.L.I.A. Integral class define and what are their bit widths?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["Integral class","integer types","bit width"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1747

### Call 2: search_spec
- params: {"keyword":["integer primitive types","i8","i16","i32","i64","u8","u16","u32","u64"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 276

### Call 3: search_spec
- params: {"keyword":["integer primitives","signed integers","unsigned integers"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 83

### Call 4: fulltext_search
- params: {"query":"i8 i16 i32 i64 u8 u16 u32 u64","maxResults":10}
- response_chars: 159

### Call 5: read_chain
- params: {"chains":["2.0.9.2"],"budget":3500,"autoExpand":true}
- response_chars: 147

### Call 6: fulltext_search
- params: {"query":"integral bit width signed unsigned","maxResults":10}
- response_chars: 1335

### Call 7: read_chain
- params: {"chains":["2.1.1/all"],"budget":3500,"autoExpand":true}
- response_chars: 2849

## Raw MCP Output
### search_spec({"keyword":["Integral class","integer types","bit width"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.2
## 2.1.9.2 Integer encoding
1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).

▸ [T1] 2.1.1
# 2.1.1 Integral Class

▸ [T1] 2.1.1.1
## 2.1.1.1 Designation

▸ [T1] 2.1.1.2
## 2.1.1.2 Normative properties
1. Integral primitives **MUST have fixed and explicitly declared bit width** and signedness.
2. Integral primitives **MUST serialize canonically** with deterministic byte ordering and width preservation.
3. Integral primitives **MUST NOT permit implicit widening, narrowing, or signedness conversion**; any conversion MUST be explicit and type-safe.

▸ [T1] 2.1.1.3
## 2.1.1.3 Semantic role

▸ [T2] 2.1
# 2.1 Primitive Types

▸ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

▸ [T2] 2.1.5/all
# 2.1.5 Identifiers Class
  [...]
## 2.1.5.1 Designation
  [...]
## 2.1.5.2 Normative properties
  [...]
## 2.1.5.3 Semantic role
  [...]
## 2.1.5.4 Syntax
  [...]
### 2.1.5.4.1 Declaration (normative)
  [...]
### 2.1.5.4.2 AST Grammar
  [...]
### 2.1.5.4.3 Canonical Syntax

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

[Tokens: ~404] [SUFFICIENT: 82% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### search_spec({"keyword":["integer primitive types","i8","i16","i32","i64","u8","u16","u32","u64"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```
MCP error -32602: Input validation error: Invalid arguments for tool search_spec: [
  {
    "origin": "array",
    "code": "too_big",
    "maximum": 5,
    "inclusive": true,
    "path": [
      "keyword"
    ],
    "message": "Too big: expected array to have <=5 items"
  }
]
```

### search_spec({"keyword":["integer primitives","signed integers","unsigned integers"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```
No units found for keywords: integer primitives, signed integers, unsigned integers
```

### fulltext_search({"query":"i8 i16 i32 i64 u8 u16 u32 u64","maxResults":10})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.0.9.2 — Integral aliases
  file: 2_0_system_type_overview.md:453  (score 39)
  matched: i16, i32, u32

```

### read_chain({"chains":["2.0.9.2"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.0.9.2

[Tokens: ~34]
```

### fulltext_search({"query":"integral bit width signed unsigned","maxResults":10})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.1.1.2 — Normative properties
  file: 2_1_primitive_types.md:38  (score 26)
  matched: bit, width
  → bhva: integralClassNormatives

§ 2.1.9.8 — Normative rules
  file: 2_1_primitive_types.md:524  (score 26)
  matched: bit, unsigned

§ 2.0.9.2 — Integral aliases
  file: 2_0_system_type_overview.md:453  (score 13)
  matched: integral

§ 2.1.1 — Integral Class
  file: 2_1_primitive_types.md:19  (score 13)
  matched: integral
  → trma: integralClass

§ 2.4.3.3 — Normative Properties
  file: 2_4_specialized_types.md:458  (score 13)
  matched: integral
  → phya: version_type | bhva: versionNormatives

§ 2.0.6.3 — Inline opaque block types
  file: 2_0_system_type_overview.md:343  (score 13)
  matched: bit
  → phya: datatypes

§ 2.0.6.3/B. [aspect] — Inline block declarations ← §2.0.6.3
  file: 2_0_system_type_overview.md:351  (score 13)
  matched: bit
  → phya: datatypes

§ 2.1.9.8/A. [aspect] — Type Data bit layout for `any` (48 bits) ← §2.1.9.8
  file: 2_1_primitive_types.md:544  (score 13)
  matched: bit

§ 2.2.0.2 — Normative properties
  file: 2_2_block_types.md:15  (score 13)
  matched: bit
  → phya: block_types | bhva: blocksNormatives

§ 2.3.1.4 — Semantic Data Binding
  file: 2_3_stream_types.md:74  (score 13)
  matched: bit
  → phya: stream_carrier_types

```

### read_chain({"chains":["2.1.1/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.1/all
# 2.1.1 Integral Class

Integral primitives represent fixed-width integer values with deterministic size, signedness, and binary representation. They are used for counters, identifiers, flags, protocol fields, offsets, and other numerically exact values where rounding is forbidden. All integral primitives are platform-independent and serialize canonically. This class is represented by the following types:

- `int8`/`uint8` — (u)signed 1-byte fixed-width integral type;

- `int16`/ `uint16` — (u)signed 2-bytes fixed-width integral type;

- `int32`/ `uint32` — (u)signed 4-bytes fixed-width integral type;

- `int64` /`uint64`  — (u)signed 8-bytes fixed-width integral type;

## 2.1.1.1 Designation

1. represent **numerically exact discrete quantities** without approximation or rounding;
2. provide **fixed-width arithmetic** suitable for protocol fields, counters, indexes, and offsets;
3. enable deterministic comparison, serialization, and replay across heterogeneous runtimes;
4. act as the foundational numeric carriers for higher-level constructs (records, blocks, identifiers).

## 2.1.1.2 Normative properties

1. Integral primitives **MUST have fixed and explicitly declared bit width** and signedness.
2. Integral primitives **MUST serialize canonically** with deterministic byte ordering and width preservation.
3. Integral primitives **MUST NOT permit implicit widening, narrowing, or signedness conversion**; any conversion MUST be explicit and type-safe.
4. Arithmetic operations on integral primitives **MUST be exact**; overflow or underflow **MUST be explicitly defined** (error, saturation, or wrap-around) and MUST NOT be implicit.
5. Integral comparison semantics **MUST be strict and deterministic**; cross-width or cross-signedness comparison is forbidden without explicit conversion.
6. Integral primitives **MUST NOT encode semantic meaning beyond numeric value** and **MUST NOT introduce behavior or authority**.

## 2.1.1.3 Semantic role

1. Integral primitives act as **exact numeric truth carriers**, forming the base layer of quantitative representation.
2. They support enforcement, validation, and audit by guaranteeing **precision, determinism, and replay safety**.
3. Integrals provide a stable numeric substrate upon which identifiers, enums, flags, and protocol-level constructs are safely built.

**A. Standards reference:**

- ISO/IEC 9899 (C integer model, width & signedness guarantees)
- ISO/IEC 10967 (Language-independent arithmetic)
- RFC 8949 (CBOR canonical integer encoding — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.




[Tokens: ~709]
```

## Answer
Based on the E.L.I.A. specification, the **Integral class** defines the following specific integer types with their bit widths:

**Signed Integer Types:**
- `int8` — signed 1-byte (8-bit) fixed-width integral type
- `int16` — signed 2-byte (16-bit) fixed-width integral type  
- `int32` — signed 4-byte (32-bit) fixed-width integral type
- `int64` — signed 8-byte (64-bit) fixed-width integral type

**Unsigned Integer Types:**
- `uint8` — unsigned 1-byte (8-bit) fixed-width integral type
- `uint16` — unsigned 2-byte (16-bit) fixed-width integral type
- `uint32` — unsigned 4-byte (32-bit) fixed-width integral type
- `uint64` — unsigned 8-byte (64-bit) fixed-width integral type

These types provide **fixed-width arithmetic** suitable for protocol fields, counters, indexes, and offsets. All integral primitives are **platform-independent** and **serialize canonically** using:

- **Fixed-width binary representation** corresponding exactly to their declared bit width (§2.1.9.2)
- **Two's-complement representation** for signed integers (§2.1.9.2)  
- **Big-endian byte order** by default (§2.1.9.2)

The specification emphasizes that integral primitives **MUST have fixed and explicitly declared bit width** and signedness, with **no implicit widening, narrowing, or signedness conversion** permitted (§2.1.1.2).

## Metrics
- calls_total: 7
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 16938
- tokens_out: 1835
- tokens_total: 18773
- cache_read: 120376
- cache_creation: 0
- wall_time_sec: 32.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_11_mcp1_v2.md
