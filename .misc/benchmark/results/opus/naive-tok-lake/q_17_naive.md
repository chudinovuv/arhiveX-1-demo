# q_17 — B-007 — What parser obligations does E.L.I.A. define for primitive type binary decoding?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the parser obligations for primitive type binary decoding are defined in **§2.1.9.9 Parser obligations**. Here are the normative requirements:

## Parser Obligations (§2.1.9.9)

### 1. **Envelope Validation** (§2.1.9.9)
- Parsers **MUST** validate CATEGORY and TYPE_CODE against **ANNEX A — Type Registry**
- **MUST** verify the envelope structure before attempting to decode the payload

### 2. **Parsing Algorithm** (§2.1.9.9.1)
The parser **MUST** follow these steps:
1. Read and validate the envelope metadata
2. Determine payload location (inline ≤ 48 bits or external > 48 bits)
3. Extract the raw payload bytes
4. Apply type-specific decoding rules
5. Validate the decoded value against declared constraints

### 3. **Validation Error Conditions** (§2.1.9.9.2)
Parsers **MUST** reject and generate typed errors for:
- Invalid envelope structure or checksums
- TYPE_CODE not registered in ANNEX A
- Payload size mismatches
- Values outside declared ranges
- Malformed encodings (e.g., invalid UTF-8 in char types)
- Endianness violations

### 4. **Type-Specific Obligations**

**Integer types** (§2.1.9.2):
- **MUST** validate sign extension for signed types
- **MUST** enforce range constraints for each integer width

**Floating-point/Decimal** (§2.1.9.3):
- **MUST** use IEEE 754 for float32/float64
- **MUST** preserve exact decimal representation for decimal types

**Boolean** (§2.1.9.4):
- **MUST** accept only 0x00 (false) or 0x01 (true)
- Any other value **MUST** be rejected

**Temporal types** (§2.1.9.5):
- **MUST** validate epoch offsets and precision
- **MUST** enforce calendar/timezone constraints

**Identifiers** (§2.1.9.6):
- **MUST** validate structural format (GUID/UUID/RIID)
- **MUST** verify byte order and version bits

### 5. **Deterministic Failure** (§2.1.9.9)
- On any violation, the parser **MUST fail deterministically**
- **MUST surface a typed error** suitable for audit and enforcement pipelines
- **MUST NOT** attempt partial recovery or guessing

### 6. **Performance Considerations** (§2.1.9.10)
- For inline primitives (≤ 48 bits): parsers **SHOULD** optimize for single-read extraction (§2.1.9.10.1)
- For external primitives (> 48 bits): parsers **MUST** handle separate payload reads (§2.1.9.10.2)

The specification emphasizes that these obligations ensure **deterministic, canonical decoding** across all platforms and runtimes, with no platform-dependent variations permitted.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 757
- tokens_total: 783
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 24.9
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_17_naive.md
