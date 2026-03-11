# Final: Q3 — A-003 (A-003)

## Question
How does E.L.I.A. distinguish between null, void, and nothing — what are the normative differences?

## Answer

Perfect. Now I have the complete normative specification. Let me answer based on what I found.

---

## Answer

E.L.I.A. distinguishes between these three special control primitives through explicit semantic roles and strict normative rules:

### **`null` — Explicit absence of data value**
- **Semantic role**: Represents the deliberate, explicit absence of a data value in a domain context.
- **Normative constraint** (§2.1.6.1): `null` MUST represent explicit absence and MUST NOT be semantically conflated with `nothing`.
- **Serialization**: MUST serialize as an explicit absence marker.

### **`void` — Absence of return value or control semantic**
- **Semantic role**: Represents the absence of a return value in method/action signatures, or serves as a platform-native pointer placeholder (when permitted by runtime profile).
- **Normative constraint** (§2.1.6.1): `void` MUST represent the absence of a return value and MUST NOT be materialized as a value payload—it is strictly a control semantic.
- **Serialization**: MUST NOT serialize as a materialized payload; it may only appear in signature positions.

### **`nothing` — Non-materialized or undefined semantic state**
- **Semantic role**: Represents a non-materialized or undefined semantic state, distinct from explicit absence.
- **Normative constraint** (§2.1.6.1): `nothing` MUST represent a non-materialized state and MUST NOT be used as a substitute for `null` or `void`.
- **Serialization**: MUST serialize as an explicit non-materialization marker.

### **Key normative differences:**

1. **No implicit conversions** (§2.1.6.1, rule 5): Implicit conversions between `null`, `void`, and `nothing` are **strictly forbidden**. Any conversion (if permitted) MUST be explicit and MUST preserve the originating semantic meaning.

2. **Not business data** (§2.1.6.1, rule 1): All three MUST NOT be treated as business data and MUST NOT be used to encode implicit state machines or control flow.

3. **Deterministic semantics** (§2.1.6.1, rule 6): Serialization MUST be canonical and deterministic across runtimes, with each type having a distinct serialization marker.

The core distinction is **semantic intent**: `null` is absence in data, `void` is absence in control flow, and `nothing` is non-materialization—three fundamentally different concepts that E.L.I.A. enforces through mandatory separation.
