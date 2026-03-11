# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the provided E.L.I.A. specification, I cannot find specific information about how integer values are encoded in binary according to E.L.I.A. encoding rules.

The specification sections provided focus on:
- Block Types (§2.2) and their encoding rules (§2.2.4)
- Stream Types (§2.3) and their various classes

While §2.2.4 establishes general "Binary Encoding Rules for Block Types," it primarily addresses:
- Envelope-based serialization using metadata envelopes (§2.2.4)
- Byte order rules for specific block types like `beN` (big-endian) and `leN` (little-endian) blocks (§2.2.4)
- Requirements for canonical serialization

However, the specification explicitly states that detailed encoding mechanics are defined in **ANNEX A — Type Registry** and **ANNEX B — Type Metadata Envelope** (§2.2, §2.3), which are not included in the provided content.

The specification mentions that "The exact **type code**, **physical size**, **value range**, and **measurement or counting semantics** for this type class are normatively defined in **ANNEX A — Type Registry**" (§2.2.1, §2.3.1, §2.3.2, §2.3.3), but these annexes containing the specific integer encoding rules are not present in the provided specification text.

To answer your question about integer binary encoding, I would need access to ANNEX A and ANNEX B of the specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 360
- tokens_total: 385
- cache_read: 13400
- cache_creation: 0
- wall_time_sec: 7.5
- model: opus
- runner: v0.8
- run_id: 2026-03-10T00-46-53
- saved_to: opus/naive/q_13_naive.md
