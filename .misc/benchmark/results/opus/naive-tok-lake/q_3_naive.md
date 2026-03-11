# q_3 — A-003 — How does E.L.I.A. distinguish between null, void, and nothing — what are the normative differences?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the normative distinctions between null, void, and nothing:

## **null** - Explicit Absence Value
- **Type**: Special/control primitive (§2.1.6)
- **Purpose**: Represents the **intentional absence of a value** within nullable types
- **Usage**: Can be assigned to nullable types, compared for equality, and used in conditional logic
- **Example**: `let x: int32? = null;` (§3.21.5)

## **void** - No Return Value
- **Type**: Special/control primitive (§2.1.6) 
- **Purpose**: Indicates a method/action **produces no return value**
- **Usage**: Used as return type for methods/actions that perform side effects without returning data
- **Constraint**: Cannot be assigned to variables or used as a value (§3.21.5.2)

## **nothing** - Non-Value Semantic Marker
- **Type**: Special semantic marker (§A.10.1)
- **Purpose**: Represents **semantic absence that prevents any computational participation**
- **Key Properties**:
  - Cannot be assigned, compared, or participate in any operation
  - "Propagates semantic voidness through any expression tree"
  - Results in compile-time errors if used in expressions
  - More restrictive than null - represents complete semantic emptiness

## Key Normative Differences:

1. **Assignment**: 
   - `null` ✓ can be assigned
   - `void` ✗ cannot be assigned  
   - `nothing` ✗ cannot be assigned

2. **Comparison**:
   - `null` ✓ can be compared (`x == null`)
   - `void` ✗ cannot be compared
   - `nothing` ✗ cannot be compared

3. **Expression participation**:
   - `null` ✓ can participate in expressions
   - `void` ✓ can be used as return type
   - `nothing` ✗ causes compile errors in any expression

The specification emphasizes that `nothing` is the most restrictive, representing complete semantic absence beyond what `null` provides (§A.10.1).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 517
- tokens_total: 549
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 15.3
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_3_naive.md
