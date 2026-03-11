# q_17 — B-007 — What parser obligations does E.L.I.A. define for primitive type binary decoding?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification provided, there are no explicit parser obligations defined for primitive type binary decoding in the sections available.

The specification does define parser obligations, but only for **Block Types** in **§2.2.4.1 Parser Obligations**. These obligations include:

1. Validate CATEGORY and TYPE_CODE against ANNEX A — Type Registry
2. Validate declared or encoded block length against envelope size fields, SIZE_LIMITED_26BIT constraint, and enclosing structural context
3. Reject any block payload that violates declared encoding rules, exceeds permitted size limits, or contains malformed UTF-8 or Base64 where applicable
4. Must not attempt to interpret or partially decode opaque block payloads beyond validation
5. Must fail deterministically on violation and surface a typed error suitable for audit and enforcement pipelines

However, the specification sections provided (§2.2 Blocks and §2.3 Stream Types) do not contain information about primitive types or their specific parser obligations. The primitive types appear to be covered in a different section (likely §2.1) that is not included in the provided specification content.

To answer your question about primitive type binary decoding parser obligations, I would need access to the primitive types section of the specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 286
- tokens_total: 311
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 8.7
- model: sonnet
- runner: v0.8
- run_id: 2026-03-10T00-43-55
- saved_to: sonnet/naive/q_17_naive.md
