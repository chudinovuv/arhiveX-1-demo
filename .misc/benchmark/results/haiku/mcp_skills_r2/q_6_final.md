# Final: Q6 — A-006 (A-006)

## Question
How does E.L.I.A. encode boolean values at the binary level, and what are the normative constraints?

## Answer

# Boolean Encoding in E.L.I.A.

Based on the specification, here is what E.L.I.A. requires for boolean binary encoding:

## Binary Encoding Rules

**§2.1.9.4 (Boolean encoding)** establishes two normative constraints:

1. **Canonical single-value requirement**: Boolean values **MUST be encoded as a single canonical value** representing either `true` or `false`.
2. **Non-canonical rejection**: Any non-canonical or multi-bit boolean encoding **MUST be rejected** by the runtime.

## Normative Constraints

The specification defines several binding normative rules governing boolean handling:

### Type Coercion Prohibition (§2.1.10.6)
- **TYP-060**: "Numeric coercion of boolean values is FORBIDDEN. `0 ≠ false`, `1 ≠ true`."
  - This means booleans cannot be implicitly converted to or from numeric types
  - This is a **MUST NOT** constraint (error code E2104)

### Non-Numeric Nature (§2.1.3)
- Booleans are **strictly non-numeric**
- They **MUST NOT** be used to encode multi-valued states or control flow implicitly
- Boolean values **serialize canonically** and are **deterministic across all runtimes**

## Canonical Serialization Reference

The specification references **RFC 8949 (CBOR boolean encoding)** as the canonical serialization model. While the exact physical bit layout is stated to be "normatively defined in **ANNEX A — Type Registry**" and "interpreted through **ANNEX B — Type Metadata Envelope**," these annexes were not accessible in this query.

## Summary

E.L.I.A. enforces **strict single-bit canonical encoding** for booleans with **zero tolerance for numeric coercion**, ensuring deterministic, auditable binary representation across all platforms and transport layers.
