# Final: Q17 — B-007 (B-007)

## Question
What parser obligations does E.L.I.A. define for primitive type binary decoding?

## Answer

Excellent! Now I have the complete picture. Let me provide the answer.

---

## Answer

E.L.I.A. defines **six normative parsing steps** for primitive type binary decoding in **§2.1.9.9.1**. All steps **MUST** be executed sequentially; deviations, shortcuts, or heuristic parsing are prohibited (§2.1.9.9).

### Parsing Algorithm (Normative Steps)

**Step 1 — Read Envelope**
- Read the 64-bit Envelope and extract `CATEGORY` from the Meta Header
- `CATEGORY` **MUST** equal `00` (Primitive); otherwise raise "Not a primitive type"

**Step 2 — Check TYPE_CODE**
- Extract and validate `TYPE_CODE` against ANNEX A.3 (Primitive Types)
- Reserved type codes `0x16–0x1F` **MUST** trigger a validation error: "Reserved type code"

**Step 3 — Handle FORMAT_FLAGS**
- Interpret `FORMAT_FLAGS` according to the resolved primitive type
  - For `enum`: resolve the enumeration definition using the Enum Identifier in `FORMAT_FLAGS`
  - For `any`: interpret as security, compression, and reference indicators (ANNEX B)
- **MUST** raise an error if `FORMAT_FLAGS` contain bits not permitted for the type: "Invalid format flags"

**Step 4 — Determine size**
- Determine the canonical encoded size using `TYPE_CODE` and ANNEX A.3

**Step 5 — Read value**
- Apply primitive-specific parsing:
  - **Enum**: Extract Enum ID, resolve from registry, determine actual encoded size (1–64 bytes)
  - **Any** (≤48 bits): Read from Type Data field, convert 48-bit little-endian, advance 8 bytes
  - **Any** (>48 bits): Skip Envelope, read next Size bytes, advance (8 + Size) bytes

**Step 6 — Apply security checks**
- Validate security and classification bits against current execution and domain context
- Parsing **MUST NOT proceed** if violation detected: "Security context mismatch"

### Validation Error Conditions (Mandatory)

An implementation **MUST** raise a validation error under these conditions (§2.1.9.9.2):
1. `CATEGORY ≠ 00`
2. `TYPE_CODE` in reserved range `0x16–0x1F`
3. Invalid `FORMAT_FLAGS` for the resolved type
4. Security or classification constraint violation
