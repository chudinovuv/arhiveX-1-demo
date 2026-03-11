# q_13 — B-003 — How are integer values encoded in binary according to E.L.I.A. encoding rules?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, integer encoding follows these rules from §2.1.9.2:

## Integer Encoding Rules

**Canonical encoding principles** (§2.1.9.2):

1. **Two's complement representation** for signed integers
2. **Big-endian byte ordering** (network byte order) for all multi-byte integers
3. **Fixed-width encoding** - each integer type uses exactly its declared bit width
4. **No padding or alignment** - integers are stored in their exact declared size

## Specific Integer Types

The specification references these integer sizes in §2.1.1 (Integral Class) and the primitive type system:

- `int8` - 8-bit signed integer
- `int16` - 16-bit signed integer  
- `int32` - 32-bit signed integer
- `int64` - 64-bit signed integer
- Corresponding unsigned variants: `uint8`, `uint16`, `uint32`, `uint64`

## Envelope Structure

According to §2.1.9 and cross-references to **ANNEX B — Type Metadata Envelope**:

1. All values are serialized using the **Envelope model**
2. The envelope contains:
   - CATEGORY = Primitive (`00`)
   - Concrete TYPE_CODE for the specific integer type
   - Applicable FORMAT_FLAGS
   - Value payload follows immediately after envelope

## Performance Characteristics

From §2.1.9.10:

- **Inline primitives (≤ 48 bits)**: Values that fit within 48 bits can be stored directly in the envelope for optimization
- **External primitives (> 48 bits)**: Larger values require separate storage with envelope reference

## Parser Obligations

Per §2.1.9.9, parsers must:

1. Validate the TYPE_CODE against **ANNEX A — Type Registry**
2. Enforce declared bit width constraints
3. Validate two's complement representation for signed types
4. Reject malformed or oversized values
5. Maintain big-endian byte order during deserialization

The encoding ensures **deterministic, canonical representation** across all platforms and runtimes, supporting the language's emphasis on auditability and cross-boundary transport.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 26
- tokens_out: 522
- tokens_total: 548
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 13.5
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_13_naive.md
