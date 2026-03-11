# 2.2 Blocks

Block types are used to model **opaque or structurally fixed or dynamic data payloads** whose internal representation is either intentionally hidden or strictly defined at the binary level. Their primary purpose is to enable **safe serialization, transport, cryptographic processing, storage, and replay** of data that must remain **immutable, atomic, and behavior-free** across all boundaries.

> This section establishes the normative scope and intent of Block Types, defining their ontological role and core constraints within the type system. It intentionally does not exhaustively specify serialization mechanics, security-context handling, or cross-border transfer semantics, which are defined normatively in **ANNEX B — Type Metadata Envelope** and **ANNEX A — Type Registry** and must be read in conjunction with this section.

## 2.2.0.1 Designation

1. Represent opaque or structural **limited layout of data payloads** whose internal structure is either intentionally hidden or strictly defined at the binary level;
2. Enable safe handling of **raw binary artefacts**, bounded textual payloads, fixed-layout binary structures, and externally defined formats;
3. Provide a controlled boundary between **semantic data models** and **physical serialization reality**;
4. Ensure that data requiring cryptographic processing, persistence, transport, or replay remains behavior-free and semantically isolated.
5. Ensure **controlled, canonical serialization** strictly driven by declared type metadata or an explicit boxed envelope, without introducing alternative encoding or semantic interpretation.

## 2.2.0.2 Normative properties

1. Each block type **MUST belong to a block class** that explicitly defines:

   - (a) the permitted processing model (opaque handling, fixed-layout interpretation);
   - (b) the admissible set of operations (equality, transport, encryption, hashing, persistence);
   - (c) canonical rules of serialization, validation, and boundary enforcement;
   - (d) enforced physical size constraints.

2. All block values **MUST comply with a mandatory physical length limit of 26-bit** (2^26 − 1 bytes), establishing an upper bound on materialized block size.

3. The 26-bit length constraint **MUST be enforced by construction** and **MUST NOT** be bypassed via composition, wrapping, or serialization tricks.

4. All Block types **MUST NOT** encode business logic, control flow, or executable behavior.

5. Auto-promotion Block→Stream. Such promotion is a re-qualification of type from block to stream types with losing all normative properties mandatory to block types. Brief description of promotion below, but more detailed read in ANNEX.  Minimal requirements for auto promotion at processing/mutation/declaration:

   - (a) Size > 2²⁶-1 bytes
   - (b) Binding to data interface over stream
   - (c) Unbounded cardinality into collection/dictionary
   - (d) declaration does not sealed with block statement

6. Auto promotion conditions Stream→Block possible only for block-materialized  by design types

   - (a) Full materialization bounded 
   - (b) Explicit policy resolution 
   - (c) Security context preservation
   - (d) enforcement and explanation context preservation

7. Block-capable derived types are **block-materialized by default**. When the effective physical size exceeds **2^26 − 1 bytes**, the representation **MUST** be resolved deterministically according to the declared constraints:

   - (a) **Block-only declaration (block)**— the value **MUST NOT** be stream-materialized. If the effective size reaches or exceeds **2^26 − 1 bytes**, the compiler/runtime **MUST generate an error** at construction, mutation, or serialization/deserialization.
   - (b) **Stream-eligible declaration (no block)** — the value **MUST be stream-materialized** once the effective size exceeds **2^26 − 1 bytes**. In this mode, **block-specific constraints no longer apply**, and **stream semantics apply instead**. The `SIZE_LIMITED_26BIT` flag **MUST be set to 0** during mutation and serialization/deserialization.
   - (c) **Record** — records are **non-scalable by design** and **MUST NOT** transition to Stream representation. A record value **MUST NOT exceed** **2^26 − 1 bytes**; exceeding this limit **MUST generate an error** at construction, mutation, or serialization/deserialization. 

> **WARN**: It is not recommended to have large nested array declarations in a record. Instead, declare an array type and assign the array type to the property.



