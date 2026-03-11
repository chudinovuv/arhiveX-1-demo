# Final: Q2 — A-002 (A-002)

## Question
What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Answer

Perfect! Я получил полную информацию о бинарном кодировании примитивных типов и пороге инлайнирования. Вот мой ответ:

---

## Binary Encoding Rules for Primitive Types

The E.L.I.A. specification defines comprehensive normative binary serialization rules for primitive types in **§2.1.9**. Here are the core encoding rules:

### General Principles (§2.1.9.1)

1. **Deterministic serialization**: All primitive values MUST serialize into a single canonical binary representation
2. **Bijective encoding**: Decoding must always reconstruct the original value without loss of information
3. **Platform-independent**: Encoding MUST NOT depend on CPU endianness, word size, locale, or runtime configuration
4. **Unique encoding**: No primitive MAY have more than one valid binary encoding for the same semantic value

### Type-Specific Encoding Rules

- **Integers** (§2.1.9.2): Fixed-width binary representation with two's-complement for signed integers; big-endian byte order unless explicitly overridden
- **Floating-point & Decimal** (§2.1.9.3): IEEE 754 binary formats for `float`/`double`; base-10 canonical representation for `decimal`
- **Booleans** (§2.1.9.4): Single canonical value per boolean state
- **Temporal types** (§2.1.9.5): UTC-based epoch time for `timestamp`; fixed locale-independent representations for `date` and `time`
- **Identifiers** (§2.1.9.6): Fixed-width binary with no embedded delimiters (`guid`, `riid`)

### The Inline Threshold

**The inline threshold is 48 bits (6 bytes).** (§2.1.9.8.D)

#### Inline Primitives (≤ 48 bits)

According to **§2.1.9.8.D** (Deterministic Inlining Rule), a primitive **MAY be inlined if and only if**:
1. Its canonical size ≤ 48 bits
2. Its `TYPE_CODE` permits inlining (per ANNEX A)

**Typical inline primitives** include:
- `bool`, `uint8` (byte)
- `int16` (short), `uint16` (ushort)
- `int32` (int), `uint32` (uint), `float`, `date`
- Small enum values (≤ 48 bits)

**Characteristics** (§2.1.9.10.1):
- Zero allocation overhead
- Single cache-line read sufficient
- Atomic read/write guaranteed
- Branch-free parsing

#### External Primitives (> 48 bits)

Values exceeding 48 bits **MUST** be stored externally (§2.1.9.8.E).

**Typical external primitives**:
- `int64` (long), `uint64` (ulong), `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`

### Encoding Format (§2.1.9.8)

For values supporting both inline and external representations:
- **Inline mode**: All 48 bits store the actual value; bits [5..3] of `FORMAT_FLAGS` encode reference mode as `0`
- **External mode**: Bits [47..16] store a 32-bit unsigned offset from the Envelope start; bits [15..0] are reserved (must be 0)

### Parser Requirements (§2.1.9.9)

Parsers MUST:
1. Read the 64-bit Envelope and verify `CATEGORY = 00` (primitive)
2. Validate `TYPE_CODE` against the primitive type registry
3. Determine canonical encoded size and read the value accordingly
4. Apply security checks on `FORMAT_FLAGS` and security context

---

**Key normative reference**: §2.1.9 emphasizes that "encoding is deterministic and parsing is unambiguous" — this ensures primitive values are fully portable across runtimes, replay-safe, and audit-safe.
