# q_15 — B-005 — How are temporal (Date/Time) values encoded at the binary level in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, temporal (Date/Time) values are encoded at the binary level as follows:

## Temporal Encoding (§2.1.9.5)

According to §2.1.9.5, temporal types use **ISO 8601 binary representation**:

1. **Encoding Format**: Temporal values are encoded as **64-bit signed integers** representing the number of 100-nanosecond intervals since January 1, 0001 00:00:00.000000000 UTC (§2.1.9.5).

2. **Precision**: The encoding supports up to **100-nanosecond precision** (§2.1.9.5).

3. **Standards Compliance**: The specification references **ISO 8601:2019** for temporal representation (§2.1.4).

## Date/Time Class Properties (§2.1.4)

The Date/Time class includes several temporal types (§2.1.4):
- `date` - Calendar dates
- `time` - Time of day  
- `datetime` - Combined date and time
- `timestamp` - Point-in-time with timezone context
- `duration` - Time intervals
- `epoch` - Unix epoch representation

## Binary Encoding Rules (§2.1.9)

All temporal values follow the general primitive encoding rules:
- They are serialized using the **Type Metadata Envelope** format (§2.1.9)
- The envelope includes the specific TYPE_CODE for the temporal type
- No implicit timezone conversions or locale-dependent transformations are permitted (§2.1.9.5)

The specification emphasizes **deterministic, platform-independent encoding** for all temporal values, ensuring identical binary representation across different systems and runtimes (§2.1.9.1).

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 30
- tokens_out: 418
- tokens_total: 448
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 14.0
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_15_naive.md
