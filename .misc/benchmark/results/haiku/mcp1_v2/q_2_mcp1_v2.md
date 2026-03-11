# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["binary encoding","primitive types","inline threshold"],"onto":"HOW","intent":"full","indexRanking":["phya","sema","desa"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 4268

### Call 2: read_chain
- params: {"chains":["2.1.9.10","2.1.9.8"],"budget":3500,"autoExpand":true}
- response_chars: 1396

### Call 3: read_chain
- params: {"chains":["2.1.9.10.1","2.1.9.10.2"],"budget":3500,"autoExpand":true}
- response_chars: 137

### Call 4: fulltext_search
- params: {"query":"48 bits inline threshold primitive encoding","maxResults":5}
- response_chars: 763

### Call 5: read_chain
- params: {"chains":["2.1.9.9.1","2.1.9.1"],"budget":3500,"autoExpand":true}
- response_chars: 710

### Call 6: search_spec
- params: {"keyword":["numeric encoding","string encoding","boolean encoding"],"onto":"HOW","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 488

## Raw MCP Output
### search_spec({"keyword":["binary encoding","primitive types","inline threshold"],"onto":"HOW","intent":"full","indexRanking":["phya","sema","desa"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives
This section defines the **normative binary serialization and parsing rules** for all primitive types. These rules are mandatory and apply uniformly across runtimes, transports, persistence layers, and replay environments.

▸ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles
  [...]
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

▸ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T1] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T1] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

▸ [T1] 2.1.9.8/C.
**C. When inline representation is used:**

▸ [T1] 2.1
# 2.1 Primitive Types
Primitive types are used to encode **primitive information** — irreducible factual values that have no internal structure at the language level. They form the lowest semantic layer of the type system and serve as the building blocks for blocks, records, streams, and higher-order constructs.

▸ [T1] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T1] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


> **Note**: This section establishes the normative scope and intent of Primitive Types, defining their ontological role and core constraints and basic serialization within the type system. It intentionally does not exhaustively specify  security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.



▸ [T1] 2.1.5/all
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

▸ [T2] 2.1.9.9
## 2.1.9.9 Parser obligations

▸ [T2] 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)

▸ [T2] 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)

▸ [T2] 2.1.10/all
# 2.1.10 Type Compatibility and Conversion Rules (Normative)
  [...]
## 2.1.10.1 Fundamental Principles
  [...]
## 2.1.10.2 Primitive Type Compatibility Matrix
  [...]
### 2.1.10.2.1 Assignment (Implicit)
  [...]
### 2.1.10.2.2 Explicit Conversion — Numeric Types
  [...]
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives
  [...]
### 2.1.10.2.4 Special / Control Type Rules
  [...]
## 2.1.10.3 Block Type Compatibility
  [...]
## 2.1.10.4 Derived Type Compatibility
  [...]
### 2.1.10.4.1 Record
  [...]
### 2.1.10.4.2 Array and Typed Array
  [...]
### 2.1.10.4.3 Collection and Dictionary
  [...]
### 2.1.10.4.4 Class and Interface
  [...]
### 2.1.10.4.5 Error and Event
  [...]
## 2.1.10.5 Semantic Type Compatibility
  [...]
## 2.1.10.6 Normative Rules
  [...]
## 2.1.10.7 Cross-reference Summary

▸ [T2] 2.1.9.10
## 2.1.9.10 Performance Implications

▸ [T2] 2.1.9.10.1
### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

▸ [T2] 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

▸ [T2] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

