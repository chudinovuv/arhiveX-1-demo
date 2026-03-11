# Render: Q6 — A-006 (A-006)

## Extracted Content

### search_spec({"keyword":["boolean encoding","binary representation"],"onto":"WHAT","intent":"full","indexRanking":["phya","bhva"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9.4
## 2.1.9.4 Boolean encoding
1. Boolean values **MUST be encoded as a single canonical value** representing `true` or `false`.
2. Any non-canonical or multi-bit boolean encoding **MUST be rejected**.

Γû╕ [T1] 2.1.3
# 2.1.3 Boolean Class

Γû╕ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/C.
**C. When inline representation is used:**


[... TRUNCATED — 111 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 131/3500 tokens, trimmed from 111]
```

### read_chain({"chains":["2.1.9.4"],"detail":"detailed","autoExpand":true,"budget":4000})
```
Γû╕ 2.1.9.4
## 2.1.9.4 Boolean encoding
1. Boolean values **MUST be encoded as a single canonical value** representing `true` or `false`.
2. Any non-canonical or multi-bit boolean encoding **MUST be rejected**.

[Tokens: ~53]
```

### search_spec({"keyword":["Boolean","primitive types","bit encoding"],"onto":"WHAT","intent":"full","maxUnits":3,"filter":true,"budget":4000,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

Γû╕ [T1] 2.1.9.4
## 2.1.9.4 Boolean encoding
1. Boolean values **MUST be encoded as a single canonical value** representing `true` or `false`.
2. Any non-canonical or multi-bit boolean encoding **MUST be rejected**.

Γû╕ [T1] 2.1.3
# 2.1.3 Boolean Class
Boolean primitives represent binary truth values used for flags, predicates, admissibility checks, and semantic conditions. They are strictly non-numeric and MUST NOT be used to encode multi-valued states or control flow implicitly. Boolean values serialize canonically and are deterministic across all runtimes.

Γû╕ [T1] 2.1
# 2.1 Primitive Types
Primitive types are used to encode **primitive information** — irreducible factual values that have no internal structure at the language level. They form the lowest semantic layer of the type system and serve as the building blocks for blocks, records, streams, and higher-order constructs.

Γû╕ [T1] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T1] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


> **Note**: This section establishes the normative scope and intent of Primitive Types, defining their ontological role and core constraints and basic serialization within the type system. It intentionally does not exhaustively specify  security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.



Γû╕ [T1] 2.1.5/all
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

Γû╕ [T1] B.4
[File not found for chain B.4]

Γû╕ [T1] B.4.1/all
[File not found for chain B.4.1]

Γû╕ [T2] 2.1.10/all
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
| TYP-040 | Implicit type conversion between distinct types is FORBIDDEN. Any cross-type assignment MUST use an explicit conversion operator. | MUST NOT | E2102 |
| TYP-050 | Explicit conversion MUST use a declared conversion operator or built-in conversion function. The compiler MUST verify that a valid conversion path exists. | MUST | E2103 |
| TYP-060 | Numeric coercion of boolean values is FORBIDDEN. `0 ≠ false`, `1 ≠ true`. | MUST NOT | E2104 |
| TYP-070 | Conversion between mutually exclusive control types (`null`, `void`, `nothing`) is FORBIDDEN. | MUST NOT | E2105 |
| TYP-080 | Cross-identifier conversion (`guid` ↔ `riid`) is FORBIDDEN, even explicitly. | MUST NOT | E2106 |
  [...]
## 2.1.10.7 Cross-reference Summary
  [...]
| Integral normative properties (no implicit widening) | §2.1.1.2 |
| Decimal ↔ float/double conversion rules | §2.1.2.2 |
| Boolean coercion prohibition | §2.1.3, §3.21 (LIT-120) |
| Temporal cross-type conversion prohibition | §2.1.4.2 |
| Identifier conversion prohibition | §2.1.5.2 |

Γû╕ [T2] A.1
[File not found for chain A.1]

Γû╕ [T2] A.1.1
[File not found for chain A.1.1]


[... TRUNCATED — 1028 tokens exceeded budget of 4000. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 1048/4000 tokens, trimmed from 1028]
```

### read_chain({"chains":["2.1.3/all"],"detail":"detailed","autoExpand":true,"budget":4000})
```
Γû╕ 2.1.3/all
# 2.1.3 Boolean Class

Boolean primitives represent binary truth values used for flags, predicates, admissibility checks, and semantic conditions. They are strictly non-numeric and MUST NOT be used to encode multi-valued states or control flow implicitly. Boolean values serialize canonically and are deterministic across all runtimes.

**A. Standards reference:**

- ISO/IEC 9899 (C boolean type semantics — conceptual model)
- IEC 60027-2 (Binary logic symbols — conceptual alignment)
- RFC 8949 (CBOR boolean encoding — canonical serialization reference)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.


[Tokens: ~211]
```

### search_spec({"keyword":["Type Registry","boolean","bit size"],"onto":"WHAT","intent":"full","maxUnits":2,"filter":true,"budget":4000,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] A.1
[File not found for chain A.1]

Γû╕ [T1] 2.1.3
# 2.1.3 Boolean Class
Boolean primitives represent binary truth values used for flags, predicates, admissibility checks, and semantic conditions. They are strictly non-numeric and MUST NOT be used to encode multi-valued states or control flow implicitly. Boolean values serialize canonically and are deterministic across all runtimes.

Γû╕ [T4] 2.1.3/A.
**A. Standards reference:**

- ISO/IEC 9899 (C boolean type semantics — conceptual model)
- IEC 60027-2 (Binary logic symbols — conceptual alignment)
- RFC 8949 (CBOR boolean encoding — canonical serialization reference)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



[... TRUNCATED — 234 tokens exceeded budget of 4000. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 254/4000 tokens, trimmed from 234]
```

### read_chain({"chains":["2.1.9"],"detail":"complete","autoExpand":true,"budget":5000})
```
Γû╕ 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives
This section defines the **normative binary serialization and parsing rules** for all primitive types. These rules are mandatory and apply uniformly across runtimes, transports, persistence layers, and replay environments.

[Tokens: ~70]
```

## Budget
- Tool calls: 6
- Total response chars: 7341
