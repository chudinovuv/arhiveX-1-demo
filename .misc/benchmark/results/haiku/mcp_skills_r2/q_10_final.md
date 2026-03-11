# Final: Q10 — A-010 (A-010)

## Question
What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Answer

Perfect! Я получил полную и исчерпывающую информацию о правилах преобразования немиецифровых примитивных типов. Вот ответ:

---

## Explicit Conversion Rules for Non-Numeric Primitive Types

The E.L.I.A. specification defines **non-numeric primitive type conversions** in §2.1.10.2.3 using a comprehensive compatibility matrix. Here are the explicit conversion rules:

### Conversion Matrix

| From \ To | `bool` | `string` | `fixed string[N]` | `date` | `time` | `timestamp` | `timespan` | `guid` | `riid` | `enum` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `bool`    | —  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `string`  | ✗  | —  | T | R | R | R | R | R | ✗ | R |
| `fixed string[N]` | ✗ | C | — | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `date`    | ✗  | F  | ✗ | — | ✗ | D→T | ✗ | ✗ | ✗ | ✗ |
| `time`    | ✗  | F  | ✗ | ✗ | — | ✗ | ✗ | ✗ | ✗ | ✗ |
| `timestamp` | ✗ | F | ✗ | T→D | T→Ti | — | ✗ | ✗ | ✗ | ✗ |
| `timespan` | ✗ | F | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ | ✗ |
| `guid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ |
| `riid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ |
| `enum`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — ¹ |
| Numeric types | ✗ | F | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

### Conversion Codes Explained

- **F** — **Format**: Explicit string formatting. Always safe. Any non-numeric primitive can be formatted to a string.
- **R** — **Parse**: Explicit string parsing. May fail at runtime with a parse error. String can be parsed to `date`, `time`, `timestamp`, `timespan`, `guid`, or `enum`.
- **C** — **Copy with capacity check**: `fixed string[N]` ↔ `string`. Converts to/from variable-length string with length validation.
- **T** — **Truncation**: `string` → `fixed string[N]` when length ≤ N (validated at compile-time if literal, runtime otherwise).
- **D→T** — **Date to Timestamp**: `date` → `timestamp` requires explicit timezone/offset context.
- **T→D** — **Timestamp to Date**: Extracts date component; requires explicit timezone.
- **T→Ti** — **Timestamp to Time**: Extracts time-of-day component; requires explicit timezone.
- **✗** — **Forbidden**: No conversion path exists.
- **—** — **Identity**: Same type, no conversion needed.

### Key Restrictions

1. **Boolean isolation** (§2.1.10.2.3, rule TYP-060): Conversion between `bool` and any other non-numeric type is **forbidden**. Booleans cannot be coerced to or from strings, dates, times, or other primitives.

2. **Identifier isolation** (§2.1.10.2.3, rule TYP-080): Cross-identifier conversion between `guid` and `riid` is **forbidden**, even explicitly.

3. **Temporal constraints**: Conversions between `date`, `time`, `timestamp`, and `timespan` are heavily restricted. For example:
   - `date` ↔ `timestamp` requires explicit timezone context.
   - `time` can only convert to/from `string` (no `date` or `timestamp` conversion).
   - `timespan` cannot convert to any temporal type.

4. **Enum rules** (footnote ³): Enum-to-enum conversion is forbidden unless both enums share the same underlying type and the conversion is explicitly declared.

5. **Fixed-length strings**: `fixed string[N]` has a special capacity-checked conversion to/from variable-length `string`, but cannot convert to temporal types or identifiers.

All these conversions require **explicit cast operators** and must be verified at compile-time per rule TYP-050 (§2.1.10.6).
