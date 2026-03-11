# Final: Q1 — A-001 (A-001)

## Question
What is enum type in E.L.I.A. and what are its normative properties?

## Answer

---

## **What is Enum Type in E.L.I.A.**

An **enum** (enumeration type) represents a **constrained, finite value space** used to eliminate magic numbers, magic strings, and implicit semantic branching (§2.1.7). It defines an explicit closed set of admissible values and enforces semantic clarity at compile time, serialization time, and enforcement time.

### **Core Purposes (§2.1.7.1)**
1. Declare a **finite semantic domain** of mutually exclusive values
2. Provide **self-describing symbolic identifiers** instead of raw literals
3. Enable deterministic validation, comparison, and serialization of categorical data
4. Prevent semantic drift caused by loosely typed constants

### **Semantic Role (§2.1.7.3)**
- Enums act as **semantic classifiers**, not control flow mechanisms
- They provide a **stable categorical vocabulary** usable by rules, enforcement, and validation
- They improve **auditability** by making categorical decisions explicit and inspectable

---

## **Normative Properties**

The specification defines 6 core normative properties (§2.1.7.2):

1. **Closed-set constraint**: An enum **MUST define a closed set of admissible values**; values outside this set MUST be rejected at validation time.

2. **Immutability**: Enum values **MUST be immutable** and MUST NOT carry state or behavior.

3. **No runtime extensibility**: An enum **MUST NOT be extensible at runtime**; any extension constitutes a new enum definition.

4. **Canonical serialization**: Enum values **MUST serialize canonically** according to type metadata rules and MUST preserve identity across transport and persistence boundaries.

5. **Representation transparency**: An enum MAY be backed by integral or textual representation, but this representation **MUST NOT leak semantic meaning** beyond declared identifiers.

6. **Strict comparison semantics**: Enum comparison is **strict and exact**; implicit conversion to or from other primitive types is forbidden.

### **Declaration Normatives (§2.1.7.4.1)**

Key declaration rules include:

- **MUST** be declared using the `define` construct and MUST introduce a new primitive type
- **MUST** specify at least one enum member; empty enumerations are forbidden
- Member identifiers **MUST be unique** within the enum scope and **MUST be stable** once published
- **MAY** declare an explicit default value; if declared, it MUST reference a member of the same enum
- If no default is declared, the enum **MUST be explicitly initialized** at every usage site
- Members **MAY** have explicit underlying values (integral or string); if omitted, values MUST be auto-assigned deterministically by declaration order
- Underlying representation **MUST NOT affect semantic equality**—values are equal only if their type and member identifier match
- **MUST be immutable** after compilation; no runtime extension, mutation, or injection is permitted
- Any change to member set, default value, or underlying representation **MUST constitute a breaking semantic change**
- Enum declarations **MUST be resolved at compile time**; unresolved references MUST result in a compile-time error
