# q_7 — A-007 — What are the normative properties of the Date/Time class in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["Date/Time","datetime","temporal type"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","bhva","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1256

### Call 2: read_chain
- params: {"chains":["2.1.4.2"],"budget":3500,"autoExpand":true}
- response_chars: 1386

### Call 3: read_chain
- params: {"chains":["2.1.9.5"],"budget":3500,"autoExpand":true}
- response_chars: 416

## Raw MCP Output
### search_spec({"keyword":["Date/Time","datetime","temporal type"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","bhva","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9.5
## 2.1.9.5 Temporal encoding

▸ [T1] 2.1.4
# 2.1.4 Date/Time Class

▸ [T1] 2.1.4.1
## 2.1.4.1 Designation

▸ [T1] 2.1.4.2
## 2.1.4.2 Normative properties

▸ [T1] 2.1.4.3
## 2.1.4.3 Semantic role
1. Date/time primitives act as **temporal truth carriers**, making temporal interpretation explicit and inspectable.
2. They enable enforcement and audit tooling to reason about time-bound obligations deterministically (e.g., effective/deprecated dates, retention and evidence timelines).
3. They provide a stable temporal substrate that prevents hidden timezone and locale drift from silently altering meaning.

▸ [T2] 2.1
# 2.1 Primitive Types

▸ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

▸ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

▸ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/E.
**E. External primitives:**\

▸ [T2] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

[Tokens: ~282] [SUFFICIENT: 82% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.4.2"],"budget":3500,"autoExpand":true})
```
▸ 2.1.4.2
## 2.1.4.2 Normative properties
1. Temporal primitives **MUST serialize canonically** and deterministically across runtimes.
2. Temporal primitives **MUST NOT** embed implicit locale, calendar, or platform-specific behavior.
3. `date` **MUST** represent a civil calendar date only and **MUST NOT** imply time-of-day, timezone, or offset.
4. `time` **MUST** represent a wall-clock time only and **MUST NOT** imply a date, timezone, or offset.
5. `timestamp` **MUST** represent an absolute instant and **MUST** carry an explicit timezone/offset semantic at the serialization boundary (canonical form).
6. `timespan` **MUST** represent an elapsed duration and **MUST NOT** be interpreted as a calendar interval (no month/year semantics unless explicitly declared by a higher-level construct).
7. Implicit conversion between `date`, `time`, `timestamp`, and `timespan` **MUST NOT** be permitted; any conversion MUST be explicit and type-bound.
8. Temporal comparison and arithmetic **MUST** be type-safe:
   - (a) ordering comparisons are admissible for `timestamp` and MAY be admissible for `time` (within the same day context) when explicitly declared;
   - (b) `timespan` MAY be added/subtracted to/from `timestamp` only via explicit operations;
   - (c) `date` arithmetic is forbidden unless an explicit calendar policy is declared by a higher-level construct.

[Tokens: ~343]
```

### read_chain({"chains":["2.1.9.5"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.5
## 2.1.9.5 Temporal encoding
1. `timestamp` **MUST be encoded as UTC-based epoch time** with explicitly declared unit (milliseconds unless otherwise specified in ANNEX A).
2. `date` and `time` **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics.
3. `timespan` **MUST be encoded as an exact duration value**, independent of calendar semantics.

[Tokens: ~101]
```

## Answer
Based on the E.L.I.A. specification, the Date/Time class has comprehensive normative properties defined in §2.1.4.2 and §2.1.9.5. Here are the key normative requirements:

## Core Serialization Requirements

- Temporal primitives **MUST serialize canonically** and deterministically across runtimes (§2.1.4.2)
- Temporal primitives **MUST NOT** embed implicit locale, calendar, or platform-specific behavior (§2.1.4.2)

## Type-Specific Requirements

**Date primitives:**
- `date` **MUST** represent a civil calendar date only and **MUST NOT** imply time-of-day, timezone, or offset (§2.1.4.2)
- **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics (§2.1.9.5)

**Time primitives:**
- `time` **MUST** represent a wall-clock time only and **MUST NOT** imply a date, timezone, or offset (§2.1.4.2)
- **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics (§2.1.9.5)

**Timestamp primitives:**
- `timestamp` **MUST** represent an absolute instant and **MUST** carry an explicit timezone/offset semantic at the serialization boundary (§2.1.4.2)
- **MUST be encoded as UTC-based epoch time** with explicitly declared unit (milliseconds unless otherwise specified) (§2.1.9.5)

**Timespan primitives:**
- `timespan` **MUST** represent an elapsed duration and **MUST NOT** be interpreted as a calendar interval (no month/year semantics unless explicitly declared by a higher-level construct) (§2.1.4.2)
- **MUST be encoded as an exact duration value**, independent of calendar semantics (§2.1.9.5)

## Type Safety Requirements

- Implicit conversion between `date`, `time`, `timestamp`, and `timespan` **MUST NOT** be permitted; any conversion **MUST** be explicit and type-bound (§2.1.4.2)

**Temporal arithmetic constraints:**
- Ordering comparisons are admissible for `timestamp` and **MAY** be admissible for `time` (within the same day context) when explicitly declared
- `timespan` **MAY** be added/subtracted to/from `timestamp` only via explicit operations  
- `date` arithmetic is forbidden unless an explicit calendar policy is declared by a higher-level construct

These normative properties ensure that temporal data in E.L.I.A. remains deterministic, auditable, and semantically unambiguous across different runtime environments and locales.

## Metrics
- calls_total: 3
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 4864
- tokens_out: 1411
- tokens_total: 6275
- cache_read: 60188
- cache_creation: 0
- wall_time_sec: 22.8
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_7_mcp1_v2.md
