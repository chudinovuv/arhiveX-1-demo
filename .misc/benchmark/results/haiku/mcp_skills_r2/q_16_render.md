# Render: Q16 — B-006 (B-006)

## Extracted Content

### search_spec({"keyword":["guid encoding","identifier binary","riid serialization"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":3,"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```
No units found for keywords: guid encoding, identifier binary, riid serialization
```

### search_spec({"keyword":["guid","riid"],"intent":"full","maxUnits":3,"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.5/all
# 2.1.5 Identifiers Class

Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

- (a) `guid` represents a globally unique identifier with well-known external interoperability and has a **fixed width of 128 bits (16 bytes)**.
- (b) `riid` represents a **runtime-independent identifier** defined **exclusively within E.L.I.A.**, preserving **determinism, compactness, and canonical serialization** across heterogeneous runtimes, and has a **fixed width of 96 bits (12 bytes)**. `riid` has no external standard mapping and MUST NOT be implicitly converted to or from other identifier formats.

## 2.1.5.1 Designation

1. provide a **stable identity handle** for correlation and reference across domains, records, and streams;
2. enable **deduplication and idempotency** without relying on value semantics;
3. support **audit traceability and evidence linking** across time and system boundaries;
  [...]
## 2.1.5.2 Normative properties
  [...]
4. Identifiers **MUST be comparable only for equality** unless an explicit ordering semantic is defined by the identifier type.
5. Identifiers **MUST NOT** encode business state, timestamps, versioning, or control information.
6. Implicit conversion between different identifier types **MUST NOT** be permitted; any conversion MUST be explicit and type-safe.
7. Identifiers **MUST support only bitwise equality comparison and cryptographic hashing operations**. No arithmetic, ordering, range, or semantic comparison operations are permitted.

## 2.1.5.3 Semantic role

1. Identifiers act as **pure identity references**, not as data descriptors or control signals.
2. They enable **referential integrity** across records, streams, events, and audit artefacts.
3. Identifiers participate in validation, enforcement, serialization, and audit semantics **only as identity tokens** and **do not introduce authority, behavior, or decision logic**.

## 2.1.5.4 Syntax
  [...]
### 2.1.5.4.1 Declaration (normative)
  [...]
### 2.1.5.4.2 AST Grammar

> The AST grammar defined below is intentionally **representational**, not implementation-exhaustive. Its purpose is to identify and formalize the **essential syntactic nodes and structural relationships** required to construct a valid Identifier, rather than to mirror the exact grammar used by any specific compiler or runtime provider.

[TBD]
  [...]
### 2.1.5.4.3 Canonical Syntax
  [...]


**Standards reference:**

- RFC 4122 (UUID / GUID)
- ISO/IEC 9834-8 (Registration of object identifiers — conceptual alignment)


Γû╕ [T1] 2.1
# 2.1 Primitive Types
Primitive types are used to encode **primitive information** — irreducible factual values that have no internal structure at the language level. They form the lowest semantic layer of the type system and serve as the building blocks for blocks, records, streams, and higher-order constructs.

Γû╕ [T1] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T1] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


> **Note**: This section establishes the normative scope and intent of Primitive Types, defining their ontological role and core constraints and basic serialization within the type system. It intentionally does not exhaustively specify  security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.



Γû╕ [T1] A.1
[File not found for chain A.1]

Γû╕ [T1] A.1.1
[File not found for chain A.1.1]

Γû╕ [T4] A.2
[File not found for chain A.2]

Γû╕ [T4] A.2/A.
[File not found for chain A.2]

Γû╕ [T4] A.7
[File not found for chain A.7]

Γû╕ [T4] A.7/(B)
[File not found for chain A.7]

Γû╕ [T4] A.7/(A)
[File not found for chain A.7]

Γû╕ [T2] A.3/all
[File not found for chain A.3]

Γû╕ [T2] A.11/all
[File not found for chain A.11]

Γû╕ [T2] A.8/all
[File not found for chain A.8]

Γû╕ [T2] A.13/all
[File not found for chain A.13]

Γû╕ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding
1. Identifiers (`guid`, `riid`) **MUST be encoded as fixed-width binary values** with no embedded delimiters, formatting, or textual normalization.
2. Parsers **MUST NOT infer ordering, timestamps, or structure** from identifier binary layouts unless explicitly defined by the identifier type.

Γû╕ [T4] 2.1.9.8
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

Γû╕ [T4] 2.1.9.8/E.
**E. External primitives:**\
A primitive value **MUST** be stored externally when its canonical binary width exceeds 48 bits.

Typical external primitives include:

- `int64` (`long`), `uint64` (`ulong`)
  [...]
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`


Γû╕ [T4] 2.1.9.8/B.
**B. When offset-based reference is used:**
  [...]
  47                                               0
  +------------------------------------------------+
  |           Inlined referenced value             |
  +------------------------------------------------+
