# Render: Q14 — B-004 (B-004)

## Extracted Content

### search_spec({"keyword":["binary encoding","floating-point","decimal canonical form"],"onto":"WHAT","intent":"full","indexRanking":["phya","trma"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives

Γû╕ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles
  [...]
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/E.
**E. External primitives:**\

Γû╕ [T1] 2.1.9.3
## 2.1.9.3 Floating-point and decimal encoding
1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

Γû╕ [T1] 2.1.2
# 2.1.2 Decimal / floating Class
Decimal and floating-point primitives represent numeric values with fractional components.

Γû╕ [T4] 2.1.2/(A)
(A) The type system explicitly distinguishes **exact decimal arithmetic** from **binary floating-point arithmetic** to prevent semantic ambiguity and audit-unsafe rounding assumptions.

Γû╕ [T4] 2.1.2/(B)
(B) This class represented by types:

Γû╕ [T1] 2.1.2.1
## 2.1.2.1 Designation
1. represent fractional numeric facts for measurement, ratios, and calculations where integers are insufficient;
2. separate **exact** (decimal) from **approximate** (binary floating-point) arithmetic as distinct semantic commitments;
3. enable deterministic serialization and validation of numeric values with fractional components;
4. prevent implicit precision loss and audit ambiguity by making approximation explicitly type-bound.

Γû╕ [T1] 2.1.2.2
## 2.1.2.2 Normative properties
1. `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.
2.  `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation.
3. `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values.
4.  Implicit conversion between `decimal` and `float` / `double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.
5. Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).
6. Comparison semantics **MUST** be type-safe: cross-type comparison between `decimal` and `float` / `double` is forbidden unless an explicit conversion is performed.
7. Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.

Γû╕ [T1] 2.1.2.3
## 2.1.2.3 Semantic role

Γû╕ [T4] 2.1.2.3/A.
**A. Standards reference:**

- IEEE 754 (Binary floating-point arithmetic — `float`, `double`)
- ISO/IEC 10967-2 (Language-independent floating-point arithmetic)
- IEEE 754-2008 / 2019 Decimal Floating-Point (conceptual alignment for `decimal`)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

Γû╕ [T1] 2.1.9.10
## 2.1.9.10 Performance Implications

Γû╕ [T1] 2.1.9.10.1
### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

Γû╕ [T4] 2.1.9.10.1/B.
**B. Typical examples:**

Γû╕ [T1] 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

Γû╕ [T4] 2.1.9.10.2/B.
**B. Typical examples:**

Γû╕ [T1] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

Γû╕ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T1] 2.1.9.9
## 2.1.9.9 Parser obligations

Γû╕ [T1] 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)

Γû╕ [T1] 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)

Γû╕ [T2] B.1
[File not found for chain B.1]


[... TRUNCATED — 1059 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 1079/3500 tokens, trimmed from 1059]
```

### read_chain({"chains":["2.1.9.3","2.1.2.2","2.1.9.1"],"budget":3500,"detail":"detailed"})
```
Γû╕ 2.1.9.3
## 2.1.9.3 Floating-point and decimal encoding
1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

Γû╕ 2.1.2.2
## 2.1.2.2 Normative properties
1. `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.
2.  `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation.
3. `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values.
4.  Implicit conversion between `decimal` and `float` / `double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.
5. Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).
6. Comparison semantics **MUST** be type-safe: cross-type comparison between `decimal` and `float` / `double` is forbidden unless an explicit conversion is performed.
7. Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.

Γû╕ 2.1.9.1
## 2.1.9.1 Canonical encoding principles
1. All primitive values **MUST serialize deterministically** into a single canonical binary representation.
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

[Tokens: ~505]
```

## Budget
- Tool calls: 2
- Total response chars: 6428
