# Final: Q9 — A-009 (A-009)

## Question
What is the performance optimization guideline for inline vs external primitives in E.L.I.A.?

## Answer

Perfect! Now I have the complete guidance. Let me synthesize the answer.

---

## Performance Optimization Guideline for Inline vs External Primitives

According to **§2.1.9.10.3** (Optimization guideline — normative recommendation), E.L.I.A. provides clear guidance for choosing between inline and external primitives:

### **The Guideline**

When designing records and event payloads:

1. **Frequently accessed primitive fields SHOULD be declared first**
2. **Fields eligible for inlining SHOULD be arranged** so they materialize within the first **48 bits** of their respective Envelopes
3. This maximizes inline representation opportunities and improves cache locality
4. These guidelines enable predictable performance characteristics **without compromising semantic correctness, determinism, or type safety**

### **Inline Primitives (≤ 48 bits)** — §2.1.9.10.1

**Advantages:**
- Zero allocation overhead
- Cache-friendly access (single cache line read)
- Atomic read/write guaranteed at Envelope level
- Minimal indirection and branch-free parsing
- No additional payload traversal

**Recommended for:**
- High-frequency fields
- Hot-path evaluation (rules, follow conditions, guards)
- Identifiers, flags, counters, and compact state markers
- Examples: `bool`, `int8`–`int32`, `uint8`–`uint32`, `float`, `date`, small enums

### **External Primitives (> 48 bits)** — §2.1.9.10.2

**Characteristics:**
- Require reading additional bytes beyond the Envelope
- May incur allocation, buffer access, or indirect memory reads
- Increased likelihood of cache misses
- Atomicity is platform- and ABI-dependent
- May require alignment handling

**Recommended for:**
- Large numeric values
- High-precision arithmetic
- Temporal and identifier values requiring extended width
- Examples: `int64`, `uint64`, `double`, `decimal`, `timestamp`, `guid`

**Key principle:** The guidelines are normative but do not alter semantic meaning — they optimize *performance characteristics* while maintaining full correctness and determinism (§2.1.9.10).