## 2.2.0.3 Semantic role

1. Block types act as **atomic physical truth carriers**, anchoring semantic data to concrete binary representation.
2. They provide a safe substrate for **cryptographic operations, audit evidence, persistence, and replay** without leaking structure or behavior into the semantic layer.
3. Block classes define the enforcement boundary where **physical constraints (size, layout, encoding)** become semantically observable and verifiable.
4. Block types act as the **bridge between semantic data models and physical binary reality**. They enable the language to safely represent binary and textual artefacts while preserving determinism and auditability.

Block values are valid subjects of enforcement, classification, encryption, and audit, while remaining strictly non-behavioral and semantically inert.

> **Normative reference:** Canonical block classes, type codes, size semantics (including the 26-bit length constraint), and encoding rules are defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.
## 2.2.0.4 String Type Hierarchy

The language defines three distinct string representations whose semantics, constraints, and materialization models **MUST NOT be conflated**:

| Type | Category | Max size | Serialization | Auto-scale | Section |
|------|----------|----------|---------------|------------|---------|
| `fixed string[N]` | Primitive | 1 ≤ N < 1024 bytes | Exactly N bytes, zero-filled | **No** — size is fixed at declaration | §2.1.8 |
| `string[N]` | Opaque block | N ≤ 2^26 − 1 bytes | Length-prefixed, variable | **No** — bounded by declared N | §2.2.1 |
| `string` (unbounded) | Block / Stream | Up to 2^26 − 1 as block | Length-prefixed, variable | **Yes** — auto-promotes to Stream when size exceeds block limit | §2.2.0.2 (5) |

**A. Normative distinctions:**

1. `fixed string[N]` is a **primitive type** (§2.1.8): capacity is declared at definition time, serialized representation is always exactly N bytes (UTF-8, zero-padded), no length prefix, no auto-scaling. Suitable for fixed-layout records and protocol headers.

2. `string[N]` is an **opaque block type** (§2.2.1): capacity is bounded by the declared N up to the 26-bit block limit, serialized with a length prefix, payload is variable-length UTF-8. No promotion to Stream is permitted — exceeding N **MUST be rejected**.

3. `string` (without capacity) is a **block-materialized type by default** that **MUST auto-promote to Stream** once the effective payload exceeds 2^26 − 1 bytes (§2.2.0.2, normative property 5).

4. Explicit conversion **MUST** be used when moving values between string tiers. Implicit coercion between `fixed string[N]`, `string[N]`, and `string` is **forbidden**.


# 2.2.1 Opaque blocks class

Opaque block types represent **indivisible, immutable binary payloads** with explicitly declared or limited with 26-bits size semantics. They are used to carry raw or encoded data whose internal structure is intentionally outside the scope of the language semantics.

**A. This class is represented by**:

- `bytes` — raw uninterpreted binary payload.
- `beN` — fixed-size big-endian binary block (network byte order).
- `leN` — fixed-size little-endian binary block (platform-native layouts).
- `base64` — textual Base64-encoded binary payload for safe transport.
- `string` (bounded) — UTF-8 encoded text block with explicit size.

## 2.2.1.1 Designation

1. carry **binary or textual payloads whose internal structure is intentionally opaque** to the semantic layer;
2. enable safe transport and persistence of **externally defined or pre-encoded data** without reinterpretation;
3. provide a strict semantic boundary where **no field-level, element-level, or structural access is permitted**;
4. support cryptographic sealing, hashing, and evidence preservation over uninterpreted payloads.

## 2.2.1.2 Normative properties

