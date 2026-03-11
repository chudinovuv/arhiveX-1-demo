# q_4 — A-004 — Why does E.L.I.A. enforce a 2 GiB maximum for RAW Binary materialization?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
According to the E.L.I.A. specification, RAW Binary enforces a maximum materialized in-memory size of 2,147,483,647 bytes (~2 GiB) when explicitly converted to a bounded block due to **backward-compatibility requirements with existing programming language runtimes and ecosystems** (§2.3.3.3).

The specification states this limit is "**normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory byte buffers and arrays are constrained by signed 32-bit indexing semantics" (§2.3.3.3).

This same rationale and limit also applies to RAW String materialization (§2.3.2.3.1), indicating it's a consistent constraint across stream types that can be materialized into bounded blocks.

The key points are:

1. **Technical constraint**: Many existing runtime platforms use signed 32-bit integers for array/buffer indexing
2. **Interoperability**: E.L.I.A. needs to work with existing ecosystems like .NET and C++
3. **Materialization-specific**: This limit only applies when streams are explicitly converted to bounded blocks
4. **Safety mechanism**: Exceeding this limit "**MUST** result in validation failure or enforced truncation according to the governing data interface" (§2.3.3.3)

It's worth noting that this is specifically a *materialization* limit - RAW Binary as a stream can theoretically be larger, but cannot be safely converted to an in-memory block representation beyond this size due to platform constraints.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 384
- tokens_total: 416
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 11.4
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_4_naive.md
