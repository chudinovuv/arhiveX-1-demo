# q_4 — A-004 — What implicit type conversions are allowed between numeric primitives in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["implicit type conversion","numeric primitives","type coercion"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 88

### Call 2: search_spec
- params: {"keyword":["numeric types","conversion","casting"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 2139

### Call 3: read_chain
- params: {"chains":["2.1.10.2.2"],"budget":3500,"autoExpand":true}
- response_chars: 78

### Call 4: read_chain
- params: {"chains":["2.1.10/all"],"budget":6000,"autoExpand":true}
- response_chars: 11730

## Raw MCP Output
### search_spec({"keyword":["implicit type conversion","numeric primitives","type coercion"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```
No units found for keywords: implicit type conversion, numeric primitives, type coercion
```

### search_spec({"keyword":["numeric types","conversion","casting"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.10.1
## 2.1.10.1 Fundamental Principles
1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

▸ [T1] 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

▸ [T1] 2.1.10.2.3
### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

▸ [T1] 2.1.10.2.1
### 2.1.10.2.1 Assignment (Implicit)

▸ [T2] 2.1.10.6
## 2.1.10.6 Normative Rules

▸ [T2] 2.1
# 2.1 Primitive Types

▸ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:
  [...]
- the **permitted forms of processing and transformation**;
- the rules of **serialization, normalization, and validation**;
- the boundaries beyond which implicit conversion or interpretation is forbidden.

▸ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

▸ [T2] 2.1.10.2.4
### 2.1.10.2.4 Special / Control Type Rules

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

[Tokens: ~502] [SUFFICIENT: 52% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.10.2.2"],"budget":3500,"autoExpand":true})
```
▸ 2.1.10.2.2
### 2.1.10.2.2 Explicit Conversion — Numeric Types

[Tokens: ~16]
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
Perfect! Now I have comprehensive information about type conversions in E.L.I.A. Let me provide a clear and complete answer.

## Implicit Type Conversions Between Numeric Primitives in E.L.I.A.

**No implicit type conversions are allowed between numeric primitives in E.L.I.A.**

E.L.I.A. is a **strictly typed** language that completely prohibits implicit type conversions between distinct types, including all numeric primitives (§2.1.10.1). The fundamental principle states: "No implicit type conversions are permitted between distinct types."

### What IS Allowed (Implicitly)

The only implicit operations permitted are:

1. **Identity assignment** (`T → T`) - assigning the same type to itself
2. **Nullable widening** (`T → T?`) - assigning a non-nullable value to its nullable variant  
3. **Boxing to `any`** - any type can be implicitly boxed into the `any` type

### What Requires Explicit Conversion

All numeric type conversions require explicit casting, even "safe" ones like widening:

| Conversion Type | Examples | Requirement |
|-----------------|----------|-------------|
| **Widening** (W) | `int8` → `int32`, `uint8` → `uint32` | Explicit cast required |
| **Narrowing** (N) | `int32` → `int8`, `uint64` → `uint32` | Explicit cast + runtime range check |
| **Signedness change** (S) | `int8` → `uint8`, `uint32` → `int32` | Explicit cast required |
| **Integer ↔ Floating point** | `int32` → `float`, `decimal` → `double` | Explicit cast (precision loss possible) |

### Forbidden Conversions

Some numeric conversions are completely prohibited, even explicitly:

- **Float/double → integral types**: `float` → `int32` is forbidden (§2.1.10.2.2)
- **No numeric coercion of booleans**: `0 ≠ false`, `1 ≠ true` (TYP-060, §2.1.10.6)

### Normative Rules

The specification enforces this through several normative rules (§2.1.10.6):

- **TYP-040**: "Implicit type conversion between distinct types is FORBIDDEN" 
- **TYP-050**: "Explicit conversion MUST use a declared conversion operator"
- **TYP-090**: "Float/double → integral conversion is FORBIDDEN"

This design ensures type safety, prevents accidental data loss, and makes all type conversions explicit and auditable in the code.

## Metrics
- calls_total: 4
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 10579
- tokens_out: 1634
- tokens_total: 12213
- cache_read: 75235
- cache_creation: 0
- wall_time_sec: 29.4
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_4_mcp1_v2.md
