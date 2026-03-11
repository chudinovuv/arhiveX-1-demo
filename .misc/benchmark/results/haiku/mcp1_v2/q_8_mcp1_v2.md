# q_8 — A-008 — What constraints does E.L.I.A. place on enum default values and when is explicit initialization required?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["enum default values","explicit initialization","enum constraints"],"onto":"WHEN","intent":"normative_rules","indexRanking":["bhva","phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2}
- response_chars: 91

### Call 2: fulltext_search
- params: {"query":"enum default","maxResults":10}
- response_chars: 1324

### Call 3: read_chain
- params: {"chains":["2.1.7.4.1"],"budget":3500,"autoExpand":true}
- response_chars: 1859

### Call 4: read_chain
- params: {"chains":["3.13.3"],"budget":3500,"autoExpand":true}
- response_chars: 146

### Call 5: read_chain
- params: {"chains":["3.14.1.2.2"],"budget":3500,"autoExpand":true}
- response_chars: 150

## Raw MCP Output
### search_spec({"keyword":["enum default values","explicit initialization","enum constraints"],"onto":"WHEN","intent":"normative_rules","indexRanking":["bhva","phya","sema"],"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true,"maxUnits":2})
```
No units found for keywords: enum default values, explicit initialization, enum constraints
```

### fulltext_search({"query":"enum default","maxResults":10})
```
[index: 1211 sections, 1025 paragraphs, 7198 terms]

§ 2.1.7.4.1 — Declaration (normative)
  file: 2_1_primitive_types.md:300  (score 26)
  matched: enum, default
  → grma: enumSyntax

§ 3.13.3 — Normative Rules
  file: 3_0_block_syntax.md:2058  (score 26)
  matched: enum, default

§ 3.14.1.2.2 — Normative Rules
  file: 3_0_block_syntax.md:2207  (score 26)
  matched: enum, default

§ 2.0.6.2 — Inline primitives
  file: 2_0_system_type_overview.md:327  (score 13)
  matched: enum
  → phya: datatypes

§ 2.0.6.2/A. [aspect] — The following primitive types MAY be declared inline ← §2.0.6.2
  file: 2_0_system_type_overview.md:329  (score 13)
  matched: enum
  → phya: datatypes

§ 2.1.7 — Enum
  file: 2_1_primitive_types.md:268  (score 13)
  matched: enum
  → trma: enumPrimitive

§ 2.1.7.3 — Semantic role
  file: 2_1_primitive_types.md:288  (score 13)
  matched: enum

§ 2.1.9.9.1 — Parsing algorithm (normative)
  file: 2_1_primitive_types.md:609  (score 13)
  matched: enum

§ 2.5.2.4 — Event specialization hierarchy (normative)
  file: 2_5_derived_types.md:330  (score 13)
  matched: enum
  → phya: event_type | desa: derivedTypeCatalog | bhva: eventClassNormatives | onma: event_what

§ 2.5.2.4/B. [aspect] — AuditEvent\ ← §2.5.2.4
  file: 2_5_derived_types.md:353  (score 13)
  matched: enum
  → onma: event_what

```

### read_chain({"chains":["2.1.7.4.1"],"budget":3500,"autoExpand":true})
```
▸ 2.1.7.4.1
### 2.1.7.4.1 Declaration (normative)
1. An `enum` **MUST be declared using the** `define` construct and **MUST introduce a new primitive type** with a closed and finite value set.
2. An enum declaration **MUST specify at least one enum member**; empty enumerations are forbidden.
3. Enum member identifiers **MUST be unique within the enum scope** and **MUST be stable once published**.
4. An enum **MAY declare an explicit default value**; if declared, the default **MUST reference a member of the same enum**.
5. If no default is declared, the enum **MUST be explicitly initialized** at every usage site; implicit defaults are forbidden.
6. Enum members **MAY be associated with an explicit underlying value** (integral or string literal). If omitted, the underlying value **MUST be auto-assigned deterministically** according to declaration order.
7. The underlying representation **MUST NOT affect semantic equality**: enum values are equal **only if their enum type and member identifier match**, regardless of underlying value.
8. Enum declarations **MAY** include an `explained as` clause to document semantic intent, but this clause **MUST NOT alter runtime behavior**.
9. Enum declarations **MAY** include an `enforced` clause; any referenced definitions **MUST apply uniformly to all enum members**.
10. An enum declaration **MUST be immutable** after compilation; runtime extension, mutation, or injection of new members is strictly forbidden.
11. Any change to the member set, default value, or underlying representation **MUST constitute a new enum version** and **MUST be treated as a breaking semantic change** unless explicitly governed by higher-level compatibility rules.
12. Enum declarations **MUST be resolved at compile time**; unresolved or ambiguous enum references **MUST result in a compile-time error**.

[Tokens: ~461]
```

### read_chain({"chains":["3.13.3"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 3.13.3

[Tokens: ~33]
```

### read_chain({"chains":["3.14.1.2.2"],"budget":3500,"autoExpand":true})
```

─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 3.14.1.2.2

[Tokens: ~34]
```

## Answer
Секция также недоступна. У меня есть достаточно информации из §2.1.7.4.1 для полного ответа о constraint на enum default values.

Based on the E.L.I.A. specification, the constraints on enum default values and explicit initialization requirements are clearly defined in **§2.1.7.4.1**:

## Default Value Constraints

1. **Optional Declaration**: An enum **MAY declare an explicit default value** (§2.1.7.4.1, rule 4)

2. **Member Reference Requirement**: If a default value is declared, it **MUST reference a member of the same enum** (§2.1.7.4.1, rule 4)

3. **Immutability**: The default value **MUST be immutable** after compilation and any change constitutes a breaking semantic change (§2.1.7.4.1, rules 10-11)

## Explicit Initialization Requirements

**Mandatory explicit initialization** applies when:

- **No default is declared**: If no default value is specified in the enum declaration, the enum **MUST be explicitly initialized at every usage site** (§2.1.7.4.1, rule 5)

- **Implicit defaults forbidden**: The specification explicitly states that "implicit defaults are forbidden" (§2.1.7.4.1, rule 5)

## Additional Constraints

- **Compile-time resolution**: Enum declarations **MUST be resolved at compile time**, and unresolved references **MUST result in a compile-time error** (§2.1.7.4.1, rule 12)

- **Semantic equality**: The underlying representation **MUST NOT affect semantic equality** - enums are equal only if their type and member identifier match (§2.1.7.4.1, rule 7)

## Summary

E.L.I.A. follows a strict initialization model for enums: either declare an explicit default value (which must reference a valid enum member), or require explicit initialization at every usage site. There are no implicit defaults or automatic fallback values.

## Metrics
- calls_total: 5
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 8368
- tokens_out: 1400
- tokens_total: 9768
- cache_read: 90282
- cache_creation: 0
- wall_time_sec: 27.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_8_mcp1_v2.md
