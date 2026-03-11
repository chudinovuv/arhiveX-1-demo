# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["guid","riid","binary encoding","identifier"],"onto":"HOW","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 2188

### Call 2: search_spec
- params: {"keyword":["guid","riid","canonical binary width","128-bit"],"onto":"WHAT","intent":"full","indexRanking":["phya","trma"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 286

### Call 3: search_spec
- params: {"keyword":["guid binary","riid binary"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 53

### Call 4: fulltext_search
- params: {"query":"guid riid binary encoding","maxResults":5}
- response_chars: 639

### Call 5: read_chain
- params: {"chains":["2.1.5","2.1.9.10.2"],"budget":3500,"autoExpand":true}
- response_chars: 555

### Call 6: read_chain
- params: {"chains":["2.1.9.10.2/all"],"budget":3500,"autoExpand":true}
- response_chars: 709

### Call 7: search_spec
- params: {"keyword":["48 bits","external primitives","canonical binary width"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 2367

## Raw MCP Output
### search_spec({"keyword":["guid","riid","binary encoding","identifier"],"onto":"HOW","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T3] 2.1.9.6
## 2.1.9.6 Identifier encoding
1. Identifiers (`guid`, `riid`) **MUST be encoded as fixed-width binary values** with no embedded delimiters, formatting, or textual normalization.
2. Parsers **MUST NOT infer ordering, timestamps, or structure** from identifier binary layouts unless explicitly defined by the identifier type.

▸ [T3] 2.1.9.8
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

▸ [T3] 2.1.9.8/E.
**E. External primitives:**\
A primitive value **MUST** be stored externally when its canonical binary width exceeds 48 bits.

Typical external primitives include:

- `int64` (`long`), `uint64` (`ulong`)
  [...]
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`


▸ [T3] 2.1.9.8/B.
**B. When offset-based reference is used:**
  [...]
  47                                               0
  +------------------------------------------------+
  |           Inlined referenced value             |
  +------------------------------------------------+
```

▸ [T3] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**


─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 3.21
  ✗ 3.21.1

[Tokens: ~544]
```

### search_spec({"keyword":["guid","riid","canonical binary width","128-bit"],"onto":"WHAT","intent":"full","indexRanking":["phya","trma"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══

[... TRUNCATED — 4 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 24/3500 tokens, trimmed from 4] [SUFFICIENT: 69% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### search_spec({"keyword":["guid binary","riid binary"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```
No units found for keywords: guid binary, riid binary
```

### fulltext_search({"query":"guid riid binary encoding","maxResults":5})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.1.9.6 — Identifier encoding
  file: 2_1_primitive_types.md:515  (score 52)
  matched: guid, riid, binary, encoding

§ 2.1.5 — Identifiers Class
  file: 2_1_primitive_types.md:168  (score 26)
  matched: guid, riid
  → trma: identifiersClass

§ 2.1.9.8 — Normative rules
  file: 2_1_primitive_types.md:524  (score 26)
  matched: guid, riid

§ 2.1.9.8/E. [aspect] — External primitives:\ ← §2.1.9.8
  file: 2_1_primitive_types.md:580  (score 26)
  matched: guid, riid

§ 2.1.9.10.2 — External primitives (> 48 bits)
  file: 2_1_primitive_types.md:706  (score 26)
  matched: guid, riid

```

### read_chain({"chains":["2.1.5","2.1.9.10.2"],"budget":3500,"autoExpand":true})
```
▸ 2.1.5
# 2.1.5 Identifiers Class
Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

▸ 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

[Tokens: ~135]
```

### read_chain({"chains":["2.1.9.10.2/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.10.2/all
### 2.1.9.10.2 External primitives (> 48 bits)

**A. Characteristics:**
1. Require reading additional bytes beyond the Envelope.
2. MAY incur allocation, buffer access, or indirect memory reads.
3. Increased likelihood of cache misses compared to inline primitives.
4. Atomicity of read/write is platform- and ABI-dependent.
5. Payload access MAY require alignment handling.

**B. Typical examples:**
- `int64` (`long`), `uint64` (`ulong`), `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`

**C. Recommended usage:**
1. Large numeric values.
2. High-precision arithmetic.
3. Temporal and identifier values where extended width is semantically required.


[Tokens: ~174]
```

### search_spec({"keyword":["48 bits","external primitives","canonical binary width"],"onto":"WHAT","intent":"full","indexRanking":["phya"],"maxUnits":1,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives

▸ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles

▸ [T1] 2.1.9.8
### 2.1.9.8 Normative rules
1. `FORMAT_FLAGS` encode **security, compression, and reference semantics**.
2. Type Data **MAY** contain:
   - (a) an **inlined value** (if the referenced concrete type fits within 48 bits), **OR**
   - (b) an **offset / reference** to an external value.
3. The referenced value **MUST** carry its own **Envelope** and **MUST** follow its own encoding rules.
  [...]
   - (c) The referenced value **MUST begin** at the specified offset and **MUST start with its own Envelope**.
5. When Type Data contains an **inlined value**:
   - (a) All 48 bits store the actual value of the referenced primitive or block;
   - (b) Bits [5..3] of `FORMAT_FLAGS` **MUST encode the reference mode**:
     - (i) `0` — inline value;

▸ [T1] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

▸ [T1] 2.1.9.8/D.
**D. Deterministic inlining rule (normative)**\
A primitive value **MAY be inlined if and only if** all of the following conditions are met:

1. Its canonical size **≤ 48 bits (6 bytes)**;
2. Its `TYPE_CODE` **permits inlining** according to **ANNEX A**.


▸ [T1] 2.1.9.8/E.
**E. External primitives:**\
A primitive value **MUST** be stored externally when its canonical binary width exceeds 48 bits.

Typical external primitives include:

- `int64` (`long`), `uint64` (`ulong`)

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

▸ [T2] 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

▸ [T2] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

▸ [T2] 2.1
# 2.1 Primitive Types

▸ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

[Tokens: ~559] [SUFFICIENT: 60% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

## Answer
Теперь у меня достаточно информации для полного ответа. Из всех накопленных данных я могу сформулировать ответ о том, как кодируются identifier values в binary в E.L.I.A.

Based on the E.L.I.A. specification, identifier values (`guid` and `riid`) are encoded in binary according to the following rules:

## External Storage Requirement

Identifier values (`guid`, `riid`) **MUST be stored externally** because their canonical binary width exceeds 48 bits (§2.1.9.8/E). They cannot be inlined within the Type Data field of an envelope, which is limited to 48 bits.

## Binary Encoding Rules

1. **Fixed-Width Binary Format**: Identifiers MUST be encoded as **fixed-width binary values** with no embedded delimiters, formatting, or textual normalization (§2.1.9.6).

2. **No Structural Inference**: Parsers MUST NOT infer ordering, timestamps, or structure from identifier binary layouts unless explicitly defined by the identifier type (§2.1.9.6).

3. **Envelope Requirement**: When stored externally, the referenced identifier value MUST carry its own Envelope and MUST follow its own encoding rules (§2.1.9.8).

## Storage Mechanism

Since `guid` and `riid` exceed the 48-bit inline limit, they use the **offset reference mechanism**:

- Bits [47..16] of the Type Data store a **32-bit unsigned offset** from the start of the current Envelope
- Bits [15..0] are **Reserved** and MUST be 0
- The referenced identifier value MUST begin at the specified offset and MUST start with its own Envelope (§2.1.9.8)

## Identifier Characteristics

Identifiers are designed to be:
- Globally or domain-unique
- Immutable  
- Safe for serialization, transport, persistence, and replay
- Carrying **no embedded semantics** beyond identity (§2.1.5)

The specification emphasizes that identifiers MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior - they serve purely as opaque identity values for correlation, reference, deduplication, and audit traceability.

## Metrics
- calls_total: 7
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 18024
- tokens_out: 2238
- tokens_total: 20262
- cache_read: 120376
- cache_creation: 0
- wall_time_sec: 39.7
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_16_mcp1_v2.md
