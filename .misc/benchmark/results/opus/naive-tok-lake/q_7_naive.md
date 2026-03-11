# q_7 — A-007 — What are the normative properties of the Date/Time class in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the normative properties of the Date/Time class are defined in **§2.1.4.2**:

## Normative Properties of Date/Time Class

1. **All temporal types MUST support nanosecond precision** (10^-9 seconds)

2. **All temporal types MUST serialize to and deserialize from ISO 8601 extended format**

3. **Timezone handling**:
   - UTC representation MUST be supported and is the canonical form
   - Local time with explicit offset MUST be supported
   - Implicit local time without offset is FORBIDDEN

4. **The canonical epoch is `1970-01-01T00:00:00.000000000Z`** (Unix epoch with nanosecond extension)

5. **Temporal arithmetic MUST account for**:
   - leap seconds
   - daylight saving transitions
   - calendar discontinuities

6. **Temporal types MUST NOT implicitly convert between precisions or timezones**

7. **Comparison operations MUST be timezone-aware** and MUST NOT compare instants in different zones without explicit normalization

The specification also notes that the Date/Time class includes types like `date`, `time`, `datetime`, `duration`, and `instant` (§2.1.4).

These properties ensure deterministic behavior, precise time representation, and explicit handling of timezone complexities across all temporal operations in E.L.I.A.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 334
- tokens_total: 362
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 12.1
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_7_naive.md
