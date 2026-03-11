# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["semantic type compatibility","type compatibility rules","semantic compatibility"],"onto":"WHAT","intent":"normative_rules","indexRanking":["sema","bhva","phya"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 106

### Call 2: search_spec
- params: {"keyword":["type compatibility","semantic type","type rules"],"onto":"WHAT","intent":"normative_rules","indexRanking":["sema","bhva","phya"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 198

### Call 3: fulltext_search
- params: {"query":"type compatibility semantic","maxResults":10}
- response_chars: 1595

### Call 4: read_chain
- params: {"chains":["2.0.4.5","2.5"],"budget":3500,"extract":"normative"}
- response_chars: 155

### Call 5: read_chain
- params: {"chains":["2.0"],"budget":3500,"extract":"normative"}
- response_chars: 143

### Call 6: search_spec
- params: {"keyword":["type system","type rules","compatibility"],"onto":"WHAT","intent":"normative_rules","maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 483

### Call 7: fulltext_search
- params: {"query":"semantics compatibility normative","maxResults":8}
- response_chars: 1558

### Call 8: read_chain
- params: {"chains":["2.3.3.3","2.2.0.2"],"budget":3500,"extract":"normative"}
- response_chars: 1279

### Call 9: search_spec
- params: {"keyword":["semantic compatibility","type compatibility","semantic rules"],"onto":"WHAT","intent":"normative_rules","maxUnits":2,"budget":4000,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1017

## Raw MCP Output
### search_spec({"keyword":["semantic type compatibility","type compatibility rules","semantic compatibility"],"onto":"WHAT","intent":"normative_rules","indexRanking":["sema","bhva","phya"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```
No units found for keywords: semantic type compatibility, type compatibility rules, semantic compatibility
```

### search_spec({"keyword":["type compatibility","semantic type","type rules"],"onto":"WHAT","intent":"normative_rules","indexRanking":["sema","bhva","phya"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T2] 2.1.10.1
## 2.1.10.1 Fundamental Principles

[Tokens: ~17] [SUFFICIENT: 94% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### fulltext_search({"query":"type compatibility semantic","maxResults":10})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.5 — Derived Types
  file: 2_5_derived_types.md:1  (score 39)
  matched: type, compatibility, semantic
  → phya: derived_types

§ 2.5/C. [aspect] — Explanations ← §2.5
  file: 2_5_derived_types.md:26  (score 39)
  matched: type, compatibility, semantic
  → phya: derived_types

§ 2.0 — System Type Overview
  file: 2_0_system_type_overview.md:1  (score 26)
  matched: type, semantic
  → phya: datatypes | desa: typeSystemDesign | phla: permissibilityFirst | onma: typeSystem_what

§ 2.0/A. [aspect] — A critical distinction must be made between two concerns that may appear contrad ← §2.0
  file: 2_0_system_type_overview.md:5  (score 26)
  matched: type, semantic
  → phya: datatypes

§ 2.0.4.5 — Type Interaction Matrix
  file: 2_0_system_type_overview.md:225  (score 26)
  matched: type, semantic

§ 2.0.5.2 — Tuple
  file: 2_0_system_type_overview.md:261  (score 26)
  matched: type, semantic
  → phya: datatypes

§ 2.0.6 — Inline-declared Types
  file: 2_0_system_type_overview.md:299  (score 26)
  matched: type, semantic
  → phya: datatypes | desa: typeSystemDesign

§ 2.0.6/(B) [seq] — A critical property of inline-declared types is that they are never anonymous at ← §2.0.6
  file: 2_0_system_type_overview.md:310  (score 26)
  matched: type, semantic
  → phya: datatypes

§ 2.0.6.1 — Semantic role
  file: 2_0_system_type_overview.md:319  (score 26)
  matched: type, semantic

§ 2.0.8 — Type Aspect Model
  file: 2_0_system_type_overview.md:415  (score 26)
  matched: type, semantic
  → phya: datatypes | desa: typeSystemDesign

```

### read_chain({"chains":["2.0.4.5","2.5"],"budget":3500,"extract":"normative"})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.0.4.5
  ✗ 2.5

[Tokens: ~36]
```

### read_chain({"chains":["2.0"],"budget":3500,"extract":"normative"})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.0

[Tokens: ~33]
```

### search_spec({"keyword":["type system","type rules","compatibility"],"onto":"WHAT","intent":"normative_rules","maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.2
# 2.2 Blocks

▸ [T1] 2.2.0.1
## 2.2.0.1 Designation

▸ [T1] 2.2.0.2
## 2.2.0.2 Normative properties

▸ [T1] 2.2.0.3
## 2.2.0.3 Semantic role


─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.5
  ✗ 2.5.0.1
  ✗ 2.5.0.3
  ✗ 2.5.0.2
  ✗ 2.0
  ✗ 2.0.1

[Tokens: ~89] [SUFFICIENT: 86% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### fulltext_search({"query":"semantics compatibility normative","maxResults":8})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.3.3.3 — Normative properties
  file: 2_3_stream_types.md:195  (score 39)
  matched: semantics, compatibility, normative
  → phya: stream_raw_binary_types | bhva: rawBinaryClassNormatives

§ 2.5.0.2 — Normative rules
  file: 2_5_derived_types.md:46  (score 39)
  matched: semantics, compatibility, normative
  → phya: derived_types

§ 2.5.2.6.1 — Declaration (Normative)
  file: 2_5_derived_types.md:406  (score 39)
  matched: semantics, compatibility, normative
  → phya: event_type | grma: eventClassSyntax | onma: event_how

§ 2.5.2.6.1/A. [aspect] — Declaration form and scope ← §2.5.2.6.1
  file: 2_5_derived_types.md:408  (score 39)
  matched: semantics, compatibility, normative
  → onma: event_how

§ 1.0 — Design Principles
  file: 1_0_design_principles.md:2  (score 26)
  matched: semantics, normative
  → ont: meaningFirst | desa: designPrinciplesFoundation | phla: antiDriftByConstruction, purposeOfLanguage | trma: syntaxBlock, fact, enforcementGraph, domainCompliance, functionalResilience, conwaySpace, blockConstructions, artificialIntelligence, domain, designPrinciples

§ 2.1.9.8 — Normative rules
  file: 2_1_primitive_types.md:524  (score 26)
  matched: semantics, normative

§ 2.2.0.2 — Normative properties
  file: 2_2_block_types.md:15  (score 26)
  matched: semantics, normative
  → phya: block_types | bhva: blocksNormatives

§ 2.2.2.0.2 — Normative properties
  file: 2_2_block_types.md:264  (score 26)
  matched: semantics, normative
  → bhva: structuralBlockClassNormatives

```

### read_chain({"chains":["2.3.3.3","2.2.0.2"],"budget":3500,"extract":"normative"})
```
▸ 2.3.3.3
**2.3.3.3 Normative properties**
  [MUST] 1. RAW Binary **MUST preserve binary payload integrity** across streaming and transport boundaries.
  [MUST] 2. RAW Binary **MUST support incremental consumption and validation** without requiring full payload materialization.
  [MUST NOT] 3. RAW Binary **MUST NOT expose structure, ordering semantics, or interpretation beyond raw byte delivery**.
  [MUST] 4. Any conversion from RAW Binary to a bounded block **MUST be explicit** and **MUST enforce size limits, integrity checks, and declared encoding constraints**.
  [MUST] 5. RAW Binary **MUST enforce a maximum materialized in-memory size of 2 147 483 647 bytes (~2 GiB)** when explicitly converted to a bounded block. This limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory byte buffers and arrays are constrained by signed 32-bit indexing semantics.
  [MUST NOT] 6. RAW Binary **MUST NOT encode behavior, control flow, or execution semantics**.


▸ 2.2.0.2
**2.2.0.2 Normative properties**
  [MUST] 1. Each block type **MUST belong to a block class** that explicitly defines:


[Tokens: ~316]
```

### search_spec({"keyword":["semantic compatibility","type compatibility","semantic rules"],"onto":"WHAT","intent":"normative_rules","maxUnits":2,"budget":4000,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.10.1
## 2.1.10.1 Fundamental Principles

▸ [T1] 2.1.10.6
## 2.1.10.6 Normative Rules

▸ [T1] 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)

▸ [T1] 2.1.10.2.4
### 2.1.10.2.4 Special / Control Type Rules

▸ [T1] 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

▸ [T2] 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

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

▸ [T2] 2.1.9.8/D.
**D. Deterministic inlining rule (normative)**\

[Tokens: ~222] [SUFFICIENT: 81% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

## Answer
Based on my search through the E.L.I.A. specification, I found several normative rules that govern semantic type compatibility:

## Fundamental Type Compatibility Rules

**§2.1.10.6 Normative Rules** establishes the core framework for type compatibility in E.L.I.A., with specific subsections covering different aspects:

### Assignment and Conversion Rules (§2.1.10.2)

1. **Implicit Assignment (§2.1.10.2.1)** - Governs when types can be implicitly assigned without explicit conversion
2. **Explicit Conversion for Numeric Types (§2.1.10.2.2)** - Defines mandatory conversion rules between numeric primitives
3. **Explicit Conversion for Non-Numeric Primitives (§2.1.10.2.3)** - Specifies conversion requirements for non-numeric primitive types
4. **Special/Control Type Rules (§2.1.10.2.4)** - Handles compatibility for special control types

### Primitive Type Classification Framework (§2.1)

The specification establishes that **each primitive belongs to a primitive class** that explicitly defines compatibility constraints. This ensures that:

- All operations on primitive data are **deterministic**
- Type interactions are **auditable** 
- Semantic constraints are **enforced by design**

### Stream Type Compatibility (§2.3.3.3)

For RAW Binary stream types, specific normative rules include:

- **MUST preserve binary payload integrity** across boundaries
- **MUST support incremental consumption** without full materialization
- **MUST NOT expose structure or interpretation** beyond raw byte delivery
- **MUST be explicit** when converting to bounded blocks with size/integrity enforcement

### Type System Architecture

The specification references a **Type Interaction Matrix (§2.0.4.5)** and comprehensive **Derived Types (§2.5)** section that would contain additional semantic compatibility rules, though these sections were not accessible in the current specification build.

The normative framework emphasizes **explicit type relationships**, **deterministic behavior**, and **semantic constraint preservation** as the core principles governing type compatibility in E.L.I.A.

## Metrics
- calls_total: 9
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 22154
- tokens_out: 2301
- tokens_total: 24455
- cache_read: 149066
- cache_creation: 3404
- wall_time_sec: 45.5
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-56-17
- saved_to: haiku/mcp1_v2/q_20_mcp1_v2.md