▸ [T2] 2.1.8.8/A.
[Section 2.1.8.8 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

▸ [T2] 2.1.8.8/B.
[Section 2.1.8.8 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

▸ [T2] 2.1.8.8/C.
[Section 2.1.8.8 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

▸ [T2] 2.1.8.8/D.
[Section 2.1.8.8 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

[Tokens: ~1034] [SUFFICIENT: 80% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.9.10","2.1.9.8"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.10
## 2.1.9.10 Performance Implications
This section describes **normative and practical performance considerations** related to the choice between **inline** and **external** primitive representations. These implications **DO NOT alter semantic meaning**, but **SHOULD** inform schema design, layout decisions, and performance optimization strategies.

▸ 2.1.9.8
### 2.1.9.8 Normative rules
1. `FORMAT_FLAGS` encode **security, compression, and reference semantics**.
2. Type Data **MAY** contain:
   - (a) an **inlined value** (if the referenced concrete type fits within 48 bits), **OR**
   - (b) an **offset / reference** to an external value.
3. The referenced value **MUST** carry its own **Envelope** and **MUST** follow its own encoding rules.
4. When Type Data contains an **offset reference**:
   - (a) Bits [47..16] store a **32-bit unsigned offset** from the start of the current Envelope;
   - (b) Bits [15..0] are **Reserved** and **MUST be 0**;
   - (c) The referenced value **MUST begin** at the specified offset and **MUST start with its own Envelope**.
5. When Type Data contains an **inlined value**:
   - (a) All 48 bits store the actual value of the referenced primitive or block;
   - (b) Bits [5..3] of `FORMAT_FLAGS` **MUST encode the reference mode**:
     - (i) `0` — inline value;
     - (ii) `1` — offset reference;
   - (iii) `2–7` — reserved.

[Tokens: ~346]
```

### read_chain({"chains":["2.1.9.10.1","2.1.9.10.2"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.10.1
### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

▸ 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

[Tokens: ~31]
```

### fulltext_search({"query":"48 bits inline threshold primitive encoding","maxResults":5})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.1.9.8 — Normative rules
  file: 2_1_primitive_types.md:524  (score 26)
  matched: bits, inline

§ 2.1.9.9.1 — Parsing algorithm (normative)
  file: 2_1_primitive_types.md:609  (score 26)
  matched: bits, primitive

§ 2.1.9.10.1 — **Inline primitives (≤ 48 bits)**
  file: 2_1_primitive_types.md:684  (score 26)
  matched: bits, inline

§ 2.0.6 — Inline-declared Types
  file: 2_0_system_type_overview.md:299  (score 26)
  matched: inline, primitive
  → phya: datatypes | desa: typeSystemDesign

§ 2.0.6/(B) [seq] — A critical property of inline-declared types is that they are never anonymous at ← §2.0.6
  file: 2_0_system_type_overview.md:310  (score 26)
  matched: inline, primitive
  → phya: datatypes

```

### read_chain({"chains":["2.1.9.9.1","2.1.9.1"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)
When parsing a primitive value, an implementation **MUST** execute the following steps sequentially:

▸ 2.1.9.1
## 2.1.9.1 Canonical encoding principles
1. All primitive values **MUST serialize deterministically** into a single canonical binary representation.
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

[Tokens: ~174]
```

### search_spec({"keyword":["numeric encoding","string encoding","boolean encoding"],"onto":"HOW","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.4
## 2.1.9.4 Boolean encoding
1. Boolean values **MUST be encoded as a single canonical value** representing `true` or `false`.
2. Any non-canonical or multi-bit boolean encoding **MUST be rejected**.

▸ [T1] 2.1.3
# 2.1.3 Boolean Class

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

[Tokens: ~90] [SUFFICIENT: 81% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

## Answer
Based on the specification content I've gathered, I can now provide a comprehensive answer about binary encoding rules for primitive types in E.L.I.A. and the inline threshold.

## Binary Encoding Rules for Primitive Types

E.L.I.A. defines normative binary serialization rules for all primitive types in §2.1.9. The key principles are:

### Canonical Encoding Principles (§2.1.9.1)

1. **Deterministic serialization**: All primitive values MUST serialize deterministically into a single canonical binary representation
2. **Bijective encoding**: Serialization MUST be bijective - decoding the serialized form MUST always reconstruct the original primitive value without loss of information
3. **Platform independence**: Canonical encoding MUST NOT depend on platform architecture, CPU endianness, word size, locale, or runtime configuration
4. **Unique representation**: No primitive MAY have more than one valid binary encoding for the same semantic value

### Type-Specific Encoding Rules

- **Boolean encoding** (§2.1.9.4): Boolean values MUST be encoded as a single canonical value representing `true` or `false`. Any non-canonical or multi-bit boolean encoding MUST be rejected.

### Inline Threshold: 48 Bits

The inline threshold in E.L.I.A. is **48 bits** (§2.1.9.8, §2.1.9.10.1). This threshold determines how primitive values are stored:

#### Inline Primitives (≤ 48 bits)
For primitives that fit within 48 bits, the value is stored **inline** directly within the Type Data field of the `any` type's 48-bit layout. The encoding rules specify:

- All 48 bits store the actual value of the referenced primitive or block
- Bits [5..3] of `FORMAT_FLAGS` MUST encode the reference mode as `0` for inline values

#### External Primitives (> 48 bits)  
For primitives larger than 48 bits, the Type Data contains an **offset reference** instead:

- Bits [47..16] store a 32-bit unsigned offset from the start of the current Envelope
- Bits [15..0] are Reserved and MUST be 0
- The referenced value MUST begin at the specified offset and MUST start with its own Envelope
- Bits [5..3] of `FORMAT_FLAGS` MUST be set to `1` for offset reference

### Normative Parsing (§2.1.9.9.1)

The specification defines mandatory parsing algorithms that implementations MUST execute sequentially when parsing primitive values, ensuring consistent interpretation across all E.L.I.A. runtimes, transports, persistence layers, and replay environments.

The 48-bit threshold represents a key design decision balancing memory efficiency (inline storage for small values) with flexibility (external storage for larger values), while maintaining the bijective and platform-independent encoding requirements.

## Metrics
- calls_total: 6
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 20567
- tokens_out: 1982
- tokens_total: 22549
- cache_read: 105329
- cache_creation: 0
- wall_time_sec: 35.0
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_2_mcp1_v2.md
