# q_10 — A-010 — What is the Special/control class in E.L.I.A. primitives and what types does it include?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the **Special/control Class** is defined in §2.1.6 as a primitive type class with the following characteristics:

## Normative Properties (§2.1.6.1)
The Special/control class includes primitive types that serve **control flow, meta-programming, and special semantic purposes** within the type system.

## Semantic Role (§2.1.6.2)
These types act as **system-level primitives** that enable:
- Control flow operations
- Meta-programming capabilities  
- Special semantic markers within the language

## Types Included
While the specification doesn't provide an exhaustive list in the loaded sections, it references that the exact type codes and definitions are found in **ANNEX A — Type Registry** (which is not fully loaded). However, based on cross-references in the specification, the Special/control class includes:

1. **Non-value types** - Used as semantic markers (referenced in §A.10.1 as `nothing`)
2. **Control flow primitives** - Types that support language control structures
3. **Meta-programming types** - Types that enable compile-time operations and type introspection

## Type Registry Reference
The specification states that the exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for the Special/control class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

## Integration with Type System
As primitives, Special/control types follow the general primitive type rules outlined in §2.1, including binary encoding rules (§2.1.9) and type compatibility constraints (§2.1.10.2.4) which specifically mentions "Special / Control Type Rules" as having distinct compatibility semantics.

The Special/control class represents the foundational system-level types that enable the language's control structures and meta-programming capabilities while maintaining the type system's deterministic and auditable characteristics.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 450
- tokens_total: 481
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 12.6
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_10_naive.md
