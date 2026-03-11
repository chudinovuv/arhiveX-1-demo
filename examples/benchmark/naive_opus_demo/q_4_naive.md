# q_4 — A-004 — Why does E.L.I.A. enforce a 2 GiB maximum for RAW Binary materialization?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, RAW Binary enforces a 2 GiB (2,147,483,647 bytes) maximum for materialization for the following reason:

According to §2.3.3.3 (Normative properties), point 5:

> "RAW Binary **MUST enforce a maximum materialized in-memory size of 2 147 483 647 bytes (~2 GiB)** when explicitly converted to a bounded block. This limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory byte buffers and arrays are constrained by signed 32-bit indexing semantics."

The same constraint applies to RAW String, as stated in §2.3.2.3.1, point 5:

> "RAW String **MUST enforce a maximum materialized size of 2 147 483 647 bytes (~2 GiB)**. This limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory string and buffer representations are constrained by signed 32-bit indexing semantics."

In summary, E.L.I.A. enforces this 2 GiB limit to ensure compatibility with mainstream programming platforms that use signed 32-bit integers for array/buffer indexing, where the maximum positive value is 2^31 - 1 = 2,147,483,647 bytes.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 32
- tokens_out: 385
- tokens_total: 417
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 13.3
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_4_naive.md
