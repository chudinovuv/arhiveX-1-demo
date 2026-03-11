# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["integer encoding","binary representation","integer values"],"onto":"HOW","intent":"full","indexRanking":["phya","sema","desa"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1204

### Call 2: read_chain
- params: {"chains":["2.1.9.2/all"],"budget":3500,"autoExpand":true}
- response_chars: 472

### Call 3: search_spec
- params: {"keyword":["integer types","bit width","integral primitives"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 2723

### Call 4: read_chain
- params: {"chains":["2.1.1.1/all"],"budget":3500,"autoExpand":true}
- response_chars: 441

### Call 5: fulltext_search
- params: {"query":"integer types u8 u16 u32 i8 i16 i32","maxResults":5}
- response_chars: 944

### Call 6: read_chain
- params: {"chains":["2.0.9.2/all"],"budget":3500,"autoExpand":true}
- response_chars: 147

### Call 7: read_chain
- params: {"chains":["3.21.1/all"],"budget":3500,"autoExpand":true}
- response_chars: 146

## Raw MCP Output
### search_spec({"keyword":["integer encoding","binary representation","integer values"],"onto":"HOW","intent":"full","indexRanking":["phya","sema","desa"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.2
## 2.1.9.2 Integer encoding
1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).

▸ [T1] 2.1.1
# 2.1.1 Integral Class
Integral primitives represent fixed-width integer values with deterministic size, signedness, and binary representation. They are used for counters, identifiers, flags, protocol fields, offsets, and other numerically exact values where rounding is forbidden. All integral primitives are platform-independent and serialize canonically. This class is represented by the following types:

▸ [T1] 2.1.1.1
## 2.1.1.1 Designation

▸ [T1] 2.1.1.2
## 2.1.1.2 Normative properties

▸ [T1] 2.1.1.3
## 2.1.1.3 Semantic role

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/C.
**C. When inline representation is used:**

[Tokens: ~269] [SUFFICIENT: 73% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.9.2/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.2/all
## 2.1.9.2 Integer encoding

1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).
4. Parsers **MUST reject** any integer payload whose length does not exactly match the declared width.


[Tokens: ~115]
```

### search_spec({"keyword":["integer types","bit width","integral primitives"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.2
## 2.1.9.2 Integer encoding
1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).

▸ [T1] 2.1.1
# 2.1.1 Integral Class
Integral primitives represent fixed-width integer values with deterministic size, signedness, and binary representation. They are used for counters, identifiers, flags, protocol fields, offsets, and other numerically exact values where rounding is forbidden. All integral primitives are platform-independent and serialize canonically. This class is represented by the following types:

▸ [T1] 2.1.1.1
## 2.1.1.1 Designation

▸ [T1] 2.1.1.2
## 2.1.1.2 Normative properties
1. Integral primitives **MUST have fixed and explicitly declared bit width** and signedness.
2. Integral primitives **MUST serialize canonically** with deterministic byte ordering and width preservation.
3. Integral primitives **MUST NOT permit implicit widening, narrowing, or signedness conversion**; any conversion MUST be explicit and type-safe.
4. Arithmetic operations on integral primitives **MUST be exact**; overflow or underflow **MUST be explicitly defined** (error, saturation, or wrap-around) and MUST NOT be implicit.
5. Integral comparison semantics **MUST be strict and deterministic**; cross-width or cross-signedness comparison is forbidden without explicit conversion.
6. Integral primitives **MUST NOT encode semantic meaning beyond numeric value** and **MUST NOT introduce behavior or authority**.

▸ [T1] 2.1.1.3
## 2.1.1.3 Semantic role
1. Integral primitives act as **exact numeric truth carriers**, forming the base layer of quantitative representation.
2. They support enforcement, validation, and audit by guaranteeing **precision, determinism, and replay safety**.
3. Integrals provide a stable numeric substrate upon which identifiers, enums, flags, and protocol-level constructs are safely built.

▸ [T2] 2.1
# 2.1 Primitive Types

▸ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

▸ [T2] 2.1.9.8/E.
**E. External primitives:**\

[Tokens: ~648] [SUFFICIENT: 54% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.1.1/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.1.1/all
## 2.1.1.1 Designation

1. represent **numerically exact discrete quantities** without approximation or rounding;
2. provide **fixed-width arithmetic** suitable for protocol fields, counters, indexes, and offsets;
3. enable deterministic comparison, serialization, and replay across heterogeneous runtimes;
4. act as the foundational numeric carriers for higher-level constructs (records, blocks, identifiers).


[Tokens: ~107]
```

### fulltext_search({"query":"integer types u8 u16 u32 i8 i16 i32","maxResults":5})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.0.9.2 — Integral aliases
  file: 2_0_system_type_overview.md:453  (score 39)
  matched: u32, i16, i32

§ 2.1.9.2 — Integer encoding
  file: 2_1_primitive_types.md:491  (score 13)
  matched: integer

§ 3.21.1 — Integer Literals
  file: 3_0_block_syntax.md:3042  (score 13)
  matched: integer

§ 1.0 — Design Principles
  file: 1_0_design_principles.md:2  (score 13)
  matched: types
  → ont: meaningFirst | desa: designPrinciplesFoundation | phla: antiDriftByConstruction, purposeOfLanguage | trma: syntaxBlock, fact, enforcementGraph, domainCompliance, functionalResilience, conwaySpace, blockConstructions, artificialIntelligence, domain, designPrinciples

§ 1.2 — Determinism by Construction
  file: 1_0_design_principles.md:158  (score 13)
  matched: types
  → sema: definition | ont: meaningFirst | desa: designPrinciplesFoundation | phla: permissibilityFirst | onma: typeSystem_why

```

### read_chain({"chains":["2.0.9.2/all"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.0.9.2

[Tokens: ~34]
```

### read_chain({"chains":["3.21.1/all"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 3.21.1

[Tokens: ~33]
```

## Answer
Based on the E.L.I.A. specification, integer values are encoded in binary according to the following rules defined in §2.1.9.2:

## Core Encoding Rules

1. **Fixed-width binary representation**: Integral primitives MUST be encoded using fixed-width binary representation that corresponds exactly to their declared bit width (§2.1.9.2).

2. **Two's complement for signed integers**: Signed integers MUST use two's-complement representation (§2.1.9.2).

3. **Big-endian byte order**: The default byte order MUST be big-endian, unless explicitly overridden by a block-level declaration using `beN` or `leN` modifiers (§2.1.9.2).

4. **Strict width validation**: Parsers MUST reject any integer payload whose length does not exactly match the declared width (§2.1.9.2).

## Key Properties

According to §2.1.1, integral primitives in E.L.I.A. are designed to:

- Represent **numerically exact discrete quantities** without approximation or rounding
- Provide **fixed-width arithmetic** suitable for protocol fields, counters, indexes, and offsets  
- Enable deterministic comparison, serialization, and replay across heterogeneous runtimes
- Act as foundational numeric carriers for higher-level constructs

## Normative Requirements

The specification enforces several strict requirements for integral primitives (§2.1.1.2):

- MUST have fixed and explicitly declared bit width and signedness
- MUST serialize canonically with deterministic byte ordering and width preservation
- MUST NOT permit implicit widening, narrowing, or signedness conversion
- Arithmetic operations MUST be exact, with overflow/underflow explicitly defined
- MUST provide strict and deterministic comparison semantics

This encoding scheme ensures platform-independent, deterministic integer representation that supports E.L.I.A.'s emphasis on precision, auditability, and replay safety across different runtime environments.

## Metrics
- calls_total: 7
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 17389
- tokens_out: 1739
- tokens_total: 19128
- cache_read: 120376
- cache_creation: 0
- wall_time_sec: 31.4
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_13_mcp1_v2.md
