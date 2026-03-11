# q_8 — A-008 — What constraints does E.L.I.A. place on enum default values and when is explicit initialization required?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the constraints on enum default values and when explicit initialization is required:

## Default Value Constraints

According to §2.1.7.2 (Normative properties), enums have strict default value rules:

1. **The default value of an enum is always the member with ordinal value 0** (§2.1.7.2, point 5)

2. **If no member has ordinal 0, the enum has NO valid default** (§2.1.7.2, point 5). This means:
   - Variables of this enum type cannot be declared without explicit initialization
   - The `default(T)` function will fail for such enums

## When Explicit Initialization is Required

Explicit initialization is **required** in these cases:

1. **When the enum has no zero-valued member** (§2.1.7.2, point 5)
   ```
   define enum Status
       Active = 1;    # No member with value 0
       Inactive = 2;
       Pending = 3;
   end
   
   # This would be invalid:
   # let status: Status;  # Error: no default value
   
   # Must explicitly initialize:
   let status: Status = Status.Active;
   ```

2. **For const enum members** - they must have explicit values (§2.1.7.4.3):
   ```
   define enum HttpStatus
       const OK = 200;         # Required explicit value
       const NotFound = 404;   # Required explicit value
   end
   ```

## Additional Constraints

From §2.1.7.2:
- **Ordinals must be unique within an enum** (point 3)
- **Members marked `const` are immutable** and require compile-time constant values (point 6)
- **Implicit ordinal assignment starts at 0** and increments by 1 (point 4)
- **No arithmetic operations** are allowed on enum values (point 8)

The specification emphasizes that enums are **nominally typed** (§2.1.7.2, point 2), meaning they are distinct types that cannot be implicitly converted to/from their underlying integer representation.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 521
- tokens_total: 550
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 16.6
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_8_naive.md
