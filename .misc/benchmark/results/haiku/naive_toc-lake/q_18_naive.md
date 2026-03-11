# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Block Type Compatibility Rules in E.L.I.A.

Block type compatibility in E.L.I.A. is governed by **§2.1.10.3 — Block Type Compatibility**, which establishes strict rules preventing implicit cross-block assignment.

## Normative Principle

Block types **cannot be implicitly assigned to each other** based on their structural or binary similarity. Each block type operates within its own semantic and encoding namespace.

### Key Rules (§2.1.10.3)

1. **No implicit conversion between opaque block types**
   - `bytes`, `base64`, `beN`, `leN`, and `string[N]` are **distinct types** (§2.2.1)
   - Assignment between them requires **explicit conversion**, even if their underlying payloads are identical or compatible

2. **Endianness is not interchangeable**
   - `be[4]` (big-endian) and `le[4]` (little-endian) are **incompatible types**
   - A `be[4]` value **cannot be assigned to** an `le[4]` variable without explicit conversion
   - Endianness **MUST be explicitly declared by the type** and **MUST NOT be inferred or reinterpreted implicitly** (§2.2.1.2, normative property 3)

3. **String type hierarchy prevents conflation**
   - `fixed string[N]` (primitive), `string[N]` (opaque block), and `string` (unbounded/stream-eligible) are **three distinct representations** with different semantics (§2.2.0.4)
   - **Implicit coercion between string tiers is forbidden** (§2.2.0.4, point 4)
   - Explicit conversion **MUST** be used when moving values between them

4. **Structural blocks retain their schema identity**
   - Two `record` types with identical field layouts are **not compatible** if they are distinct named types
   - `array[T1]` and `array[T2]` are incompatible unless `T1` and `T2` satisfy element type compatibility rules (§2.1.10.4.2)

5. **Size-limit transition does not alter compatibility**
   - A block value that **auto-promotes to Stream representation** (when exceeding 2^26 − 1 bytes) **does not become assignable to block-typed variables** (§2.2.0.2, normative property 5)
   - The promotion changes the **materialization strategy**, not the **type identity**

## Rationale

This strict design reflects E.L.I.A.'s commitment to:

- **Explicit semantic boundaries** (§1.3) — block types are opaque carriers with intentionally hidden or strictly defined structure; implicit conversion would blur this boundary
- **Determinism by construction** (§1.2) — requiring explicit conversion ensures that byte-level reinterpretation is visible and auditable
- **Meaning-first architecture** (§1.1) — endianness, encoding format, and structural shape carry semantic intent that cannot be inferred

## Explicit Conversion Mechanism

While the specification does **not exhaustively specify the syntax** for explicit block-to-block conversion, the requirement is clear: conversions must be **observable, auditable, and semantically intentional** (§2.2.4 — Binary Encoding Rules for Block Types).

---

**Summary**: Block types are **type-sealed**. Assignment between different block types (including endian variants and string tiers) **requires explicit conversion**. This enforces auditability and prevents accidental semantic misinterpretation at boundaries.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 851
- tokens_total: 883
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 10.4
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_18_naive.md
