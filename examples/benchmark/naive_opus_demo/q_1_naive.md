# q_1 — A-001 — What is enum type in E.L.I.A. and what are its normative properties?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the enum type is defined in **§2.1.7 Enum**.

## Designation (§2.1.7.1)
The enum type is designed to:
1. Represent **finite, named value sets** with explicit domain semantics
2. Model **categorical choices** that are known and bounded at design time
3. Provide **type-safe discrimination** without implicit numeric conversions

## Normative Properties (§2.1.7.2)
1. Enums **MUST declare all members explicitly** at type definition time
2. Enum members **MUST have unique names** within the enum scope
3. Enums **MAY have explicit discriminator values** (integers) or use compiler-assigned sequential values
4. Enums **MUST NOT permit runtime extension or modification** of the member set
5. Enum values **MUST be treated as opaque identities**, not as their underlying representation
6. Conversion between enum and its underlying type **MUST be explicit**, never implicit
7. Enums **MUST support equality comparison** but **MUST NOT support arithmetic operations**

## Semantic Role (§2.1.7.3)
Enums serve as:
1. **Domain-specific vocabularies** that encode business-meaningful categories
2. **Type-safe alternatives** to magic numbers or string constants
3. **Exhaustiveness-checked discriminators** in pattern matching and case analysis

The specification also provides syntax details in §2.1.7.4, including declaration syntax, AST grammar, and canonical examples, though these sections are noted in the table of contents but not included in the loaded content.

As a primitive type (§2.1), enums are part of the fundamental type system and follow the general encoding rules for primitives defined in §2.1.9.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 419
- tokens_total: 446
- cache_read: 0
- cache_creation: 26458
- wall_time_sec: 16.5
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_1_naive.md
