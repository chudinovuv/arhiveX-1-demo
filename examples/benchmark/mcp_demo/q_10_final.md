# Final: Q10 — A-010 (A-010)

## Question
What is the Special/control class in E.L.I.A. primitives and what types does it include?

## Answer

The **Special/control class** in E.L.I.A. primitives (§2.1.6) represents **semantic control markers** rather than domain data. These primitives are used to explicitly model absence, non-materialization, control flow boundaries, and constrained value spaces in a deterministic and inspectable way.

The Special/control class comprises **three types**:

1. **`null`** — represents an explicit absence of a data value
2. **`void`** — represents the absence of a return value or a platform-native pointer placeholder
3. **`nothing`** — represents a non-materialized or undefined semantic state

**Key characteristics** (§2.1.6):
- These primitives are essential for semantic clarity and enforcement
- MUST NOT be treated as business data
- MUST NOT be used to encode implicit behavior
