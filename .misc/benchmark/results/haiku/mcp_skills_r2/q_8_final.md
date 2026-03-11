# Final: Q8 — A-008 (A-008)

## Question
What constraints does E.L.I.A. place on enum default values and when is explicit initialization required?

## Answer

Perfect! I now have the complete normative rules for enum default values and initialization. Let me provide a comprehensive answer.

---

## **Constraints on Enum Default Values and Initialization Requirements**

E.L.I.A. places several strict constraints on enum default values and requires explicit initialization in specific cases:

### **Default Value Constraints**

According to **§2.1.7.4.1** (Declaration normative rules):

1. **Optional Declaration**: An enum **MAY declare an explicit default value** (rule 4). This is not mandatory.

2. **Default Must Reference a Member**: When declared, the default **MUST reference a member of the same enum** (rule 4). You cannot assign arbitrary values as defaults — only enum members are valid.

3. **Example with default**:
   ```
   define enum TrafficLight (Red, Yellow, Green) default Red;
   ```

### **When Explicit Initialization is Required**

**§2.1.7.4.1, rule 5** states the core requirement:

> **"If no default is declared, the enum MUST be explicitly initialized at every usage site; implicit defaults are forbidden."**

This means:
- If you declare an enum **without** a `default` clause, every place where that enum is used must explicitly provide a value.
- There is no fallback to `null`, zero, or any implicit sentinel value.

**Example without default** (forces explicit initialization everywhere):
```
define enum OrgStructRole (
    DivisionLead,
    DepartmentLead,
    Expert,
    Architect
) enforced ["Organizational Structure"];
```

### **Additional Normative Constraints**

- **§2.1.7.4.1, rule 2**: An enum **MUST specify at least one enum member**; empty enumerations are forbidden.
- **§2.1.7.4.1, rule 3**: Enum member identifiers **MUST be unique within the enum scope** and **MUST be stable once published**.
- **§2.1.7.2, rule 6**: Enum comparison semantics are **strict and exact**; implicit conversion to other primitive types is forbidden.
- **§2.1.7.4.1, rule 11**: Any change to the member set, default value, or underlying representation **MUST constitute a new enum version** and **MUST be treated as a breaking semantic change**.

### **Summary**

| Scenario | Requirement |
|----------|-------------|
| Enum **with explicit default** | Default value **MUST be a member of the enum** |
| Enum **without default** | Explicit initialization **REQUIRED at every usage site** |
| Default value scope | Cannot use implicit/null/zero; only enum members allowed |
| Member modifications | **Treated as breaking change** — requires new enum version |
