# Final: Q3 — A-003 (A-003)

## Question
What are the normative differences between RAW String and RAW Binary stream types?

## Answer

Perfect! Я получил полную информацию о нормативных различиях между RAW String и RAW Binary. Теперь могу дать подробный ответ.

## Normative Differences Between RAW String and RAW Binary Stream Types

Based on §2.3.2 and §2.3.3 of the E.L.I.A. specification, here are the key normative differences:

### **1. Data Content Semantics**

- **RAW String** (§2.3.2.1): Handles **textual content whose size or production model exceeds bounded block constraints**. It preserves text encoding semantics (e.g., UTF-8) while allowing incremental consumption.
  
- **RAW Binary** (§2.3.3.1): Handles **binary payloads** including media streams, large files, encrypted blobs, and telemetry feeds whose size or lifecycle requires incremental processing.

### **2. Encoding and Decoding Rules**

- **RAW String** (§2.3.2.3.1–2.3.2.3.2): 
  - **MUST preserve declared text encoding semantics** across streaming boundaries
  - **MUST allow incremental decoding and validation** without full materialization
  - Base64-encoded RAW String **MUST NOT be decoded implicitly**; decoding **MUST be performed explicitly by the governing data interface**
  - Base64 encoding **MUST NOT be used to bypass size limits**

- **RAW Binary** (§2.3.3.3): 
  - **MUST preserve binary payload integrity** across streaming boundaries
  - **MUST NOT expose structure, ordering semantics, or interpretation beyond raw byte delivery**
  - No encoding/decoding rules specified (remains opaque)

### **3. Semantic Data Binding Restrictions**

- **RAW String** (§2.3.2.4.3):
  - The semantic data interface **MUST NOT generate CRUD semantics**, field-level accessors, or schema-driven projections
  - **MUST NOT be treated as iterable structured data**, even if payload encodes structured formats (e.g., JSON, XML, CSV)

- **RAW Binary** (§2.3.3.4.3):
  - The semantic data interface **MUST NOT generate CRUD semantics**, record-level accessors, field projections, or iteration-based operations
  - **MUST NOT be treated as iterable or structurally decomposable data** (even if higher-level structure exists externally)

### **4. Permitted Stream Operations**

- **RAW String** (§2.3.2.4.2): The interface **MUST expose only sequential binary or textual stream operations** — read, forward-only consume, stream, or transport semantics.

- **RAW Binary** (§2.3.3.4.2): The interface **MUST expose only binary stream operations** — sequential read, forward-only consume, stream forwarding, or controlled write/append where permitted.

### **5. Size Constraints**

Both types share an identical normative constraint (§2.3.2.3.1.5, §2.3.3.3.5):
- **MUST enforce a maximum materialized in-memory size of 2,147,483,647 bytes (~2 GiB)** when explicitly converted to a bounded block
- This limit is dictated by backward-compatibility with C#/.NET, C++, and similar platforms that use signed 32-bit indexing

### **6. Conversion Rules**

- **RAW String** (§2.3.2.3.1.4): Any conversion to bounded `string` **MUST be explicit** and **MUST enforce size limits and encoding validity**

- **RAW Binary** (§2.3.3.3.4): Any conversion to a bounded block **MUST be explicit** and **MUST enforce size limits, integrity checks, and declared encoding constraints**

In summary, **RAW String is normalized for textual data with encoding semantics**, while **RAW Binary is normalized for opaque binary data without interpretation**. Both prohibit implicit materialization and structure-aware operations through semantic interfaces.
