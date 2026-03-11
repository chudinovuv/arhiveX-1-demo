# q_9 — A-009 — What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["inline primitive","external primitive","performance optimization"],"onto":"WHY","intent":"full","indexRanking":["desa","phya","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 1357

### Call 2: read_chain
- params: {"chains":["2.1.9.10/all"],"budget":3500,"autoExpand":true}
- response_chars: 2357

### Call 3: read_chain
- params: {"chains":["2.1.9.8/C."],"budget":3500}
- response_chars: 217

## Raw MCP Output
### search_spec({"keyword":["inline primitive","external primitive","performance optimization"],"onto":"WHY","intent":"full","indexRanking":["desa","phya","bhva"],"maxUnits":3,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives

▸ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/C.
**C. When inline representation is used:**

▸ [T2] 2.1.9.8/E.
**E. External primitives:**\
A primitive value **MUST** be stored externally when its canonical binary width exceeds 48 bits.

Typical external primitives include:

- `int64` (`long`), `uint64` (`ulong`)

▸ [T2] 2.1.9.9
## 2.1.9.9 Parser obligations

▸ [T2] 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)

▸ [T2] 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)

▸ [T2] 2.1.9.10
## 2.1.9.10 Performance Implications
This section describes **normative and practical performance considerations** related to the choice between **inline** and **external** primitive representations. These implications **DO NOT alter semantic meaning**, but **SHOULD** inform schema design, layout decisions, and performance optimization strategies.

▸ [T2] 2.1.9.10.1
### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

▸ [T2] 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

▸ [T2] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

[Tokens: ~307] [SUFFICIENT: 64% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.9.10/all"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.10/all
## 2.1.9.10 Performance Implications

This section describes **normative and practical performance considerations** related to the choice between **inline** and **external** primitive representations. These implications **DO NOT alter semantic meaning**, but **SHOULD** inform schema design, layout decisions, and performance optimization strategies.

### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

**A. Characteristics:**

1. Zero allocation overhead — the value is fully contained within the Envelope.
2. Cache-friendly access pattern — a single cache line read is sufficient.
3. Atomic read/write is guaranteed at the Envelope level.
4. Minimal indirection and branch-free parsing.
5. No additional payload traversal is required.

**B. Typical examples:**
- `bool`, `uint8` (`byte`)
- `int16` (`short`), `uint16` (`ushort`)
- `int32` (`int`), `uint32` (`uint`), `float`, `date`
- Small enum values (≤ 48 bits)

**(C) Recommended usage:**

1. High-frequency fields.
2. Hot-path evaluation (rules, follow conditions, guards).
3. Identifiers, flags, counters, and compact state markers.

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

### 2.1.9.10.3 Optimization guideline (normative recommendation)

When designing records and event payloads:

1. Frequently accessed primitive fields **SHOULD** be declared first.
2. Fields that are eligible for inlining **SHOULD** be arranged so that they are materialized within the first 48 bits of their respective Envelopes.
3. This maximizes inline representation opportunities and improves cache locality.
4. These guidelines enable predictable performance characteristics **WITHOUT compromising semantic correctness, determinism, or type safety**.




[Tokens: ~586]
```

### read_chain({"chains":["2.1.9.8/C."],"budget":3500})
```
▸ 2.1.9.8/C.
**C. When inline representation is used:**
- All 48 bits store the actual value

These layouts are **mutually exclusive** and are selected according to the rules defined in this section.




[Tokens: ~51]
```

## Answer
Теперь у меня достаточно информации для полного ответа о рекомендациях по производительности для inline vs external примитивов.

## Performance Optimization Guidelines for Inline vs External Primitives

The E.L.I.A. specification provides specific performance optimization guidelines for choosing between inline and external primitive representations in **§2.1.9.10**.

### Inline Primitives (≤ 48 bits)

**Performance Characteristics:**
- **Zero allocation overhead** — the value is fully contained within the Envelope
- **Cache-friendly access** — single cache line read is sufficient  
- **Atomic operations** guaranteed at the Envelope level
- **Minimal indirection** and branch-free parsing
- **No additional payload traversal** required

**Recommended Usage:**
1. **High-frequency fields**
2. **Hot-path evaluation** (rules, follow conditions, guards)
3. **Identifiers, flags, counters, and compact state markers**

**Typical Examples:** `bool`, `uint8`, `int16`, `uint16`, `int32`, `uint32`, `float`, `date`, and small enum values

### External Primitives (> 48 bits)

**Performance Characteristics:**
- **Require additional byte reads** beyond the Envelope
- **May incur allocation** and indirect memory reads
- **Increased cache miss likelihood** compared to inline primitives
- **Platform-dependent atomicity** for read/write operations
- **May require alignment handling** for payload access

**Recommended Usage:**
1. **Large numeric values**
2. **High-precision arithmetic**  
3. **Temporal and identifier values** requiring extended width

**Typical Examples:** `int64`, `uint64`, `double`, `decimal`, `timestamp`, `time`, `timespan`, `guid`, `riid`

### Design Optimization Guidelines (§2.1.9.10.3)

The specification provides **normative recommendations** for record and event payload design:

1. **Frequently accessed primitive fields SHOULD be declared first**
2. **Fields eligible for inlining SHOULD be arranged** to be materialized within the first 48 bits of their respective Envelopes
3. This **maximizes inline representation opportunities** and improves cache locality
4. These guidelines enable **predictable performance characteristics** without compromising semantic correctness, determinism, or type safety

### Technical Threshold

A primitive value **MUST** be stored externally when its canonical binary width **exceeds 48 bits** (§2.1.9.8/E). This is a normative requirement, not just a performance suggestion.

The guidelines emphasize that these performance implications **do not alter semantic meaning** but should inform schema design and optimization strategies.

## Metrics
- calls_total: 3
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 5638
- tokens_out: 1406
- tokens_total: 7044
- cache_read: 60188
- cache_creation: 0
- wall_time_sec: 24.1
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_9_mcp1_v2.md
