# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["block type","compatibility","assignment"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","sema","bhva"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2}
- response_chars: 3288

### Call 2: search_spec
- params: {"keyword":["block type assignment","block conversion","block class compatibility"],"onto":"HOW","intent":"normative_rules","indexRanking":["phya","bhva"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2}
- response_chars: 95

### Call 3: fulltext_search
- params: {"query":"block assignment conversion compatibility","maxResults":5}
- response_chars: 1311

### Call 4: read_chain
- params: {"chains":["2.7.2.0.2"],"budget":3500,"autoExpand":true}
- response_chars: 149

### Call 5: read_chain
- params: {"chains":["2.7.2"],"budget":3500,"autoExpand":true}
- response_chars: 145

### Call 6: read_chain
- params: {"chains":["2.2/all"],"budget":4000,"autoExpand":true}
- response_chars: 7301

### Call 7: read_chain
- params: {"chains":["2.1.10"],"budget":3000,"autoExpand":true}
- response_chars: 367

## Raw MCP Output
### search_spec({"keyword":["block type","compatibility","assignment"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","sema","bhva"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2})
```

═══ CONTENT ═══
▸ [T1] 2.2
# 2.2 Blocks
Block types are used to model **opaque or structurally fixed or dynamic data payloads** whose internal representation is either intentionally hidden or strictly defined at the binary level. Their primary purpose is to enable **safe serialization, transport, cryptographic processing, storage, and replay** of data that must remain **immutable, atomic, and behavior-free** across all boundaries.

▸ [T1] 2.2.0.1
## 2.2.0.1 Designation

▸ [T1] 2.2.0.2
## 2.2.0.2 Normative properties
1. Each block type **MUST belong to a block class** that explicitly defines:

▸ [T1] 2.2.0.3
## 2.2.0.3 Semantic role
1. Block types act as **atomic physical truth carriers**, anchoring semantic data to concrete binary representation.
2. They provide a safe substrate for **cryptographic operations, audit evidence, persistence, and replay** without leaking structure or behavior into the semantic layer.
3. Block classes define the enforcement boundary where **physical constraints (size, layout, encoding)** become semantically observable and verifiable.
4. Block types act as the **bridge between semantic data models and physical binary reality**. They enable the language to safely represent binary and textual artefacts while preserving determinism and auditability.

▸ [T1] 2.1.10.1
## 2.1.10.1 Fundamental Principles
1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

▸ [T1] 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)
The only permitted implicit assignments are **identity** and **nullable widening**:

▸ [T1] 2.1.10.2.4
### 2.1.10.2.4 Special / Control Type Rules

▸ [T1] 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

▸ [T2] 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

▸ [T2] 2.1.10.6
## 2.1.10.6 Normative Rules

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

[Tokens: ~790] [SUFFICIENT: 50% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### search_spec({"keyword":["block type assignment","block conversion","block class compatibility"],"onto":"HOW","intent":"normative_rules","indexRanking":["phya","bhva"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2})
```
No units found for keywords: block type assignment, block conversion, block class compatibility
```

### fulltext_search({"query":"block assignment conversion compatibility","maxResults":5})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.5.2.6.1 — Declaration (Normative)
  file: 2_5_derived_types.md:406  (score 26)
  matched: block, compatibility
  → phya: event_type | grma: eventClassSyntax | onma: event_how

§ 2.7.2.0.2 — Types Compatibility
  file: 2_7_2_data_interface.md:58  (score 26)
  matched: block, compatibility
  → sema: data_interface

§ 5.4 — Layer 4 — Physical Execution & Runtime Reality
  file: 5_0_domain_semantic_authority.md:486  (score 26)
  matched: block, compatibility
  → sema: domainAuthority | ont: domainSemanticContour | desa: domainStructure | onma: domainAuthority_what, domainAuthority_how

§ 1.0 — Design Principles
  file: 1_0_design_principles.md:2  (score 13)
  matched: block
  → ont: meaningFirst | desa: designPrinciplesFoundation | phla: antiDriftByConstruction, purposeOfLanguage | trma: syntaxBlock, fact, enforcementGraph, domainCompliance, functionalResilience, conwaySpace, blockConstructions, artificialIntelligence, domain, designPrinciples

§ 1.2/(A) [seq] — At the syntactic level, determinism is achieved through a strictly defined block ← §1.2
  file: 1_0_design_principles.md:162  (score 13)
  matched: block
  → sema: definition | ont: meaningFirst | desa: designPrinciplesFoundation | phla: permissibilityFirst | onma: typeSystem_why

```

### read_chain({"chains":["2.7.2.0.2"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.7.2.0.2

[Tokens: ~34]
```

### read_chain({"chains":["2.7.2"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.7.2

[Tokens: ~33]
```

### read_chain({"chains":["2.2/all"],"budget":4000,"autoExpand":true})
```
▸ 2.2/all
# 2.2 Blocks

Block types are used to model **opaque or structurally fixed or dynamic data payloads** whose internal representation is either intentionally hidden or strictly defined at the binary level. Their primary purpose is to enable **safe serialization, transport, cryptographic processing, storage, and replay** of data that must remain **immutable, atomic, and behavior-free** across all boundaries.

> This section establishes the normative scope and intent of Block Types, defining their ontological role and core constraints within the type system. It intentionally does not exhaustively specify serialization mechanics, security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.

## 2.2.0.1 Designation

1. Represent opaque or structural **limited layout of data payloads** whose internal structure is either intentionally hidden or strictly defined at the binary level;
2. Enable safe handling of **raw binary artefacts**, bounded textual payloads, fixed-layout binary structures, and externally defined formats;
3. Provide a controlled boundary between **semantic data models** and **physical serialization reality**;
4. Ensure that data requiring cryptographic processing, persistence, transport, or replay remains behavior-free and semantically isolated.
5. Ensure **controlled, canonical serialization** strictly driven by declared type metadata or an explicit boxed envelope, without introducing alternative encoding or semantic interpretation.

## 2.2.0.2 Normative properties

1. Each block type **MUST belong to a block class** that explicitly defines:

   - (a) the permitted processing model (opaque handling, fixed-layout interpretation);
   - (b) the admissible set of operations (equality, transport, encryption, hashing, persistence);
   - (c) canonical rules of serialization, validation, and boundary enforcement;
   - (d) enforced physical size constraints.

2. All block values **MUST comply with a mandatory physical length limit of 26-bit** (2^26 − 1 bytes), establishing an upper bound on materialized block size.

3. The 26-bit length constraint **MUST be enforced by construction** and **MUST NOT** be bypassed via composition, wrapping, or serialization tricks.

4. All Block types **MUST NOT** encode business logic, control flow, or executable behavior.

5. Auto-promotion Block→Stream. Such promotion is a re-qualification of type from block to stream types with losing all normative properties mandatory to block types. Brief description of promotion below, but more detailed read in ANNEX.  Minimal requirements for auto promotion at processing/mutation/declaration:

   - (a) Size > 2²⁶-1 bytes
   - (b) Binding to data interface over stream
   - (c) Unbounded cardinality into collection/dictionary
   - (d) declaration does not sealed with block statement

6. Auto promotion conditions Stream→Block possible only for block-materialized  by design types

   - (a) Full materialization bounded 
   - (b) Explicit policy resolution 
   - (c) Security context preservation
   - (d) enforcement and explanation context preservation

7. Block-capable derived types are **block-materialized by default**. When the effective physical size exceeds **2^26 − 1 bytes**, the representation **MUST** be resolved deterministically according to the declared constraints:

   - (a) **Block-only declaration (block)**— the value **MUST NOT** be stream-materialized. If the effective size reaches or exceeds **2^26 − 1 bytes**, the compiler/runtime **MUST generate an error** at construction, mutation, or serialization/deserialization.
   - (b) **Stream-eligible declaration (no block)** — the value **MUST be stream-materialized** once the effective size exceeds **2^26 − 1 bytes**. In this mode, **block-specific constraints no longer apply**, and **stream semantics apply instead**. The `SIZE_LIMITED_26BIT` flag **MUST be set to 0** during mutation and serialization/deserialization.
   - (c) **Record** — records are **non-scalable by design** and **MUST NOT** transition to Stream representation. A record value **MUST NOT exceed** **2^26 − 1 bytes**; exceeding this limit **MUST generate an error** at construction, mutation, or serialization/deserialization. 

> **WARN**: It is not recommended to have large nested array declarations in a record. Instead, declare an array type and assign the array type to the property.



## 2.2.0.3 Semantic role

1. Block types act as **atomic physical truth carriers**, anchoring semantic data to concrete binary representation.
2. They provide a safe substrate for **cryptographic operations, audit evidence, persistence, and replay** without leaking structure or behavior into the semantic layer.
3. Block classes define the enforcement boundary where **physical constraints (size, layout, encoding)** become semantically observable and verifiable.
4. Block types act as the **bridge between semantic data models and physical binary reality**. They enable the language to safely represent binary and textual artefacts while preserving determinism and auditability.

Block values are valid subjects of enforcement, classification, encryption, and audit, while remaining strictly non-behavioral and semantically inert.

> **Normative reference:** Canonical block classes, type codes, size semantics (including the 26-bit length constraint), and encoding rules are defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.
## 2.2.0.4 String Type Hierarchy

The language defines three distinct string representations whose semantics, constraints, and materialization models **MUST NOT be conflated**:

| Type | Category | Max size | Serialization | Auto-scale | Section |
|------|----------|----------|---------------|------------|---------|
| `fixed string[N]` | Primitive | 1 ≤ N < 1024 bytes | Exactly N bytes, zero-filled | **No** — size is fixed at declaration | §2.1.8 |
| `string[N]` | Opaque block | N ≤ 2^26 − 1 bytes | Length-prefixed, variable | **No** — bounded by declared N | §2.2.1 |
| `string` (unbounded) | Block / Stream | Up to 2^26 − 1 as block | Length-prefixed, variable | **Yes** — auto-promotes to Stream when size exceeds block limit | §2.2.0.2 (5) |

**A. Normative distinctions:**

1. `fixed string[N]` is a **primitive type** (§2.1.8): capacity is declared at definition time, serialized representation is always exactly N bytes (UTF-8, zero-padded), no length prefix, no auto-scaling. Suitable for fixed-layout records and protocol headers.

2. `string[N]` is an **opaque block type** (§2.2.1): capacity is bounded by the declared N up to the 26-bit block limit, serialized with a length prefix, payload is variable-length UTF-8. No promotion to Stream is permitted — exceeding N **MUST be rejected**.

3. `string` (without capacity) is a **block-materialized type by default** that **MUST auto-promote to Stream** once the effective payload exceeds 2^26 − 1 bytes (§2.2.0.2, normative property 5).

4. Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**.



[Tokens: ~1822]
```

### read_chain({"chains":["2.1.10"],"budget":3000,"autoExpand":true})
```
▸ 2.1.10
# 2.1.10 Type Compatibility and Conversion Rules (Normative)
This section defines the **complete type compatibility matrix** for all E.L.I.A. types. It governs which types can be assigned, converted, or passed as arguments without violating semantic safety. All rules in this section are **normative** and **MUST** be enforced at compile time.

[Tokens: ~89]
```

## Answer
Based on the E.L.I.A. specification, here are the **block type compatibility rules**:

## **No, block types cannot be freely assigned to each other**

E.L.I.A. follows **strict typing principles** with very limited assignment compatibility:

### **Fundamental Assignment Rules (§2.1.10.1)**

1. **Identity assignment only**: `T → T` is always permitted for identical block types
2. **Nullable widening**: `BlockType → BlockType?` is permitted (non-nullable to nullable)
3. **No implicit conversions**: No implicit type conversions are permitted between distinct block types
4. **Explicit conversion required**: Different block types require declared conversion operators or functions

### **Block Type Constraints (§2.2.0.2)**

Each block type **MUST belong to a specific block class** that defines:
- Permitted processing model (opaque vs. fixed-layout)
- Admissible operations (equality, transport, encryption, hashing, persistence)  
- Canonical serialization and validation rules
- Physical size constraints

### **Special Case: String Type Hierarchy (§2.2.0.4)**

The specification explicitly states that **implicit coercion between different string block types is forbidden**:

- `fixed string[N]` (primitive type)
- `string[N]` (opaque block type) 
- `string` (block/stream type)

**Explicit conversion MUST be used** when moving values between these string tiers.

### **Auto-Promotion Exception (§2.2.0.2)**

The only automatic type change allowed is **Block → Stream promotion** when:
- Size exceeds 2^26 - 1 bytes
- Type is not declared with `block` keyword (which prevents promotion)

This is a **re-qualification**, not an assignment between different block types.

## **Summary**

Block types follow E.L.I.A.'s strict typing model: only identity assignments and nullable widening are permitted. Different block types require explicit conversion functions and cannot be assigned to each other implicitly, even within the same block class.

## Metrics
- calls_total: 7
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 22438
- tokens_out: 1912
- tokens_total: 24350
- cache_read: 120376
- cache_creation: 0
- wall_time_sec: 38.0
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_18_mcp1_v2.md
