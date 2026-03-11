# Final: Q13 — B-003 (B-003)

## Question
How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Answer

Perfect! Теперь я получил полную информацию. Вот ответ:

---

## Integer Encoding in E.L.I.A.

According to **§2.1.9.2 Integer encoding**, E.L.I.A. defines four core rules for encoding integer values in binary:

### 1. Fixed-Width Binary Representation
Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width (§2.1.9.2, rule 1). This means an `i32` integer must always occupy exactly 32 bits, an `i64` must occupy 64 bits, etc.

### 2. Two's-Complement for Signed Integers
Signed integers **MUST use two's-complement representation** (§2.1.9.2, rule 2). This is the standard method for representing negative numbers in binary, allowing a single representation of zero and symmetric range handling.

### 3. Big-Endian Byte Order (Default)
Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN` or `leN`) (§2.1.9.2, rule 3). Big-endian means the most significant byte is stored first in memory.

### 4. Strict Length Validation
Parsers **MUST reject** any integer payload whose length does not exactly match the declared width (§2.1.9.2, rule 4). This ensures deterministic parsing and prevents ambiguity.

### Context
The Integral Class (§2.1.1) represents fixed-width integer values designed for platform-independence and canonical serialization. All integral primitives ensure deterministic size, signedness, and binary representation across systems.
