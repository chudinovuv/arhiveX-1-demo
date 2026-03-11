# Final: Q7 — A-007 (A-007)

## Question
What are the normative properties of the Date/Time class in E.L.I.A.?

## Answer

Perfect! I have the complete normative properties of the Date/Time class. Here is the answer:

---

## Normative Properties of the Date/Time Class (§2.1.4.2)

The Date/Time class in E.L.I.A. has the following **8 normative properties**:

1. **Canonical serialization** — Temporal primitives **MUST** serialize canonically and deterministically across runtimes.

2. **No implicit platform behavior** — Temporal primitives **MUST NOT** embed implicit locale, calendar, or platform-specific behavior.

3. **`date` type semantics** — `date` **MUST** represent a civil calendar date only and **MUST NOT** imply time-of-day, timezone, or offset.

4. **`time` type semantics** — `time` **MUST** represent a wall-clock time only and **MUST NOT** imply a date, timezone, or offset.

5. **`timestamp` type semantics** — `timestamp` **MUST** represent an absolute instant and **MUST** carry an explicit timezone/offset semantic at the serialization boundary (canonical form).

6. **`timespan` type semantics** — `timespan` **MUST** represent an elapsed duration and **MUST NOT** be interpreted as a calendar interval (no month/year semantics unless explicitly declared by a higher-level construct).

7. **Explicit conversions only** — Implicit conversion between `date`, `time`, `timestamp`, and `timespan` **MUST NOT** be permitted; any conversion **MUST** be explicit and type-bound.

8. **Type-safe temporal operations** — Temporal comparison and arithmetic **MUST** be type-safe:
   - Ordering comparisons are admissible for `timestamp` and MAY be admissible for `time` (within the same day context) when explicitly declared
   - `timespan` MAY be added/subtracted to/from `timestamp` only via explicit operations
   - `date` arithmetic is forbidden unless an explicit calendar policy is declared by a higher-level construct

**Purpose** (§2.1.4.1): These properties exist to encode temporal facts and durations with explicit, non-ambiguous semantics; provide deterministic ordering for audit and evidence chains; prevent locale, calendar, and platform drift; and support legal and compliance-relevant time semantics.
