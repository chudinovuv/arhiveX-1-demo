# q_20 — B-010 — What normative rules govern semantic type compatibility in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, semantic type compatibility is governed by several normative rules across multiple sections:

## Core Compatibility Principles (§2.1.10.1)

**Fundamental Principles:**
1. **No implicit conversion between type categories** — primitives, blocks, derived types, and semantic types maintain strict boundaries
2. **Explicit conversion required** for cross-category assignments
3. **Type safety enforced at compile-time** with deterministic error generation

## Semantic Type Specific Rules (§2.1.10.5)

**Semantic Type Compatibility:**
- Semantic types have **specialized compatibility rules** that differ from data types
- Compatibility is determined by **semantic contracts and interface alignment** rather than structural similarity
- **Authority boundaries** must be respected in compatibility determinations

## Enforcement-Driven Compatibility (§2.7.0.4)

**Cross-Boundary Surface Interaction Constraints (Normative):**
1. **Exported surfaces only** — semantic types can only interact through explicitly exported interfaces
2. **Domain authority preservation** — compatibility must respect the originating domain's semantic authority
3. **Enforcement graph validation** — all semantic type interactions must be validated against the enforcement graph

## Directionality Model Rules (§2.7.0.5)

**Enforcement Mechanics — Directionality Model (Normative):**

**Vector Definitions:**
- **Outward Vector (`enforces`)** — defines what constraints a semantic type imposes
- **Inward Vector (`enforced`)** — defines what constraints a semantic type accepts

**Normative Rules:**
1. Semantic type compatibility **MUST respect enforcement directionality**
2. **Enforcement DAG** must remain acyclic during compatibility resolution
3. **No circular enforcement dependencies** permitted between semantic types

## Definition Identity Requirements (§2.7.1.3.4)

**Definition Identity (riid Layout):**
- Semantic types **MUST maintain stable identity** through `riid` (resource instance identifier)
- Compatibility checks **MUST validate riid consistency** across domain boundaries
- **Version compatibility** must be explicitly declared and validated

## Compilation-Time Enforcement (§3.20.3)

**Type Compatibility Enforcement at Call Sites:**
- **Normative Rules** require compile-time validation of all semantic type interactions
- **Cross-reference validation** against semantic contracts
- **Authority boundary validation** at every interaction point

## Error Handling (§G.7)

**Semantic Type Errors:**
The specification defines specific error codes for semantic type compatibility violations, including:
- **Enforcement Graph Errors** (§G.7A)
- **Definition Lifecycle Errors** (§G.7B) 
- **Domain Authority & Cross-Border Errors** (§G.7D)

## Key Normative Constraints

1. **Authority Preservation** — semantic compatibility cannot violate domain authority boundaries
2. **Enforcement Consistency** — all compatible semantic types must maintain consistent enforcement relationships
3. **Explicit Declaration** — semantic compatibility must be explicitly declared, not inferred
4. **Deterministic Validation** — compatibility checks must be deterministic and repeatable
5. **Cross-Border Validation** — semantic types crossing domain boundaries require additional validation layers

These rules ensure that semantic type compatibility maintains the language's core principles of **meaning-first architecture**, **explicit semantic boundaries**, and **enforcement as architecture**.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 24
- tokens_out: 781
- tokens_total: 805
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 20.6
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_20_naive.md
