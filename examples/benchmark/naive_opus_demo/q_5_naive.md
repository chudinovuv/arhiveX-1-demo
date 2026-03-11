# q_5 — A-005 — What is the semantic role of Identifiers class in E.L.I.A. type system?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the semantic role of the Identifiers Class is defined in **§2.1.5.3 Semantic role**:

1. **Unique designation and reference** - Identifiers enable unambiguous designation of entities, resources, and semantic elements across system boundaries (§2.1.5.3).

2. **Stable, location-independent binding** - They provide references that remain valid regardless of physical location or runtime context (§2.1.5.3).

3. **Cross-domain and cross-temporal correlation** - Identifiers support tracking and correlation of entities across different domains and time periods (§2.1.5.3).

4. **Type-safe external key representation** - They offer a type-safe way to represent external keys and references (§2.1.5.3).

The Identifiers Class includes primitive types like:
- `guid` - globally unique identifiers
- `riid` - registry item identifiers  
- `uuid` - universally unique identifiers
- `uid` - unique identifiers

These are classified as **primitive types** (§2.1.5), meaning they are atomic, immutable values with no internal structure exposed to the language runtime. They serve as the foundational building blocks for entity identification and reference throughout the E.L.I.A. type system.

The specification emphasizes that identifiers are purely for designation and reference - they "MUST NOT encode behavior, control flow, or execution semantics" (§2.1.5.3), maintaining clear separation between data and behavior in the type system.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 360
- tokens_total: 388
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 12.1
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_5_naive.md
