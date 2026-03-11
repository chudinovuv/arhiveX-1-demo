# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Semantic Type Compatibility in E.L.I.A. (Normative Rules)

## Overview

The specification defines semantic type compatibility through a hierarchical normative framework. The **primary normative source** is **§2.1.10 — Type Compatibility and Conversion Rules**, which establishes fundamental principles; this is complemented by category-specific rules throughout the type system.

---

## 1. Fundamental Principles (§2.1.10.1)

The specification establishes these core normative principles:

1. **Explicit Assignment vs. Conversion Distinction**
   - Implicit assignment is **strictly limited** to declared compatibility paths
   - Explicit conversion **requires** intentional operator or function invocation
   - No implicit coercion between unrelated categories is permitted

2. **Category-Preserving Semantics**
   - Primitive types, block types, derived types, and semantic types **maintain category identity** across compatibility operations
   - Cross-category encapsulation is **explicitly forbidden** (§A.16 — Forbidden Cross-Category Encapsulation)

3. **Type Identity and Equality**
   - Semantic type compatibility **must preserve identity and equality semantics** as defined in **§A.12 — Identity and Equality Semantics**
   - Substitution must be demonstrable without loss of semantic meaning

---

## 2. Semantic Type Compatibility Rules

### 2.1 Definition Compatibility (§2.7.1)

Definitions are **semantic containers** that declare meaning, not behavioral types. Their compatibility is governed by:

1. **Identity-Based Compatibility**
   - Two definitions are semantically compatible **if and only if they reference the same semantic identity** (RIID or UUID)
   - Structural similarity **does not imply compatibility**; identity is the sole criterion

2. **Substitution Rule (Normative)**
   - A definition **MAY be substituted for another** in a semantic interface binding **only if**:
     - (a) Both definitions share the same semantic identity, **OR**
     - (b) One definition **explicitly declares** inheritance or delegation to the other (via semantic interface binding mechanisms)

3. **No Implicit Structural Compatibility**
   - Definitions with identical field structure **are NOT compatible** without explicit binding
   - This preserves semantic autonomy and prevents accidental coupling

### 2.2 Semantic Interface Compatibility (§2.7.3)

Semantic interfaces govern meaning contracts and establish compatibility through declared bindings:

1. **Binding-Based Compatibility (§2.7.3.5 — Semantic Binding Mechanisms)**
   - A type is compatible with a semantic interface **if and only if** it is explicitly bound via one of the declared binding forms:
     - Definition Binding
     - Domain Binding
     - Flow Binding
     - Rule Binding (reserved)
     - Action Binding

2. **Inheritance and Conflict Resolution (§2.7.3.3.4–3.3.6)**
   - Semantic interfaces **MAY inherit from parent interfaces**, and compatibility is **transitive** through the inheritance chain
   - When multiple interfaces declare overlapping obligations, **conflict resolution directives** (§2.7.3.3.5–3.3.6) **MUST be explicitly specified** at bind-time
   - Implicit conflict resolution is **forbidden**

3. **Enforcement Propagation Compatibility (§2.7.3.3.10)**
   - A type binding to a semantic interface **MUST transitively accept all enforcements** (§2.7.0.5 — Enforcement Mechanics) declared by that interface
   - Enforcement compatibility is **not negotiable**; it is a precondition for semantic interface binding

### 2.3 Data Surrogate Compatibility (§2.7.6 — Data Surrogate)

Data surrogates represent **semantic overlays** on data types and govern compatibility as follows:

1. **Structural Enforcement Attachment (§2.7.6.3)**
   - A data surrogate is **compatible with a data type** **if and only if**:
     - (a) The underlying data type matches the declared surrogate schema, **AND**
     - (b) All structural enforcement rules (constraints, validation) are **statically decidable** and **can be verified at bind-time**

2. **Transit and Fact-Materialization Semantics (§2.7.6.5)**
   - When a data surrogate is transported across semantic boundaries, **compatibility is re-evaluated at each boundary**
   - A surrogate **remains compatible only if**:
     - All enforcements applicable at the source boundary **remain satisfiable** at the destination boundary
     - Enforcement **cannot be relaxed** during transit; only intensification is permitted

3. **Compiler Probabilistic Reasoning (§2.7.6.7)**
   - The compiler **MAY reason probabilistically** about whether a data value conforms to a surrogate schema
   - However, **actual compatibility is determined deterministically** at enforcement-graph closure (§2.7.0.5.5)

### 2.4 Behavioral Surrogate Compatibility (§2.7.7 — Behavioral Surrogate)

Behavioral surrogates define **semantic intent overlays** on behavioral types and establish compatibility through:

