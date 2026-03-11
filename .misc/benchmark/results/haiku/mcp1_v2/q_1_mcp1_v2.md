# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["fixed string","capacity constraint"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 2643

## Raw MCP Output
### search_spec({"keyword":["fixed string","capacity constraint"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.8.4
## 2.1.8.4 Syntax

▸ [T1] 2.1.8.4.1
### 2.1.8.4.1 Declaration (normative)
```
# Fixed string field declaration (exact 32-byte capacity)
let code: fixed string[32] = "US-EAST-1";

▸ [T1] 2.1.8.4.2
### 2.1.8.4.2 AST Grammar

▸ [T1] 2.1.8
# 2.1.8 Fixed String Class
Fixed strings represent **inline, fixed-capacity character sequences** stored entirely within the primitive envelope. Unlike heap-allocated, variable-length `string`, a `fixed string` has a **compile-time-declared byte capacity** and is treated as a primitive value — not a block, not a stream.

▸ [T1] 2.1.8/(A)
(A) A fixed string is declared with an explicit maximum capacity in bytes:

```
fixed string[N]
```


▸ [T1] 2.1.8/(B)
(B) The actual content **MAY be shorter** than the declared capacity, but the storage reservation is always exactly `N` bytes. Unused trailing bytes **MUST be zero-filled**.

▸ [T1] 2.1.8.1
## 2.1.8.1 Designation

▸ [T1] 2.1.8.2
## 2.1.8.2 Normative properties
1. A `fixed string` **MUST declare an explicit capacity** `N` in bytes at compile time; `N` **MUST satisfy** `1 ≤ N < 1024`.
2. The declared capacity is **invariant** — it MUST NOT change at runtime, upon assignment, or during serialization.
3. Assignment of a value whose byte length **exceeds** `N` **MUST be rejected** at compile time or validation time; truncation is forbidden.
4. Assignment of a value whose byte length is **less than** `N` **MUST zero-fill the remaining trailing bytes**.
5. A `fixed string` **MUST serialize as exactly** `N` bytes — no length prefix, no variable encoding.
6. Character encoding **MUST be UTF-8**; implementations MUST NOT assume single-byte characters.
7. A `fixed string` **MUST NOT be implicitly converted** to or from `string`; any conversion MUST be explicit.
8. Comparison semantics **MUST compare the effective content only** (up to the first zero byte or `N`, whichever is shorter); trailing zero-fill MUST NOT affect equality.
9. A `fixed string` is a **primitive value** — it does not carry metadata, references, or envelope beyond the fixed byte array.
10. A `fixed string` **MUST NOT be used** for values that require unbounded or dynamically growing storage; use `string` (block type) instead.

▸ [T1] 2.1.8.3
## 2.1.8.3 Semantic role
1. Fixed strings act as **compact textual value carriers** where the maximum size is part of the type contract.
2. They enable deterministic binary layouts for records, protocol frames, and audit payloads without heap indirection.
3. Fixed strings participate in validation and enforcement semantics as primitive values with no behavior or authority.

[Tokens: ~657]
```

## Answer
Perfect! Получил полную информацию о fixed string типе. Ответ содержит все необходимые детали о capacity constraint механизме. Информация достаточна для полного ответа.

## Fixed String Type in E.L.I.A.

The **fixed string** is a primitive data type in E.L.I.A. that represents **inline, fixed-capacity character sequences** stored entirely within the primitive envelope (§2.1.8). Unlike heap-allocated, variable-length `string`, a `fixed string` has a compile-time-declared byte capacity and is treated as a primitive value — not a block or stream.

### Declaration Syntax

A fixed string is declared with an explicit maximum capacity in bytes:

```
fixed string[N]
```

Example:
```
let code: fixed string[32] = "US-EAST-1";
```

### Capacity Constraint Mechanism

The capacity constraint system works as follows:

**1. Compile-time Declaration (§2.1.8.2)**
- A `fixed string` **MUST declare an explicit capacity** `N` in bytes at compile time
- `N` **MUST satisfy** `1 ≤ N < 1024` (maximum 1023 bytes)
- The declared capacity is **invariant** — it cannot change at runtime, upon assignment, or during serialization

**2. Storage Behavior**
- The actual content **MAY be shorter** than the declared capacity, but storage reservation is always exactly `N` bytes
- Unused trailing bytes **MUST be zero-filled**
- Assignment of values whose byte length **exceeds** `N` **MUST be rejected** at compile time or validation time (truncation is forbidden)
- Assignment of shorter values **MUST zero-fill** the remaining trailing bytes

**3. Serialization**
- A `fixed string` **MUST serialize as exactly** `N` bytes — no length prefix, no variable encoding
- Character encoding **MUST be UTF-8**; implementations must not assume single-byte characters

**4. Comparison Semantics**
- Comparison **MUST compare the effective content only** (up to the first zero byte or `N`, whichever is shorter)
- Trailing zero-fill **MUST NOT affect equality**

### Semantic Role

Fixed strings serve as **compact textual value carriers** where the maximum size is part of the type contract (§2.1.8.3). They enable deterministic binary layouts for records, protocol frames, and audit payloads without heap indirection, participating in validation and enforcement semantics as primitive values with no behavior or authority.

The key constraint is that fixed strings **MUST NOT be used** for values requiring unbounded or dynamically growing storage — for such cases, use the `string` block type instead.

## Metrics
- calls_total: 1
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 1560
- tokens_out: 1028
- tokens_total: 2588
- cache_read: 15047
- cache_creation: 15047
- wall_time_sec: 17.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_1_mcp1_v2.md
