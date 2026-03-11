# Final: Q4 — A-004 (A-004)

## Question
What implicit type conversions are allowed between numeric primitives in E.L.I.A.?

## Answer

Perfect! Now I have the complete type conversion rules. Let me formulate the answer.

---

## Answer

**No implicit type conversions are allowed between numeric primitives in E.L.I.A.** The language enforces strict typing for all numeric types.

According to §2.1.10.1 (Fundamental Principles):

> E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.

The only **permitted implicit operations** between numeric types are:

1. **Identity assignment** (`T → T`): Always permitted for the same numeric type
2. **Nullable widening** (`T → T?`): Non-nullable numeric values can be assigned to nullable targets

### Explicit Conversion Matrix

All other numeric conversions require **explicit** conversion operators. §2.1.10.2.2 provides a complete conversion matrix with these categories:

| Conversion | Symbol | Requirement | Example |
|-----------|--------|-------------|---------|
| **Widening** | W | Safe, no data loss | `int8 → int16` |
| **Narrowing** | N | May overflow/truncate, requires range check | `int32 → int8` |
| **Signedness change** | S | Requires explicit cast | `int8 → uint8` |
| **Precision loss** | P | Requires explicit cast | `int32 → float` |
| **Forbidden** | ✗ | No conversion path exists | `float → int32` |

### Key Prohibitions

Rule **TYP-040** (§2.1.10.6) explicitly states:

> Implicit type conversion between distinct types is **FORBIDDEN**. Any cross-type assignment **MUST** use an explicit conversion operator.

Additional prohibitions for numeric types:

- **TYP-060**: Numeric coercion of boolean values is forbidden (`0 ≠ false`, `1 ≠ true`)
- **TYP-090**: Float/double → integral conversion is **FORBIDDEN** (even explicitly in some cases); integral → float/double requires explicit cast with acknowledgment of precision loss

All type conversion errors are caught at **compile time** (error codes E2102–E2110 in §2.1.10.6).
