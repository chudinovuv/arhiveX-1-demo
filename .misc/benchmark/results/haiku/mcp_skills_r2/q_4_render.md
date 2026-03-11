# Render: Q4 — A-004 (A-004)

## Extracted Content

### search_spec({"keyword":["implicit type conversion","numeric primitives","coercion"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","bhva","sema"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none","maxUnits":3})
```
No chains in requested tier.

═══ READING PLAN ═══
Units: 1 | Chains: 32 → 25 (deduped: 7, subsumed: 0, territory-demoted: 10)

─── Tier 4: Supplementary context ───
  [3.11] 3.11/all ⚠, 3.11.2/all ⚠, 3.11.1/all ⚠, 3.11.4/all ⚠, 3.11.3/all ⚠, 3.11.5/all ⚠, 3.11.6/all ⚠
  [2.7] 2.7.8.1, 2.7.8, 2.7.8.2, 2.7.8.2.1/all, 2.7.8.2.2/all, 2.7.8.2.3/all, 2.7.8.2.4/all, 2.7.8.2.5/all, 2.7.8.3/all
  [2.6] 2.6.3.4/all, 2.6.3, 2.6.3.1/all, 2.6.3.2/all, 2.6.3.3/all, 2.6.3.5.1/all
  [4.3] 4.3.8/all ⚠
  [4.6] 4.6.3/all ⚠
  [4.5] 4.5.4/all ⚠

```

### search_spec({"keyword":["type promotion","type compatibility","numeric type"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","bhva"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none","maxUnits":3})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.10.1
## 2.1.10.1 Fundamental Principles

Γû╕ [T1] 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

Γû╕ [T1] 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

Γû╕ [T1] 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)

Γû╕ [T1] 2.1.10.2.4
### 2.1.10.2.4 Special / Control Type Rules

Γû╕ [T1] G.4/all
[File not found for chain G.4]

Γû╕ [T1] G.5/all
[File not found for chain G.5]

Γû╕ [T2] G.6/all
[File not found for chain G.6]

Γû╕ [T2] 2.1.10.6
## 2.1.10.6 Normative Rules

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


[... TRUNCATED — 251 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 271/3500 tokens, trimmed from 251]
```

### read_chain({"chains":["2.1.10.2.1"],"detail":"complete"})
```
Γû╕ 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)
The only permitted implicit assignments are **identity** and **nullable widening**:

[Tokens: ~34]
```

### read_chain({"chains":["2.1.10/all"],"detail":"complete"})
```
Γû╕ 2.1.10/all
# 2.1.10 Type Compatibility and Conversion Rules (Normative)

This section defines the **complete type compatibility matrix** for all E.L.I.A. types. It governs which types can be assigned, converted, or passed as arguments without violating semantic safety. All rules in this section are **normative** and **MUST** be enforced at compile time.

## 2.1.10.1 Fundamental Principles

1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

## 2.1.10.2 Primitive Type Compatibility Matrix

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

| From \ To | `int8` | `int16` | `int32` | `int64` | `uint8` | `uint16` | `uint32` | `uint64` | `float` | `double` | `decimal` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `int8`    | —  | W  | W  | W  | S  | S+W | S+W | S+W | P  | P  | E  |
| `int16`   | N  | —  | W  | W  | S+N | S  | S+W | S+W | P  | P  | E  |
| `int32`   | N  | N  | —  | W  | S+N | S+N | S  | S+W | P  | P  | E  |
| `int64`   | N  | N  | N  | —  | S+N | S+N | S+N | S  | P  | P  | E  |
| `uint8`   | S  | W  | W  | W  | —  | W  | W  | W  | P  | P  | E  |
| `uint16`  | S+N | S  | W  | W  | N  | —  | W  | W  | P  | P  | E  |
| `uint32`  | S+N | S+N | S  | W  | N  | N  | —  | W  | P  | P  | E  |
| `uint64`  | S+N | S+N | S+N | S  | N  | N  | N  | —  | P  | P  | E  |
| `float`   | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | —  | W  | P  |
| `double`  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | N  | —  | P  |
| `decimal` | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | P  | P  | —  |

**Legend:**
- **W** — Widening: always safe, no data loss. Requires explicit cast.
- **N** — Narrowing: may overflow/truncate. Requires explicit cast + runtime range check.
- **S** — Signedness change: requires explicit cast.
- **S+W** / **S+N** — Signedness + widening/narrowing combined.
- **P** — Precision loss possible. Requires explicit cast.
- **E** — Exact: integer → decimal is lossless but requires explicit cast.
- **✗** — Forbidden: no conversion path exists (float/double → integral types).
- **—** — Identity: same type, no conversion needed.

### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

