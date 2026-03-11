# Render: Q17 — B-007 (B-007)

## Extracted Content

### search_spec({"keyword":["primitive type binary decoding","parser obligations"],"intent":"normative_rules","onto":"WHAT","indexRanking":["phya","bhva"],"filter":true,"tier":"adaptive","budget":3500,"autoExpand":true,"verbose":"none","maxUnits":3})
```

ΓòÉΓòÉΓòÉ CONTENT ΓòÉΓòÉΓòÉ
Γû╕ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives

Γû╕ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles

Γû╕ [T4] 2.1.9.8
### 2.1.9.8 Normative rules

Γû╕ [T4] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**

Γû╕ [T1] 2.1.9.9
## 2.1.9.9 Parser obligations

Γû╕ [T1] 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)

Γû╕ [T1] 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)

Γû╕ [T2] 2.1.9.10
## 2.1.9.10 Performance Implications

Γû╕ [T2] 2.1.9.10.1
### 2.1.9.10.1 **Inline primitives (≤ 48 bits)**

Γû╕ [T2] 2.1.9.10.2
### 2.1.9.10.2 External primitives (> 48 bits)

Γû╕ [T2] 2.1.9.10.3
### 2.1.9.10.3 Optimization guideline (normative recommendation)

Γû╕ [T2] 2.1
# 2.1 Primitive Types

Γû╕ [T2] 2.1/(A)
(A) Each primitive belongs to a **primitive class** that explicitly defines:

Γû╕ [T2] 2.1/(B)
(B) Primitive classes ensure that all operations on primitive data are deterministic, auditable, and semantically constrained by design.


[... TRUNCATED — 254 tokens exceeded budget of 3500. Use filter:true, extract, or lower maxUnits to reduce size.]
[Budget: 274/3500 tokens, trimmed from 254]
```

### read_chain({"chains":["2.1.9.9","2.1.9.9.1","2.1.9.9.2"],"detail":"complete","budget":5000})
```
Γû╕ 2.1.9.9
## 2.1.9.9 Parser obligations
This section defines the **normative parsing algorithm and validation requirements** for primitive values. All steps defined below **MUST** be performed in the specified order. Deviations, shortcuts, or heuristic parsing are prohibited.

Γû╕ 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)
When parsing a primitive value, an implementation **MUST** execute the following steps sequentially:

Γû╕ 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)
An implementation **MUST** raise a validation error under any of the following conditions:

[Tokens: ~150]
```

### read_chain({"chains":["2.1.9.9/all"],"detail":"complete","extract":"normative","budget":6000})
```
Γû╕ 2.1.9.9/all
**2.1.9.9 Parser obligations**
  [MUST] This section defines the **normative parsing algorithm and validation requirements** for primitive values. All steps defined below **MUST** be performed in the specified order. Deviations, shortcuts, or heuristic parsing are prohibited.

**2.1.9.9.1 Parsing algorithm (normative)**
  [MUST] When parsing a primitive value, an implementation **MUST** execute the following steps sequentially:
  [MUST] 3. `CATEGORY` **MUST** equal `00` (Primitive). Otherwise, raise a validation error: **"Not a primitive type"**.
  [MUST] 1. Parsing of `any` **MUST** follow the rules defined in **ANNEX B.4.1** and **MUST be delegated** to that specification.
  [MUST] 1. Security and classification bits extracted from `FORMAT_FLAGS` (and optional Security Context, if present) **MUST** be validated against the current execution and domain context.
  [MUST NOT] 2. Parsing **MUST NOT proceed** if a security or classification violation is detected.

**2.1.9.9.2 Validation error conditions (normative)**
  [MUST] An implementation **MUST** raise a validation error under any of the following conditions:


[Tokens: ~287]
```

### read_chain({"chains":["2.1.9.9.1/all","2.1.9.9.2/all"],"detail":"complete","budget":7000})
```
Γû╕ 2.1.9.9.1/all
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


Γû╕ 2.1.9.9.2/all
### 2.1.9.9.2 Validation error conditions (normative)

An implementation **MUST** raise a validation error under any of the following conditions:

1. `CATEGORY ≠ 00` → **"Not a primitive type"**;
2. `TYPE_CODE` in range `0x16–0x1F` → **"Reserved type code"**;
3. `FORMAT_FLAGS` contain bits not permitted for the resolved primitive → **"Invalid format flags"**;
4. Security or classification constraints are violated → **"Security context mismatch"**.


[Tokens: ~738]
```

## Budget
- Tool calls: 4
- Total response chars: 5916
