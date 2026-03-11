# Final: Q4 — A-004 (A-004)

## Question
Why does E.L.I.A. enforce a 2 GiB maximum for RAW Binary materialization?

## Answer

E.L.I.A. enforces a **2 GiB (2,147,483,647 bytes) maximum for RAW Binary materialization** for backward-compatibility reasons with existing programming language runtimes.

### Rationale

According to **§2.3.3.3 (Normative properties, item 5)**:

> RAW Binary **MUST enforce a maximum materialized in-memory size of 2 147 483 647 bytes (~2 GiB)** when explicitly converted to a bounded block. This limit is **normatively dictated by backward-compatibility requirements with existing programming language runtimes and ecosystems** (including, but not limited to, **C#/.NET**, **C++**, and comparable platforms) where in-memory byte buffers and arrays are constrained by signed 32-bit indexing semantics.

**Key design principle (§2.3.3):**
RAW Binary is semantically defined as a **stream surface** rather than a materialized block value. While RAW Binary MAY be incrementally processed and buffered in memory, the 2 GiB limit applies specifically when explicitly converting RAW Binary to a bounded block—at which point the buffer must comply with the signed 32-bit integer constraint shared across all major runtime ecosystems (C#/.NET, C++, Java, etc.).

This design preserves **streaming semantics** (no mandatory full materialization) while ensuring **interoperability** with underlying runtime platforms that enforce 32-bit signed integer limits on array indices and byte buffer sizes.
