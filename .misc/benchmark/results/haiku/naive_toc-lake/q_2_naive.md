# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Binary Encoding Rules for Primitive Types

According to **§2.1.9 — Binary Encoding Rules for Primitives**, the language defines canonical, deterministic binary encoding for all primitive types:

## Core Encoding Principles (§2.1.9.1)

All primitives **MUST be serialized using the Envelope model** defined in **ANNEX B — Type Metadata Envelope**. The Envelope encodes:
- CATEGORY = Primitive (00)
- the concrete TYPE_CODE of the primitive type
- applicable FORMAT_FLAGS
- the declared or effective primitive length

## Specific Encoding Rules

**§2.1.9.2 — Integer Encoding**: Integral types use **big-endian (network byte order)** representation, with sign-extension for negative values in two's complement form.

**§2.1.9.3 — Floating-Point and Decimal Encoding**: IEEE 754 binary representation for `float32` and `float64`; decimal types use a defined fixed-point or variable-precision representation (specific format referenced to **ANNEX A — Type Registry**).

**§2.1.9.4 — Boolean Encoding**: Single byte, `0x00` for false, `0x01` for true.

**§2.1.9.5 — Temporal Encoding**: Date/time types encoded as unsigned 64-bit Unix timestamps or ISO 8601-aligned structures (normatively defined in **ANNEX A**).

**§2.1.9.6 — Identifier Encoding**: UUID/GUID types encoded as 128-bit binary (16 bytes); RIID (Runtime Interface Identifier) similarly encoded in binary form.

---

## The Inline Threshold: 48 Bits

**§2.1.9.10 — Performance Implications** defines the critical distinction:

### **§2.1.9.10.1 — Inline Primitives (≤ 48 bits)**

Primitive types with **declared size ≤ 48 bits** (6 bytes):
- `int8`, `int16`, `int32` (partially)
- `float32`
- `bool`
- `char`
- Small enums

These are treated as **inline primitives** and **MAY be allocated directly in register or stack contexts** without requiring external heap allocation or indirection. They are suitable for **high-frequency access patterns** and **zero-copy composition** into records and derived structures.

### **§2.1.9.10.2 — External Primitives (> 48 bits)**

Primitive types exceeding **48 bits** (such as `int64`, `float64`, large UUIDs, temporal types) are classified as **external primitives** and:
- **MUST** be allocated separately from the containing structure
- **MAY** require pointer indirection or out-of-line storage
- Follow the Envelope serialization model with explicit size prefixes

### **§2.1.9.10.3 — Optimization Guideline (Normative Recommendation)**

Compilers and runtimes **SHOULD prioritize inline allocation for primitives ≤ 48 bits** to minimize allocation overhead and improve cache locality. However, this is a **normative recommendation**, not a hard requirement; implementations **MAY choose different allocation strategies** provided that serialization determinism is preserved.

---

## Parser Obligations (§2.1.9.9)

Parsers **MUST**:

1. **Validate type against the Envelope's TYPE_CODE** and reject mismatches.
2. **Enforce bit-width constraints** (e.g., int8 cannot exceed ±127).
3. **Preserve byte order exactly as declared** (big-endian by default for network primitives).
4. **Fail deterministically** on encoding violations and surface **typed error** suitable for audit pipelines.

---

## Summary

The **48-bit inline threshold** is the performance-critical boundary:
- **≤ 48 bits**: suitable for inline, register-friendly allocation
- **> 48 bits**: external, potentially pointer-based, Envelope-governed serialization

All encoding is **canonical, deterministic, and Envelope-driven**, ensuring identical binary representation across platforms and runtimes.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 987
- tokens_total: 1018
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 11.3
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_2_naive.md
