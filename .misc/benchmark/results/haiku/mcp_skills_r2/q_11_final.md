# Final: Q11 — B-001 (B-001)

## Question
What specific integer types does the E.L.I.A. Integral class define and what are their bit widths?

## Answer

Perfect! Я нашел точный ответ. На основе информации из спецификации вот детальный ответ:

---

## E.L.I.A. Integral Class — Integer Types and Bit Widths

The E.L.I.A. **Integral class** (§2.1.1) defines **four signed/unsigned integer type pairs** with the following bit widths:

| Type Pair | Bit Width | Byte Width | Range Examples |
|-----------|-----------|-----------|-----------------|
| `int8` / `uint8` | 8 bits | 1 byte | int8: −128 to 127; uint8: 0 to 255 |
| `int16` / `uint16` | 16 bits | 2 bytes | int16: −32,768 to 32,767; uint16: 0 to 65,535 |
| `int32` / `uint32` | 32 bits | 4 bytes | int32: −2,147,483,648 to 2,147,483,647; uint32: 0 to 4,294,967,295 |
| `int64` / `uint64` | 64 bits | 8 bytes | int64: −2^63 to 2^63−1; uint64: 0 to 2^64−1 |

### Key Properties (§2.1.1.2):

1. **Fixed-width declaration**: All integral types **MUST have explicitly declared bit width** and signedness — no dynamic resizing.
2. **Canonical serialization**: All integrals **MUST serialize canonically** with **deterministic byte ordering** (big-endian by default per §2.1.9.2) and **width preservation**.
3. **Two's-complement representation**: Signed integers use two's-complement encoding (§2.1.9.2).
4. **Strict conversions**: **MUST NOT permit implicit widening, narrowing, or signedness conversion** — all conversions must be explicit and type-safe.
5. **Exact arithmetic**: Arithmetic operations **MUST be exact**; overflow/underflow **MUST be explicitly defined** (error, saturation, or wrap-around), never implicit.

### Semantic Role (§2.1.1.3):

Integral primitives serve as **exact numeric truth carriers**, providing the foundational layer for counters, identifiers, flags, protocol fields, and other contexts where numerically exact values are required and rounding is forbidden. They guarantee **precision, determinism, and replay safety** across heterogeneous runtimes.
