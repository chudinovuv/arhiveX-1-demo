# Final: Q15 — B-005 (B-005)

## Question
How are temporal (Date/Time) values encoded at the binary level in E.L.I.A.?

## Answer

Perfect! I now have comprehensive information about temporal encoding. Let me provide the answer:

---

## Answer

Temporal (Date/Time) values in E.L.I.A. are encoded at the binary level with explicit, deterministic rules that ensure portability across runtimes and audit safety.

### **Encoding Requirements** (§2.1.9.5)

Temporal primitives follow three encoding strategies:

1. **`timestamp`** — MUST be encoded as **UTC-based epoch time** with an explicitly declared unit (milliseconds by default, unless otherwise specified in ANNEX A).

2. **`date` and `time`** — MUST be encoded using **fixed, locale-independent representations derived from ISO 8601 semantics**. These encode:
   - `date` as a civil calendar date only (no time-of-day, timezone, or offset)
   - `time` as a wall-clock time only (no date, timezone, or offset)

3. **`timespan`** — MUST be encoded as an **exact duration value**, independent of calendar semantics (no month/year interpretation unless explicitly declared by a higher-level construct).

### **External Storage** (§2.1.9.8)

All temporal primitives are classified as **external primitives** (canonical size > 48 bits) and thus:
- Cannot be inlined within the 64-bit Envelope
- MUST be stored immediately after the Envelope in their canonical binary form
- Require 8-byte alignment following platform ABI requirements
- The Envelope's Type Data field MUST be set to zero

**Layout example:**
```
[ Envelope (64 bits) ] [ temporal value bytes (8+ bytes) ]
```

### **Normative Encoding Properties** (§2.1.4.2)

- All temporal primitives **MUST serialize canonically and deterministically** across runtimes
- **MUST NOT embed implicit locale, calendar, or platform-specific behavior**
- **MUST NOT allow implicit conversion** between date, time, timestamp, and timespan; any conversion MUST be explicit and type-bound
- Temporal comparison and arithmetic **MUST be type-safe** with admissibility constraints (e.g., ordering allowed for `timestamp`, `timespan` arithmetic limited to `timestamp` only)

### **Parsing Guarantees** (§2.1.9.9)

Parsers **MUST**:
1. Read the 64-bit Envelope and verify CATEGORY = `00` (Primitive)
2. Validate the TYPE_CODE against the primitive types registry
3. For temporal primitives > 6 bytes: skip the 8-byte Envelope, then read the following bytes as the canonical temporal value
4. Apply security and classification checks from FORMAT_FLAGS
5. Reject any value that violates size, encoding, or semantic constraints

This design ensures temporal values are **fully portable**, **replay-safe**, and **audit-safe** across all E.L.I.A. implementations.
