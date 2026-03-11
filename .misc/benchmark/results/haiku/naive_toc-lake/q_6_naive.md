# q_6 — A-006 — How does E.L.I.A. encode boolean values at the binary level, and what are the normative constraints?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Boolean Binary Encoding in E.L.I.A.

## Encoding Rules

According to **§2.1.9.4 — Boolean Encoding**, E.L.I.A. defines a **canonical binary representation** for boolean values:

**Boolean values are encoded as a single byte:**
- **`true`** → `0x01` (1 byte, value 1)
- **`false`** → `0x00` (1 byte, value 0)

This encoding is **deterministic and platform-independent**, ensuring consistent representation across all runtime environments and serialization contexts.

## Normative Constraints

### 1. **Canonical Representation** (§2.1.9.1)

Boolean encoding follows **canonical encoding principles**, which mandate:
- **Single, unambiguous binary form** for each boolean value
- **No alternative encodings** permitted (e.g., no multi-byte representations, no sign-extension variants)
- **Identical representation across serialization contexts** (envelope-driven, no padding or platform-specific variation)

### 2. **Envelope Integration** (§2.2.4)

Boolean values **MUST be serialized using the Envelope model** defined in **ANNEX B — Type Metadata Envelope**:

- The Envelope **MUST encode** the CATEGORY, TYPE_CODE, and applicable FORMAT_FLAGS
- The boolean payload byte **MUST follow immediately after the Envelope** with **no padding or platform-dependent alignment** (§2.2.4)
- This ensures **deterministic, canonical serialization** strictly driven by declared type metadata

### 3. **Parser Obligations** (§2.1.9.9.1)

Parsers and decoders **MUST enforce strict validation**:

- **Only `0x00` and `0x01` are valid boolean encodings**
- Any other byte value **MUST be rejected** as a malformed boolean
- On violation, the parser **MUST fail deterministically** and **MUST surface a typed error** suitable for audit and enforcement pipelines (§2.2.4.1)

### 4. **Performance Characteristics** (§2.1.9.10.1)

Boolean values are **inline primitives (≤ 48 bits)**:

- **Single allocation**, no external storage required
- **Direct memory access** without traversal or indirection
- **Immediate equality and hashing** operations
- Suitable for **high-throughput, boundary-heavy, and audit-sensitive pipelines** (§2.2.4.2)

### 5. **Semantic Role** (§2.1.3 — Boolean Class)

Boolean types:
- Represent **binary logical truth values** with no alternative interpretation
- **MUST NOT** encode semantic meaning beyond true/false
- Are **immutable** after materialization
- Support **bitwise equality comparison** and **cryptographic hashing** in contexts where booleans appear as block or record fields

## Cross-Reference Summary

| Aspect | Section |
|--------|---------|
| Encoding specifics | §2.1.9.4 |
| Canonical principles | §2.1.9.1 |
| Envelope model | §2.2.4 |
| Parser obligations | §2.2.4.1 |
| Validation rules | §2.1.9.9.1 |
| Performance model | §2.1.9.10.1 |

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 796
- tokens_total: 828
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 8.8
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_6_naive.md
