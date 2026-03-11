# Render: Q7 — A-007 (A-007)

## Extracted Content

### search_spec({"keyword":["Date/Time class","normative properties","temporal"],"onto":"WHAT","intent":"normative_rules","indexRanking":["phya","bhva","sema"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"maxUnits":3,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9.5
## 2.1.9.5 Temporal encoding

Γû╕ [T1] 2.1.4
# 2.1.4 Date/Time Class
Date and time primitives represent temporal facts and durations with explicit semantics and canonical representation. They are used to model calendar dates, wall-clock times, absolute instants, and elapsed durations in a way that is unambiguous, timezone-safe, and suitable for audit and legal traceability. This class is represented by:

Γû╕ [T1] 2.1.4.1
## 2.1.4.1 Designation
1. encode temporal facts and durations with **explicit, non-ambiguous semantics**.
2. provide deterministic ordering and traceability for audit, evidence, and causality chains.
3. prevent locale, calendar, and platform drift by making temporal interpretation type-bound.
4. support legal and compliance-relevant time semantics (retention windows, effective/deprecated dates, evidence timestamps).

Γû╕ [T1] 2.1.4.2
## 2.1.4.2 Normative properties
1. Temporal primitives **MUST serialize canonically** and deterministically across runtimes.
2. Temporal primitives **MUST NOT** embed implicit locale, calendar, or platform-specific behavior.
3. `date` **MUST** represent a civil calendar date only and **MUST NOT** imply time-of-day, timezone, or offset.
4. `time` **MUST** represent a wall-clock time only and **MUST NOT** imply a date, timezone, or offset.
  [...]
6. `timespan` **MUST** represent an elapsed duration and **MUST NOT** be interpreted as a calendar interval (no month/year semantics unless explicitly declared by a higher-level construct).
7. Implicit conversion between `date`, `time`, `timestamp`, and `timespan` **MUST NOT** be permitted; any conversion MUST be explicit and type-bound.
8. Temporal comparison and arithmetic **MUST** be type-safe:
   - (a) ordering comparisons are admissible for `timestamp` and MAY be admissible for `time` (within the same day context) when explicitly declared;
   - (b) `timespan` MAY be added/subtracted to/from `timestamp` only via explicit operations;

Γû╕ [T1] 2.1.4.3
## 2.1.4.3 Semantic role
1. Date/time primitives act as **temporal truth carriers**, making temporal interpretation explicit and inspectable.
2. They enable enforcement and audit tooling to reason about time-bound obligations deterministically (e.g., effective/deprecated dates, retention and evidence timelines).
3. They provide a stable temporal substrate that prevents hidden timezone and locale drift from silently altering meaning.

Γû╕ [T2] 2.1.5/all
# 2.1.5 Identifiers Class

Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

- (a) `guid` represents a globally unique identifier with well-known external interoperability and has a **fixed width of 128 bits (16 bytes)**.
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


[... TRUNCATED — 837 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 857/3500 tokens, trimmed from 837]
```

### read_chain({"chains":["2.1.4.2/all"],"detail":"detailed","budget":5000})
```
Γû╕ 2.1.4.2/all
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


[Tokens: ~345]
```

## Budget
- Tool calls: 2
- Total response chars: 4899
