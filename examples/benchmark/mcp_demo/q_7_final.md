# Final: Q7 — A-007 (A-007)

## Question
What are the stream metadata and interface obligations for stream types in E.L.I.A.?

## Answer

Based on the information I've gathered, I now have sufficient content to answer the question comprehensively. Let me synthesize:

---

## Stream Metadata and Interface Obligations in E.L.I.A.

Stream types in E.L.I.A. are governed by a set of explicit metadata and interface requirements designed to ensure safe and deterministic handling of sequential, potentially unbounded data.

### **Stream Metadata Requirements** (§2.3.0.4)

1. **Open-ended length support**: Stream metadata **MUST allow unknown or open-ended length**. Any declared length is strictly advisory and **MUST NOT imply full materialization** of the stream into memory.

2. **Transport transparency**: Chunking, segmentation, or incremental delivery **MUST be treated as a transport concern** and **MUST NOT affect semantic interpretation** of the stream payload.

3. **Size constraints**: By default, stream types are limited to 2^48 bytes and always have the `SIZE_LIMITED_26BIT` flag set to 0 (§2.3.0.2).

### **Interface Obligations** (§2.3.0.4)

Every stream value **MUST be associated with a governing data interface** that declares:
- **Admissible operations** — which operations may be performed on the stream
- **Access mode** — read-only or writable
- **Enforcement scope** — the domain/module boundaries where the stream is valid

### **Materialization Contract**

1. **Explicit declaration required**: A data interface **MUST explicitly declare** whether and how a stream MAY be materialized into a bounded block, including size limits and validation rules.

2. **Observable operation**: Any stream materialization **MUST be an explicit, observable operation** subject to enforcement, audit, and failure semantics.

3. **Non-materialization by default**: In the absence of an explicit materialization contract, streams **MUST be treated as non-materializable by default** (§2.3.0.4).

### **Fundamental Constraint**

Stream types **MUST NOT be materialized as bounded block values** unless explicitly converted via a data interface with size validation and enforcement. This separation ensures that data movement is cleanly distinguished from data interpretation, keeping enforcement mechanisms explicit and inspectable (§2.3.0.2-3).
