# Render: Q20 — B-010 (B-010)

## Extracted Content

### search_spec({"keyword":["semantic type compatibility","type system constraints"],"onto":"WHAT","intent":"normative_rules","indexRanking":["sema","bhva","ont"],"maxUnits":3,"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```
No units found for keywords: semantic type compatibility, type system constraints
```

### search_spec({"keyword":["type compatibility","conformance"],"onto":"WHAT","intent":"normative_rules","indexRanking":["sema","bhva"],"maxUnits":3,"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] G.4/all
[File not found for chain G.4]

Γû╕ [T1] G.5/all
[File not found for chain G.5]

Γû╕ [T2] G.6/all
[File not found for chain G.6]

Γû╕ [T2] 2.1.10.1
## 2.1.10.1 Fundamental Principles

Γû╕ [T2] E.1
[File not found for chain E.1]

Γû╕ [T2] E.1/A.
[File not found for chain E.1]

Γû╕ [T2] E.1/B.
[File not found for chain E.1]


[... TRUNCATED — 93 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 113/3500 tokens, trimmed from 93]
```

### fulltext_search({"query":"type compatibility assignment conformance","maxResults":10})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

┬º 2.3.3.3 ΓÇö Normative properties
  file: 2_3_stream_types.md:195  (score 26)
  matched: type, compatibility
  ΓåÆ phya: stream_raw_binary_types | bhva: rawBinaryClassNormatives

┬º 2.5 ΓÇö Derived Types
  file: 2_5_derived_types.md:1  (score 26)
  matched: type, compatibility
  ΓåÆ phya: derived_types

┬º 2.5/C. [aspect] ΓÇö Explanations ΓåÉ ┬º2.5
  file: 2_5_derived_types.md:26  (score 26)
  matched: type, compatibility
  ΓåÆ phya: derived_types

┬º 2.7.2.0.2 ΓÇö Types Compatibility
  file: 2_7_2_data_interface.md:58  (score 26)
  matched: type, compatibility
  ΓåÆ sema: data_interface

┬º 8.1.5.1 ΓÇö Limited LSP (Normative)
  file: 8_0_resilience_model.md:165  (score 26)
  matched: type, assignment
  ΓåÆ ont: recordVsClass | desa: dataBehaviorSplit

┬º 2.0 ΓÇö System Type Overview
  file: 2_0_system_type_overview.md:1  (score 13)
  matched: type
  ΓåÆ phya: datatypes | desa: typeSystemDesign | phla: permissibilityFirst | onma: typeSystem_what

┬º 2.0/A. [aspect] ΓÇö A critical distinction must be made between two concerns that may appear contrad ΓåÉ ┬º2.0
  file: 2_0_system_type_overview.md:5  (score 13)
  matched: type
  ΓåÆ phya: datatypes

┬º 2.0.1 ΓÇö Terms and Definitions
  file: 2_0_system_type_overview.md:16  (score 13)
  matched: type
  ΓåÆ phya: datatypes | phla: permissibilityFirst | trma: enforcementMechanic, specializedType, dataSurrogate, behavioralSurrogate | onma: typeSystem_what

┬º 2.0.3 ΓÇö Fundamental Type Categories
  file: 2_0_system_type_overview.md:86  (score 13)
  matched: type
  ΓåÆ desa: typeSystemDesign

┬º 2.0.4.5 ΓÇö Type Interaction Matrix
  file: 2_0_system_type_overview.md:225  (score 13)
  matched: type

```

### read_chain({"chains":["2.7.2.0.2","2.0.4.5","8.1.5.1"],"extract":"normative","budget":4000})
```
Γû╕ 2.7.2.0.2
[no normative statements found]

Γû╕ 2.0.4.5
[no normative statements found]

[8.1.5.1] File not found for chain 8.1.5.1
[Tokens: ~34]
```

### read_chain({"chains":["2.7.2.0.2","2.0.4.5"],"budget":4000})
```
Γû╕ 2.7.2.0.2
[Section 2.7.2.0.2 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

Γû╕ 2.0.4.5
[Section 2.0.4.5 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

[Tokens: ~70]
```

### search_spec({"keyword":["assignment","type rules","substitutability"],"onto":"WHAT","intent":"normative_rules","maxUnits":3,"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.2
# 2.2 Blocks

Γû╕ [T1] 2.2.0.1
## 2.2.0.1 Designation

Γû╕ [T1] 2.2.0.2
## 2.2.0.2 Normative properties

Γû╕ [T1] 2.2.0.3
## 2.2.0.3 Semantic role

Γû╕ [T1] 2.1.10.1
## 2.1.10.1 Fundamental Principles
1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

Γû╕ [T1] 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)
The only permitted implicit assignments are **identity** and **nullable widening**:

Γû╕ [T1] 2.1.10.6
## 2.1.10.6 Normative Rules

Γû╕ [T1] 2.1.10.2.4
### 2.1.10.2.4 Special / Control Type Rules

Γû╕ [T1] 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

Γû╕ [T1] B.4
[File not found for chain B.4]

Γû╕ [T1] B.4.2/all
[File not found for chain B.4.2]

Γû╕ [T1] B.4.2.1/all
[File not found for chain B.4.2.1]

Γû╕ [T2] A.1
[File not found for chain A.1]

Γû╕ [T2] A.1.1
[File not found for chain A.1.1]

Γû╕ [T4] A.2
[File not found for chain A.2]

Γû╕ [T4] A.2/A.
[File not found for chain A.2]

Γû╕ [T2] A.9/all
[File not found for chain A.9]

Γû╕ [T2] 2.6.1.5.1
[Section 2.6.1.5.1 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

Γû╕ [T2] 2.6.1.4/A.
[Section 2.6.1.4 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

Γû╕ [T2] 2.6.1.4/B.
[Section 2.6.1.4 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

Γû╕ [T2] 2.6.1.4/C.
[Section 2.6.1.4 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

Γû╕ [T2] 2.6.1.5.3
[Section 2.6.1.5.3 not found in D:\Projects\ai-actor\components\elia-language\spec\.misc\demo\current\2_1_primitive_types.md]

Γû╕ [T2] 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

Γû╕ [T2] 2.1
# 2.1 Primitive Types

Γû╕ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

Γû╕ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

Γû╕ [T4] 2.1.9.8/D.
**D. Deterministic inlining rule (normative)**\


[... TRUNCATED — 816 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 836/3500 tokens, trimmed from 816]
```

### read_chain({"chains":["2.1.10.1/all","2.1.10.2"],"budget":5000,"detail":"detailed"})
```
Γû╕ 2.1.10.1/all
## 2.1.10.1 Fundamental Principles

1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.


Γû╕ 2.1.10.2
## 2.1.10.2 Primitive Type Compatibility Matrix

[Tokens: ~273]
```

## Budget
- Tool calls: 7
- Total response chars: 7294
