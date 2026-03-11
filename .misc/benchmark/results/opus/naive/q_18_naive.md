# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, there are **no explicit block type compatibility or assignment rules** defined in the provided sections. However, the specification establishes several key constraints that strongly suggest **restrictive compatibility**:

## Implicit Compatibility Constraints

**§2.2.0.4** establishes that **explicit conversion MUST be used** when moving values between different string tiers (`fixed string[N]`, `string[N]`, and `string`), and that **implicit coercion between these string types is forbidden**.

**§2.2.1.2** (normative property 7) states that **opaque Block types MUST be immutable after materialization**, which implies assignment restrictions.

**§2.2.2.0.2** (normative property 1) requires that **structural containers MUST be immutable after construction**, further limiting assignment possibilities.

## Type Identity Requirements

**§2.2.1.2** (normative property 1) mandates that **opaque blocks MUST NOT expose internal structure** beyond raw byte equality, suggesting that assignment compatibility would be limited to exact type matches.

**§2.2.4** requires that all block values **MUST be serialized using the Envelope model** with specific **CATEGORY = Block** and **concrete TYPE_CODE**, implying that type identity is strictly enforced at the binary level.

## Size and Format Constraints

**§2.2.0.2** (normative property 2) establishes a **mandatory physical length limit of 26-bit (2^26 − 1 bytes)** that **MUST be enforced by construction**, which would apply to any assignment operations.

**§2.2.1.2** (normative property 3) requires that **endianness (`beN`, `leN`) MUST be explicitly declared by the type** and **MUST NOT be inferred or reinterpreted implicitly**.

## Conclusion

While explicit assignment rules are not provided in these sections, the specification's emphasis on **immutability**, **explicit type identity**, **mandatory type codes**, and **forbidden implicit coercion** strongly suggests that block types have **very limited assignment compatibility**, likely restricted to exact type matches with explicit conversion required for any cross-type assignments.

The complete assignment compatibility rules would likely be specified in sections covering type operations or derived types that are not included in the provided specification excerpt.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 534
- tokens_total: 565
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 15.3
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_18_naive.md
