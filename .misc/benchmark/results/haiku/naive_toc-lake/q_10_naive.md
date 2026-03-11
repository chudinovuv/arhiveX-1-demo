# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Explicit Conversion Rules Between Non-Numeric Primitive Types in E.L.I.A.

Based on the specification provided, I can address the structure of conversion rules, but I must note that **the detailed explicit conversion rules for non-numeric primitives are referenced but not fully elaborated in the loaded sections**.

## What the Specification States

**§2.1.10 — Type Compatibility and Conversion Rules** defines the normative framework, including:

- **§2.1.10.2.3 — Explicit Conversion – Non-Numeric Primitives** (listed in the TOC)
- **§2.1.10.4 — Derived Type Compatibility**
- **§2.1.10.6 — Normative Rules**

However, **the detailed text of §2.1.10.2.3 is not included in the loaded specification sections**.

## What Can Be Inferred from Context

From the available content, the specification establishes these foundational principles:

1. **§2.1.10.1 — Fundamental Principles** requires that conversion rules follow **explicit, deterministic semantics** aligned with the language's core design principle of **"Meaning Before Mechanics"** (§0.4).

2. **Primitive type categories** referenced include (§2.1):
   - Integral types (int8–int64)
   - Decimal/floating types (float32–float64)
   - Boolean (§2.1.3)
   - Date/Time (§2.1.4)
   - Identifiers (§2.1.5, including GUID and UUID)
   - Special/Control types (§2.1.6)
   - Enum (§2.1.7)
   - Fixed String (§2.1.8)

3. **§2.1.10.2.4 — Special / Control Type Rules** is explicitly called out as having distinct conversion semantics for non-standard types.

4. **§2.1.10 — General principle**: Implicit coercion is **forbidden** between distinct type tiers; conversion **MUST be explicit** (analogous to the rule stated for string hierarchies in **§2.2.0.4**).

## Recommendation

To obtain the complete explicit conversion rules for non-numeric primitives (bool ↔ enum, date/time conversions, identifier transformations, etc.), you should:

1. **Consult §2.1.10.2.3** directly in the full specification document.
2. **Cross-reference §2.1.10.4 — Derived Type Compatibility** for any derived-type interactions.
3. **Review §2.1.9 — Binary Encoding Rules for Primitives**, which constrains what conversions are physically valid.

---

**Is there a specific non-numeric primitive conversion (e.g., enum to string, date to identifier, bool encoding) you need clarified? I can reference the normative encoding rules or type structure that governs such conversions.**

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 695
- tokens_total: 723
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 7.7
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_10_naive.md
