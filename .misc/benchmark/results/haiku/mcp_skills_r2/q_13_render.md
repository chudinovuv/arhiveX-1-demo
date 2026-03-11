# Render: Q13 — B-003 (B-003)

## Extracted Content

### search_spec({"keyword":"integer encoding binary","intent":"full","onto":"WHAT","indexRanking":["phya","sema"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none","maxUnits":3})
```
No units found for keywords: integer encoding binary
```

### search_spec({"keyword":"integer encoding","intent":"full","onto":"WHAT","filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none","maxUnits":3})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9.2
## 2.1.9.2 Integer encoding

Γû╕ [T1] 2.1.1
# 2.1.1 Integral Class

Γû╕ [T1] 2.1.1.1
## 2.1.1.1 Designation

Γû╕ [T1] 2.1.1.2
## 2.1.1.2 Normative properties

Γû╕ [T1] 2.1.1.3
## 2.1.1.3 Semantic role

Γû╕ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T2] 2.1
# 2.1 Primitive Types

Γû╕ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

Γû╕ [T2] 2.1.5/all
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


[... TRUNCATED — 231 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 251/3500 tokens, trimmed from 231]
```

### read_chain({"chains":["2.1.9.2"],"detail":"complete","budget":5000})
```
Γû╕ 2.1.9.2
## 2.1.9.2 Integer encoding
1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).
4. Parsers **MUST reject** any integer payload whose length does not exactly match the declared width.

[Tokens: ~114]
```

### read_chain({"chains":["2.1.1"],"detail":"complete","budget":5000})
```
Γû╕ 2.1.1
# 2.1.1 Integral Class
Integral primitives represent fixed-width integer values with deterministic size, signedness, and binary representation. They are used for counters, identifiers, flags, protocol fields, offsets, and other numerically exact values where rounding is forbidden. All integral primitives are platform-independent and serialize canonically. This class is represented by the following types:

[Tokens: ~105]
```

## Budget
- Tool calls: 4
- Total response chars: 2035
