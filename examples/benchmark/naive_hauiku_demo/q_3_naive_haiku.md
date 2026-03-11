# q_3 — A-003 — What are the normative differences between RAW String and RAW Binary stream types?

## Spec Files Pre-loaded (in context)
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the normative differences between RAW String and RAW Binary stream types are:

## Content and Encoding Semantics

**RAW String** (§2.3.2):
- **MUST preserve declared text encoding semantics** (e.g. UTF-8) across streaming boundaries (§2.3.2.3.1)
- **MUST allow incremental decoding and validation** without requiring full materialization (§2.3.2.3.1)
- For Base64 encoding: **MUST be treated strictly as a transport encoding**, not as semantic transformation, with **deterministic decode semantics** (§2.3.2.3.2)

**RAW Binary** (§2.3.3):
- **MUST preserve binary payload integrity** across streaming and transport boundaries (§2.3.3.3)
- **MUST NOT expose structure, ordering semantics, or interpretation beyond raw byte delivery** (§2.3.3.3)

## Access and Interpretation Constraints

**RAW String** (§2.3.2):
- **MUST NOT expose random access, mutation, or in-place transformation semantics** (§2.3.2.3.1)
- **MUST NOT introduce semantic interpretation beyond textual representation** (§2.3.2.3.1)

**RAW Binary** (§2.3.3):
- **MUST NOT expose structure, ordering semantics, or interpretation beyond raw byte delivery** (§2.3.3.3)
- **MUST NOT encode behavior, control flow, or execution semantics** (§2.3.3.3)

## Materialization Size Limits

Both types share the **same materialization constraint**:
- **MUST enforce a maximum materialized in-memory size of 2,147,483,647 bytes (~2 GiB)** when explicitly converted to a bounded block
- This limit is **normatively dictated by backward-compatibility requirements** with existing programming language runtimes (§2.3.2.3.1, §2.3.3.3)

## Semantic Data Binding

Both types follow **identical binding rules** (§2.3.2.4, §2.3.3.4):
- **MUST be treated as non-structural stream surfaces** regardless of encoding or format
- **MUST expose only sequential stream operations** (read, forward-only consume, stream, transport)
- **MUST NOT generate CRUD semantics**, field-level accessors, or schema-driven projections
- **MUST NOT be treated as iterable structured data** for semantic interface generation

## Key Distinction

The fundamental difference is **semantic purpose**:
- **RAW String** is designed for **textual content** with encoding awareness and text-specific validation capabilities
- **RAW Binary** is designed for **pure binary transport** with no structural or textual interpretation whatsoever

Both act as **controlled I/O surfaces** governed by data interfaces, but RAW String maintains text encoding semantics while RAW Binary remains completely interpretation-agnostic.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 23
- tokens_out: 709
- tokens_total: 732
- cache_read: 26458
- cache_creation: 0
- wall_time_sec: 16.9
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T21-21-39
- saved_to: sonnet/naive/q_3_naive.md
