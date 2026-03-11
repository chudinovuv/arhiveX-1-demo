# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, semantic type compatibility is governed by several key normative rules:

## Core Compatibility Principles

According to §2.1.10.5 Semantic Type Compatibility:

1. **No implicit conversion between semantic types** - Semantic types (Definition, Data Interface, Semantic Interface, Rule, Action, Flow, Delegate) have distinct roles and MUST NOT be implicitly converted between each other.

2. **Explicit semantic binding required** - Any interaction between semantic types MUST occur through explicit binding mechanisms:
   - Definition binding via Semantic Interface
   - Data exposure via Data Interface
   - Behavior orchestration via Action/Flow
   - External integration via Delegate

## Enforcement Mechanisms

The specification defines enforcement directionality (§2.7.0.5):

1. **Outward Vector (`enforces`)** - A semantic construct can declare constraints it imposes on other constructs
2. **Inward Vector (`enforced`)** - A semantic construct declares what constraints it accepts from others
3. **Enforcement DAG** - These relationships MUST form a directed acyclic graph with no cycles

Key normative rules from §2.7.0.5.5:
- Enforcement relationships MUST be explicitly declared
- Circular enforcement dependencies are forbidden
- Enforcement predicates MUST be deterministic
- Runtime enforcement MUST preserve compile-time guarantees

## Cross-Boundary Constraints

From §2.7.0.4.1 Cross-Boundary Surface Interaction Constraints:

1. **Export requirements** - Semantic types crossing domain boundaries MUST be explicitly exported
2. **Surface interaction** - Cross-boundary interactions MUST occur through declared surfaces (Data Interface, Semantic Interface, or Delegate)
3. **No implicit boundary crossing** - Semantic types cannot implicitly traverse domain boundaries

## Semantic Binding Rules

According to §2.7.3.5 Semantic Binding Mechanisms:

1. **Definition Binding** - Definitions bind to domain semantics via Semantic Interface
2. **Domain Binding** - Domains expose semantic contracts through explicit interfaces
3. **Flow Binding** - Flows orchestrate semantic interactions through declared bindings
4. **Action Binding** - Actions bind to semantic contexts through explicit declarations

## Type-Specific Compatibility

From §2.1.10.6 Normative Rules:

1. **Semantic types enforce strict separation** - Each semantic type has a specific role that cannot be substituted
2. **No semantic type aliasing** - Semantic types cannot be aliased or treated as equivalent
3. **Explicit transformation required** - Any semantic transformation MUST be explicit and auditable

The specification emphasizes that semantic type compatibility is fundamentally about **preserving meaning and intent** rather than structural compatibility. All semantic interactions must be explicit, deterministic, and traceable through the enforcement graph.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 24
- tokens_out: 650
- tokens_total: 674
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 22.3
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_20_naive.md
