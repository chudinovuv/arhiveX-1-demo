# q_15 — B-005 — How are temporal (Date/Time) values encoded at the binary level in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
# Binary Encoding of Temporal (Date/Time) Values in E.L.I.A.

Based on the specification provided, **the exact binary encoding rules for temporal (Date/Time) values are normatively defined but not exhaustively detailed in the loaded sections.**

## What the Specification States

According to **§2.1.4 — Date/Time Class** (section heading present in the table of contents), temporal types are part of the **Primitive Types** category and are subject to the general **Binary Encoding Rules for Primitives** defined in **§2.1.9**.

**§2.1.9.5** specifically covers **"Temporal encoding"** as a normative sub-section of the encoding model, indicating that Date/Time values have dedicated binary encoding semantics.

## Normative Framework

The following principles apply to temporal encoding under **§2.1.9 — Binary Encoding Rules for Primitives**:

1. **Canonical encoding principles** (§2.1.9.1) establish that all primitive encodings must be **deterministic, platform-independent, and reproducible** across all runtimes and languages.

2. **Envelope-driven serialization** — Temporal values are serialized using the **Type Metadata Envelope** model defined in **ANNEX B — Type Metadata Envelope**, which encodes:
   - CATEGORY = Primitive (`00`)
   - Concrete TYPE_CODE for the temporal type
   - Physical payload bytes following immediately after the envelope (§2.2.4)

3. **Parser obligations** (§2.1.9.9) mandate that parsers **validate temporal payload correctness** and reject malformed values deterministically.

## Missing Detail

**The specific byte layout, endianness, epoch reference, precision semantics, and range constraints for Date/Time values are not provided in the loaded specification sections.** These details are:

- **Normatively specified** in the full **§2.1.4 — Date/Time Class** section (not loaded)
- **Cross-referenced** in **ANNEX A — Type Registry** (not loaded), which defines the exact **TYPE_CODE**, **physical size**, and **measurement semantics** for each temporal variant

## Recommendation

To obtain the complete temporal encoding specification, consult:

1. **§2.1.4 — Date/Time Class** — designation, normative properties, and semantic role
2. **§2.1.9.5 — Temporal encoding** — canonical binary representation rules
3. **ANNEX A — Type Registry** — TYPE_CODE assignments, byte layouts, and epoch/precision definitions
4. **ANNEX B — Type Metadata Envelope** — envelope structure wrapping temporal payloads

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 616
- tokens_total: 646
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 7.2
- model: haiku
- runner: v0.8
- run_id: 2026-03-09T23-01-09
- saved_to: haiku/naive/q_15_naive.md
