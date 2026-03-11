# q_14 — B-004 — What is the canonical binary encoding for floating-point and decimal values in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["floating-point","decimal","binary encoding","canonical"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 5464

### Call 2: search_spec
- params: {"keyword":["IEEE 754","base-10 representation","canonical binary width"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1061

### Call 3: read_chain
- params: {"chains":["A.1"],"extract":"table","budget":3500,"detail":"normal","autoExpand":true}
- response_chars: 13

### Call 4: search_spec
- params: {"keyword":["type registry","float","double","decimal","binary width"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 286

## Raw MCP Output
### search_spec({"keyword":["floating-point","decimal","binary encoding","canonical"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives

▸ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles
1. All primitive values **MUST serialize deterministically** into a single canonical binary representation.
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

▸ [T1] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T1] 2.1.9.8/E.
**E. External primitives:**\
A primitive value **MUST** be stored externally when its canonical binary width exceeds 48 bits.

Typical external primitives include:
  [...]
- `int64` (`long`), `uint64` (`ulong`)
- `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`

▸ [T1] 2.1.9.3
## 2.1.9.3 Floating-point and decimal encoding
1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

▸ [T1] 2.1.2
# 2.1.2 Decimal / floating Class
Decimal and floating-point primitives represent numeric values with fractional components.

▸ [T1] 2.1.2/(A)
(A) The type system explicitly distinguishes **exact decimal arithmetic** from **binary floating-point arithmetic** to prevent semantic ambiguity and audit-unsafe rounding assumptions.

▸ [T1] 2.1.2/(B)
(B) This class represented by types:

- `decimal` is intended for **exact, base-10 arithmetic** (e.g., monetary values) and MUST preserve declared precision across serialization boundaries.
- `float` represent **approximate single precision numeric values**  optimized for geometry, statistical, or signal-processing use cases
- `double` represent **approximate double precision numeric values** optimized for scientific, statistical, or signal-processing use cases.

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

▸ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T1] 2.1.9.9
## 2.1.9.9 Parser obligations

▸ [T1] 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)

▸ [T1] 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)

▸ [T2] 2.1.9.10
## 2.1.9.10 Performance Implications

▸ [T2] 2.1.9.10.1
### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

▸ [T2] 2.1.9.10.1/B.
**B. Typical examples:**

▸ [T2] 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

▸ [T2] 2.1.9.10.2/B.
**B. Typical examples:**
- `int64` (`long`), `uint64` (`ulong`), `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`

▸ [T2] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

[Tokens: ~1362]
```

### search_spec({"keyword":["IEEE 754","base-10 representation","canonical binary width"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.3
## 2.1.9.3 Floating-point and decimal encoding
1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

▸ [T1] 2.1.2
# 2.1.2 Decimal / floating Class

▸ [T1] 2.1.2/(A)
(A) The type system explicitly distinguishes **exact decimal arithmetic** from **binary floating-point arithmetic** to prevent semantic ambiguity and audit-unsafe rounding assumptions.

▸ [T1] 2.1.2.1
## 2.1.2.1 Designation

▸ [T1] 2.1.2.2
## 2.1.2.2 Normative properties

▸ [T1] 2.1.2.3
## 2.1.2.3 Semantic role

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/C.
**C. When inline representation is used:**

[Tokens: ~233] [SUFFICIENT: 78% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["A.1"],"extract":"table","budget":3500,"detail":"normal","autoExpand":true})
```

[Tokens: ~0]
```

### search_spec({"keyword":["type registry","float","double","decimal","binary width"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══

[... TRUNCATED — 4 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 24/3500 tokens, trimmed from 4] [SUFFICIENT: 43% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

## Answer
Based on the specification content I've gathered, I can provide a comprehensive answer about the canonical binary encoding for floating-point and decimal values in E.L.I.A.

## Canonical Binary Encoding for Floating-Point and Decimal Values

E.L.I.A. defines strict canonical binary encoding rules for floating-point and decimal values to ensure deterministic serialization and cross-platform compatibility.

### General Encoding Principles (§2.1.9.1)

All primitive values, including floating-point and decimal types, **MUST serialize deterministically** into a single canonical binary representation. The encoding:

- **MUST be bijective**: decoding must always reconstruct the original value without information loss
- **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration  
- **MUST ensure** no primitive has more than one valid binary encoding for the same semantic value

### Floating-Point Encoding (§2.1.9.3)

- **`float` and `double` MUST be encoded according to IEEE 754 binary formats**
- These represent approximate arithmetic optimized for geometry, statistical, or signal-processing use cases
- Parsers **MUST NOT normalize, round, or reinterpret** floating-point values beyond declared encoding rules

### Decimal Encoding (§2.1.9.3)

- **`decimal` MUST be encoded using a canonical base-10 representation** preserving declared precision and scale
- Designed for **exact, base-10 arithmetic** (e.g., monetary values)
- **MUST preserve declared precision across serialization boundaries**
- **MUST model base-10 exactness** and cannot be silently coerced into binary floating-point representation

### Storage Classification (§2.1.9.8)

Both `double` and `decimal` are classified as **external primitives** because their canonical binary width exceeds 48 bits. This means they:

- **MUST be stored externally** when their canonical binary width exceeds 48 bits
- Are subject to different performance characteristics compared to inline primitives

### Type Safety and Conversion Rules (§2.1.2.2)

- Implicit conversion between `decimal` and `float`/`double` **MUST NOT** be permitted
- Any conversion MUST be explicit and acknowledge potential precision loss
- Cross-type comparison between `decimal` and floating-point types is forbidden unless explicit conversion is performed

### Standards Compliance (§2.1.2.3)

The specification references these standards for implementation:
- **IEEE 754** (Binary floating-point arithmetic for `float`, `double`)
- **ISO/IEC 10967-2** (Language-independent floating-point arithmetic)
- **IEEE 754-2008/2019 Decimal Floating-Point** (conceptual alignment for `decimal`)

This encoding scheme ensures that E.L.I.A. maintains semantic distinction between exact decimal and approximate floating-point arithmetic while providing deterministic serialization suitable for audit-critical applications.

## Metrics
- calls_total: 4
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 12338
- tokens_out: 1793
- tokens_total: 14131
- cache_read: 75235
- cache_creation: 0
- wall_time_sec: 31.6
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_14_mcp1_v2.md