1. **Formation and Enforcement Interaction (§2.7.7.2–2.7.7.3)**
   - A behavioral surrogate is **compatible with a behavioral type** **if and only if**:
     - (a) The type's method signature matches the surrogate's declared contract, **AND**
     - (b) All execution-level enforcement rules are **observable and enforceable** at the enforcement-graph level

2. **Reasoning Checkpoint Semantics (§2.7.7.6)**
   - The compiler **MUST establish reasoning checkpoints** at surrogate boundaries to verify semantic intent alignment
   - Incompatibility is signaled **if** the surrogate's declared intent cannot be verified against actual execution trace

---

## 3. Cross-Type Compatibility Constraints

### 3.1 Prohibition of Implicit Semantic Boundaries (§1.3.8)

> "All semantic boundaries **MUST be explicit**. Implicit semantic boundaries are **forbidden**."

This normative principle **directly governs semantic type compatibility**:

1. No type **MAY implicitly adopt** the obligations or constraints of another type
2. Compatibility **MUST be declared through explicit semantic constructs** (definitions, semantic interfaces, surrogates)
3. Implicit assumption of meaning **is forbidden** and **MUST result in a compilation error**

### 3.2 Enforcement Direction and Explanation Symmetry (§2.7.0.5.7 — Enforcement Invariants by Construct)

Semantic types **MUST satisfy enforcement directionality constraints**:

1. **Outward Vector (`enforces`)**
   - A semantic type **MAY impose enforcement** on types it exports (via domain boundary)
   - Compatibility is **established only if** the receiving side **acknowledges the enforcement** (via `enforced` declaration)

2. **Inward Vector (`enforced`)**
   - A semantic type **MAY declare acceptance** of enforcements from upstream sources
   - Compatibility requires that **the source enforcement is compatible** with the receiving type's constraints

3. **Explanation Symmetry**
   - A semantic construct that **declares `enforces`** **MUST provide an `explained` attachment** defining the rationale
   - A construct that **declares `enforced`** **MUST provide corresponding explanation** of why the enforcement is accepted
   - Asymmetry in explanation **MUST result in a compilation error** (§G.7F — Enforcement Direction & Explanation Symmetry Errors)

---

## 4. Inline vs. Named Type Equivalence (§A.15)

Semantic type compatibility **treats inline declarations as equivalent to named declarations** under the following rules:

1. **Inline Semantic Type Equivalence**
   - An inline semantic type (e.g., inline definition, inline interface) is **semantically equivalent** to a named type with the same schema
   - However, **they are not type-compatible without explicit binding**

2. **Substitution Constraint**
   - An inline semantic type **MAY NOT be substituted** for a named semantic type (or vice versa) without explicit semantic interface binding
   - This preserves determinism and prevents accidental semantic drift

---

## 5. Normative Summary by Semantic Type Class

| Semantic Type | Compatibility Criterion | Binding Required | Enforcement Transitive |
|---|---|---|---|
| **Definition** | Identity (RIID/UUID) or explicit inheritance | Yes (semantic interface) | Yes (`enforces` / `enforced`) |
| **Semantic Interface** | Explicit binding + inheritance chain | Yes (bind-time) | Yes (transitive closure) |
| **Data Surrogate** | Schema match + static enforcement decidability | Implicit (via data type) | Re-evaluated at boundaries |
| **Behavioral Surrogate** | Signature match + enforcement observability | Implicit (via behavioral type) | Verified at checkpoints |
| **Delegate** | Signature match + integration boundary declaration | Yes (explicit binding) | Yes (cross-border enforcement) |
| **Explanation** | Attachment to semantic construct | Non-normative (informative) | No (informative only) |

---

## 6. Error Conditions

Semantic type incompatibility **MUST be detected and reported** via the error pipeline (§G.7 — Semantic Type Errors):

- **G.7C** — Semantic Interface Governance Errors
- **G.7D** — Domain Authority & Cross-Border Errors
- **G.7F** — Enforcement Direction & Explanation Symmetry Errors

These errors **prevent compilation** and **MUST be resolved** before executable code is generated.

---

## 7. Cross-Reference Summary

The normative framework for semantic type compatibility is defined across:

1. **Core principles**: §1.3 (Explicit Semantic Boundaries), §1.5 (Declarative Authority)
2. **Semantic type categories**: §2.7 (Semantic Types — Definition, Semantic Interface, Surrogate, Delegate)
3. **Enforcement model**: §2.7.0.5 (Enforcement Mechanics — Directionality), §7.0 (Enforcement & Compliance)
4. **Identity and equality**: §A.12 (Identity and Equality Semantics), §A.15 (Inline vs Named Type Equivalence)
5. **Error codes**: §G.7 (Semantic Type Errors)

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 24
- tokens_out: 2485
- tokens_total: 2509
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 24.2
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_20_naive.md
