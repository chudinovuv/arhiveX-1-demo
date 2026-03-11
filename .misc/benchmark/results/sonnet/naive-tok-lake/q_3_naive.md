# q_3 — A-003 — How does E.L.I.A. distinguish between null, void, and nothing — what are the normative differences?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, there are distinct semantic and normative differences between these concepts:

## `nothing` - Non-Value Semantic Marker

According to **§A.10.1**, `nothing` is a **"Non-Value Semantic Marker"** that represents the absence of a meaningful value at the semantic level. This is a **normative construct** defined in the type registry as a special marker indicating that no valid value exists for a given context.

## `null` - Special/Control Primitive

From **§2.1.6** on Special/control Class and **§3.21.5** on Special Literals, `null` appears to be a **primitive value** in the Special/control class that represents an explicit "no value" state within the data model. Unlike `nothing`, `null` is an actual value that can be assigned, compared, and serialized.

## `void` - Method Return Absence

While not explicitly detailed in the loaded sections, `void` appears in the syntax sections as a **method return type indicator** (referenced in **§3.12** method declarations) that signals a method produces no return value - this is a **type-level construct** rather than a value.

## Normative Distinctions

The key differences are:

1. **Semantic Level**: 
   - `nothing` operates at the **semantic marker level** (§A.10.1) - it indicates the absence of meaning itself
   - `null` operates at the **data value level** - it's a concrete primitive value representing "no data"
   - `void` operates at the **type signature level** - it describes method behavior, not values

2. **Materialization**:
   - `nothing` is a **non-materializable marker** - it cannot be stored or serialized as data
   - `null` is a **materializable primitive** - it has concrete representation in the type system
   - `void` is a **type declaration construct** - it exists only in signatures

3. **Usage Context**:
   - `nothing` indicates semantic absence in the type registry and default value semantics
   - `null` can be assigned to variables and used in comparisons as a regular primitive
   - `void` can only appear in method return type declarations

This three-way distinction reflects E.L.I.A.'s **"Meaning-First Architecture"** (§1.1) by separating semantic absence (`nothing`) from data absence (`null`) from behavioral absence (`void`).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 561
- tokens_total: 593
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 16.1
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_3_naive.md
