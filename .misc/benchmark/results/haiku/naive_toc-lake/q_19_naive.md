# q_19 — B-009 — What are the derived type compatibility rules for Record and Array in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Derived Type Compatibility Rules for Record and Array in E.L.I.A.

Based on the specification provided, the normative compatibility rules for **Record** and **Array** derived types are defined in **§2.1.10.4 — Derived Type Compatibility**, which establishes the framework. However, the specification you've provided does not include the full text of §2.1.10.4.1 (Record) and §2.1.10.4.2 (Array and Typed Array) — these sections are listed in the table of contents but their detailed normative rules are not loaded in the available content.

## What IS Specified

### **Record (Structural Block)**
From **§2.2.2 — Structural Block Class** and **§2.5.6 — Record (brief)**:

1. **Immutability (§2.2.2.0.2):** Record fields **MUST be immutable** after construction; no in-place mutation is permitted.

2. **Field Resolution (§2.2.2.0.2):** Record fields **MUST be uniquely named** and resolved deterministically; duplicate or ambiguous field resolution is forbidden.

3. **Size Constraint (§2.2.0.2, normative property 7(c)):** Records are **non-scalable by design** and **MUST NOT** transition to Stream representation. A record value **MUST NOT exceed 2^26 − 1 bytes**; exceeding this limit **MUST generate an error** at construction, mutation, or serialization/deserialization.

4. **Schema Declaration (§2.2.2.0.2):** Field layout, ordering, and typing **MUST be explicitly declared** and **MUST serialize canonically**.

### **Array / Typed Array (Derived Structural Types)**

From **§2.3.4 — Structural Stream Class** and **§2.5.3–2.5.4 — Typed Array and Derived Array Classes**:

1. **Block Materialization by Default (§2.2.0.2, normative property 5 & §2.3.4):** Arrays are **block-materialized by default**; when their effective serialized size exceeds the 26-bit block limit (2^26 − 1 bytes), they **MUST transition to Stream representation** automatically.

2. **Element Type Homogeneity (§2.2.2.0.2):** Array and typed arrays **MUST enforce homogeneous element type** and deterministic ordering.

3. **Stream Promotion Conditions (§2.3.4):** An array **MUST be promoted to a Stream type** when:
   - (a) it is produced by a stream-originating function (e.g. `memory`, `file`, or equivalent external source);
   - (b) it is referenced or exposed via a **data interface** (§2.7.2).

4. **SIZE_LIMITED_26BIT Flag (§2.3.4.0.2):** When promoted to Stream, the `SIZE_LIMITED_26BIT` flag **MUST be set to 0** for structural stream arrays.

5. **Schema Identity Preservation (§2.3.4.0.2):** A structural stream array **MUST preserve the schema identity** (`TYPE_HASH`) and declared element types after Block→Stream promotion.

## What Is NOT Fully Specified in the Loaded Content

The **detailed normative assignment and explicit conversion rules** between Records and Arrays — including:
- Whether Records and Arrays are assignable to one another
- Type narrowing or widening semantics
- Subtyping relationships
- Explicit conversion requirements

These details are **promised** in **§2.1.10.4.1 (Record)** and **§2.1.10.4.2 (Array and Typed Array)** but **are not included in the available loaded sections**.

## Inference from Core Constraints

Based on normative principles in the loaded sections, we can infer:

1. **Records and Arrays are distinct derived types**: Records have fixed schema with named fields (§2.5.6); Arrays are ordered homogeneous collections (§2.5.3–2.5.4).

2. **Implicit coercion is forbidden** (per §2.2.0.4 on string hierarchy and general design principle 1.5.5 — "Prohibition of Implicit Authority"): Any conversion between Record and Array **likely requires explicit declaration**.

3. **Structural compatibility is schema-driven**: Both types serialize canonically (§2.2.4); conversion would require schema equivalence verification.

---

**Recommendation:** Consult the **full §2.1.10.4.1** and **§2.1.10.4.2** sections for the authoritative, detailed compatibility matrix and explicit conversion rules.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 1119
- tokens_total: 1146
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 12.7
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_19_naive.md
