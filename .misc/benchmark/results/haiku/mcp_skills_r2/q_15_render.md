# Render: Q15 — B-005 (B-005)

## Extracted Content

### search_spec({"keyword":["temporal encoding","date time binary","primitive types encoding"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema","bhva"],"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9.5
## 2.1.9.5 Temporal encoding

Γû╕ [T1] 2.1.4
# 2.1.4 Date/Time Class

Γû╕ [T1] 2.1.4.1
## 2.1.4.1 Designation

Γû╕ [T1] 2.1.4.2
## 2.1.4.2 Normative properties

Γû╕ [T1] 2.1.4.3
## 2.1.4.3 Semantic role

Γû╕ [T1] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

Γû╕ [T4] 2.1.9.8/E.
**E. External primitives:**\

Γû╕ [T2] 2.1
# 2.1 Primitive Types

Γû╕ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


[... TRUNCATED — 188 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 208/3500 tokens, trimmed from 188]
```

### read_chain({"chains":["2.1.9.5","2.1.4"],"detail":"detailed","autoExpand":true,"budget":6000})
```
Γû╕ 2.1.9.5
## 2.1.9.5 Temporal encoding
1. `timestamp` **MUST be encoded as UTC-based epoch time** with explicitly declared unit (milliseconds unless otherwise specified in ANNEX A).
2. `date` and `time` **MUST be encoded using fixed, locale-independent representations** derived from ISO 8601 semantics.
3. `timespan` **MUST be encoded as an exact duration value**, independent of calendar semantics.

Γû╕ 2.1.4
# 2.1.4 Date/Time Class
Date and time primitives represent temporal facts and durations with explicit semantics and canonical representation. They are used to model calendar dates, wall-clock times, absolute instants, and elapsed durations in a way that is unambiguous, timezone-safe, and suitable for audit and legal traceability. This class is represented by:

[Tokens: ~194]
```

### read_chain({"chains":["2.1.4.2","2.1.4.3"],"detail":"detailed","autoExpand":true,"budget":6000})
```
Γû╕ 2.1.4.2
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

Γû╕ 2.1.4.3
## 2.1.4.3 Semantic role
1. Date/time primitives act as **temporal truth carriers**, making temporal interpretation explicit and inspectable.
2. They enable enforcement and audit tooling to reason about time-bound obligations deterministically (e.g., effective/deprecated dates, retention and evidence timelines).
3. They provide a stable temporal substrate that prevents hidden timezone and locale drift from silently altering meaning.

[Tokens: ~456]
```

### read_chain({"chains":["2.1.9"],"detail":"detailed","autoExpand":true,"budget":6000})
```
Γû╕ 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives
This section defines the **normative binary serialization and parsing rules** for all primitive types. These rules are mandatory and apply uniformly across runtimes, transports, persistence layers, and replay environments.

[Tokens: ~70]
```

### read_chain({"chains":["2.1.9/all"],"detail":"complete","autoExpand":true,"budget":8000})
```
Γû╕ 2.1.9/all
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




[Tokens: ~2982]
```

## Budget
- Tool calls: 5
- Total response chars: 15772
