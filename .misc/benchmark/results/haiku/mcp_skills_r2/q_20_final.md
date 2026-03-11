# Final: Q20 — B-010 (B-010)

## Question
What normative rules govern semantic type compatibility in E.L.I.A.?

## Answer

# Normative Rules Governing Semantic Type Compatibility in E.L.I.A.

Based on §2.1.10.1 "Fundamental Principles", E.L.I.A. enforces the following normative rules for type compatibility:

## Core Rules

1. **Strict Typing Requirement**
   - E.L.I.A. is a strictly typed language
   - No implicit type conversions are permitted between distinct types

2. **Identity Assignment (Always Permitted)**
   - `T → T` is always permitted for all materialized types
   - A type is always compatible with itself

3. **Nullable Widening (Permitted)**
   - `T → T?` is permitted for all materialized types
   - Assigning a non-nullable value to a nullable target preserves the value and marks it as present

4. **Nullable Narrowing (Forbidden)**
   - `T? → T` is **FORBIDDEN** without an explicit null-check or guard
   - The compiler **MUST** verify that a null-check precedes the assignment on all code paths

5. **Explicit Conversion (Requires Declaration)**
   - Explicit conversion requires a declared conversion operator or function
   - The compiler **MUST** verify that a valid conversion path exists at compile time

6. **Forbidden Conversion (Rejected)**
   - When no conversion path exists (neither implicit nor explicit), the compiler **MUST** reject any attempt

## Scope of Application

All conversion rules apply uniformly across (§2.1.10.1):
- Variable assignment
- Parameter passing
- Return value binding
- Field initialization

These normative rules establish E.L.I.A.'s type system as **deterministic and auditable**, preventing runtime type errors through compile-time verification.
