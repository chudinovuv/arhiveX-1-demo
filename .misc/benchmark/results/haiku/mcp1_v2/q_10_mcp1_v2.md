# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["conversion rules","primitive types","non-numeric"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 4009

### Call 2: read_chain
- params: {"chains":["2.1.10.2.3"],"budget":3500,"autoExpand":true}
- response_chars: 87

### Call 3: read_chain
- params: {"chains":["2.1.10.2"],"budget":3500,"autoExpand":true}
- response_chars: 73

### Call 4: read_chain
- params: {"chains":["2.1.10/all"],"budget":6000,"autoExpand":true}
- response_chars: 11730

## Raw MCP Output
### search_spec({"keyword":["conversion rules","primitive types","non-numeric"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.10.1
## 2.1.10.1 Fundamental Principles
  [...]
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

▸ [T1] 2.1
# 2.1 Primitive Types
Primitive types are used to encode **primitive information** — irreducible factual values that have no internal structure at the language level. They form the lowest semantic layer of the type system and serve as the building blocks for blocks, records, streams, and higher-order constructs.

▸ [T1] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T1] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


> **Note**: This section establishes the normative scope and intent of Primitive Types, defining their ontological role and core constraints and basic serialization within the type system. It intentionally does not exhaustively specify  security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.



▸ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T1] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T1] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

▸ [T1] 2.1.9.8/D.
**D. Deterministic inlining rule (normative)**\

▸ [T1] 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

▸ [T1] 2.1.10/all
# 2.1.10 Type Compatibility and Conversion Rules (Normative)
  [...]
## 2.1.10.1 Fundamental Principles
  [...]
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

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
## 2.1.10.7 Cross-reference Summary
  [...]
|-------|-----------|
| Integral normative properties (no implicit widening) | §2.1.1.2 |
| Decimal ↔ float/double conversion rules | §2.1.2.2 |
| Boolean coercion prohibition | §2.1.3, §3.21 (LIT-120) |
| Temporal cross-type conversion prohibition | §2.1.4.2 |

▸ [T1] 2.1.5/all
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

▸ [T1] 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

▸ [T1] 2.1.10.6
## 2.1.10.6 Normative Rules

▸ [T1] 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)

▸ [T1] 2.1.10.2.4
### 2.1.10.2.4 Special / Control Type Rules

[Tokens: ~970] [SUFFICIENT: 81% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.10.2.3"],"budget":3500,"autoExpand":true})
```
▸ 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

[Tokens: ~19]
```

### read_chain({"chains":["2.1.10.2"],"budget":3500,"autoExpand":true})
```
▸ 2.1.10.2
## 2.1.10.2 Primitive Type Compatibility Matrix

[Tokens: ~15]
```

### read_chain({"chains":["2.1.10/all"],"budget":6000,"autoExpand":true})
```
▸ 2.1.10/all
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
| TYP-070 | Conversion between mutually exclusive cont
... (1730 chars truncated)
```

## Answer
Отличо! Теперь у меня есть полная информация о правилах конверсии между не-числовыми примитивными типами.

## Explicit Conversion Rules Between Non-Numeric Primitive Types in E.L.I.A.

Based on §2.1.10.2.3, E.L.I.A. defines explicit conversion rules for non-numeric primitive types. Here are the key rules:

### String Conversions
- **`bool` → `string`**: Formatting conversion (F) - always safe
- **`string` → `fixed string[N]`**: Truncation conversion (T) - requires length ≤ N
- **`fixed string[N]` → `string`**: Copy conversion (C) - always safe
- **Any type → `string`**: Format conversion (F) - string representation always possible

### Temporal Type Conversions
- **`date` → `timestamp`**: Date-to-timestamp conversion (D→T) - requires explicit timezone/offset context
- **`timestamp` → `date`**: Timestamp-to-date conversion (T→D) - extracts date component, requires explicit timezone
- **`timestamp` → `time`**: Timestamp-to-time conversion (T→Ti) - extracts time-of-day component, requires explicit timezone
- **No other temporal cross-conversions are permitted**

### String Parsing Conversions
- **`string` → temporal types** (`date`, `time`, `timestamp`, `timespan`): Parse conversion (R) - may fail at runtime with parse error
- **`string` → `guid`**: Parse conversion (R) - may fail at runtime with parse error

### Forbidden Conversions
According to §2.1.10.2.3, the following conversions are **explicitly forbidden** (✗):

1. **Boolean conversions**: `bool` cannot be converted to any type except `string`
2. **Cross-identifier conversions**: `guid` ↔ `riid` conversion is forbidden (TYP-080)
3. **Numeric-to-non-numeric**: No numeric type can be converted to boolean, temporal, or identifier types
4. **Enum conversions**: Enums can only be converted to `string` (formatting), no other conversions permitted
5. **Fixed string conversions**: `fixed string[N]` can only convert to `string`, no other types

### Normative Requirements
Per §2.1.10.1 and §2.1.10.6:

- All explicit conversions **MUST** use a declared conversion operator or built-in conversion function (TYP-050)
- The compiler **MUST** verify that a valid conversion path exists at compile time (TYP-050)
- Parse conversions (R) may fail at runtime and **MUST** be handled appropriately
- Conversions requiring context (like timezone for temporal types) **MUST** provide that context explicitly

These rules ensure type safety while allowing necessary conversions between compatible non-numeric primitive types, with special attention to string formatting/parsing and temporal type handling.

## Metrics
- calls_total: 4
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 14194
- tokens_out: 1662
- tokens_total: 15856
- cache_read: 75235
- cache_creation: 0
- wall_time_sec: 31.2
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_10_mcp1_v2.md