```

Γû╕ [T4] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

Γû╕ [T2] 2.1.10/all
# 2.1.10 Type Compatibility and Conversion Rules (Normative)
  [...]
## 2.1.10.1 Fundamental Principles
  [...]
1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

## 2.1.10.2 Primitive Type Compatibility Matrix
  [...]
### 2.1.10.2.1 Assignment (Implicit)

The only permitted implicit assignments are **identity** and **nullable widening**:

| From → To | Same type `T` | Nullable `T?` | `any` | All other types |
|-----------|:---:|:---:|:---:|:---:|
| Value of type `T` | ✓ | ✓ | ✓ ¹ | ✗ |
| Value of type `T?` | ✗ ² | ✓ | ✓ ¹ | ✗ |
| `null` | ✗ | ✓ | ✓ | ✗ |

> ¹ Boxing into `any` preserves the concrete type envelope but erases enforcement (see A.3, code `0x15`).
> ² Requires explicit null-check guard; see §2.1.10.1(4).

### 2.1.10.2.2 Explicit Conversion — Numeric Types
  [...]
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

| From \ To | `bool` | `string` | `fixed string[N]` | `date` | `time` | `timestamp` | `timespan` | `guid` | `riid` | `enum` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `bool`    | —  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
  [...]
| `timestamp` | ✗ | F | ✗ | T→D | T→Ti | — | ✗ | ✗ | ✗ | ✗ |
| `timespan` | ✗ | F | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ | ✗ |
| `guid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ |
| `riid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ |
| `enum`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — ³ |
| Numeric ⁴ | ✗ | F | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
  [...]
**Legend:**
- **F** — Format: explicit string formatting. Always safe.
- **R** — Parse: explicit string parsing. May fail at runtime (parse error).
- **C** — Copy with capacity check: `fixed string[N]` → `string` always safe; `string` → `fixed string[N]` requires length ≤ N (compile-time if literal, runtime otherwise).
- **T** — Truncation conversion: `string` → `fixed string[N]` when length ≤ N.
  [...]
### 2.1.10.2.4 Special / Control Type Rules
  [...]
| Type | Assignable to | Assignable from | Explicit conversion | Notes |
|------|---------------|-----------------|---------------------|-------|
| `null` | `T?` (any nullable) | — | None | Represents absence. Not a type, but a value. |
| `void` | — | — | None | Non-materialized. Cannot be assigned, stored, or transported. Signature-only. |
| `nothing` | — | — | None | Non-materialized. Represents non-applicability. Cannot be assigned or stored. |
| `any` | via explicit unbox | any `T` | Unbox to concrete `T` | Boxing preserves type; unboxing requires explicit cast. Erases enforcement. |

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

1. A `class` instance is assignable to a variable typed as any `interface` that the class implements.
2. A `class` instance is assignable to a variable typed as its base class (if inheritance is declared).
3. `interface` variables accept any class that satisfies the interface contract.
4. Cross-class assignment between unrelated classes is **FORBIDDEN**.

### 2.1.10.4.5 Error and Event

1. `error` types follow the same inheritance rules as records: derived error → base error is permitted.
2. `event` types are **invariant**: `event A` is assignable only to `event A`.

## 2.1.10.5 Semantic Type Compatibility

Semantic types (`definition`, `domain`, `data interface`, `semantic interface`, `delegate`) are **non-materialized** and do not participate in value assignment. They are referenced by name only.

1. Semantic types **MUST NOT** appear on the right-hand side of an assignment statement.
2. Semantic types **MUST NOT** be passed as parameters to methods, actions, or flows.
3. Semantic types **MUST NOT** be stored in variables, fields, or containers.
4. The only permitted operations on semantic type references are: declaration, enforcement linkage (`enforced`/`enforces`), and compile-time resolution.

## 2.1.10.6 Normative Rules

| # | Rule | Class | Error Code |
|---|------|-------|:---:|
| TYP-010 | Identity assignment (`T → T`) is always permitted for materialized types. | MUST | — |
| TYP-020 | Nullable widening (`T → T?`) is always permitted for materialized types. | MUST | — |
| TYP-030 | Nullable narrowing (`T? → T`) MUST be preceded by an explicit null-check on all code paths. Unguarded nullable narrowing is a compilation error. | MUST | E2101 |
| TYP-040 | Implicit type conversion between distinct types is FORBIDDEN. Any cross-type assignment MUST use an explicit conversion operator. | MUST NOT | E2102 |
| TYP-050 | Explicit conversion MUST use a declared conversion operator or built-in conversion function. The compiler MUST verify that a valid conversion path exists. | MUST | E2103 |
| TYP-060 | Numeric coercion of boolean values is FORBIDDEN. `0 ≠ false`, `1 ≠ true`. | MUST NOT | E2104 |
| TYP-070 | Conversion between mutually exclusive control types (`null`, `void`, `nothing`) is FORBIDDEN. | MUST NOT | E2105 |
| TYP-080 | Cross-identifier conversion (`guid` ↔ `riid`) is FORBIDDEN, even explicitly. | MUST NOT | E2106 |
| TYP-090 | Float/double → integral conversion is FORBIDDEN. Integral → float/double requires explicit cast and acknowledges precision loss. | MUST NOT | E2107 |
| TYP-100 | Record assignment follows nominal typing. Structural equivalence does not constitute type compatibility. | MUST | E2108 |
| TYP-110 | Container types (`array`, `collection`, `dictionary`) are invariant in their element types. Covariant or contravariant assignment is FORBIDDEN. | MUST NOT | E2109 |
| TYP-120 | Assigning a semantic type (definition, domain, interface, delegate) to a variable or parameter is FORBIDDEN. | MUST NOT | E2110 |
| TYP-130 | Boxing into `any` erases enforcement guarantees. Unboxing from `any` MUST use explicit type assertion and MUST restore the concrete type's enforcement context. | MUST | E2111 |

## 2.1.10.7 Cross-reference Summary

| Topic | Reference |
|-------|-----------|
| Integral normative properties (no implicit widening) | §2.1.1.2 |
  [...]
| Special/control type semantics | §2.1.6.1 |
| Fixed string ↔ string conversion | §2.1.8.2 |
| `any` type semantics and enforcement erasure | ANNEX A (code 0x15) |
| Derived type inheritance and compatibility | §2.5 |
| Record interface implementation | §2.6 |
| Block ↔ stream promotion/demotion | ANNEX A §A.9 |
| Compilation error catalog | ANNEX G |



[... TRUNCATED — 3486 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 3506/3500 tokens, trimmed from 3486]
```

## Budget
- Tool calls: 2
- Total response chars: 14184
