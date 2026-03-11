# q_5 — A-005 — What is the semantic role of the Identifiers class and what specific types does it include?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, here's what I can tell you about the Identifiers Class:

## Semantic Role (§2.1.5.3)

The Identifiers Class serves as **semantic anchors for entity identification and referencing**. According to §2.1.5.3, identifiers:

1. Act as **stable, unique references to semantic entities** across time and space
2. Enable **deterministic identity resolution** without relying on mutable state or external lookups
3. Provide **auditable linkage** between facts, events, and semantic structures

## Specific Types Included (§2.1.5)

The Identifiers Class includes the following types:

1. **`guid`** - 128-bit globally unique identifier (UUID/GUID)
2. **`riid`** - 256-bit resource identifier with embedded semantic structure  
3. **`objectid`** - 96-bit compact object identifier (e.g., MongoDB ObjectId)

## Key Properties (§2.1.5.2)

According to §2.1.5.2, all identifier types share these normative properties:

1. **MUST be immutable** after construction
2. **MUST support bitwise equality comparison**
3. **MUST serialize deterministically** to their canonical byte representation
4. **MUST NOT** encode behavior or mutable state
5. Are **non-arithmetic** (no ordering or arithmetic operations)

## Designation (§2.1.5.1)

Per §2.1.5.1, the Identifiers Class is designated to:

1. Represent **globally unique, stable identifiers** for entities and facts
2. Enable **cross-system referencing** without collision or ambiguity
3. Support **cryptographic evidence chains** and tamper-evident audit trails
4. Provide **deterministic serialization** for persistence and transport

The specification emphasizes that these identifiers serve as foundational elements for establishing stable references across the entire semantic system, supporting both local and distributed identity resolution scenarios.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 25
- tokens_out: 469
- tokens_total: 494
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 16.1
- model: opus
- runner: v0.8
- run_id: 2026-03-09T23-34-21
- saved_to: opus/naive/q_5_naive.md
