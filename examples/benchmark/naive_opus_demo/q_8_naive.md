# q_8 — A-008 — What constraints does E.L.I.A. place on enum default values and when must explicit initialization be used?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the constraints on enum default values and when explicit initialization must be used:

## Default Value Constraints

According to **§2.1.7.2** (Normative properties), enums have specific default value rules:

1. **The default value of an enum type is always the member with ordinal value 0** (§2.1.7.2)
2. **If no member explicitly has value 0, the first declared member becomes the default** (§2.1.7.2)
3. **Compilers MUST generate a warning when an enum lacks an explicit zero-valued member** (§2.1.7.2)

## When Explicit Initialization is Required

Per **§2.1.7.4.3** (Canonical Syntax), explicit initialization must be used in these cases:

1. **When you need a specific member to be the default** - You must explicitly assign it the value 0
2. **When creating sparse enums** - Members can have non-sequential values like 1, 2, 4, 8, 16 for bitwise operations
3. **When the first member should NOT be the default** - Another member must be explicitly set to 0

## Examples from the Specification

From **§2.1.7.4.3**, here are the canonical examples:

```elia
# Basic enum - first member (None) is implicitly 0 and becomes default
enum OrderStatus:
    None
    Pending  
    Confirmed
    Shipped
    Delivered
    Cancelled
end

# Explicit values - Unknown is explicitly 0, making it the default
enum PaymentMethod:
    Unknown = 0
    CreditCard = 1
    DebitCard = 2
    BankTransfer = 3
    DigitalWallet = 4
end

# Sparse enum for bitwise operations
enum FilePermissions:
    None = 0      # Explicit default
    Read = 1
    Write = 2
    Execute = 4
    Delete = 8
end
```

## Key Normative Rules

From **§2.1.7.2**:
- Each enum member has a unique ordinal value (no duplicates allowed)
- Values must fit within int32 range
- The compiler warning for missing explicit zero-valued member helps maintain semantic clarity about which value represents the "uninitialized" or "default" state

This design ensures that enum default behavior is predictable and that developers explicitly consider what the appropriate default state should be for their domain model.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 593
- tokens_total: 623
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 18.0
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_8_naive.md
