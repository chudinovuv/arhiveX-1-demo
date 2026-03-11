# 2.1 Primitive Types

Primitive types are used to encode **primitive information** — irreducible factual values that have no internal structure at the language level. They form the lowest semantic layer of the type system and serve as the building blocks for blocks, records, streams, and higher-order constructs.

(A) Each primitive belongs to a **primitive class** that explicitly defines:

- the **scope of admissible operations** (comparison, arithmetic, ordering, equality, etc.);
- the **permitted forms of processing and transformation**;
- the rules of **serialization, normalization, and validation**;
- the boundaries beyond which implicit conversion or interpretation is forbidden.

(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


> **Note**: This section establishes the normative scope and intent of Primitive Types, defining their ontological role and core constraints and basic serialization within the type system. It intentionally does not exhaustively specify  security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.



# 2.1.1 Integral Class

Integral primitives represent fixed-width integer values with deterministic size, signedness, and binary representation. They are used for counters, identifiers, flags, protocol fields, offsets, and other numerically exact values where rounding is forbidden. All integral primitives are platform-independent and serialize canonically. This class is represented by the following types:

- `int8`/`uint8` — (u)signed 1-byte fixed-width integral type;

- `int16`/ `uint16` — (u)signed 2-bytes fixed-width integral type;

- `int32`/ `uint32` — (u)signed 4-bytes fixed-width integral type;

- `int64` /`uint64`  — (u)signed 8-bytes fixed-width integral type;

## 2.1.1.1 Designation

1. represent **numerically exact discrete quantities** without approximation or rounding;
2. provide **fixed-width arithmetic** suitable for protocol fields, counters, indexes, and offsets;
3. enable deterministic comparison, serialization, and replay across heterogeneous runtimes;
4. act as the foundational numeric carriers for higher-level constructs (records, blocks, identifiers).

## 2.1.1.2 Normative properties

1. Integral primitives **MUST have fixed and explicitly declared bit width** and signedness.
2. Integral primitives **MUST serialize canonically** with deterministic byte ordering and width preservation.
3. Integral primitives **MUST NOT permit implicit widening, narrowing, or signedness conversion**; any conversion MUST be explicit and type-safe.
4. Arithmetic operations on integral primitives **MUST be exact**; overflow or underflow **MUST be explicitly defined** (error, saturation, or wrap-around) and MUST NOT be implicit.
5. Integral comparison semantics **MUST be strict and deterministic**; cross-width or cross-signedness comparison is forbidden without explicit conversion.
6. Integral primitives **MUST NOT encode semantic meaning beyond numeric value** and **MUST NOT introduce behavior or authority**.

## 2.1.1.3 Semantic role

1. Integral primitives act as **exact numeric truth carriers**, forming the base layer of quantitative representation.
2. They support enforcement, validation, and audit by guaranteeing **precision, determinism, and replay safety**.
3. Integrals provide a stable numeric substrate upon which identifiers, enums, flags, and protocol-level constructs are safely built.

**A. Standards reference:**

- ISO/IEC 9899 (C integer model, width & signedness guarantees)
- ISO/IEC 10967 (Language-independent arithmetic)
- RFC 8949 (CBOR canonical integer encoding — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



# 2.1.2 Decimal / floating Class

Decimal and floating-point primitives represent numeric values with fractional components.

(A) The type system explicitly distinguishes **exact decimal arithmetic** from **binary floating-point arithmetic** to prevent semantic ambiguity and audit-unsafe rounding assumptions.

(B) This class represented by types:

- `decimal` is intended for **exact, base-10 arithmetic** (e.g., monetary values) and MUST preserve declared precision across serialization boundaries.
- `float` represent **approximate single precision numeric values**  optimized for geometry, statistical, or signal-processing use cases
- `double` represent **approximate double precision numeric values** optimized for scientific, statistical, or signal-processing use cases.

## 2.1.2.1 Designation

1. represent fractional numeric facts for measurement, ratios, and calculations where integers are insufficient;
2. separate **exact** (decimal) from **approximate** (binary floating-point) arithmetic as distinct semantic commitments;
3. enable deterministic serialization and validation of numeric values with fractional components;
4. prevent implicit precision loss and audit ambiguity by making approximation explicitly type-bound.

## 2.1.2.2 Normative properties

1. `decimal`, `float`, and `double` **MUST** have deterministic binary width and canonical serialization.
2.  `decimal` **MUST** model base-10 exactness and **MUST NOT** be silently coerced into binary floating-point representation.
3. `float` and `double` **MUST** follow binary floating-point semantics and **MUST NOT** be interpreted as exact values.
4.  Implicit conversion between `decimal` and `float` / `double` **MUST NOT** be permitted; any conversion MUST be explicit and MUST acknowledge potential precision loss.
5. Any loss of precision, rounding, or overflow **MUST** be explicit, type-bound, and observable (validation error or explicitly declared rounding policy).
6. Comparison semantics **MUST** be type-safe: cross-type comparison between `decimal` and `float` / `double` is forbidden unless an explicit conversion is performed.
7. Serialization and replay of decimal and floating-point values **MUST** preserve the same semantic interpretation across runtimes; implementations **MUST NOT** introduce platform-specific normalization.

## 2.1.2.3 Semantic role

1. Decimal and floating types act as **numeric truth carriers**, where the chosen type communicates the admissible interpretation of the value (exact vs approximate).
2. They enable enforcement and validation to reason about precision-sensitive constraints without implicit assumptions.
3. They support auditability by ensuring that approximation is a declared property of the type, not an emergent runtime artifact.

**A. Standards reference:**

- IEEE 754 (Binary floating-point arithmetic — `float`, `double`)
- ISO/IEC 10967-2 (Language-independent floating-point arithmetic)
- IEEE 754-2008 / 2019 Decimal Floating-Point (conceptual alignment for `decimal`)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



# 2.1.3 Boolean Class

Boolean primitives represent binary truth values used for flags, predicates, admissibility checks, and semantic conditions. They are strictly non-numeric and MUST NOT be used to encode multi-valued states or control flow implicitly. Boolean values serialize canonically and are deterministic across all runtimes.

**A. Standards reference:**

- ISO/IEC 9899 (C boolean type semantics — conceptual model)
- IEC 60027-2 (Binary logic symbols — conceptual alignment)
- RFC 8949 (CBOR boolean encoding — canonical serialization reference)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.

# 2.1.4 Date/Time Class

Date and time primitives represent temporal facts and durations with explicit semantics and canonical representation. They are used to model calendar dates, wall-clock times, absolute instants, and elapsed durations in a way that is unambiguous, timezone-safe, and suitable for audit and legal traceability. This class is represented by:

- `date` — a calendar date without time-of-day or timezone semantics.
- `time` — a wall-clock time without a date or timezone.
- `timestamp` — an absolute point in time suitable for ordering, causality, and audit trails.
- `timespan` — a duration independent of calendar alignment.

## 2.1.4.1 Designation

1. encode temporal facts and durations with **explicit, non-ambiguous semantics**.
2. provide deterministic ordering and traceability for audit, evidence, and causality chains.
3. prevent locale, calendar, and platform drift by making temporal interpretation type-bound.
4. support legal and compliance-relevant time semantics (retention windows, effective/deprecated dates, evidence timestamps).

## 2.1.4.2 Normative properties

1. Temporal primitives **MUST serialize canonically** and deterministically across runtimes.
2. Temporal primitives **MUST NOT** embed implicit locale, calendar, or platform-specific behavior.
3. `date` **MUST** represent a civil calendar date only and **MUST NOT** imply time-of-day, timezone, or offset.
4. `time` **MUST** represent a wall-clock time only and **MUST NOT** imply a date, timezone, or offset.
5. `timestamp` **MUST** represent an absolute instant and **MUST** carry an explicit timezone/offset semantic at the serialization boundary (canonical form).
6. `timespan` **MUST** represent an elapsed duration and **MUST NOT** be interpreted as a calendar interval (no month/year semantics unless explicitly declared by a higher-level construct).
7. Implicit conversion between `date`, `time`, `timestamp`, and `timespan` **MUST NOT** be permitted; any conversion MUST be explicit and type-bound.
8. Temporal comparison and arithmetic **MUST** be type-safe:
   - (a) ordering comparisons are admissible for `timestamp` and MAY be admissible for `time` (within the same day context) when explicitly declared;
   - (b) `timespan` MAY be added/subtracted to/from `timestamp` only via explicit operations;
   - (c) `date` arithmetic is forbidden unless an explicit calendar policy is declared by a higher-level construct.

## 2.1.4.3 Semantic role

1. Date/time primitives act as **temporal truth carriers**, making temporal interpretation explicit and inspectable.
2. They enable enforcement and audit tooling to reason about time-bound obligations deterministically (e.g., effective/deprecated dates, retention and evidence timelines).
3. They provide a stable temporal substrate that prevents hidden timezone and locale drift from silently altering meaning.



**A. Standards reference:**

- ISO 8601 (Date and time representations, including durations)
- RFC 3339 (Internet profile of ISO 8601 — timestamps)
- ISO/IEC 10967-1 (Language-independent arithmetic — temporal concepts, conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



# 2.1.5 Identifiers Class

Identifier primitives represent stable, opaque identity values used for correlation, reference, deduplication, and audit traceability. They MUST be globally or domain-unique, immutable, and safe for serialization, transport, persistence, and replay. Identifiers carry **no embedded semantics** beyond identity and MUST NOT encode business meaning, temporal ordering (unless explicitly defined), or behavior. This class represented by two types:

- (a) `guid` represents a globally unique identifier with well-known external interoperability and has a **fixed width of 128 bits (16 bytes)**.
- (b) `riid` represents a **runtime-independent identifier** defined **exclusively within E.L.I.A.**, preserving **determinism, compactness, and canonical serialization** across heterogeneous runtimes, and has a **fixed width of 96 bits (12 bytes)**. `riid` has no external standard mapping and MUST NOT be implicitly converted to or from other identifier formats.

## 2.1.5.1 Designation

1. provide a **stable identity handle** for correlation and reference across domains, records, and streams;
2. enable **deduplication and idempotency** without relying on value semantics;
3. support **audit traceability and evidence linking** across time and system boundaries;
4. act as **opaque identity anchors**, not as descriptive or behavioral carriers.

## 2.1.5.2 Normative properties

1. Identifiers **MUST be immutable** for their entire lifetime and **MUST NOT** be reused for different entities.
2. Identifiers **MUST be treated as opaque values**; no semantic meaning, ordering, or structure MAY be inferred unless explicitly declared by the identifier type.
3. Identifiers **MUST serialize canonically** and preserve identity across transport, persistence, replay, and cryptographic operations.
4. Identifiers **MUST be comparable only for equality** unless an explicit ordering semantic is defined by the identifier type.
5. Identifiers **MUST NOT** encode business state, timestamps, versioning, or control information.
6. Implicit conversion between different identifier types **MUST NOT** be permitted; any conversion MUST be explicit and type-safe.
7. Identifiers **MUST support only bitwise equality comparison and cryptographic hashing operations**. No arithmetic, ordering, range, or semantic comparison operations are permitted.

## 2.1.5.3 Semantic role

1. Identifiers act as **pure identity references**, not as data descriptors or control signals.
2. They enable **referential integrity** across records, streams, events, and audit artefacts.
3. Identifiers participate in validation, enforcement, serialization, and audit semantics **only as identity tokens** and **do not introduce authority, behavior, or decision logic**.

## 2.1.5.4 Syntax

### 2.1.5.4.1 Declaration (normative)

[TBD]

### 2.1.5.4.2 AST Grammar

> The AST grammar defined below is intentionally **representational**, not implementation-exhaustive. Its purpose is to identify and formalize the **essential syntactic nodes and structural relationships** required to construct a valid Identifier, rather than to mirror the exact grammar used by any specific compiler or runtime provider.

[TBD]

### 2.1.5.4.3 Canonical Syntax

[TBD]


**Standards reference:**

- RFC 4122 (UUID / GUID)
- ISO/IEC 9834-8 (Registration of object identifiers — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



# 2.1.6 Special/control Class

Special/control primitives represent **semantic control markers**, not domain data. They are used to explicitly model absence, non-materialization, control flow boundaries, and constrained value spaces in a deterministic and inspectable way. These primitives are essential for semantic clarity and enforcement but MUST NOT be treated as business data or used to encode implicit behavior. This class is represented by three types:
- (a) `null` represents an explicit absence of data value.
- (b) `void` represents the absence of a return value or a platform-native pointer placeholder.
- (c) `nothing` represents a non-materialized or undefined semantic state.

## 2.1.6.1 Normative properties

1. Special/control primitives (`null`, `void`, `nothing`) **MUST NOT** be treated as business data and **MUST NOT** be used to encode implicit state machines, multi-valued states, or control flow.
2. `null` **MUST** represent explicit absence of a value and **MUST NOT** be semantically conflated with `nothing`.
3. `nothing` **MUST** represent a non-materialized or undefined semantic state and **MUST NOT** be used as a substitute for `null` or `void`.
4. `void` **MUST** represent the absence of a return value (or an explicitly declared platform-native placeholder when permitted by the runtime profile) and **MUST NOT** be materialized as a value payload.
5. Implicit conversions between `null`, `void`, and `nothing` are **strictly forbidden**. Any conversion, if permitted by a higher-level construct, MUST be explicit and MUST preserve the originating semantic meaning.
6. Serialization of special/control primitives **MUST be canonical** and **MUST be deterministic** across runtimes:
   - (a) `null` **MUST** serialize as an explicit absence marker.
   - (b) `nothing` **MUST** serialize as an explicit non-materialization marker.
   - (c) `void` **MUST NOT** serialize as a materialized payload; it is a control semantic and may only appear in signature positions.

7) Validation and enforcement pipelines **MUST** treat special/control primitives as first-class semantic markers:
   - (a) `null` and `nothing` **MUST** be validated against declared nullability/materialization constraints.
   - (b) violations **MUST** surface deterministically (compile-time or validation-time, depending on the carrier construct).
8) Special/control primitives **MUST NOT** introduce authority or behavior and **MUST NOT** relax any enforcement rule attached to the concrete carrier (record field, parameter, return contract, or envelope).

## 2.1.6.2 Semantic role

1. Special/control primitives act as **explicit semantic boundary markers**, making absence, non-materialization, and control termination states inspectable and unambiguous.
2. They enable enforcement, validation, and reasoning layers to distinguish **data absence** from **data invalidity** and from **non-applicability** without implicit conventions.
3. Special/control primitives provide a stable semantic substrate for nullability rules, lifecycle boundaries, and contract completeness checks, while remaining strictly behavior-free.
4. Special/control primitives are serialized canonically and participate in validation and enforcement semantics, but they do not introduce behavior or authority.
   
   For additional normative detail, see **ANNEX B — Type Metadata Envelope**, Section **B.8 (Serialization Context)**. 



**A. Standards reference:**

- ISO/IEC 11404 (Language-independent datatypes — conceptual alignment)
- RFC 8949 (CBOR null / simple values encoding — canonical control markers)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.



# 2.1.7 Enum

`enum` represents a **constrained, finite value space** used to eliminate magic numbers, magic strings, and implicit semantic branching. An enum defines an explicit closed set of admissible values and enforces semantic clarity at compile time, serialization time, and enforcement time.

## 2.1.7.1 Designation

1. declare a **finite semantic domain** of values that are mutually exclusive;
2. provide **self-describing symbolic identifiers** instead of raw literals;
3. enable deterministic validation, comparison, and serialization of categorical data;
4. prevent semantic drift caused by loosely typed constants.

## 2.1.7.2 Normative properties

1. An enum **MUST define a closed set of admissible values**; values outside this set are invalid and MUST be rejected at validation time.
2. Enum values **MUST be immutable** and MUST NOT carry state or behavior.
3. An enum **MUST NOT** be extensible at runtime; any extension constitutes a new enum definition.
4. Enum values **MUST serialize canonically** according to the type metadata rules and MUST preserve identity across transport and persistence boundaries.
5. An enum **MAY** be backed by an integral or textual representation, but this representation **MUST NOT leak semantic meaning** beyond the declared identifiers.
6. Enum comparison semantics are **strict and exact**; implicit conversion to or from other primitive types is forbidden.

## 2.1.7.3 Semantic role

1. Enums act as **semantic classifiers**, not as control flow mechanisms.
2. They provide a stable categorical vocabulary usable by rules, enforcement, and validation.
3. Enums improve auditability by making categorical decisions explicit and inspectable.

Enums participate fully in enforcement and validation semantics but **do not introduce authority or behavior**. `enum`  primitive is serialized canonically and participate in validation and enforcement semantics, but they do not introduce behavior or authority.



## 2.1.7.4 Syntax

### 2.1.7.4.1 Declaration (normative)

1. An `enum` **MUST be declared using the** `define` construct and **MUST introduce a new primitive type** with a closed and finite value set.
2. An enum declaration **MUST specify at least one enum member**; empty enumerations are forbidden.
3. Enum member identifiers **MUST be unique within the enum scope** and **MUST be stable once published**.
4. An enum **MAY declare an explicit default value**; if declared, the default **MUST reference a member of the same enum**.
5. If no default is declared, the enum **MUST be explicitly initialized** at every usage site; implicit defaults are forbidden.
6. Enum members **MAY be associated with an explicit underlying value** (integral or string literal). If omitted, the underlying value **MUST be auto-assigned deterministically** according to declaration order.
7. The underlying representation **MUST NOT affect semantic equality**: enum values are equal **only if their enum type and member identifier match**, regardless of underlying value.
8. Enum declarations **MAY** include an `explained as` clause to document semantic intent, but this clause **MUST NOT alter runtime behavior**.
9. Enum declarations **MAY** include an `enforced` clause; any referenced definitions **MUST apply uniformly to all enum members**.
10. An enum declaration **MUST be immutable** after compilation; runtime extension, mutation, or injection of new members is strictly forbidden.
11. Any change to the member set, default value, or underlying representation **MUST constitute a new enum version** and **MUST be treated as a breaking semantic change** unless explicitly governed by higher-level compatibility rules.
12. Enum declarations **MUST be resolved at compile time**; unresolved or ambiguous enum references **MUST result in a compile-time error**.

### 2.1.7.4.2 AST Grammar

> The AST grammar defined below is intentionally **representational**, not implementation-exhaustive. Its purpose is to identify and formalize the **essential syntactic nodes and structural relationships** required to construct a valid Enum, rather than to mirror the exact grammar used by any specific compiler or runtime provider.

```
# Enum type definition
<enum_definition> ::=
    "define" [<visibility>] "enum" <identifier>
    "(" <enum_members> ")"
    ["default" <identifier>]
    ["explained" "as" <string_literal>]
    ["enforced" "[" <policy_list> "]"]
    ";"

<enum_members> ::=
    <enum_member> ("," <enum_member>)* [","]

<enum_member> ::=
    <identifier> ["=" <enum_value>]

<enum_value> ::=
    <integer_literal> | <string_literal>

# Enum access
<enum_access> ::=
    <identifier> "." <identifier>

# Enum in case/when
<enum_case> ::=
    "case" <expression> ":"
        <enum_when_clause>+
        ["default" ":" <block_grammar>]
    "end"

<enum_when_clause> ::=
    "when" <enum_access> ":"
        <block_grammar>

```

### 2.1.7.4.3 Canonical Syntax

```
# Simple enum (ordinal values, auto-assigned starting from 0)
define enum TrafficLight (Red, Yellow, Green) default Red;

# Enum with explicit string values
define enum TrafficLight (
    Red = "red",
    Yellow = "yellow",
    Green = "green"
) default Red;

# Enum with explicit integral values
define enum FlowAction (
    Approve = 1,
    Review = 3,
    Contribute = 4,
    View = 7
) default View
enforced ["Process Roles"];

# Enum without default (must be explicitly initialized)
define enum OrgStructRole (
    DivisionLead,
    DepartmentLead,
    Expert,
    Architect
) enforced ["Organizational Structure"];

# PascalCase members — recommended naming convention
define enum OrderStatus (Pending, Confirmed, Shipped, Delivered, Cancelled);
```

**A. Standards reference:**

- ISO/IEC 11404 (Language-independent datatypes — conceptual alignment)
- RFC 8949 (CBOR null / simple values encoding — canonical control markers)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.


# 2.1.8 Fixed String Class

Fixed strings represent **inline, fixed-capacity character sequences** stored entirely within the primitive envelope. Unlike heap-allocated, variable-length `string`, a `fixed string` has a **compile-time-declared byte capacity** and is treated as a primitive value — not a block, not a stream.

(A) A fixed string is declared with an explicit maximum capacity in bytes:

```
fixed string[N]
```

where `N` is the capacity in bytes, `1 ≤ N < 1024` (2^10).

(B) The actual content **MAY be shorter** than the declared capacity, but the storage reservation is always exactly `N` bytes. Unused trailing bytes **MUST be zero-filled**.

## 2.1.8.1 Designation

1. provide a **compact, inline string representation** for short textual values (labels, codes, identifiers, tags);
2. enable **fixed-width serialization** suitable for binary protocols, packed records, and deterministic layouts;
3. eliminate heap allocation and indirection for string values that fit within a known bound;
4. ensure **exact byte-size preservation** — the declared capacity MUST NOT expand or shrink upon assignment.

## 2.1.8.2 Normative properties

1. A `fixed string` **MUST declare an explicit capacity** `N` in bytes at compile time; `N` **MUST satisfy** `1 ≤ N < 1024`.
2. The declared capacity is **invariant** — it MUST NOT change at runtime, upon assignment, or during serialization.
3. Assignment of a value whose byte length **exceeds** `N` **MUST be rejected** at compile time or validation time; truncation is forbidden.
4. Assignment of a value whose byte length is **less than** `N` **MUST zero-fill the remaining trailing bytes**.
5. A `fixed string` **MUST serialize as exactly** `N` bytes — no length prefix, no variable encoding.
6. Character encoding **MUST be UTF-8**; implementations MUST NOT assume single-byte characters.
7. A `fixed string` **MUST NOT be implicitly converted** to or from `string`; any conversion MUST be explicit.
8. Comparison semantics **MUST compare the effective content only** (up to the first zero byte or `N`, whichever is shorter); trailing zero-fill MUST NOT affect equality.
9. A `fixed string` is a **primitive value** — it does not carry metadata, references, or envelope beyond the fixed byte array.
10. A `fixed string` **MUST NOT be used** for values that require unbounded or dynamically growing storage; use `string` (block type) instead.

## 2.1.8.3 Semantic role

1. Fixed strings act as **compact textual value carriers** where the maximum size is part of the type contract.
2. They enable deterministic binary layouts for records, protocol frames, and audit payloads without heap indirection.
3. Fixed strings participate in validation and enforcement semantics as primitive values with no behavior or authority.

## 2.1.8.4 Syntax

### 2.1.8.4.1 Declaration (normative)

```
# Fixed string field declaration (exact 32-byte capacity)
let code: fixed string[32] = "US-EAST-1";

# Fixed string in a record
define record Header
    property Tag: fixed string[8];
    property Label: fixed string[64];
end

# Explicit capacity — assignment must fit
let short: fixed string[4] = "OK";       # valid: 2 bytes + 2 zero-fill
let exact: fixed string[4] = "STOP";     # valid: 4 bytes, no zero-fill
# let overflow: fixed string[4] = "OVERFLOW"; ← compile-time error
```

### 2.1.8.4.2 AST Grammar

> The AST grammar defined below is intentionally **representational**, not implementation-exhaustive.

```
<fixed_string_type> ::=
    "fixed" "string" "[" <capacity> "]"

<capacity> ::=
    <integer_literal>       # 1 ≤ value < 1024

<fixed_string_declaration> ::=
    "let" <identifier> ":" <fixed_string_type> "=" <string_literal> ";"
```

**A. Standards reference:**

- ISO/IEC 9899 (C fixed-width character arrays — conceptual alignment)
- ISO/IEC 14882 (C++ `std::array<char, N>` — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, and **serialization rules** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.


# 2.1.9 Binary Encoding Rules for Primitives

This section defines the **normative binary serialization and parsing rules** for all primitive types. These rules are mandatory and apply uniformly across runtimes, transports, persistence layers, and replay environments.

## 2.1.9.1 Canonical encoding principles

1. All primitive values **MUST serialize deterministically** into a single canonical binary representation.
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

## 2.1.9.2 Integer encoding

1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).
4. Parsers **MUST reject** any integer payload whose length does not exactly match the declared width.

## 2.1.9.3 Floating-point and decimal encoding

1.  `float` and `double` **MUST be encoded according to IEEE 754 binary formats**.
2. `decimal` **MUST be encoded using a canonical base-10 representation** preserving declared precision and scale.
3. Parsers **MUST NOT normalize, round, or reinterpret** floating-point or decimal values beyond declared encoding rules.

## 2.1.9.4 Boolean encoding

1. Boolean values **MUST be encoded as a single canonical value** representing `true` or `false`.
2. Any non-canonical or multi-bit boolean encoding **MUST be rejected**.

## 2.1.9.5 Temporal encoding

1. `timestamp` **MUST be encoded as UTC-based epoch time** with explicitly declared unit (milliseconds unless otherwise specified in ANNEX A).
2. `date` and `time` **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics.
3. `timespan` **MUST be encoded as an exact duration value**, independent of calendar semantics.

## 2.1.9.6 Identifier encoding

1. Identifiers (`guid`, `riid`) **MUST be encoded as fixed-width binary values** with no embedded delimiters, formatting, or textual normalization.
2. Parsers **MUST NOT infer ordering, timestamps, or structure** from identifier binary layouts unless explicitly defined by the identifier type.

## 2.1.9.7 Generic Rules encoding

Each primitive represents an **indirection to another value** and preserves the full envelope and semantic identity of the referenced concrete type.

### 2.1.9.8 Normative rules

1. `FORMAT_FLAGS` encode **security, compression, and reference semantics**.
2. Type Data **MAY** contain:
   - (a) an **inlined value** (if the referenced concrete type fits within 48 bits), **OR**
   - (b) an **offset / reference** to an external value.
3. The referenced value **MUST** carry its own **Envelope** and **MUST** follow its own encoding rules.
4. When Type Data contains an **offset reference**:
   - (a) Bits [47..16] store a **32-bit unsigned offset** from the start of the current Envelope;
   - (b) Bits [15..0] are **Reserved** and **MUST be 0**;
   - (c) The referenced value **MUST begin** at the specified offset and **MUST start with its own Envelope**.
5. When Type Data contains an **inlined value**:
   - (a) All 48 bits store the actual value of the referenced primitive or block;
   - (b) Bits [5..3] of `FORMAT_FLAGS` **MUST encode the reference mode**:
     - (i) `0` — inline value;
     - (ii) `1` — offset reference;
   - (iii) `2–7` — reserved.

6. Security classification bits [2..0] in `FORMAT_FLAGS` **apply to the serialized value**

**A. Type Data bit layout for `any` (48 bits)**
```
  47                              16 15          0
  +--------------------------------+--------------+
  |        Offset (uint32)          |  Reserved   |
  +--------------------------------+--------------+
```

**B. When offset-based reference is used:**
- (a) Bits [47..16] : Unsigned 32-bit offset (bytes) from start of current Envelope
- (b) Bits [15..0] : MUST be 0

```
  47                                               0
  +------------------------------------------------+
  |           Inlined referenced value             |
  +------------------------------------------------+
```

**C. When inline representation is used:**
- All 48 bits store the actual value

These layouts are **mutually exclusive** and are selected according to the rules defined in this section.



**D. Deterministic inlining rule (normative)**\
A primitive value **MAY be inlined if and only if** all of the following conditions are met:

1. Its canonical size **≤ 48 bits (6 bytes)**;
2. Its `TYPE_CODE` **permits inlining** according to **ANNEX A**.

If these conditions are satisfied, the implementation **MAY** choose to inline the value. Otherwise, the value **MUST** be encoded externally.

This rule guarantees that encoding is deterministic and parsing is unambiguous.

**E. External primitives:**\
A primitive value **MUST** be stored externally when its canonical binary width exceeds 48 bits.

Typical external primitives include:

- `int64` (`long`), `uint64` (`ulong`)
- `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`

**F. Normative properties:**

1. Position: immediately after the 64-bit Envelope;
2. Layout: canonical binary representation of the primitive;
3. Alignment: follows platform ABI requirements (typically 8-byte aligned);
4. Endianness: platform-native unless explicitly constrained by context;
5. The Envelope **Type Data field MUST be set to zero** unless otherwise specified by the concrete primitive definition.

**G. Example (illustrative):**

```
[ Envelope (64 bits) ] [ double value bytes (8 bytes) ]
```

## 2.1.9.9 Parser obligations

This section defines the **normative parsing algorithm and validation requirements** for primitive values. All steps defined below **MUST** be performed in the specified order. Deviations, shortcuts, or heuristic parsing are prohibited.

### 2.1.9.9.1 Parsing algorithm (normative)

When parsing a primitive value, an implementation **MUST** execute the following steps sequentially:

**Step 1 — Read Envelope**

1. Read the 64-bit Envelope.
2. Extract `CATEGORY` from the Meta Header.
3. `CATEGORY` **MUST** equal `00` (Primitive). Otherwise, raise a validation error: **"Not a primitive type"**.

**Step 2 — Check TYPE_CODE**

1. Extract `TYPE_CODE` from the Meta Header.
2. Validate `TYPE_CODE` against **ANNEX A.3 (Primitive Types)**.
3. If `TYPE_CODE` is in the range `0x16–0x1F`, raise a validation error: **"Reserved type code"**.

**Step 3 — Handle FORMAT_FLAGS**

1. Interpret `FORMAT_FLAGS` according to the resolved primitive type:
   - (a) For `enum`: resolve the enumeration definition using the **Enum Identifier** encoded in `FORMAT_FLAGS`.
   - (b) For `any`: interpret `FORMAT_FLAGS` as **security, compression, and reference indicators** as defined in **ANNEX B**.
2. If `FORMAT_FLAGS` contain bits not permitted for the resolved primitive type, raise a validation error: **"Invalid format flags"**.

**Step 4 — Determine size**

1. Determine the canonical encoded size using `TYPE_CODE` and **ANNEX A.3**.

**Step 5 — Read value**

1. Apply primitive-specific parsing rules as follows.

**(i). Special handling — enum**

1. Extract the **Enum ID** from `FORMAT_FLAGS` (bits `[7..0]`).
2. Resolve the enumeration definition from the registry.
3. Determine the actual encoded size (1–64 bytes) according to the resolved enum definition.

**(ii) Special handling — any**

1. Parsing of `any` **MUST** follow the rules defined in **ANNEX B.4.1** and **MUST be delegated** to that specification.
2. If the referenced value canonical size **≤ 6 bytes (48 bits)**:
   - (a) Read the value from the **Type Data** field;
   - (b) Convert the 48-bit **little-endian** value to the native representation;
   - (c) Advance the input pointer by **8 bytes** (Envelope only).
3. If the referenced value canonical size **> 6 bytes**:
   - (a) Skip the 8-byte Envelope;
   - (b) Read the next *Size* bytes as the primitive value;
   - (c) Advance the input pointer by **(8 + Size)** bytes.

**Step 6 — Apply security checks**

1. Security and classification bits extracted from `FORMAT_FLAGS` (and optional Security Context, if present) **MUST** be validated against the current execution and domain context.
2. Parsing **MUST NOT proceed** if a security or classification violation is detected.

### 2.1.9.9.2 Validation error conditions (normative)

An implementation **MUST** raise a validation error under any of the following conditions:

1. `CATEGORY ≠ 00` → **"Not a primitive type"**;
2. `TYPE_CODE` in range `0x16–0x1F` → **"Reserved type code"**;
3. `FORMAT_FLAGS` contain bits not permitted for the resolved primitive → **"Invalid format flags"**;
4. Security or classification constraints are violated → **"Security context mismatch"**.

## 2.1.9.9 Semantic guarantees

1. primitive values are **fully portable** across runtimes and languages;
2. serialized data is **replay-safe and audit-safe**;
3. enforcement, hashing, and evidence pipelines operate over **stable, machine-verifiable representations**.

> **Normative reference:** Canonical binary encoding rules are aligned conceptually with **RFC 8949 (CBOR)** and **ISO/IEC 11404**, but E.L.I.A. defines its own mandatory canonical form as specified above.

## 2.1.9.10 Performance Implications

This section describes **normative and practical performance considerations** related to the choice between **inline** and **external** primitive representations. These implications **DO NOT alter semantic meaning**, but **SHOULD** inform schema design, layout decisions, and performance optimization strategies.

### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

**A. Characteristics:**

1. Zero allocation overhead — the value is fully contained within the Envelope.
2. Cache-friendly access pattern — a single cache line read is sufficient.
3. Atomic read/write is guaranteed at the Envelope level.
4. Minimal indirection and branch-free parsing.
5. No additional payload traversal is required.

**B. Typical examples:**
- `bool`, `uint8` (`byte`)
- `int16` (`short`), `uint16` (`ushort`)
- `int32` (`int`), `uint32` (`uint`), `float`, `date`
- Small enum values (≤ 48 bits)

**(C) Recommended usage:**

1. High-frequency fields.
2. Hot-path evaluation (rules, follow conditions, guards).
3. Identifiers, flags, counters, and compact state markers.

### 2.1.9.10.2 External primitives (> 48 bits)

**A. Characteristics:**
1. Require reading additional bytes beyond the Envelope.
2. MAY incur allocation, buffer access, or indirect memory reads.
3. Increased likelihood of cache misses compared to inline primitives.
4. Atomicity of read/write is platform- and ABI-dependent.
5. Payload access MAY require alignment handling.

**B. Typical examples:**
- `int64` (`long`), `uint64` (`ulong`), `double`
- `decimal`
- `timestamp`, `time`, `timespan`
- `guid`, `riid`

**C. Recommended usage:**
1. Large numeric values.
2. High-precision arithmetic.
3. Temporal and identifier values where extended width is semantically required.

### 2.1.9.10.3 Optimization guideline (normative recommendation)

When designing records and event payloads:

1. Frequently accessed primitive fields **SHOULD** be declared first.
2. Fields that are eligible for inlining **SHOULD** be arranged so that they are materialized within the first 48 bits of their respective Envelopes.
3. This maximizes inline representation opportunities and improves cache locality.
4. These guidelines enable predictable performance characteristics **WITHOUT compromising semantic correctness, determinism, or type safety**.



# 2.1.10 Type Compatibility and Conversion Rules (Normative)

This section defines the **complete type compatibility matrix** for all E.L.I.A. types. It governs which types can be assigned, converted, or passed as arguments without violating semantic safety. All rules in this section are **normative** and **MUST** be enforced at compile time.

## 2.1.10.1 Fundamental Principles

1. E.L.I.A. is a **strictly typed** language. No implicit type conversions are permitted between distinct types.
2. **Identity assignment** (`T → T`) is always permitted for all materialized types.
3. **Nullable widening** (`T → T?`) is permitted for all materialized types. Assigning a non-nullable value to a nullable target preserves the value and marks it as present.
4. **Nullable narrowing** (`T? → T`) is **FORBIDDEN** without an explicit null-check or guard. The compiler MUST verify that a null-check precedes the assignment on all code paths.
5. **Explicit conversion** requires a declared conversion operator or function. The compiler MUST verify that a valid conversion path exists at compile time.
6. **Forbidden conversion** means no conversion path exists — neither implicit nor explicit. The compiler MUST reject any attempt.
7. All conversion rules apply uniformly to: variable assignment, parameter passing, return value binding, and field initialization.

## 2.1.10.2 Primitive Type Compatibility Matrix

### 2.1.10.2.1 Assignment (Implicit)

The only permitted implicit assignments are **identity** and **nullable widening**:

| From → To | Same type `T` | Nullable `T?` | `any` | All other types |
|-----------|:---:|:---:|:---:|:---:|
| Value of type `T` | ✓ | ✓ | ✓ ¹ | ✗ |
| Value of type `T?` | ✗ ² | ✓ | ✓ ¹ | ✗ |
| `null` | ✗ | ✓ | ✓ | ✗ |

> ¹ Boxing into `any` preserves the concrete type envelope but erases enforcement (see A.3, code `0x15`).
> ² Requires explicit null-check guard; see §2.1.10.1(4).

### 2.1.10.2.2 Explicit Conversion — Numeric Types

| From \ To | `int8` | `int16` | `int32` | `int64` | `uint8` | `uint16` | `uint32` | `uint64` | `float` | `double` | `decimal` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `int8`    | —  | W  | W  | W  | S  | S+W | S+W | S+W | P  | P  | E  |
| `int16`   | N  | —  | W  | W  | S+N | S  | S+W | S+W | P  | P  | E  |
| `int32`   | N  | N  | —  | W  | S+N | S+N | S  | S+W | P  | P  | E  |
| `int64`   | N  | N  | N  | —  | S+N | S+N | S+N | S  | P  | P  | E  |
| `uint8`   | S  | W  | W  | W  | —  | W  | W  | W  | P  | P  | E  |
| `uint16`  | S+N | S  | W  | W  | N  | —  | W  | W  | P  | P  | E  |
| `uint32`  | S+N | S+N | S  | W  | N  | N  | —  | W  | P  | P  | E  |
| `uint64`  | S+N | S+N | S+N | S  | N  | N  | N  | —  | P  | P  | E  |
| `float`   | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | —  | W  | P  |
| `double`  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | N  | —  | P  |
| `decimal` | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | ✗  | P  | P  | —  |

**Legend:**
- **W** — Widening: always safe, no data loss. Requires explicit cast.
- **N** — Narrowing: may overflow/truncate. Requires explicit cast + runtime range check.
- **S** — Signedness change: requires explicit cast.
- **S+W** / **S+N** — Signedness + widening/narrowing combined.
- **P** — Precision loss possible. Requires explicit cast.
- **E** — Exact: integer → decimal is lossless but requires explicit cast.
- **✗** — Forbidden: no conversion path exists (float/double → integral types).
- **—** — Identity: same type, no conversion needed.

### 2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives

| From \ To | `bool` | `string` | `fixed string[N]` | `date` | `time` | `timestamp` | `timespan` | `guid` | `riid` | `enum` |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `bool`    | —  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `string`  | ✗  | —  | T | R | R | R | R | R | ✗ | R |
| `fixed string[N]` | ✗ | C | — | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| `date`    | ✗  | F  | ✗ | — | ✗ | D→T | ✗ | ✗ | ✗ | ✗ |
| `time`    | ✗  | F  | ✗ | ✗ | — | ✗ | ✗ | ✗ | ✗ | ✗ |
| `timestamp` | ✗ | F | ✗ | T→D | T→Ti | — | ✗ | ✗ | ✗ | ✗ |
| `timespan` | ✗ | F | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ | ✗ |
| `guid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ | ✗ |
| `riid`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — | ✗ |
| `enum`    | ✗  | F  | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | — ³ |
| Numeric ⁴ | ✗ | F | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

**Legend:**
- **F** — Format: explicit string formatting. Always safe.
- **R** — Parse: explicit string parsing. May fail at runtime (parse error).
- **C** — Copy with capacity check: `fixed string[N]` → `string` always safe; `string` → `fixed string[N]` requires length ≤ N (compile-time if literal, runtime otherwise).
- **T** — Truncation conversion: `string` → `fixed string[N]` when length ≤ N.
- **D→T** — Date-to-timestamp: requires explicit timezone/offset context.
- **T→D** — Timestamp-to-date: extracts date component. Requires explicit timezone.
- **T→Ti** — Timestamp-to-time: extracts time-of-day component. Requires explicit timezone.
- **✗** — Forbidden: no conversion path exists.
- **—** — Identity.

> ³ Enum-to-enum conversion is forbidden unless both enums share the same underlying type and the conversion is explicitly declared.
> ⁴ Numeric types include all integral, float, double, and decimal types.

### 2.1.10.2.4 Special / Control Type Rules

| Type | Assignable to | Assignable from | Explicit conversion | Notes |
|------|---------------|-----------------|---------------------|-------|
| `null` | `T?` (any nullable) | — | None | Represents absence. Not a type, but a value. |
| `void` | — | — | None | Non-materialized. Cannot be assigned, stored, or transported. Signature-only. |
| `nothing` | — | — | None | Non-materialized. Represents non-applicability. Cannot be assigned or stored. |
| `any` | via explicit unbox | any `T` | Unbox to concrete `T` | Boxing preserves type; unboxing requires explicit cast. Erases enforcement. |

## 2.1.10.3 Block Type Compatibility

| From \ To | `string` | `bytes` | `base64` | `beN` / `leN` | `tuple` |
|-----------|:---:|:---:|:---:|:---:|:---:|
| `string`  | — | E | E | ✗ | ✗ |
| `bytes`   | E | — | E | S | ✗ |
| `base64`  | E | E | — | ✗ | ✗ |
| `beN`/`leN` | ✗ | S | ✗ | — ⁵ | ✗ |
| `tuple`   | ✗ | ✗ | ✗ | ✗ | — ⁶ |

**Legend:**
- **E** — Encoding conversion: explicit, reversible (e.g., string ↔ base64 ↔ bytes).
- **S** — Size-checked reinterpretation: `bytes` ↔ `beN`/`leN` requires matching width.
- **✗** — Forbidden.
- **—** — Identity.

> ⁵ `beN` ↔ `leN` conversion requires explicit endianness swap; forbidden implicitly.
> ⁶ Tuple compatibility requires identical arity and element-wise type compatibility.

## 2.1.10.4 Derived Type Compatibility

### 2.1.10.4.1 Record

1. Record assignment is **nominal** (by declared type name), not structural.
2. A record value of type `A` is assignable to a variable of type `B` **only if** `A` is the same type as `B` or `A` inherits from `B` (via `extends`).
3. Derived records that **redefine** inherited fields break compatibility with the base type (see §2.5, rule (d)).
4. Two records with identical field sets but different type names are **NOT assignable** to each other.

### 2.1.10.4.2 Array and Typed Array

1. `array of T` is assignable to `array of T` (identity only).
2. `array of T` is **NOT assignable** to `array of U` even if `T` is assignable to `U` (arrays are **invariant**).
3. `typed array` follows the same invariance rule.

### 2.1.10.4.3 Collection and Dictionary

1. `collection of T` is assignable to `collection of T` (identity only).
2. `dictionary of (K, V)` is assignable to `dictionary of (K, V)` (identity only).
3. Collections and dictionaries are **invariant** in their element/key-value types.

### 2.1.10.4.4 Class and Interface

1. A `class` instance is assignable to a variable typed as any `interface` that the class implements.
2. A `class` instance is assignable to a variable typed as its base class (if inheritance is declared).
3. `interface` variables accept any class that satisfies the interface contract.
4. Cross-class assignment between unrelated classes is **FORBIDDEN**.

### 2.1.10.4.5 Error and Event

1. `error` types follow the same inheritance rules as records: derived error → base error is permitted.
2. `event` types are **invariant**: `event A` is assignable only to `event A`.

## 2.1.10.5 Semantic Type Compatibility

Semantic types (`definition`, `domain`, `data interface`, `semantic interface`, `delegate`) are **non-materialized** and do not participate in value assignment. They are referenced by name only.

1. Semantic types **MUST NOT** appear on the right-hand side of an assignment statement.
2. Semantic types **MUST NOT** be passed as parameters to methods, actions, or flows.
3. Semantic types **MUST NOT** be stored in variables, fields, or containers.
4. The only permitted operations on semantic type references are: declaration, enforcement linkage (`enforced`/`enforces`), and compile-time resolution.

## 2.1.10.6 Normative Rules

| # | Rule | Class | Error Code |
|---|------|-------|:---:|
| TYP-010 | Identity assignment (`T → T`) is always permitted for materialized types. | MUST | — |
| TYP-020 | Nullable widening (`T → T?`) is always permitted for materialized types. | MUST | — |
| TYP-030 | Nullable narrowing (`T? → T`) MUST be preceded by an explicit null-check on all code paths. Unguarded nullable narrowing is a compilation error. | MUST | E2101 |
| TYP-040 | Implicit type conversion between distinct types is FORBIDDEN. Any cross-type assignment MUST use an explicit conversion operator. | MUST NOT | E2102 |
| TYP-050 | Explicit conversion MUST use a declared conversion operator or built-in conversion function. The compiler MUST verify that a valid conversion path exists. | MUST | E2103 |
| TYP-060 | Numeric coercion of boolean values is FORBIDDEN. `0 ≠ false`, `1 ≠ true`. | MUST NOT | E2104 |
| TYP-070 | Conversion between mutually exclusive control types (`null`, `void`, `nothing`) is FORBIDDEN. | MUST NOT | E2105 |
| TYP-080 | Cross-identifier conversion (`guid` ↔ `riid`) is FORBIDDEN, even explicitly. | MUST NOT | E2106 |
| TYP-090 | Float/double → integral conversion is FORBIDDEN. Integral → float/double requires explicit cast and acknowledges precision loss. | MUST NOT | E2107 |
| TYP-100 | Record assignment follows nominal typing. Structural equivalence does not constitute type compatibility. | MUST | E2108 |
| TYP-110 | Container types (`array`, `collection`, `dictionary`) are invariant in their element types. Covariant or contravariant assignment is FORBIDDEN. | MUST NOT | E2109 |
| TYP-120 | Assigning a semantic type (definition, domain, interface, delegate) to a variable or parameter is FORBIDDEN. | MUST NOT | E2110 |
| TYP-130 | Boxing into `any` erases enforcement guarantees. Unboxing from `any` MUST use explicit type assertion and MUST restore the concrete type's enforcement context. | MUST | E2111 |

## 2.1.10.7 Cross-reference Summary

| Topic | Reference |
|-------|-----------|
| Integral normative properties (no implicit widening) | §2.1.1.2 |
| Decimal ↔ float/double conversion rules | §2.1.2.2 |
| Boolean coercion prohibition | §2.1.3, §3.21 (LIT-120) |
| Temporal cross-type conversion prohibition | §2.1.4.2 |
| Identifier conversion prohibition | §2.1.5.2 |
| Special/control type semantics | §2.1.6.1 |
| Fixed string ↔ string conversion | §2.1.8.2 |
| `any` type semantics and enforcement erasure | ANNEX A (code 0x15) |
| Derived type inheritance and compatibility | §2.5 |
| Record interface implementation | §2.6 |
| Block ↔ stream promotion/demotion | ANNEX A §A.9 |
| Compilation error catalog | ANNEX G |