1. Opaque blocks **MUST NOT expose internal structure**, iteration, slicing, or field-level access beyond raw byte equality.
2. Opaque blocks **MUST support only bitwise equality comparison and cryptographic hashing**; no ordering, arithmetic, or semantic comparison operations are permitted.
3. Endianness (`beN`, `leN`) **MUST be explicitly declared by the type** and **MUST NOT** be inferred or reinterpreted implicitly.
4. Textual opaque blocks (`string`, `base64`) **MUST NOT** imply semantic text processing beyond encoding validity and declared size constraints.
5. Opaque blocks **MUST NOT** be partially materialized or lazily interpreted; they are always handled as complete atomic payloads.
6. Opaque block values **MUST be treated as single atomic values** and **MUST NOT** expose iteration, mutation, traversal, or behavioral semantics.
7. Opaque Block types **MUST be immutable** after materialization.

## 2.2.1.3 Semantic role

1. Opaque blocks act as **semantic black boxes**, allowing the system to reason about existence, identity, and integrity of data without understanding its content.
2. They provide a safe carrier for **foreign formats, encrypted data, signatures, and evidence artefacts**.
3. Opaque blocks enforce a clear separation between **physical data custody** and **semantic interpretation**, preventing accidental meaning leakage or implicit behavior.

Opaque blocks serialize canonically and are treated as atomic values in records and streams.

## 2.2.1.4 Syntax

### 2.2.1.4.1 Declaration (Normative)

Not Applicable

### 2.2.1.4.2 AST Grammar

The AST grammar defined below is intentionally **representational**, not implementation-exhaustive. Its purpose is to identify and formalize the **essential syntactic nodes and structural relationships** required to construct a valid primitive, rather than to mirror the exact grammar used by any specific compiler or runtime provider.

```
<big_endian_type> ::=
    "be" "[" <integer_literal> "]"

<little_endian_type> ::=
    "le" "[" <integer_literal> "]"

<bounded_string_type> ::=
    "string" "[" <integer_literal> "]"

<binary_literal> ::=
    <bytes_literal> |
    <hex_literal> |
    <base64_literal> |
    <be_literal> |
    <le_literal>

<bytes_literal> ::=
    "bytes" "(" [<byte_value_list>] ")"

<hex_literal> ::=
    'b"' <hex_string> '"'

<base64_literal> ::=
    'b64"' <base64_string> '"' |
    "base64" "(" <string_literal> ")"

<be_literal> ::=
    "be" "[" <integer_literal> "]" "(" <hex_value> ")"

<le_literal> ::=
    "le" "[" <integer_literal> "]" "(" <hex_value> ")"

<byte_value_list> ::=
    <hex_value> ("," <hex_value>)*

<hex_value> ::=
    "0x" <hex_digit>+

<hex_string> ::=
    <hex_digit>+ (" " <hex_digit>+)*

<base64_string> ::=
    <base64_char>+ "="*

<integer_literal> ::=
    <digit>+
```

### 2.2.1.4.3 Canonical Syntax

```
# Raw bytes (variable length)
let data: bytes = bytes(0x48, 0x65, 0x6C, 0x6F);
let hex: bytes = b"48 65 6C 6F";  # Hex literal

# Big-endian fixed blocks
let be2Val: be[2] = be[2](0x1234);
let be4Val: be[4] = be[4](0x12345678);
let be8Val: be[8] = be[8](0x123456789ABCDEF0);
let be16Val: be[16] = be[16](0x00112233445566778899AABBCCDDEEFF);

# Little-endian fixed blocks
let le2Val: le[2] = le[2](0x1234);
let le4Val: le[4] = le[4](0x12345678);
let le8Val: le[8] = le[8](0x123456789ABCDEF0);
let le16Val: le[16] = le[16](0x00112233445566778899AABBCCDDEEFF);

# Base64-encoded binary
let encoded: base64 = b64"SGVsbG8gV29ybGQ=";
let decoded: base64 = base64("SGVsbG8gV29ybGQ=");

# Bounded string (UTF-8)
let msg: string[256] = "Message up to 256 bytes";
let title: string[64] = "Title";

# Record with binary fields
define record NetworkPacket
    property Version: be[2];           # 2-byte version (big-endian)
    property Length: be[4];            # 4-byte length (big-endian)
    property Payload: bytes;           # Variable-length payload
    property Checksum: be[4];          # 4-byte checksum (big-endian)
end explained as "Network packet with big-endian header";
```

