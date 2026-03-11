# q_3 — A-003 — What are the normative differences between RAW String and RAW Binary stream types?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here are the normative differences between RAW String and RAW Binary stream types:

## 1. **Semantic Interpretation**
- **RAW String** (§2.3.2): Acts as a **textual transport surface** that preserves text encoding semantics
- **RAW Binary** (§2.3.3): Acts as a **pure binary transport surface** with no semantic interpretation beyond raw byte delivery

## 2. **Encoding Requirements**
- **RAW String** (§2.3.2.3.1): **MUST preserve declared text encoding semantics** (e.g., UTF-8) across streaming boundaries
- **RAW Binary** (§2.3.3.3): **MUST NOT expose structure, ordering semantics, or interpretation** beyond raw byte delivery

## 3. **Validation Capabilities**
- **RAW String** (§2.3.2.3.1): **MUST allow incremental decoding and validation** without requiring full materialization
- **RAW Binary** (§2.3.3.3): **MUST support incremental consumption and validation** but only for binary payload integrity, not content structure

## 4. **Special Encoding Support**
- **RAW String** (§2.3.2.3.2): Explicitly supports **Base64 encoding** as a transport encoding with specific normative rules
- **RAW Binary**: No special encoding support mentioned - treats all content as opaque bytes

## 5. **Semantic Data Binding Behavior**
- **RAW String** (§2.3.2.4): **MUST expose only sequential binary or textual stream operations** despite being textual
- **RAW Binary** (§2.3.3.4): **MUST expose only binary stream operations** limited to sequential read, forward-only consume, stream forwarding

## 6. **Content Restrictions**
- **RAW String** (§2.3.2.3.1): **MUST NOT introduce semantic interpretation beyond textual representation**
- **RAW Binary** (§2.3.3.3): **MUST NOT encode behavior, control flow, or execution semantics**

## 7. **Maximum Materialized Size**
Both types share the same constraint:
- **MUST enforce a maximum materialized in-memory size of 2,147,483,647 bytes (~2 GiB)** when explicitly converted to a bounded block (§2.3.2.3.1 and §2.3.3.3)

## 8. **Interface Generation**
Both types:
- **MUST NOT generate CRUD semantics**, field-level accessors, record-oriented operations, or schema-driven projections (§2.3.2.4 and §2.3.3.4)
- **MUST NOT be treated as iterable structured data** for semantic interface generation

The key distinction is that RAW String maintains text encoding semantics and supports text-specific transport encodings like Base64, while RAW Binary is completely opaque with no interpretation of its content whatsoever.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 23
- tokens_out: 710
- tokens_total: 733
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 23.0
- model: opus
- runner: v0.8
- run_id: 2026-03-09T21-24-19
- saved_to: opus/naive/q_3_naive.md
