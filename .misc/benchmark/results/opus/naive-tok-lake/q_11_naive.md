# q_11 — B-001 — What specific integer types does the E.L.I.A. Integral class define and what are their bit widths?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the Integral class (§2.1.1) defines the following integer types with their bit widths:

**Signed integers:**
- `int8` - 8-bit signed integer
- `int16` - 16-bit signed integer  
- `int32` - 32-bit signed integer
- `int64` - 64-bit signed integer

**Unsigned integers:**
- `uint8` - 8-bit unsigned integer
- `uint16` - 16-bit unsigned integer
- `uint32` - 32-bit unsigned integer
- `uint64` - 64-bit unsigned integer

The specification explicitly states in §2.1.1 that the Integral class consists of **signed** (`int8`, `int16`, `int32`, `int64`) and **unsigned** (`uint8`, `uint16`, `uint32`, `uint64`) integers.

Additionally, the specification mentions in §2.0.9 (Primitive Type Aliases) that there are integral aliases including `byte` (alias for `uint8`) and potentially others, though the full list of aliases is noted as being in a section not fully loaded in the provided content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 279
- tokens_total: 311
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 8.3
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_11_naive.md
