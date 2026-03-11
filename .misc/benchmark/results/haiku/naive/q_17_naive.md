# q_17 — B-007 — What parser obligations does E.L.I.A. define for primitive type binary decoding?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification provided, there are no parser obligations specifically defined for primitive type binary decoding in the sections included.

The specification only defines parser obligations for **Block Types** in §2.2.4.1, which states that parsers, decoders, and runtime loaders **MUST enforce the following obligations** when handling Block Types:

1. Validate CATEGORY and TYPE_CODE against **ANNEX A — Type Registry**
2. Validate declared or encoded block length against:
   - envelope size fields
   - SIZE_LIMITED_26BIT constraint  
   - enclosing structural context (record, array, tuple)
3. Reject any block payload that:
   - violates declared encoding rules
   - exceeds permitted size limits
   - contains malformed UTF-8 or Base64 where applicable
4. Parsers **MUST NOT attempt to interpret or partially decode** opaque block payloads beyond validation
5. On violation, the parser **MUST fail deterministically** and **MUST surface a typed error** suitable for audit and enforcement pipelines

However, the specification sections provided do not include coverage of primitive types (which would typically be found in a section like §2.1). The parser obligations in §2.2.4.1 are explicitly scoped to Block Types only, not primitive types.

To get the complete answer about primitive type parser obligations, you would need to consult the primitive types section of the specification (likely §2.1) which is not included in the provided content.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 344
- tokens_total: 369
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 9.2
- model: haiku
- runner: v0.8
- run_id: 2026-03-10T00-36-53
- saved_to: haiku/naive/q_17_naive.md
