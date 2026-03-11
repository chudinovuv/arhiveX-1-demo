# Final: Q8 — A-008 (A-008)

## Question
What constraints does E.L.I.A. place on enum default values and when must explicit initialization be used?

## Answer

Отлично. Теперь у меня есть полная информация. Все ключевые constraints находятся в §2.1.7.4.1 (Declaration - normative). Synthesize answer:

---

## Enum Default Value Constraints in E.L.I.A.

E.L.I.A. places the following key constraints on enum default values (§2.1.7.4.1):

### **Explicit Default Declaration (Optional but Governed)**

1. **Enums MAY declare an explicit default value** — this is optional
2. **If a default IS declared, it MUST reference a member of the same enum** (rule 4)
   - The default cannot be arbitrary; it must be a valid enum member
   - The underlying value representation does NOT affect equality (rule 7)

### **When Explicit Initialization Is MANDATORY**

**If no default is declared, the enum MUST be explicitly initialized at every usage site** — this is an unconditional requirement (rule 5):

> "If no default is declared, the enum **MUST be explicitly initialized** at every usage site; implicit defaults are forbidden."

This means:
- **No implicit defaults are allowed** — the language forbids zero-initialization or undefined behavior
- **Semantic clarity is enforced** — every enum variable must be given an explicit member at assignment
- **This is checked at compile time** — uninitialized enum references result in compile-time errors (rule 12)

### **Design Rationale**

Enums serve as **semantic classifiers** (§2.1.7.3) that eliminate magic numbers and magic strings. The mandatory explicit initialization when no default is declared reinforces this principle: every categorical decision must be intentional and inspectable, improving auditability and preventing accidental implicit branching (§2.1.7).

### **Additional Constraints**

- Enum declarations are **immutable after compilation** (rule 10)
- Any change to member set, default value, or representation **constitutes a breaking semantic change** (rule 11)
- Member identifiers **must be unique within the enum scope** and **stable once published** (rule 3)
