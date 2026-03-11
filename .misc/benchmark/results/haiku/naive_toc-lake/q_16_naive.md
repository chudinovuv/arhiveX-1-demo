# q_16 — B-006 — How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Identifier Binary Encoding in E.L.I.A.

Based on the specification provided, **identifier encoding is defined in Section 2.1.9.6 — Identifier encoding**, but the detailed binary representation is not exhaustively specified in the loaded content.

However, the specification establishes the following normative framework:

## Normative Encoding Obligations (§2.1.9.6, §2.1.9.8)

1. **Identifiers are primitives** (§2.1.5 — Identifiers Class) belonging to the **Primitive Type Category** (CATEGORY = `00`).

2. All primitive type encoding **MUST follow the Canonical Encoding Principles** defined in §2.1.9.1, which establish:
   - Deterministic, platform-independent binary representation
   - Canonical byte order as declared by the type
   - Strict compliance with **ANNEX A — Type Registry** (which defines exact type codes, physical sizes, and value ranges)
   - Interpretation through **ANNEX B — Type Metadata Envelope** (which wraps all encoded values with category, type code, and format flags)

3. **Parser Obligations** (§2.1.9.9) **MUST**:
   - Validate the TYPE_CODE against ANNEX A for the identifier type
   - Enforce declared physical size constraints
   - Reject malformed identifier payloads deterministically

## Cross-Reference for Exact Binary Layout

The **precise binary structure** for GUID and RIID encoding (byte order, field layout, padding rules) is defined in:

- **ANNEX A — Type Registry** (§A.3 for primitives, specifically identifier codes)
- **ANNEX B — Type Metadata Envelope** (§B.2 for envelope wrapping and format flags)

These annexes are referenced as **normative** but their detailed content is not loaded in this context.

## Syntax Reference

Identifier literals are defined in §3.21.6 (GUID and RIID Literals), which covers **textual representation**, but the binary encoding mechanics defer to the envelope and registry model above.

**Bottom line:** The encoding is deterministic and canonical, but the exact byte-level specification requires consulting **ANNEX A and ANNEX B** directly.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 29
- tokens_out: 528
- tokens_total: 557
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 7.0
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_16_naive.md
