# Final: Q16 — B-006 (B-006)

## Question
How are identifier values (guid, riid) encoded in binary in E.L.I.A.?

## Answer

Perfect! I found the answer. The search returned §2.1.5 and §2.1.9.6 with the key information about identifier encoding.

Based on the E.L.I.A. specification, identifier values (`guid` and `riid`) are encoded in binary as follows:

## Fixed-Width Binary Encoding

Both identifier types use **fixed-width binary encoding with no embedded delimiters, formatting, or textual normalization** (§2.1.9.6):

- **`guid`** (Globally Unique Identifier): **128 bits (16 bytes)** — represents a globally unique identifier with well-known external interoperability mapping per RFC 4122 (UUID).

- **`riid`** (Runtime-Independent Identifier): **96 bits (12 bytes)** — represents a runtime-independent identifier defined exclusively within E.L.I.A., designed to preserve determinism, compactness, and canonical serialization across heterogeneous runtimes.

## Key Encoding Rules

Per §2.1.9.6, identifiers are treated as **external primitives** (§2.1.9.8/E) when materialized in Type Data envelopes:

1. **No inference from layout**: Parsers **MUST NOT infer ordering, timestamps, or structure** from identifier binary layouts unless explicitly defined by the identifier type.

2. **Pure equality semantics** (§2.1.5.2): Identifiers **MUST support only bitwise equality comparison and cryptographic hashing operations**. Arithmetic, ordering, range, or semantic comparison operations are prohibited.

3. **No embedded meaning**: Identifiers carry **no embedded semantics** beyond identity and **MUST NOT encode business meaning, temporal ordering, or behavior** (§2.1.5).

Both `guid` and `riid` are classified as **external primitives** due to their widths exceeding 48 bits, and when referenced in Type Data, they are stored via **offset reference** or external allocation rather than inlined (§2.1.9.8/E).
