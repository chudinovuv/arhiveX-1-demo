# q_6 — A-006 — How does E.L.I.A. encode boolean values at the binary level, and what are the normative constraints?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here's how boolean values are encoded at the binary level:

## Boolean Binary Encoding (§2.1.9.4)

**Encoding Format:**
- `false` = `0x00` (single byte)
- `true` = `0x01` (single byte)

## Normative Constraints

**1. Canonical Representation (§2.1.9.4)**
- Boolean values **MUST** be encoded as exactly one byte
- Only `0x00` and `0x01` are valid encodings
- No other byte values are permitted for boolean representation

**2. Parser Obligations (§2.1.9.9)**
- Parsers **MUST** reject any boolean encoding other than `0x00` or `0x01`
- Invalid boolean values **MUST** result in deterministic parsing failure
- The parser **MUST** surface a typed error suitable for audit and enforcement pipelines

**3. Semantic Guarantees (§2.1.9.9)**
- Boolean encoding **MUST** be deterministic and platform-independent
- The same boolean value **MUST** always produce identical binary representation
- No locale-dependent or runtime-specific variations are permitted

**4. Type System Integration**
- Boolean is classified as a **Primitive Type** under the **Boolean Class** (§2.1.3)
- It participates in the **Type Metadata Envelope** system (referenced in §2.1.9 as normatively defined in **ANNEX B**)
- Boolean values are subject to the general **canonical encoding principles** (§2.1.9.1)

**5. Performance Characteristics (§2.1.9.10.1)**
- As a primitive type ≤ 48 bits, boolean values are handled as **inline primitives**
- This enables efficient single-allocation handling without element-level traversal
- Boolean operations benefit from predictable cache locality and stable latency

The specification emphasizes that this encoding must be **deterministic, canonical, and envelope-driven** to ensure identical binary representation across all platforms, runtimes, and languages.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 492
- tokens_total: 524
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 12.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_6_naive.md
