# q_1 — A-001 — What is enum type in E.L.I.A. and what are its normative properties?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, an **enum** is a primitive type class that represents a **finite, named set of discrete values** with explicit semantic meaning.

## Definition and Designation (§2.1.7.1)

Enum types:
1. represent **finite, named sets of discrete values** where each value carries explicit semantic meaning beyond its ordinal position
2. enable **type-safe categorical data modeling** with compile-time validation and runtime integrity
3. provide **explicit value declaration** with optional underlying representation control

## Normative Properties (§2.1.7.2)

1. **Finite Value Set**: Enum types MUST define a complete, bounded set of permissible values at declaration time
2. **Named Values**: Each enum value MUST have an explicit, unique identifier within the enum's namespace
3. **Type Safety**: Enum values are NOT implicitly convertible to integers or other primitive types
4. **Explicit Underlying Type**: Enums MAY specify an underlying integral type for storage representation
5. **Ordinal Semantics**: Unless explicitly specified, enum values receive sequential ordinal assignments starting from 0
6. **Immutable Definition**: Once declared, the enum's value set and semantics MUST NOT change within a compilation unit

## Semantic Role (§2.1.7.3)

1. Enums act as **controlled vocabularies** for categorical data that requires both human readability and machine processing
2. They provide **semantic boundaries** around discrete state spaces, preventing invalid value assignment
3. Enums enable **domain-specific modeling** where the meaning of each value is explicit and verifiable
4. They serve as **type-safe alternatives** to magic numbers, string constants, or boolean flags in multi-state scenarios

## Syntax (§2.1.7.4)

### Declaration (Normative) (§2.1.7.4.1)
```
enum <EnumName> [: <UnderlyingType>]
    <ValueName1> [= <ExplicitValue>]
    <ValueName2> [= <ExplicitValue>]
    ...
end
```

### AST Grammar (§2.1.7.4.2)
```
EnumDeclaration := 'enum' Identifier [':' TypeReference] 
                   EnumBody 'end'
EnumBody := EnumValue+
EnumValue := Identifier ['=' Literal]
```

### Canonical Syntax (§2.1.7.4.3)
```elia
enum Status : int32
    Pending = 0
    InProgress = 1
    Completed = 2
    Failed = -1
end
```

The enum type provides **compile-time type safety** and **runtime value validation**, ensuring that only declared values can be assigned to enum-typed variables, preventing common categorical data errors.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 658
- tokens_total: 685
- cache_read: 0
- cache_creation: 26458
- wall_time_sec: 16.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_1_naive.md
