# Render: Q11 — B-001 (B-001)

## Extracted Content

### search_spec({"keyword":["Integral","integer types","bit width"],"onto":"WHAT","intent":"full","indexRanking":["phya","sema"],"maxUnits":3,"filter":true,"budget":3500,"tier":"adaptive","autoExpand":true,"verbose":"none"})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9.2
## 2.1.9.2 Integer encoding
1. Integral primitives **MUST be encoded using fixed-width binary representation** corresponding exactly to their declared bit width.
2. Signed integers **MUST use two’s-complement representation**.
3. Byte order **MUST be big-endian** unless explicitly overridden by a block-level declaration (`beN`, `leN`).

Γû╕ [T1] 2.1.1
# 2.1.1 Integral Class
Integral primitives represent fixed-width integer values with deterministic size, signedness, and binary representation. They are used for counters, identifiers, flags, protocol fields, offsets, and other numerically exact values where rounding is forbidden. All integral primitives are platform-independent and serialize canonically. This class is represented by the following types:

Γû╕ [T1] 2.1.1.1
## 2.1.1.1 Designation

Γû╕ [T1] 2.1.1.3
## 2.1.1.3 Semantic role
1. Integral primitives act as **exact numeric truth carriers**, forming the base layer of quantitative representation.
2. They support enforcement, validation, and audit by guaranteeing **precision, determinism, and replay safety**.
3. Integrals provide a stable numeric substrate upon which identifiers, enums, flags, and protocol-level constructs are safely built.

Γû╕ [T2] 2.1
# 2.1 Primitive Types

Γû╕ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.

Γû╕ [T2] 2.1.1.2/all
## 2.1.1.2 Normative properties

1. Integral primitives **MUST have fixed and explicitly declared bit width** and signedness.
2. Integral primitives **MUST serialize canonically** with deterministic byte ordering and width preservation.
3. Integral primitives **MUST NOT permit implicit widening, narrowing, or signedness conversion**; any conversion MUST be explicit and type-safe.
4. Arithmetic operations on integral primitives **MUST be exact**; overflow or underflow **MUST be explicitly defined** (error, saturation, or wrap-around) and MUST NOT be implicit.
5. Integral comparison semantics **MUST be strict and deterministic**; cross-width or cross-signedness comparison is forbidden without explicit conversion.
6. Integral primitives **MUST NOT encode semantic meaning beyond numeric value** and **MUST NOT introduce behavior or authority**.


Γû╕ [T2] 2.1.9.6
## 2.1.9.6 Identifier encoding

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**


[... TRUNCATED — 646 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 666/3500 tokens, trimmed from 646]
```

### read_chain({"chains":["2.1.1/all"],"detail":"complete","budget":5000,"autoExpand":true})
```
Γû╕ 2.1.1/all
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




[Tokens: ~709]
```

## Budget
- Tool calls: 2
- Total response chars: 5594
