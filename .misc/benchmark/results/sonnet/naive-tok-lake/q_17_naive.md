# q_17 — B-007 — What parser obligations does E.L.I.A. define for primitive type binary decoding?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, parser obligations for primitive type binary decoding are defined in **§2.1.9.9 Parser obligations**, which establishes both algorithmic requirements and validation error conditions.

## Core Parser Obligations

**§2.1.9.9** defines that parsers, decoders, and runtime loaders **MUST enforce the following obligations** when handling primitive types:

### 1. Parsing Algorithm (§2.1.9.9.1)
The specification establishes a **normative parsing algorithm** that parsers must follow, though the detailed algorithm steps are not provided in the loaded sections.

### 2. Validation Error Conditions (§2.1.9.9.2) 
Parsers must handle **normative validation error conditions**, with specific error handling requirements that are referenced but not detailed in the available content.

### 3. Envelope Validation Requirements
From **§2.1.9.1 Canonical encoding principles**, parsers must:
- Validate that primitive values are encoded using the **Envelope model** defined in **ANNEX B — Type Metadata Envelope**
- Verify the **CATEGORY** field correctly identifies the value as a primitive type
- Validate the concrete **TYPE_CODE** against **ANNEX A — Type Registry**

### 4. Size and Layout Constraints
**§2.1.9.10** Performance Implications establishes two categories with different parser obligations:

- **Inline primitives (≤ 48 bits)**: Must handle values embedded directly in the envelope
- **External primitives (> 48 bits)**: Must handle values stored as separate payloads with envelope references

### 5. Type-Specific Validation
From the encoding rules in **§2.1.9.2** through **§2.1.9.8**, parsers must validate:
- **Integer encoding**: Proper byte order and range validation
- **Floating-point and decimal encoding**: IEEE compliance and precision handling  
- **Boolean encoding**: Valid true/false representation
- **Temporal encoding**: Valid date/time format compliance
- **Identifier encoding**: Proper GUID/RIID format validation

### 6. Error Handling Requirements
**§2.1.9.9** establishes that on validation failure, parsers **MUST**:
- Fail deterministically 
- Surface typed errors suitable for audit and enforcement pipelines
- Not attempt recovery or implicit conversion

The specification notes that detailed parsing algorithms and comprehensive error condition catalogs are provided in the normative sections, with cross-references to **ANNEX G — Compilation error codes** for specific error handling requirements.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 601
- tokens_total: 627
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 16.5
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_17_naive.md
