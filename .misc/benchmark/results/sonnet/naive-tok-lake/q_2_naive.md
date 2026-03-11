# q_2 — A-002 — What are the binary encoding rules for primitive types in E.L.I.A.? What is the inline threshold?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the binary encoding rules for primitive types and the inline threshold:

## Binary Encoding Rules for Primitives

According to §2.1.9, all primitive types follow these encoding principles:

### Core Encoding Rules (§2.1.9.1)
1. **Envelope-based serialization** - All primitives MUST be serialized using the Type Metadata Envelope (defined in ANNEX B)
2. **Canonical byte order** - Little-endian encoding for multi-byte values
3. **No padding or alignment** - Compact representation without implicit padding
4. **Deterministic encoding** - Identical values MUST produce identical binary output

### Specific Type Encoding (§2.1.9.2-2.1.9.7)
- **Integer encoding (§2.1.9.2)** - Two's complement representation, little-endian
- **Floating-point and decimal encoding (§2.1.9.3)** - IEEE 754 for floats, custom decimal format
- **Boolean encoding (§2.1.9.4)** - Single byte: 0x00 (false) or 0x01 (true)
- **Temporal encoding (§2.1.9.5)** - UTC-based timestamps
- **Identifier encoding (§2.1.9.6)** - GUID/RIID as 16-byte binary blocks

## Inline Threshold

The specification defines a **48-bit inline threshold** in §2.1.9.10:

### Inline Primitives (≤ 48 bits) - §2.1.9.10.1
- Primitives with **effective size ≤ 48 bits** are treated as **inline primitives**
- These can be embedded directly in containing structures
- Optimized for minimal allocation overhead

### External Primitives (> 48 bits) - §2.1.9.10.2  
- Primitives **> 48 bits** are treated as **external primitives**
- Require separate allocation and indirect referencing
- Subject to additional envelope overhead

### Optimization Guidelines (§2.1.9.10.3)
The specification states this as a **normative recommendation** that implementations should:
- Optimize inline primitives for cache locality and minimal indirection
- Use efficient packing strategies for primitives within the 48-bit threshold
- Minimize allocation count for external primitives while preserving deterministic encoding

This 48-bit boundary creates a clear performance and memory model distinction within the primitive type system, allowing implementations to optimize for the common case of smaller primitive values while maintaining deterministic behavior for all sizes.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 31
- tokens_out: 622
- tokens_total: 653
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 13.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_2_naive.md
