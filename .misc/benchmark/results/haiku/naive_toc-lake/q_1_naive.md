# q_1 — A-001 — What is the fixed string type in E.L.I.A. and how does its capacity constraint work?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Fixed String Type in E.L.I.A.

## Definition and Designation

The fixed string type is a **primitive type** (§2.1.8) designed to represent **textual data with a strictly declared, immutable capacity at definition time**.

According to §2.1.8.1 (Designation):

1. Represent **fixed-capacity textual payloads** whose length is declared at the type level and **MUST NOT vary** at runtime;
2. Enable safe, predictable serialization and storage of text in **protocol headers, fixed-layout records, and constrained environments**;
3. Provide a **deterministic binary footprint** suitable for cryptographic operations and persistence.

## Capacity Constraint Mechanics

### Declaration and Bounds

The fixed string type is declared as `fixed string[N]`, where `N` specifies the **maximum capacity in bytes**. According to §2.1.8.2 (Normative properties):

1. **Capacity is fixed at declaration time**: A `fixed string[128]` always allocates exactly 128 bytes, regardless of the actual content length.

2. **Payload must be UTF-8 encoded text** (§2.1.8.2):
   - The declared capacity N must accommodate valid UTF-8 sequences
   - No encoding normalization or transformation is permitted

3. **Zero-padding for unused capacity**: §2.1.8.2 specifies that unused bytes **MUST be zero-padded** to fill the declared capacity exactly.

4. **Serialization is always exactly N bytes**: Unlike `string[N]` (bounded opaque block, §2.2.1) which uses length-prefixing, `fixed string[N]` serializes to **exactly N bytes, no length prefix, zero-filled to capacity**.

### Critical Distinction from Other String Types

§2.2.0.4 (String Type Hierarchy) establishes the normative distinction:

| Type | Category | Serialization | Auto-scale |
|------|----------|---------------|------------|
| `fixed string[N]` | **Primitive** | Exactly N bytes, zero-filled | **No** |
| `string[N]` | Opaque block | Length-prefixed, variable | **No** |
| `string` (unbounded) | Block / Stream | Length-prefixed, variable | **Yes** |

**Normative consequence** (§2.2.0.4):

- `fixed string[N]` **has NO length prefix**; its size is always N bytes at serialization
- `fixed string[N]` **does NOT auto-scale** — the capacity is immutable
- Exceeding the declared capacity **MUST be rejected at construction time**

### Enforcement at Boundaries

Per §2.1.8.2:

1. **No implicit coercion** between `fixed string[N]`, `string[N]`, and `string` is permitted (§2.2.0.4).
2. **Explicit conversion is mandatory** when moving values between string tiers.
3. Attempting to assign a text payload larger than N bytes **MUST generate a compilation or runtime error**.

## Canonical Syntax Example

From §2.1.8.4.3:

```
# Fixed-size string, exactly 64 bytes (zero-padded)
let title: fixed string[64] = "Title";

# In a record with fixed layout
define record NetworkHeader
    property Version: fixed string[8];    # Always 8 bytes
    property Type: fixed string[16];     # Always 16 bytes
end explained as "Fixed-layout header";
```

## Performance and Use Case

Fixed strings are designed for:

- **Protocol headers** with strict byte-alignment requirements
- **Fixed-layout records** requiring deterministic binary footprints
- **Cryptographic operations** where binary size must be known in advance
- **Performance-critical serialization** (zero-copy eligible, predictable allocation)

The absence of length-prefixing and zero-padding guarantee makes fixed strings significantly more efficient than bounded or unbounded string types for these scenarios.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 947
- tokens_total: 976
- cache_read: 0
- cache_creation: 32176
- wall_time_sec: 12.6
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_1_naive.md
