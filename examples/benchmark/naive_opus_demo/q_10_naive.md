# q_10 — A-010 — What is the Special/control class in E.L.I.A. primitives and what types does it include?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the **Special/control Class** is a category of primitive types found in §2.1.6. Here's what it includes:

## Special/control Class (§2.1.6)

### Normative Properties (§2.1.6.1)
The Special/control class has specific normative properties that distinguish it from other primitive types, though the detailed properties are not provided in the loaded sections.

### Semantic Role (§2.1.6.2)
This class serves a particular semantic role within the type system, though the specific role description is not available in the loaded content.

### Known Special/Control Types

From other sections of the specification, we can identify several types that belong to this class:

1. **`null`** - Referenced in §3.21.5 as part of "Null and Special Literals"
2. **`none`** - The specification mentions "non-value" types in the primitive types summary
3. **`nothing`** - Referenced in §A.10.1 as a "Non-Value Semantic Marker"

### Type Compatibility Rules (§2.1.10.2.4)

The specification explicitly states that Special/Control types have specific compatibility rules:
- They follow "Special / Control Type Rules" as outlined in §2.1.10.2.4
- These types have unique conversion and assignment behaviors distinct from numeric and other primitive types

### Integration with Type System

According to §2.1 (Primitive Types), the Special/control class is one of the fundamental primitive type classes alongside:
- Integral Class
- Decimal/floating Class  
- Boolean Class
- Date/Time Class
- Identifiers Class
- Enum
- Fixed String Class

The Special/control class appears to handle edge cases and control flow markers within the type system, providing semantic markers for absence of value or special states that cannot be represented by regular data-carrying types.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 440
- tokens_total: 471
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 20.6
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_10_naive.md