**A. Standards reference:**

- ISO/IEC 10646 (Unicode / UTF-8 for `string`)
- RFC 4648 (Base64 encoding)
- RFC 8949 (CBOR byte and text string encoding — conceptual alignment)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.





# 2.2.2 Structural block class

Structural blocks mainly represent **derived types** with **schema-defined, immutable data compositions** built from primitives and block values. They define explicit structure, typing, and layout, while remaining strictly non-behavioral. Structural containers are the primary carriers of **semantic data shape** within the system.

**A. This class is represented by**:

1. `record` — a named, ordered set of typed fields forming a fixed structural schema. The `record` is a **derived type** that is **block-materialized by default** and **MUST NOT exceed** the 2^26-1 byte limit. Exceeding this limit **MUST result in a compile-time or materialization error**.
  
    **Note:** Detailed normative constraints, declaration rules, and syntax for record as derived structural types are specified in Section 2.5 Derived Types — Record and should be consulted in conjunction with this section.


2. `array` and `derived arrays`  — an ordered collection of homogeneous elements with explicit element type. Arrays are **derived types** and are **block-materialized by default**; when their effective serialized size exceeds the 26-bit block limit, they **MUST transition to Stream representation** automatically.
  
    **Note:** Detailed normative constraints, declaration rules, and syntax for arrays as derived structural types are specified in Section 2.5 Derived Types — Array/Derived Array and should be consulted in conjunction with this section.


3. `dictionary` — a key–value container with explicitly typed keys and values, used for associative access where field names are not fixed at design time. Dictionaries are **derived types** and are **block-materialized by default**; exceeding the 26-bit size limit **forces promotion to a Stream type**.
  
    **Note:** Detailed normative constraints, declaration rules, and syntax for dictionary as derived structural types are specified in **Section 2.5 Derived Types — Dictionary**  and should be consulted in conjunction with this section.


4. `collection` — a homogeneous, unordered container used to model sets or bags of elements without positional semantics. Collections are **derived types** that **default to block semantics** and **MUST scale into Stream types** once the physical size constraint is exceeded.
  
    **Note:** Detailed normative constraints, declaration rules, and syntax for collections as derived structural types are specified in **Section 2.5 Derived Types — Collection** and should be consulted in conjunction with this section.


5. **Specialized embedded types**, which are structurally fixed, language-defined data carriers used to represent system-level facts and references. This includes, in a non-exhaustive manner: `event` (an immutable record of an occurrence), `error` (a structured representation of a failure or violation), `reference` (an embedded pointer to a person, external system, or resource artefact with internal paragraph- or anchor-level addressing), as well as other language-defined fact carriers. These types are treated as structural blocks and participate in the same canonical serialization and enforcement model.

## 2.2.2.0.1 Designation

1. model **explicit data shape and composition** through declarative structural schemas;
2. provide a deterministic, inspectable representation of complex domain data without embedding behavior;
3. enable validation, enforcement, and audit tooling to reason about field presence, types, and constraints;
4. act as the canonical form for persistence, transport, and semantic referencing of structured data.

## 2.2.2.0.2 Normative properties

1. Structural containers **MUST be immutable** after construction; no in-place mutation is permitted.
2. Structural containers **MUST NOT** introduce behavior, execution semantics, or control flow.
3. Field layout, ordering, and typing **MUST be explicitly declared** and **MUST serialize canonically**.
4. `record` fields **MUST be uniquely named** and resolved deterministically; duplicate or ambiguous field resolution is forbidden.
5. `array` and typed arrays **MUST enforce homogeneous element type** and deterministic ordering.
6. `dictionary` **MUST enforce declared key and value types** and **MUST NOT** assume ordering unless explicitly defined by the type.
7. `collection` **MUST NOT expose positional semantics** and **MUST NOT** rely on ordering for meaning.

