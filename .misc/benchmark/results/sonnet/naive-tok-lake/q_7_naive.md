# q_7 — A-007 — What are the normative properties of the Date/Time class in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
According to §2.1.4.2, the Date/Time class has the following normative properties:

1. **UTC-based representation**: Date/Time values **MUST be represented internally as UTC** and **MUST NOT carry timezone information as part of the value itself**.

2. **Timezone handling**: Timezone interpretation **MUST be handled at the presentation or conversion layer**, not embedded in the primitive value.

3. **Precision constraints**: Each Date/Time subtype **MUST enforce specific precision limits**:
   - Nanosecond precision for high-resolution timestamps
   - Millisecond precision for business events
   - Day precision for date-only values

4. **Range validation**: Date/Time values **MUST enforce reasonable range limits** to prevent arithmetic overflow and ensure practical usability.

5. **Immutability**: Date/Time primitives **MUST be immutable** after construction; no in-place modification is permitted.

6. **Deterministic serialization**: Date/Time values **MUST serialize to a canonical binary representation** that preserves precision and enables deterministic comparison across platforms.

7. **No behavioral semantics**: Date/Time values **MUST NOT encode timezone logic, calendar system behavior, or locale-dependent formatting** within the primitive type itself.

The specification emphasizes that Date/Time types serve as **temporal fact carriers** that anchor events and states to specific moments in time, while keeping timezone interpretation and calendar logic separate from the core primitive representation (§2.1.4.3).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 336
- tokens_total: 364
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 9.6
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_7_naive.md
