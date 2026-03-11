# q_17 — B-007 — What parser obligations does E.L.I.A. define for primitive type binary decoding?

## MCP Calls
### Call 1: search_spec
- params: {"keyword":["parser obligations","primitive type","binary decoding"],"onto":"HOW","intent":"normative_rules","indexRanking":["bhva","phya","desa"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true}
- response_chars: 945

### Call 2: read_chain
- params: {"chains":["2.1.9.9","2.1.9.8"],"budget":3500,"autoExpand":true}
- response_chars: 1312

### Call 3: read_chain
- params: {"chains":["2.1.9.9.1","2.1.9.9.2"],"budget":3500,"autoExpand":true}
- response_chars: 329

### Call 4: read_chain
- params: {"chains":["2.1.9.9/all"],"budget":5000,"autoExpand":true}
- response_chars: 3212

### Call 5: read_chain
- params: {"chains":["2.1.9.1"],"budget":3500,"autoExpand":true}
- response_chars: 552

## Raw MCP Output
### search_spec({"keyword":["parser obligations","primitive type","binary decoding"],"onto":"HOW","intent":"normative_rules","indexRanking":["bhva","phya","desa"],"maxUnits":2,"budget":3500,"filter":true,"verbose":"none","tier":"adaptive","autoExpand":true})
```

═══ CONTENT ═══
▸ [T1] 2.1.9
# 2.1.9 Binary Encoding Rules for Primitives
This section defines the **normative binary serialization and parsing rules** for all primitive types. These rules are mandatory and apply uniformly across runtimes, transports, persistence layers, and replay environments.

▸ [T1] 2.1.9.1
## 2.1.9.1 Canonical encoding principles

▸ [T2] 2.1.9.9
## 2.1.9.9 Parser obligations

▸ [T2] 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)

▸ [T2] 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)

▸ [T2] 2.1.9.8
### 2.1.9.8 Normative rules

▸ [T2] 2.1.9.8/A.
**A. Type Data bit layout for `any` (48 bits)**


─── MISSING CONTENT ───
The following sections have no backing file in current/. Content is absent — skip these chains.
  ✗ 2.4.1
  ✗ 2.4.1.1
  ✗ 2.4.1.2
  ✗ 2.4.1.3

[Tokens: ~204] [SUFFICIENT: 70% filtered — remaining content covers the query. Additional read_chain calls unlikely to add value.]
```

### read_chain({"chains":["2.1.9.9","2.1.9.8"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.9
## 2.1.9.9 Parser obligations
This section defines the **normative parsing algorithm and validation requirements** for primitive values. All steps defined below **MUST** be performed in the specified order. Deviations, shortcuts, or heuristic parsing are prohibited.

▸ 2.1.9.8
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

[Tokens: ~325]
```

### read_chain({"chains":["2.1.9.9.1","2.1.9.9.2"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.9.1
### 2.1.9.9.1 Parsing algorithm (normative)
When parsing a primitive value, an implementation **MUST** execute the following steps sequentially:

▸ 2.1.9.9.2
### 2.1.9.9.2 Validation error conditions (normative)
An implementation **MUST** raise a validation error under any of the following conditions:

[Tokens: ~79]
```

### read_chain({"chains":["2.1.9.9/all"],"budget":5000,"autoExpand":true})
```
▸ 2.1.9.9/all
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


[Tokens: ~800]
```

### read_chain({"chains":["2.1.9.1"],"budget":3500,"autoExpand":true})
```
▸ 2.1.9.1
## 2.1.9.1 Canonical encoding principles
1. All primitive values **MUST serialize deterministically** into a single canonical binary representation.
2. Serialization **MUST be bijective**: decoding the serialized form **MUST always** reconstruct the original primitive value without loss of information.
3. Canonical encoding **MUST NOT depend on platform architecture**, CPU endianness, word size, locale, or runtime configuration.
4. No primitive **MAY have more than one valid binary encoding** for the same semantic value.

[Tokens: ~135]
```

## Answer
Теперь у меня есть полная картина парсерных обязательств. Могу дать исчерпывающий ответ.

# Parser Obligations for Primitive Type Binary Decoding in E.L.I.A.

E.L.I.A. defines comprehensive **normative parsing requirements** for primitive type binary decoding in §2.1.9.9. These obligations are mandatory and apply uniformly across all runtimes, transports, persistence layers, and replay environments.

## Mandatory Sequential Parsing Algorithm

All implementations **MUST** execute the following six-step algorithm in the specified order (§2.1.9.9.1). Deviations, shortcuts, or heuristic parsing are **prohibited**:

### Step 1 — Read Envelope
- Read the 64-bit Envelope
- Extract `CATEGORY` from the Meta Header
- `CATEGORY` **MUST** equal `00` (Primitive)
- **Error condition**: If not primitive → raise "Not a primitive type"

### Step 2 — Check TYPE_CODE
- Extract `TYPE_CODE` from the Meta Header
- Validate against **ANNEX A.3 (Primitive Types)**
- **Error condition**: If `TYPE_CODE` is in range `0x16–0x1F` → raise "Reserved type code"

### Step 3 — Handle FORMAT_FLAGS
- For `enum`: resolve enumeration definition using Enum Identifier from `FORMAT_FLAGS`
- For `any`: interpret as security, compression, and reference indicators per **ANNEX B**
- **Error condition**: If `FORMAT_FLAGS` contain unauthorized bits → raise "Invalid format flags"

### Step 4 — Determine Size
- Calculate canonical encoded size using `TYPE_CODE` and **ANNEX A.3**

### Step 5 — Read Value
- Apply primitive-specific parsing rules
- **Special handling for `enum`**: Extract Enum ID from `FORMAT_FLAGS` bits [7..0], resolve definition, determine actual size (1–64 bytes)
- **Special handling for `any`**: Follow **ANNEX B.4.1** rules, handle inlined values (≤48 bits) vs. external references (>48 bits) differently

### Step 6 — Apply Security Checks
- Validate security and classification bits from `FORMAT_FLAGS` against current execution and domain context
- **MUST NOT proceed** if security violations are detected

## Mandatory Error Conditions

Implementations **MUST** raise validation errors for (§2.1.9.9.2):

1. `CATEGORY ≠ 00` → **"Not a primitive type"**
2. `TYPE_CODE` in reserved range `0x16–0x1F` → **"Reserved type code"**  
3. Invalid `FORMAT_FLAGS` for the resolved primitive → **"Invalid format flags"**
4. Security constraint violations → **"Security context mismatch"**

## Canonical Encoding Requirements

The parser obligations are grounded in the canonical encoding principles (§2.1.9.1):

- **Deterministic serialization**: All primitives must serialize to exactly one canonical binary form
- **Bijective guarantee**: Decoding must always reconstruct the original value without information loss
- **Platform independence**: Encoding must not depend on architecture, endianness, word size, or runtime configuration
- **Uniqueness**: No primitive may have multiple valid encodings for the same semantic value

These obligations ensure consistent, secure, and deterministic primitive type processing across all E.L.I.A. implementations.

## Metrics
- calls_total: 5
- calls_llm: ?
- calls_search: ?
- calls_read: ?
- retries: 0
- tokens_in: 10701
- tokens_out: 1834
- tokens_total: 12535
- cache_read: 90282
- cache_creation: 0
- wall_time_sec: 31.8
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T02-24-10
- saved_to: haiku/mcp1_v2/q_17_mcp1_v2.md
