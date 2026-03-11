# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Integer Binary Encoding in E.L.I.A.

According to **§2.1.9.2 — Integer encoding**, E.L.I.A. specifies the following normative encoding rules for integer values:

## Canonical Encoding Principles

All integer values are encoded using a **deterministic, platform-independent binary format** governed by the **Type Metadata Envelope** (§2.1.9 — Binary Encoding Rules for Primitives, §ANNEX B).

## Byte Order (Endianness)

The specification establishes that:

1. **Big-Endian is the canonical network byte order** for all multi-byte integer types (§2.2.1.4.3 — Canonical Syntax for opaque blocks confirms this for `be[N]` types: "Big-endian fixed blocks").

2. **Signed integers** are represented using **two's complement notation** at the binary level (normatively referenced in §2.1.1 — Integral Class, though the detailed two's complement algorithm is deferred to standard implementations).

3. **Fixed-size integer types** (int8, int16, int32, int64, uint8, uint16, uint32, uint64) are serialized in their declared bit width without padding or alignment tricks.

## Envelope-Driven Serialization

Per **§2.2.4 — Binary Encoding Rules for Block Types** (which applies transitively to primitives embedded in envelopes):

- The **Envelope model** (defined in **ANNEX B — Type Metadata Envelope**) **MUST encode** the TYPE_CODE of the integer type before the payload (§2.2.4 point 2).
- Integer payload bytes **MUST follow immediately after the Envelope** and **MUST NOT include padding, implicit alignment, or platform-dependent headers** (§2.2.4 point 3).

## Parser Obligations

Per **§2.1.9.9 — Parser obligations**:

1. Parsers **MUST validate** the declared integer type code against **ANNEX A — Type Registry**.
2. Parsers **MUST enforce** the declared bit width and reject any encoded value that exceeds the permissible range.
3. **On violation**, the parser **MUST fail deterministically** and surface a typed error (§2.2.4.1).

## Performance Implications

**§2.1.9.10** notes:

- **Inline primitives (≤ 48 bits)**: optimized for direct register placement and zero-copy transport.
- **External primitives (> 48 bits)**: require envelope wrapping and follow standard serialization rules.

## Standards Reference

The specification notes (§2.1.9 — Binary Encoding Rules for Primitives) normative alignment with:
- **ISO/IEC 10967-1** (Language-independent arithmetic)
- **IEEE 754** (for floating-point reference; integers use fixed two's complement)

---

**Summary**: E.L.I.A. integers are encoded in **big-endian byte order**, **two's complement representation**, with **deterministic bit widths** and **envelope-driven serialization** to ensure **identical binary representation across all platforms and runtimes**.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 748
- tokens_total: 774
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 9.2
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_13_naive.md
