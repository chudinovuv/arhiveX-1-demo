# q_18 — B-008 — What are the block type compatibility rules in E.L.I.A. — can block types be assigned to each other?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, block types have **strict compatibility rules** that generally **prohibit direct assignment between different block types**. Here are the key rules:

## General Block Type Compatibility Rules

According to §2.1.10.3 Block Type Compatibility:

1. **No implicit conversions** between block types are permitted
2. **Explicit conversion required** for any transformation between block types
3. **Size constraints must be validated** during conversion (26-bit limit per §2.2.0.2)

## Specific Block Type Assignment Rules

### Opaque Block Types (§2.2.1)
- `bytes`, `beN`, `leN`, `base64`, `string[N]` are **not implicitly assignable** to each other
- Only **bitwise equality comparison** is supported (§2.2.1.2)
- **Explicit conversion functions required** for any transformation

### String Type Hierarchy (§2.2.0.4)
The specification explicitly states:
- **"Explicit conversion MUST be used"** when moving values between string tiers
- **"Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is forbidden"**

### Structural Block Types (§2.2.2)
- `record`, `array`, `dictionary`, `collection` are **immutable after construction** (§2.2.2.0.2)
- **No cross-type assignment** permitted between structural types
- Each maintains its **distinct TYPE_CODE** and schema identity

## Key Normative Properties

From §2.2.0.2 Normative properties:
- All block values **"MUST comply with a mandatory physical length limit of 26-bit"**
- Block types **"MUST NOT encode business logic, control flow, or executable behavior"**
- Blocks are **"treated as single atomic values"** (§2.2.1.2)

## Example Implications

```elia
# These assignments would be INVALID without explicit conversion:
let rawData: bytes = bytes(0x48, 0x65);
let encoded: base64 = rawData;  # ERROR - requires explicit conversion

let msg: string[256] = "Hello";
let fixed: fixed string[256] = msg;  # ERROR - forbidden implicit coercion

let be4Val: be[4] = be[4](0x1234);
let le4Val: le[4] = be4Val;  # ERROR - no implicit endian conversion
```

The specification enforces **type safety through explicit boundaries** — block types represent different semantic commitments about data structure and encoding, so assignments require deliberate conversion to prevent accidental data corruption or misinterpretation.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 633
- tokens_total: 665
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 24.4
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_18_naive.md
