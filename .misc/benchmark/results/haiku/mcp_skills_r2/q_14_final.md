# Final: Q14 — B-004 (B-004)

## Question
What is the canonical binary encoding for floating-point and decimal values in E.L.I.A.?

## Answer

Perfect! Now I have comprehensive information. Let me provide the answer:

---

## Canonical Binary Encoding for Floating-Point and Decimal Values

### Floating-Point (`float` and `double`)

**IEEE 754 binary format** (§2.1.9.3)

According to E.L.I.A., `float` and `double` primitives **MUST be encoded according to IEEE 754 binary formats**. This means:
- `float` uses single-precision (32-bit) IEEE 754 representation
- `double` uses double-precision (64-bit) IEEE 754 representation
- The encoding is platform-independent and deterministic (§2.1.9.1)

### Decimal (`decimal`)

**Canonical base-10 representation** (§2.1.9.3)

The `decimal` type **MUST be encoded using a canonical base-10 representation** that preserves the declared precision and scale. Key normative requirements:
- The encoding preserves exact decimal arithmetic semantics (§2.1.2.2)
- It **MUST NOT** be silently coerced into binary floating-point representation
- **MUST NOT** normalize, round, or reinterpret values beyond declared encoding rules (§2.1.9.3)
- Serialization **MUST** preserve semantic interpretation across runtimes without platform-specific normalization (§2.1.2.2)

### Canonical Encoding Principles (§2.1.9.1)

Both types follow universal canonicality rules:
1. **Deterministic serialization**: All primitive values serialize into a single canonical binary representation
2. **Bijective mapping**: Decoding always reconstructs the original value without loss of information
3. **Platform-independence**: Encoding MUST NOT depend on architecture, CPU endianness, word size, locale, or runtime configuration
4. **Uniqueness**: No primitive MAY have more than one valid binary encoding for the same semantic value

### Type Distinction (§2.1.2.2)

Notably, E.L.I.A. explicitly distinguishes these two approaches to prevent audit-unsafe assumptions. Cross-type conversion between `decimal` and `float`/`double` is forbidden without explicit conversion that acknowledges potential precision loss.
