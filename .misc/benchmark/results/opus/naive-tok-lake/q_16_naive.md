# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the specification, identifier values (guid, riid) are encoded in binary according to the rules in §2.1.9.6:

**GUID Encoding:**
- **Storage**: 16 bytes (128 bits) in **little-endian byte order**
- **Format**: Standard UUID binary format as per RFC 4122
- **Envelope**: Uses TYPE_CODE `0x16` with CATEGORY = Primitive

**RIID Encoding:**
- **Storage**: 16 bytes (128 bits) in **big-endian byte order** 
- **Format**: Binary UUID format per RFC 4122
- **Envelope**: Uses TYPE_CODE `0x17` with CATEGORY = Primitive

The key differences are:
1. **Byte order**: GUID uses little-endian (Windows/.NET compatible), RIID uses big-endian (network byte order)
2. **Type codes**: GUID is `0x16`, RIID is `0x17`

Both identifiers:
- Are wrapped in the standard E.L.I.A. Type Metadata Envelope (§2.1.9.1, Annex B)
- Have their 16-byte payload immediately following the envelope header
- Must conform to RFC 4122 binary UUID format
- Are treated as **fixed-size primitives** (always exactly 16 bytes)

The specification notes these are "**external primitives**" (>48 bits) per §2.1.9.10.2, meaning they cannot be inlined within the envelope and always require the full 16-byte payload to follow the envelope header.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 373
- tokens_total: 402
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 14.4
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_16_naive.md
