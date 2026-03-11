# q_10 — A-010 — What are the explicit conversion rules between non-numeric primitive types in E.L.I.A.?

## Spec Files Pre-loaded (in context)
- 2_2_block_types.md
- 2_3_stream_types.md

## Answer
Based on the E.L.I.A. specification, the explicit conversion rules for non-numeric primitive types are defined in **§2.1.10.2.3 Explicit Conversion — Non-Numeric Primitives**.

However, the detailed conversion rules for non-numeric primitives are not included in the loaded specification content. The table of contents indicates this section exists, but the actual conversion matrix and rules are in a section that was not loaded.

What I can tell you from the available content is:

## General Conversion Framework (§2.1.10.1)

The specification establishes that:
- **Implicit conversions are heavily restricted** and only allowed where no semantic meaning is lost
- **Explicit conversions must be declared** using conversion syntax 
- **All conversions must preserve determinism** and be auditable

## Available Non-Numeric Primitive Types

From the loaded sections, the non-numeric primitive types include:

**§2.1.3** - Boolean Class
**§2.1.4** - Date/Time Class  
**§2.1.5** - Identifiers Class (GUID, RIID)
**§2.1.6** - Special/Control Class
**§2.1.7** - Enum
**§2.1.8** - Fixed String Class

## Cross-Reference Note

The specification states in **§2.1.10.7** that explicit conversion rules are "Cross-referenced" to other sections, but the detailed conversion matrix for non-numeric primitives would be found in the unloaded **§2.1.10.2.3** section.

To get the complete explicit conversion rules between non-numeric primitive types (such as bool ↔ enum, string ↔ identifier, date/time conversions, etc.), you would need access to that specific section of the specification.

## Metrics
- mode: naive (spec-in-context, no tools)
- iterations: 1
- tool_calls: 0
- tokens_in: 28
- tokens_out: 417
- tokens_total: 445
- cache_read: 32176
- cache_creation: 0
- wall_time_sec: 11.0
- model: sonnet
- runner: v0.8
- run_id: 2026-03-09T23-29-47
- saved_to: sonnet/naive/q_10_naive.md
