# Render: Q1 — A-001 (A-001)

## Extracted Content

### search_spec({"keyword":"fixed string type capacity","onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"maxUnits":3,"verbose":"none"})
```
No units found for keywords: fixed string type capacity
```

### search_spec({"keyword":["fixed string","string capacity"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"maxUnits":3,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.8.4
## 2.1.8.4 Syntax

Γû╕ [T1] 2.1.8.4.1
### 2.1.8.4.1 Declaration (normative)
```
# Fixed string field declaration (exact 32-byte capacity)
let code: fixed string[32] = "US-EAST-1";

Γû╕ [T1] 2.1.8.4.2
### 2.1.8.4.2 AST Grammar

Γû╕ [T1] 2.1.8
# 2.1.8 Fixed String Class
Fixed strings represent **inline, fixed-capacity character sequences** stored entirely within the primitive envelope. Unlike heap-allocated, variable-length `string`, a `fixed string` has a **compile-time-declared byte capacity** and is treated as a primitive value — not a block, not a stream.

Γû╕ [T4] 2.1.8/(A)
(A) A fixed string is declared with an explicit maximum capacity in bytes:

```
fixed string[N]
```


Γû╕ [T4] 2.1.8/(B)
(B) The actual content **MAY be shorter** than the declared capacity, but the storage reservation is always exactly `N` bytes. Unused trailing bytes **MUST be zero-filled**.

Γû╕ [T1] 2.1.8.1
## 2.1.8.1 Designation

Γû╕ [T1] 2.1.8.2
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

Γû╕ [T1] 2.1.8.3
## 2.1.8.3 Semantic role
1. Fixed strings act as **compact textual value carriers** where the maximum size is part of the type contract.
2. They enable deterministic binary layouts for records, protocol frames, and audit payloads without heap indirection.
3. Fixed strings participate in validation and enforcement semantics as primitive values with no behavior or authority.


[... TRUNCATED — 665 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 685/3500 tokens, trimmed from 665]
```

## Budget
- Tool calls: 2
- Total response chars: 2872
