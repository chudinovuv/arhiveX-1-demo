# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, identifier values (guid, riid) are encoded in binary according to **§2.1.9.6 Identifier encoding**:

## Binary Encoding for Identifiers

**GUID encoding:**
- **Format**: RFC 4122 UUID binary representation
- **Size**: Exactly 16 bytes (128 bits)
- **Byte order**: Network byte order (big-endian)
- **Layout**: Standard UUID field layout as defined in RFC 4122

**RIID encoding:**
- **Format**: RFC 4122 UUID binary representation  
- **Size**: Exactly 16 bytes (128 bits)
- **Byte order**: Network byte order (big-endian)
- **Additional constraint**: Must conform to the riid semantic structure for resource identification

## General Encoding Principles

According to **§2.1.9.1 Canonical encoding principles**, all identifier encodings must be:

1. **Deterministic** - identical logical values produce identical binary representations
2. **Platform-independent** - same encoding across all systems
3. **Canonical** - single valid encoding for each value
4. **Standards-compliant** - follows RFC 4122 for UUID structure

## Parser Obligations

Per **§2.1.9.9 Parser obligations**, parsers must:

- Validate that identifier payloads are exactly 16 bytes
- Verify RFC 4122 format compliance for both guid and riid
- Enforce big-endian byte ordering
- Reject malformed or truncated identifier values

The encoding ensures that identifier values can be safely serialized, transported, and used for cryptographic operations while maintaining deterministic binary representation across all E.L.I.A. implementations.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 402
- tokens_total: 431
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 8.9
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_16_naive.md