## 2.2.2.0.3 Semantic role

1. Structural containers act as **semantic data frames**, giving shape and meaning to raw values without executing logic.
2. They form the primary substrate for domain facts, evidence structures, and policy-relevant data models.
3. Structural containers enable clear separation between **data structure** and **behavioral intent**, supporting deterministic enforcement and auditability.

**A. Standards reference:**

- ISO/IEC 11404 (Language-independent datatypes — structured types)
- ISO/IEC 19505 (UML data structures — conceptual alignment)
- RFC 8949 (CBOR arrays and maps — canonical serialization model)

> **Type registry linkage:** The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry** and interpreted through **ANNEX B — Type Metadata Envelope**.


# 2.2.3 Special Block Formats

*Reserved for future specification.*


# 2.2.4 Binary Encoding Rules for Block Types

This section defines the **normative binary encoding model** for all Block Types. Encoding rules are **deterministic, canonical, and envelope-driven**, ensuring identical binary representation across platforms, runtimes, and languages.

**A. Encoding rules**:
1. All block values **MUST be serialized using the Envelope model** defined in **ANNEX B — Type Metadata Envelope**.

2. The Envelope **MUST encode**:
   - (a) CATEGORY = Block;
   - (b) the concrete TYPE_CODE of the block type;
   - (c) applicable FORMAT_FLAGS (e.g. compression, encryption, size-limited semantics);
   - (d) the declared or effective block length.

3. Block payload bytes **MUST follow immediately after the Envelope** and **MUST NOT** include padding, implicit alignment, or platform-dependent headers.

4. Canonical byte order:
   - `beN` blocks **MUST use big-endian** encoding;
   - `leN` blocks **MUST use little-endian** encoding;
   - `bytes`, `string`, and `base64` **MUST preserve declared byte order exactly as provided**.

5. For textual blocks:

   - `string` payload **MUST be valid UTF-8**;
   - `base64` payload **MUST be valid RFC 4648 Base64**;
   - no normalization, collation, or locale-dependent transformation is permitted.

6. Any block value whose effective size exceeds **2²⁶ − 1 bytes** **MUST NOT be encoded as a Block** and **MUST be represented as a Stream type**.


## 2.2.4.1 Parser Obligations

Parsers, decoders, and runtime loaders **MUST enforce the following obligations** when handling Block Types:

1. Validate CATEGORY and TYPE_CODE against **ANNEX A — Type Registry**.

2. Validate declared or encoded block length against:

   - envelope size fields;
   - SIZE_LIMITED_26BIT constraint;
   - enclosing structural context (record, array, tuple).

3. Reject any block payload that:
   - violates declared encoding rules;
   - exceeds permitted size limits;
   - contains malformed UTF-8 or Base64 where applicable.

4. Parsers **MUST NOT attempt to interpret or partially decode** opaque block payloads beyond validation.

5. On violation, the parser **MUST fail deterministically** and **MUST surface a typed error** suitable for audit and enforcement pipelines.



## 2.2.4.2 Performance Implications

Block Types are explicitly designed for **predictable, low-overhead handling**.

**A. Performance characteristics:**

1. Block values are **single-allocation artefacts**; no element-level allocation or traversal is required.

2. Equality, hashing, encryption, and transport operations **operate over contiguous memory regions**, enabling efficient implementation.

**B. Absence of internal semantics allows:**

- zero-copy transport where permitted by the runtime;
- direct cryptographic processing;
- stable hashing without semantic re-interpretation.

C. Size limits prevent pathological memory pressure and uncontrolled amplification during serialization or persistence.

D. Compared to structural containers (`record`, `array`), block types:

- minimize allocation count;
- avoid schema traversal;
- provide superior cache locality and predictable latency.

These properties make Block Types suitable for **high-throughput, boundary-heavy, and audit-sensitive pipelines**, including cryptography, evidence handling, persistence, and inter-domain transport.

