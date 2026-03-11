# Final: Q12 — B-002 (B-002)

## Question
What normative properties govern the Decimal/floating class in E.L.I.A.?

## Answer

Perfect. Теперь у меня есть полная картина нормативных свойств. Вот ответ:

---

## Normative Properties Governing Decimal/Floating Class

The E.L.I.A. specification defines **seven core normative properties** for the `decimal`, `float`, and `double` types in **§2.1.2.2**:

### 1. **Deterministic Width & Serialization (MUST)**
Both types **MUST** have deterministic binary width and canonical serialization to ensure reproducibility across systems (§2.1.2.2, property 1).

### 2. **Decimal Base-10 Exactness (MUST)**
The `decimal` type **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation. This preserves exactness for monetary and audit-critical values (§2.1.2.2, property 2).

### 3. **Float/Double Approximation Semantics (MUST)**
`float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values, clarifying their role in scientific and statistical use cases (§2.1.2.2, property 3).

### 4. **No Implicit Cross-Type Conversion (MUST NOT)**
Implicit conversion between `decimal` and `float`/`double` **MUST NOT** be permitted. Any conversion must be **explicit** and must acknowledge potential precision loss (§2.1.2.2, property 4).

### 5. **Observable Precision Loss (MUST)**
Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable—either as a validation error or through an explicitly declared rounding policy (§2.1.2.2, property 5).

### 6. **Type-Safe Comparison (MUST)**
Cross-type comparison between `decimal` and `float`/`double` is **forbidden** unless an explicit conversion is performed first (§2.1.2.2, property 6).

### 7. **Semantic Preservation Across Runtimes (MUST)**
Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across all runtimes. Implementations **MUST NOT** introduce platform-specific normalization (§2.1.2.2, property 7).

### Encoding Standards (§2.1.9.3)
- `float` and `double` **MUST** be encoded according to **IEEE 754 binary formats**
- `decimal` **MUST** be encoded using **canonical base-10 representation** preserving declared precision and scale

These normative properties enforce the core design principle of **explicit semantic commitment**—the type itself declares whether a value is exact or approximate, preventing implicit precision loss and enabling auditability (§2.1.2.1, §2.1.2.3).
