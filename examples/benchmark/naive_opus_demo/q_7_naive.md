# q_7 — A-007 — What are the stream metadata and interface obligations for stream types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the stream metadata and interface obligations are defined in §2.3.0.4 "Stream Metadata and Interface Obligations". Here are the normative requirements:

## Stream Metadata and Interface Obligations (§2.3.0.4)

1. **Mandatory Data Interface Association**: Every stream value **MUST be associated with a governing data interface** that declares:
   - Admissible operations
   - Access mode (read-only / writable)
   - Enforcement scope

2. **Length Declaration**: Stream metadata **MUST allow unknown or open-ended length**. Any declared length **MAY be advisory** and **MUST NOT imply full materialization**.

3. **Transport Transparency**: Chunking, segmentation, or incremental delivery **MUST be treated as a transport concern** and **MUST NOT affect semantic interpretation** of the stream payload.

4. **Materialization Contract**: A data interface **MUST explicitly declare** whether and how a stream MAY be materialized into a bounded block, including:
   - Size limits
   - Validation rules

5. **Observable Operations**: Any stream materialization **MUST be an explicit, observable operation** subject to:
   - Enforcement
   - Audit
   - Failure semantics

6. **Default Non-Materialization**: In the absence of an explicit materialization contract, streams **MUST be treated as non-materializable by default**.

## Additional Constraints from Related Sections

From §2.3.0.2 (Normative properties):
- Stream types **MUST NOT be materialized as bounded block values** unless explicitly converted via a data interface with size validation and enforcement
- Stream types **MUST be consumed sequentially** and **MUST NOT** expose random access, mutation, or in-place traversal semantics
- By default, the stream type is limited to 2^48 bytes and always has `SIZE_LIMITED_26BIT` set to 0

From §2.3.1.4 (Semantic Data Binding):
- When binding to a semantic data interface, the system **MUST evaluate Bit 7** (`IS_STRUCTURED`) from the Type Metadata Envelope
- If `IS_STRUCTURED = 1`, the interface **MAY generate structured access methods** (CRUD operations)
- If `IS_STRUCTURED = 0`, the interface **MUST expose only raw sequential access semantics**

These obligations ensure that streams maintain their role as controlled I/O surfaces with explicit boundaries and deterministic behavior.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 27
- tokens_out: 575
- tokens_total: 602
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 23.7
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_7_naive.md
