# q_15 — B-005 — How are temporal (Date/Time) values encoded at the binary level in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, temporal (Date/Time) values are encoded at the binary level as follows:

## Temporal Encoding Rules (§2.1.9.5)

The specification states that temporal encoding follows **"ISO 8601 binary representation with UTC normalization"** but does not provide the complete detailed encoding rules in the loaded sections.

## Key Constraints from Date/Time Class (§2.1.4)

The Date/Time primitive class has these normative properties that affect binary encoding:

1. **UTC Normalization Required**: All temporal values **MUST be normalized to UTC** before encoding (§2.1.4.2, property 2)

2. **Deterministic Serialization**: The encoding **MUST produce identical binary representations** for equivalent temporal values across different platforms and timezones (§2.1.4.2, property 3)

3. **Precision Preservation**: The encoding **MUST preserve the declared temporal precision** without loss (§2.1.4.2, property 4)

## General Binary Encoding Framework (§2.1.9)

All primitives, including temporal types, follow these canonical encoding principles (§2.1.9.1):

1. **Deterministic**: Identical values produce identical binary representations
2. **Platform-independent**: No endianness, alignment, or architecture dependencies  
3. **Canonical**: Single valid representation per logical value
4. **Envelope-driven**: All values are serialized using the Type Metadata Envelope model

## Type Registry Reference

The specification notes that the **exact binary format details** for temporal encoding are normatively defined in **ANNEX A — Type Registry** (§2.1.4.2), which is not included in the loaded sections.

## Standards Alignment

The temporal encoding aligns with **ISO 8601** for the logical representation and uses **UTC normalization** to ensure deterministic cross-timezone serialization, but the specific binary layout (byte order, field arrangement, precision encoding) would be found in the Type Registry annex.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 465
- tokens_total: 495
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 12.8
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_15_naive.md
