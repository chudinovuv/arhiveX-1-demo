# Final: Q1 — A-001 (A-001)

## Question
What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Answer

Отлично! У меня есть полная информация о фиксированных строках. Вот ответ:

## Fixed String Type in E.L.I.A.

A **fixed string** (§2.1.8) is an inline, fixed-capacity character sequence stored entirely within the primitive envelope. It is declared with an explicit compile-time byte capacity:

```
fixed string[N]
```

where `N` must satisfy `1 ≤ N < 1024` bytes (§2.1.8.2, normative property 1).

### Capacity Constraint Mechanism

The capacity constraint works as follows:

1. **Invariant declaration** — The declared capacity `N` is **invariant** and cannot change at runtime, upon assignment, or during serialization (§2.1.8.2, property 2).

2. **Strict validation** — Assignment of a value whose byte length **exceeds** `N` **MUST be rejected** at compile time or validation time; truncation is **forbidden** (§2.1.8.2, property 3). There is no silent truncation.

3. **Zero-filling** — When a value is shorter than `N` bytes, the remaining trailing bytes **MUST be zero-filled** (§2.1.8.2, property 4 and §2.1.8/(B)).

4. **Fixed serialization** — A fixed string **MUST serialize as exactly** `N` bytes with no length prefix or variable encoding (§2.1.8.2, property 5). This enables deterministic binary layouts.

5. **Comparison semantics** — Comparison is done only on the **effective content** up to the first zero byte or `N` (whichever is shorter); trailing zero-fill does not affect equality (§2.1.8.2, property 8).

### Purpose

Fixed strings serve as **compact textual value carriers** (§2.1.8.3) where the maximum size is part of the type contract, enabling deterministic binary layouts for records, protocol frames, and audit payloads without heap indirection. They are primitive values with no metadata, references, or behavior beyond the fixed byte array (§2.1.8.2, property 9).
