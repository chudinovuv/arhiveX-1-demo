# q_3 — A-003 — How does E.L.I.A. distinguish between null, void, and nothing — what are the normative differences?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["null","void","nothing"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","trma"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 2059

### Call 2: search_spec
- params: {"keyword":["special control primitives","absence marker","non-materialized"],"onto":"WHEN","intent":"normative_rules","indexRanking":["bhva","desa"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 89

### Call 3: fulltext_search
- params: {"query":"null void nothing absence","maxResults":5}
- response_chars: 858

### Call 4: read_chain
- params: {"chains":["2.8.2"],"budget":3500,"autoExpand":true}
- response_chars: 145

### Call 5: read_chain
- params: {"chains":["2.0.6.2"],"budget":3500,"autoExpand":true}
- response_chars: 147

## Raw MCP Output
### search_spec({"keyword":["null","void","nothing"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","trma"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.6
# 2.1.6 Special/control Class
Special/control primitives represent **semantic control markers**, not domain data. They are used to explicitly model absence, non-materialization, control flow boundaries, and constrained value spaces in a deterministic and inspectable way. These primitives are essential for semantic clarity and enforcement but MUST NOT be treated as business data or used to encode implicit behavior. This class is represented by three types:
- (a) `null` represents an explicit absence of data value.
- (b) `void` represents the absence of a return value or a platform-native pointer placeholder.
- (c) `nothing` represents a non-materialized or undefined semantic state.

▸ [T1] 2.1.6.1
## 2.1.6.1 Normative properties
1. Special/control primitives (`null`, `void`, `nothing`) **MUST NOT** be treated as business data and **MUST NOT** be used to encode implicit state machines, multi-valued states, or control flow.
2. `null` **MUST** represent explicit absence of a value and **MUST NOT** be semantically conflated with `nothing`.
3. `nothing` **MUST** represent a non-materialized or undefined semantic state and **MUST NOT** be used as a substitute for `null` or `void`.
4. `void` **MUST** represent the absence of a return value (or an explicitly declared platform-native placeholder when permitted by the runtime profile) and **MUST NOT** be materialized as a value payload.
5. Implicit conversions between `null`, `void`, and `nothing` are **strictly forbidden**. Any conversion, if permitted by a higher-level construct, MUST be explicit and MUST preserve the originating semantic meaning.
6. Serialization of special/control primitives **MUST be canonical** and **MUST be deterministic** across runtimes:
   - (a) `null` **MUST** serialize as an explicit absence marker.
   - (b) `nothing` **MUST** serialize as an explicit non-materialization marker.
   - (c) `void` **MUST NOT** serialize as a materialized payload; it is a control semantic and may only appear in signature positions.

[Tokens: ~511]
```

### search_spec({"keyword":["special control primitives","absence marker","non-materialized"],"onto":"WHEN","intent":"normative_rules","indexRanking":["bhva","desa"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```
No units found for keywords: special control primitives, absence marker, non-materialized
```

### fulltext_search({"query":"null void nothing absence","maxResults":5})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.0.6.2 — Inline primitives
  file: 2_0_system_type_overview.md:327  (score 39)
  matched: null, void, nothing
  → phya: datatypes

§ 2.0.6.2/A. [aspect] — The following primitive types MAY be declared inline ← §2.0.6.2
  file: 2_0_system_type_overview.md:329  (score 39)
  matched: null, void, nothing
  → phya: datatypes

§ 2.1.6 — Special/control Class
  file: 2_1_primitive_types.md:224  (score 39)
  matched: null, void, nothing
  → phya: non-value | sema: non-value | trma: specialControlClass

§ 2.1.6.1 — Normative properties
  file: 2_1_primitive_types.md:231  (score 39)
  matched: null, void, nothing
  → phya: non-value | sema: non-value | bhva: specialNormatives

§ 2.8.2 — typeof
  file: 2_8_data_type_functions.md:98  (score 39)
  matched: null, void, nothing
  → desa: dataTypeFunctions

```

### read_chain({"chains":["2.8.2"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.8.2

[Tokens: ~33]
```

### read_chain({"chains":["2.0.6.2"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.0.6.2

[Tokens: ~34]
```

## Answer
У меня достаточно информации из §2.1.6 для полного ответа. Секция четко определяет все три концепта и их нормативные различия.

Based on §2.1.6, E.L.I.A. makes clear normative distinctions between `null`, `void`, and `nothing` as special/control primitives:

## Semantic Differences

**`null`** represents an **explicit absence of data value** - it indicates that a value position exists but contains no data.

**`void`** represents the **absence of a return value** or serves as a platform-native pointer placeholder when permitted by the runtime profile. It indicates no value is returned or expected.

**`nothing`** represents a **non-materialized or undefined semantic state** - it indicates that the semantic state itself has not been established or materialized.

## Normative Requirements

The specification establishes strict normative boundaries (§2.1.6.1):

1. **No business data usage**: All three primitives **MUST NOT** be treated as business data or used to encode implicit state machines or control flow.

2. **Semantic separation**: 
   - `null` **MUST NOT** be semantically conflated with `nothing`
   - `nothing` **MUST NOT** be used as a substitute for `null` or `void`
   - `void` **MUST NOT** be materialized as a value payload

3. **Conversion restrictions**: Implicit conversions between these three primitives are **strictly forbidden**. Any conversion MUST be explicit and preserve originating semantic meaning.

4. **Serialization requirements**:
   - `null` **MUST** serialize as an explicit absence marker
   - `nothing` **MUST** serialize as an explicit non-materialization marker  
   - `void` **MUST NOT** serialize as a materialized payload (control semantic only)

The key distinction is that `null` indicates explicit absence of a value, `void` indicates absence of return/no value expected, while `nothing` indicates the semantic state itself is undefined or non-materialized.

## Metrics
- calls_total: 5
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 9309
- tokens_out: 1580
- tokens_total: 10889
- cache_read: 90282
- cache_creation: 0
- wall_time_sec: 30.8
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_3_mcp1_v2.md
