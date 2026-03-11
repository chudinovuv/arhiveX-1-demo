# q_12 — B-002 — What normative properties govern the Decimal/floating class in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["Decimal","floating","normative properties"],"onto":"WHAT","intent":"normative_rules","indexRanking":["bhva","phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2}
- response_chars: 3808

### Call 2: search_spec
- params: {"keyword":["decimal precision","floating point validation","type-safe comparison"],"onto":"WHEN","intent":"normative_rules","indexRanking":["bhva","desa"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":1}
- response_chars: 95

### Call 3: lookup_xref
- params: {"sections":["2.1.2.2"],"mode":"forward","refType":["section"]}
- response_chars: 47

## Raw MCP Output
### search_spec({"keyword":["Decimal","floating","normative properties"],"onto":"WHAT","intent":"normative_rules","indexRanking":["bhva","phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.3
## 2.1.9.3 Floating-point and decimal encoding
1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

▸ [T1] 2.1.2
# 2.1.2 Decimal / floating Class
Decimal and floating-point primitives represent numeric values with fractional components.

▸ [T1] 2.1.2/(B)
(B) This class represented by types:

- `decimal` is intended for **exact, base-10 arithmetic** (e.g., monetary values) and MUST preserve declared precision across serialization boundaries.
- `float` represent **approximate single precision numeric values**  optimized for geometry, statistical, or signal-processing use cases
- `double` represent **approximate double precision numeric values** optimized for scientific, statistical, or signal-processing use cases.

▸ [T1] 2.1.2/(A)
(A) The type system explicitly distinguishes **exact decimal arithmetic** from **binary floating-point arithmetic** to prevent semantic ambiguity and audit-unsafe rounding assumptions.

▸ [T1] 2.1.2.1
## 2.1.2.1 Designation
1. represent fractional numeric facts for measurement, ratios, and calculations where integers are insufficient;
2. separate **exact** (decimal) from **approximate** (binary floating-point) arithmetic as distinct semantic commitments;
3. enable deterministic serialization and validation of numeric values with fractional components;
4. prevent implicit precision loss and audit ambiguity by making approximation explicitly type-bound.

▸ [T1] 2.1.2.2
## 2.1.2.2 Normative properties
1. `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.
2.  `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation.
3. `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values.
4.  Implicit conversion between `decimal` and `float` / `double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.
5. Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).
6. Comparison semantics **MUST** be type-safe: cross-type comparison between `decimal` and `float` / `double` is forbidden unless an explicit conversion is performed.
7. Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.

▸ [T1] 2.1.2.3
## 2.1.2.3 Semantic role
1. Decimal and floating types act as **numeric truth carriers**, where the chosen type communicates the admissible interpretation of the value (exact vs approximate).
2. They enable enforcement and validation to reason about precision-sensitive constraints without implicit assumptions.
3. They support auditability by ensuring that approximation is a declared property of the type, not an emergent runtime artifact.

▸ [T1] 2.1.2.3/A.
**A. Standards reference:**

- IEEE 754 (Binary floating-point arithmetic — `float`, `double`)
- ISO/IEC 10967-2 (Language-independent floating-point arithmetic)
- IEEE 754-2008 / 2019 Decimal Floating-Point (conceptual alignment for `decimal`)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

[Tokens: ~949]
```

### search_spec({"keyword":["decimal precision","floating point validation","type-safe comparison"],"onto":"WHEN","intent":"normative_rules","indexRanking":["bhva","desa"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":1})
```
No units found for keywords: decimal precision, floating point validation, type-safe comparison
```

### lookup_xref({"sections":["2.1.2.2"],"mode":"forward","refType":["section"]})
```
⊘ No outgoing references from sections: 2.1.2.2
```

## Answer
У меня достаточно информации для полного ответа. Основная информация о нормативных свойствах найдена в первом поиске.

The normative properties governing the Decimal/floating class in E.L.I.A. are comprehensively defined in **§2.1.2.2 Normative properties** and supported by encoding requirements in **§2.1.9.3**. Here are the key normative requirements:

## Core Normative Properties (§2.1.2.2)

1. **Deterministic representation**: `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.

2. **Type semantic integrity**: 
   - `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation
   - `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values

3. **Explicit conversion requirement**: Implicit conversion between `decimal` and `float`/`double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.

4. **Observable precision handling**: Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).

5. **Type-safe comparison**: Comparison semantics **MUST** be type-safe; cross-type comparison between `decimal` and `float`/`double` is forbidden unless an explicit conversion is performed.

6. **Serialization consistency**: Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.

## Encoding Requirements (§2.1.9.3)

1. **IEEE 754 compliance**: `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.

2. **Decimal canonical form**: `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.

3. **Parser constraints**: Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

## Design Intent (§2.1.2.1)

The normative framework serves to:
- Separate **exact** (decimal) from **approximate** (binary floating-point) arithmetic as distinct semantic commitments
- Enable deterministic serialization and validation of numeric values with fractional components
- Prevent implicit precision loss and audit ambiguity by making approximation explicitly type-bound

These properties ensure that the Decimal/floating class maintains **auditability**, **type safety**, and **semantic clarity** by treating exactness vs. approximation as a declared property of the type rather than an emergent runtime artifact.

## Metrics
- calls_total: 3
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 5960
- tokens_out: 1560
- tokens_total: 7520
- cache_read: 60188
- cache_creation: 0
- wall_time_sec: 25.7
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_12_mcp1_v2.md