| From \ To | `bool` | `string` | `fixed string[N]` | `date` | `time` | `timestamp` | `timespan` | `guid` | `riid` | `enum` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `bool`    | —  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `string`  | ✗  | —  | T | R | R | R | R | R | ✗ | R |
| `fixed string[N]` | ✗ | C | — | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `date`    | ✗  | F  | ✗ | — | ✗ | D→T | ✗ | ✗ | ✗ | ✗ |
| `time`    | ✗  | F  | ✗ | ✗ | — | ✗ | ✗ | ✗ | ✗ | ✗ |
| `timestamp` | ✗ | F | ✗ | T→D | T→Ti | — | ✗ | ✗ | ✗ | ✗ |
| `timespan` | ✗ | F | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ | ✗ |
| `guid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ |
| `riid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ |
| `enum`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — ³ |
| Numeric ⁴ | ✗ | F | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

**Legend:**
- **F** — Format: explicit string formatting. Always safe.
- **R** — Parse: explicit string parsing. May fail at runtime (parse error).
- **C** — Copy with capacity check: `fixed string[N]` → `string` always safe; `string` → `fixed string[N]` requires length ≤ N (compile-time if literal, runtime otherwise).
- **T** — Truncation conversion: `string` → `fixed string[N]` when length ≤ N.
- **D→T** — Date-to-timestamp: requires explicit timezone/offset context.
- **T→D** — Timestamp-to-date: extracts date component. Requires explicit timezone.
- **T→Ti** — Timestamp-to-time: extracts time-of-day component. Requires explicit timezone.
- **✗** — Forbidden: no conversion path exists.
- **—** — Identity.

> ³ Enum-to-enum conversion is forbidden unless both enums share the same underlying type and the conversion is explicitly declared.
> ⁴ Numeric types include all integral, float, double, and decimal types.

### 2.1.10.2.4 Special / Control Type Rules

| Type | Assignable to | Assignable from | Explicit conversion | Notes |
|------|---------------|-----------------|---------------------|-------|
| `null` | `T?` (any nullable) | — | None | Represents absence. Not a type, but a value. |
| `void` | — | — | None | Non-materialized. Cannot be assigned, stored, or transported. Signature-only. |
| `nothing` | — | — | None | Non-materialized. Represents non-applicability. Cannot be assigned or stored. |
| `any` | via explicit unbox | any `T` | Unbox to concrete `T` | Boxing preserves type; unboxing requires explicit cast. Erases enforcement. |

## 2.1.10.3 Block Type Compatibility

| From \ To | `string` | `bytes` | `base64` | `beN` / `leN` | `tuple` |
|-----------|:---:|:---:|:---:|:---:|:---:|
| `string`  | — | E | E | ✗ | ✗ |
| `bytes`   | E | — | E | S | ✗ |
| `base64`  | E | E | — | ✗ | ✗ |
| `beN`/`leN` | ✗ | S | ✗ | — ⁵ | ✗ |
| `tuple`   | ✗ | ✗ | ✗ | ✗ | — ⁶ |

**Legend:**
- **E** — Encoding conversion: explicit, reversible (e.g., string ↔ base64 ↔ bytes).
- **S** — Size-checked reinterpretation: `bytes` ↔ `beN`/`leN` requires matching width.
- **✗** — Forbidden.
- **—** — Identity.

> ⁵ `beN` ↔ `leN` conversion requires explicit endianness swap; forbidden implicitly.
> ⁶ Tuple compatibility requires identical arity and element-wise type compatibility.

## 2.1.10.4 Derived Type Compatibility

### 2.1.10.4.1 Record

1. Record assignment is **nominal** (by declared type name), not structural.
2. A record value of type `A` is assignable to a variable of type `B` **only if** `A` is the same type as `B` or `A` inherits from `B` (via `extends`).
3. Derived records that **redefine** inherited fields break compatibility with the base type (see §2.5, rule (d)).
4. Two records with identical field sets but different type names are **NOT assignable** to each other.

### 2.1.10.4.2 Array and Typed Array

1. `array of T` is assignable to `array of T` (identity only).
2. `array of T` is **NOT assignable** to `array of U` even if `T` is assignable to `U` (arrays are **invariant**).
3. `typed array` follows the same invariance rule.

### 2.1.10.4.3 Collection and Dictionary

1. `collection of T` is assignable to `collection of T` (identity only).
2. `dictionary of (K, V)` is assignable to `dictionary of (K, V)` (identity only).
3. Collections and dictionaries are **invariant** in their element/key-value types.

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
| Decimal ↔ float/double conversion rules | §2.1.2.2 |
| Boolean coercion prohibition | §2.1.3, §3.21 (LIT-120) |
| Temporal cross-type conversion prohibition | §2.1.4.2 |
| Identifier conversion prohibition | §2.1.5.2 |
| Special/control type semantics | §2.1.6.1 |
| Fixed string ↔ string conversion | §2.1.8.2 |
| `any` type semantics and enforcement erasure | ANNEX A (code 0x15) |
| Derived type inheritance and compatibility | §2.5 |
| Record interface implementation | §2.6 |
| Block ↔ stream promotion/demotion | ANNEX A §A.9 |
| Compilation error catalog | ANNEX G |


[Tokens: ~2929]
```

## Budget
- Tool calls: 4
- Total response chars: 13574
