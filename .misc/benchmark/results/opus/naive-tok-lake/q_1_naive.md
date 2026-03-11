# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the specification, the fixed string type in E.L.I.A. is defined in §2.1.8 as a **primitive type** with the following characteristics:

## Fixed String Type Definition

According to §2.1.8, the fixed string class represents:
- **Fixed-capacity, zero-padded UTF-8 text blocks**
- Used for **protocol fields, fixed-layout records, identifiers, and alignment-sensitive structures**

## Capacity Constraints

The capacity constraint works as follows (§2.1.8.2 Normative properties):

1. **Size Range**: Fixed strings **MUST declare an explicit byte capacity N where 1 ≤ N ≤ 1023 bytes**

2. **Fixed Serialization**: The serialized representation is **always exactly N bytes**, regardless of the actual UTF-8 content length

3. **Zero-Padding**: If the UTF-8 content is shorter than N bytes, the remaining bytes **MUST be zero-filled**

4. **No Null Termination**: Fixed strings **MUST NOT use null-termination**; the capacity N defines the exact field width

5. **UTF-8 Validation**: Content **MUST be valid UTF-8** up to the last non-zero byte

6. **No Length Prefix**: Unlike variable-length strings, fixed strings have **no length prefix** - they serialize as exactly N raw bytes

## Type Hierarchy Context

As clarified in §2.2.0.4 (String Type Hierarchy), fixed string is distinct from other string types:

| Type | Category | Max size | Serialization |
|------|----------|----------|---------------|
| `fixed string[N]` | Primitive | 1 ≤ N ≤ 1023 bytes | Exactly N bytes, zero-filled |
| `string[N]` | Opaque block | N ≤ 2^26 − 1 bytes | Length-prefixed, variable |
| `string` (unbounded) | Block/Stream | Up to 2^26 − 1 as block | Length-prefixed, variable |

The specification emphasizes (§2.2.0.4) that **explicit conversion MUST be used** when moving values between these string tiers - implicit coercion is forbidden.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 534
- tokens_total: 563
- cache_read: 0
- cache_creation: 32176
- wall_time_sec: 19.5
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_1_naive.md
