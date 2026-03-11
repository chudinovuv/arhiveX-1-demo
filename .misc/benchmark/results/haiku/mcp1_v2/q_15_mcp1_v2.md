# q_15 — B-005 — How are temporal (Date/Time) values encoded at the binary level in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["temporal","date time","binary encoding"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1334

### Call 2: search_spec
- params: {"keyword":["datetime","timestamp","temporal types"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 3049

### Call 3: read_chain
- params: {"chains":["2.1.9.8"],"budget":3500,"autoExpand":true}
- response_chars: 1034

### Call 4: fulltext_search
- params: {"query":"UTC epoch timestamp milliseconds binary","maxResults":5}
- response_chars: 663

### Call 5: read_chain
- params: {"chains":["A.3"],"budget":3500,"autoExpand":true}
- response_chars: 13

### Call 6: read_chain
- params: {"chains":["2.1.9.5/all"],"budget":3500,"autoExpand":true}
- response_chars: 422

## Raw MCP Output
### search_spec({"keyword":["temporal","date time","binary encoding"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives

▸ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles
  [...]
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

▸ [T1] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T1] 2.1.9.8/E.
**E. External primitives:**\

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

▸ [T2] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

[Tokens: ~301] [SUFFICIENT: 70% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### search_spec({"keyword":["datetime","timestamp","temporal types"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.5
## 2.1.9.5 Temporal encoding
1. `timestamp` **MUST be encoded as UTC-based epoch time** with explicitly declared unit (milliseconds unless otherwise specified in ANNEX A).
2. `date` and `time` **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics.
3. `timespan` **MUST be encoded as an exact duration value**, independent of calendar semantics.

▸ [T1] 2.1.4
# 2.1.4 Date/Time Class

▸ [T1] 2.1.4.1
## 2.1.4.1 Designation
  [...]
2. provide deterministic ordering and traceability for audit, evidence, and causality chains.
3. prevent locale, calendar, and platform drift by making temporal interpretation type-bound.
4. support legal and compliance-relevant time semantics (retention windows, effective/deprecated dates, evidence timestamps).

▸ [T1] 2.1.4.2
## 2.1.4.2 Normative properties
  [...]
3. `date` **MUST** represent a civil calendar date only and **MUST NOT** imply time-of-day, timezone, or offset.
4. `time` **MUST** represent a wall-clock time only and **MUST NOT** imply a date, timezone, or offset.
5. `timestamp` **MUST** represent an absolute instant and **MUST** carry an explicit timezone/offset semantic at the serialization boundary (canonical form).
6. `timespan` **MUST** represent an elapsed duration and **MUST NOT** be interpreted as a calendar interval (no month/year semantics unless explicitly declared by a higher-level construct).
7. Implicit conversion between `date`, `time`, `timestamp`, and `timespan` **MUST NOT** be permitted; any conversion MUST be explicit and type-bound.
8. Temporal comparison and arithmetic **MUST** be type-safe:
   - (a) ordering comparisons are admissible for `timestamp` and MAY be admissible for `time` (within the same day context) when explicitly declared;
   - (b) `timespan` MAY be added/subtracted to/from `timestamp` only via explicit operations;
   - (c) `date` arithmetic is forbidden unless an explicit calendar policy is declared by a higher-level construct.

▸ [T1] 2.1.4.3
## 2.1.4.3 Semantic role

▸ [T2] 2.1
# 2.1 Primitive Types

▸ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding
1. Identifiers (`guid`, `riid`) **MUST be encoded as fixed-width binary values** with no embedded delimiters, formatting, or textual normalization.
2. Parsers **MUST NOT infer ordering, timestamps, or structure** from identifier binary layouts unless explicitly defined by the identifier type.

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/E.
**E. External primitives:**\
  [...]
- `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`


▸ [T2] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

[Tokens: ~730] [SUFFICIENT: 54% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.9.8"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.8
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

[Tokens: ~255]
```

### fulltext_search({"query":"UTC epoch timestamp milliseconds binary","maxResults":5})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.1.9.5 — Temporal encoding
  file: 2_1_primitive_types.md:509  (score 39)
  matched: utc, epoch, timestamp

§ A.3 — Primitive Data Types (CATEGORY = `00`)
  file: annex_a_type_registry.md:44  (score 26)
  matched: epoch, timestamp
  → phya: primitiveTypesRegistry

§ 2.1.4 — Date/Time Class
  file: 2_1_primitive_types.md:120  (score 13)
  matched: timestamp
  → trma: dateTimeClass

§ 2.1.4.2 — Normative properties
  file: 2_1_primitive_types.md:136  (score 13)
  matched: timestamp
  → bhva: dateNormatives

§ 2.1.9.8 — Normative rules
  file: 2_1_primitive_types.md:524  (score 13)
  matched: timestamp

```

### read_chain({"chains":["A.3"],"budget":3500,"autoExpand":true})
```

[Tokens: ~0]
```

### read_chain({"chains":["2.1.9.5/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.5/all
## 2.1.9.5 Temporal encoding

1. `timestamp` **MUST be encoded as UTC-based epoch time** with explicitly declared unit (milliseconds unless otherwise specified in ANNEX A).
2. `date` and `time` **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics.
3. `timespan` **MUST be encoded as an exact duration value**, independent of calendar semantics.


[Tokens: ~102]
```

## Answer
Based on my search through the E.L.I.A. specification, here's how temporal (Date/Time) values are encoded at the binary level:

## Temporal Binary Encoding in E.L.I.A.

### General Encoding Principles (§2.1.9.1)
All temporal types follow E.L.I.A.'s canonical encoding principles:
- **Bijective serialization**: Encoding must be reversible without information loss
- **Platform independence**: No dependency on CPU endianness, word size, or locale
- **Unique encoding**: Each semantic value has exactly one valid binary representation

### Specific Temporal Encoding Rules (§2.1.9.5)

**1. `timestamp` encoding:**
- **MUST be encoded as UTC-based epoch time**
- Default unit is **milliseconds** (unless otherwise specified in ANNEX A)
- Represents an absolute instant with explicit timezone/offset semantics at serialization boundary

**2. `date` encoding:**
- **MUST use fixed, locale-independent representations**
- Based on **ISO 8601 semantics**
- Represents civil calendar date only (no time-of-day, timezone, or offset)

**3. `time` encoding:**
- **MUST use fixed, locale-independent representations** 
- Based on **ISO 8601 semantics**
- Represents wall-clock time only (no date, timezone, or offset)

**4. `timespan` encoding:**
- **MUST be encoded as an exact duration value**
- Independent of calendar semantics (no month/year interpretation unless explicitly declared)

### Storage Architecture (§2.1.9.8)

Temporal types are classified as **external primitives** (>48 bits), meaning they:
- Are stored outside the inline Type Data field
- Require their own Envelope structure
- Use offset references in the 48-bit Type Data field:
  - Bits [47..16]: 32-bit unsigned offset from Envelope start
  - Bits [15..0]: Reserved (must be 0)

### Type Safety Requirements (§2.1.4.2)
The specification enforces strict type safety:
- **No implicit conversions** between temporal types
- All conversions must be explicit and type-bound
- Temporal arithmetic is restricted and type-safe
- Ordering comparisons are only permitted for `timestamp` and conditionally for `time`

This encoding approach ensures deterministic, auditable temporal handling across platforms while maintaining compliance with international standards and legal requirements for time-sensitive data.

## Metrics
- calls_total: 6
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 17348
- tokens_out: 1769
- tokens_total: 19117
- cache_read: 105329
- cache_creation: 0
- wall_time_sec: 33.4
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_15_mcp1_v2.md
