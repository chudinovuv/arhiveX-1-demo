# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, there are **no explicit block type compatibility or assignment rules** defined in the provided sections. However, I can identify several relevant constraints and properties that would affect block type compatibility:

## Key Constraints on Block Types

**Immutability Requirement**: According to §2.2.1.2, opaque blocks "MUST be immutable after materialization," and §2.2.2.0.2 states that structural containers "MUST be immutable after construction; no in-place mutation is permitted."

**Type-Specific Constraints**: Different block classes have distinct normative properties:
- **Opaque blocks** (§2.2.1.2) "MUST NOT expose internal structure" and support only "bitwise equality comparison and cryptographic hashing"
- **Structural blocks** (§2.2.2.0.2) have explicitly declared field layout and typing that "MUST serialize canonically"

## String Type Hierarchy Restrictions

The specification does provide explicit guidance on string type compatibility in §2.2.0.4:

> "Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**."

This suggests the language follows a **strict typing model** where implicit conversions between related types are prohibited.

## Size-Based Promotion Rules

The specification defines automatic promotion rules in §2.2.0.2 (normative property 5-7) where block types can be promoted to stream types under certain size conditions, but this is promotion rather than assignment between block types.

## Missing Specification

The provided sections do not contain:
- General block-to-block assignment rules
- Type coercion matrices
- Explicit compatibility hierarchies
- Conversion mechanisms between different block classes

**Conclusion**: Based on the available specification, E.L.I.A. appears to enforce **strict type boundaries** with no implicit conversions between block types, requiring explicit conversion operations when type changes are needed.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 467
- tokens_total: 498
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 13.2
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_18_naive.md
