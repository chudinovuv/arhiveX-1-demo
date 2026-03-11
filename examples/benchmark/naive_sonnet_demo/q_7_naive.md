# q_7 — A-007 — What are the stream metadata and interface obligations for stream types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on §2.3.0.4 Stream Metadata and Interface Obligations, E.L.I.A. defines the following normative requirements for stream types:

## Stream Metadata Requirements

1. **Governing Data Interface**: Every stream value **MUST be associated with a governing data interface** that declares:
   - Admissible operations
   - Access mode (read-only / writable)  
   - Enforcement scope

2. **Length Handling**: Stream metadata **MUST allow unknown or open-ended length**. Any declared length:
   - **MAY be advisory** only
   - **MUST NOT imply full materialization**

3. **Transport Separation**: Chunking, segmentation, or incremental delivery **MUST be treated as a transport concern** and **MUST NOT affect semantic interpretation** of the stream payload.

## Interface Obligations

4. **Explicit Materialization Contract**: A data interface **MUST explicitly declare** whether and how a stream MAY be materialized into a bounded block, including:
   - Size limits
   - Validation rules

5. **Observable Operations**: Any stream materialization **MUST be an explicit, observable operation** subject to:
   - Enforcement
   - Audit
   - Failure semantics

6. **Default Non-Materialization**: In the absence of an explicit materialization contract, streams **MUST be treated as non-materializable by default**.

## Additional Context

From §2.3.0.2, streams have a default size limit of 2^48 bytes with the `SIZE_LIMITED_26BIT` flag always set to 0, indicating they are not subject to the standard block size constraints.

The interface obligations ensure that stream processing remains controlled and auditable, preventing unsafe materialization while maintaining deterministic behavior through explicit contracts rather than implicit assumptions.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 410
- tokens_total: 437
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 11.5
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_7_naive.md
