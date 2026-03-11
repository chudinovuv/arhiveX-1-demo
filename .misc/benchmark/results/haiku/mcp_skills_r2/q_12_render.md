# Render: Q12 — B-002 (B-002)

## Extracted Content

### search_spec({"keyword":["Decimal floating class","numeric type normative"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","bhva"],"maxUnits":3,"filter":true,"tier":"adaptive","budget":3500,"verbose":"none","autoExpand":true})
```
No units found for keywords: decimal floating class, numeric type normative
```

### search_spec({"keyword":"Decimal","intent":"full","maxUnits":3,"filter":true,"budget":3500,"verbose":"none","autoExpand":true})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.2
# 2.1.2 Decimal / floating Class
Decimal and floating-point primitives represent numeric values with fractional components.

Γû╕ [T4] 2.1.2/(A)
(A) The type system explicitly distinguishes **exact decimal arithmetic** from **binary floating-point arithmetic** to prevent semantic ambiguity and audit-unsafe rounding assumptions.

Γû╕ [T4] 2.1.2/(B)
(B) This class represented by types:

- `decimal` is intended for **exact, base-10 arithmetic** (e.g., monetary values) and MUST preserve declared precision across serialization boundaries.
- `float` represent **approximate single precision numeric values**  optimized for geometry, statistical, or signal-processing use cases
- `double` represent **approximate double precision numeric values** optimized for scientific, statistical, or signal-processing use cases.

Γû╕ [T1] 2.1.2.1
## 2.1.2.1 Designation
1. represent fractional numeric facts for measurement, ratios, and calculations where integers are insufficient;
2. separate **exact** (decimal) from **approximate** (binary floating-point) arithmetic as distinct semantic commitments;
3. enable deterministic serialization and validation of numeric values with fractional components;
4. prevent implicit precision loss and audit ambiguity by making approximation explicitly type-bound.

Γû╕ [T1] 2.1.2.3
## 2.1.2.3 Semantic role
1. Decimal and floating types act as **numeric truth carriers**, where the chosen type communicates the admissible interpretation of the value (exact vs approximate).
2. They enable enforcement and validation to reason about precision-sensitive constraints without implicit assumptions.
3. They support auditability by ensuring that approximation is a declared property of the type, not an emergent runtime artifact.

Γû╕ [T4] 2.1.2.3/A.
**A. Standards reference:**
  [...]
- IEEE 754 (Binary floating-point arithmetic — `float`, `double`)
- ISO/IEC 10967-2 (Language-independent floating-point arithmetic)
- IEEE 754-2008 / 2019 Decimal Floating-Point (conceptual alignment for `decimal`)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

Γû╕ [T1] A.1
[File not found for chain A.1]

Γû╕ [T1] A.1.1
[File not found for chain A.1.1]

Γû╕ [T1] 2.1.9.3
## 2.1.9.3 Floating-point and decimal encoding
1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

Γû╕ [T4] A.2
[File not found for chain A.2]

Γû╕ [T1] A.3/all
[File not found for chain A.3]

Γû╕ [T2] A.11/all
[File not found for chain A.11]

Γû╕ [T2] 2.1.2.2/all
## 2.1.2.2 Normative properties

1. `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.
2.  `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation.
3. `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values.
4.  Implicit conversion between `decimal` and `float` / `double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.
5. Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).
6. Comparison semantics **MUST** be type-safe: cross-type comparison between `decimal` and `float` / `double` is forbidden unless an explicit conversion is performed.
7. Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.


Γû╕ [T2] A.13/all
[File not found for chain A.13]

Γû╕ [T4] 2.1.10/all
# 2.1.10 Type Compatibility and Conversion Rules (Normative)
  [...]
## 2.1.10.1 Fundamental Principles
  [...]
## 2.1.10.2 Primitive Type Compatibility Matrix
  [...]
### 2.1.10.2.1 Assignment (Implicit)
  [...]
### 2.1.10.2.2 Explicit Conversion — Numeric Types

| From \ To | `int8` | `int16` | `int32` | `int64` | `uint8` | `uint16` | `uint32` | `uint64` | `float` | `double` | `decimal` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `int8`    | —  | W  | W  | W  | S  | S+W | S+W | S+W | P  | P  | E  |
  [...]
| `float`   | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | —  | W  | P  |
| `double`  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | N  | —  | P  |
| `decimal` | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | P  | P  | —  |

**Legend:**
  [...]
- **S+W** / **S+N** — Signedness + widening/narrowing combined.
- **P** — Precision loss possible. Requires explicit cast.
- **E** — Exact: integer → decimal is lossless but requires explicit cast.
- **✗** — Forbidden: no conversion path exists (float/double → integral types).
- **—** — Identity: same type, no conversion needed.
  [...]
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives
  [...]

> ³ Enum-to-enum conversion is forbidden unless both enums share the same underlying type and the conversion is explicitly declared.
> ⁴ Numeric types include all integral, float, double, and decimal types.

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
  [...]
|-------|-----------|
| Integral normative properties (no implicit widening) | §2.1.1.2 |
| Decimal ↔ float/double conversion rules | §2.1.2.2 |
| Boolean coercion prohibition | §2.1.3, §3.21 (LIT-120) |
| Temporal cross-type conversion prohibition | §2.1.4.2 |

Γû╕ [T4] B.2.2
[File not found for chain B.2.2]

Γû╕ [T4] B.2.2/table-1
[File not found for chain B.2.2]

Γû╕ [T4] 1.4.1/all
[File not found for chain 1.4.1]


[... TRUNCATED — 1611 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 1631/3500 tokens, trimmed from 1611]
```

### search_spec({"keyword":"floating point numeric precision","onto":"WHAT","intent":"normative_rules","maxUnits":3,"filter":true,"budget":3500,"verbose":"none","autoExpand":true})
```
No units found for keywords: floating point numeric precision
```

### read_chain({"chains":["2.1.2.2"],"detail":"complete"})
```
Γû╕ 2.1.2.2
## 2.1.2.2 Normative properties
1. `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.
2.  `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation.
3. `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values.
4.  Implicit conversion between `decimal` and `float` / `double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.
5. Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).
6. Comparison semantics **MUST** be type-safe: cross-type comparison between `decimal` and `float` / `double` is forbidden unless an explicit conversion is performed.
7. Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.

[Tokens: ~275]
```

## Budget
- Tool calls: 4
- Total response chars: 7852
