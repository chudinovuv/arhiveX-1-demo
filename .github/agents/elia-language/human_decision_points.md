# Human Decision Points — Index Maintenance

> **Scope:** This document defines the ~5% of index maintenance decisions that **cannot be automated** and MUST be resolved through dialogue with the human operator.

## When to trigger

The agent MUST initiate a human-decision dialogue when any of the following conditions are met during index maintenance:

### 1. Unit ownership (target index)

**Trigger:** `suggest-units` outputs candidate units but the correct target index (`phya`, `sema`, `ont`, `desa`, `phla`, `bhva`) is ambiguous.

**Rule:** If the section content clearly maps to one aspect (e.g., error codes → `bhva`, type definitions → `phya`), the agent MAY proceed without asking. Otherwise:

**Dialogue template:**
```
Section {section} "{title}" could belong to:
  (a) {alias1} — because {reason1}
  (b) {alias2} — because {reason2}
Recommended: (a). Confirm?
```

**Decision factors:**
- Primary topic matches index scope description in `aspect_index.json`
- Keywords overlap with existing units in the candidate index
- Section co-locates with other sections already in that index

---

### 2. Unit split vs merge

**Trigger:** `suggest-units` groups headings by H2 boundary, but the content under a single H2 covers **unrelated concepts**, or adjacent H2 sections cover the **same concept**.

**Rule:** The agent MUST ask when:
- A single suggested unit has keywords from ≥2 distinct domains
- Two adjacent suggested units share ≥60% of keywords
- A suggested unit has >8 chain entries (potential oversized unit)

**Dialogue template (split):**
```
Unit "{name}" covers {n} sections, but keywords indicate 2 topics:
  • Topic A: {keywords_A} (sections {sections_A})
  • Topic B: {keywords_B} (sections {sections_B})
Split into two units? Or keep as one?
```

**Dialogue template (merge):**
```
Units "{name1}" and "{name2}" share {overlap}% keyword overlap:
  Shared: {shared_keywords}
Merge into one unit? If yes — what name?
```

---

### 3. Keyword prioritization

**Trigger:** `suggest-keywords` extracts >20 candidates but `maxKeywords` (default: 12) limits the output. The cut-off may exclude semantically important terms.

**Rule:** The agent MUST ask when:
- The top-12 are all from one pattern (e.g., all error codes, no conceptual terms)
- A keyword with weight ≤5 appears to be the primary concept of the section

**Dialogue template:**
```
For unit "{name}" suggest-keywords recommends:
  Top 12: {top12}
But potentially important keywords were excluded:
  {excluded_important} (weight: {weight}, source: {source})
Add them, replacing less important ones? Or keep as-is?
```

---

### 4. Cross-reference relevance ($ref)

**Trigger:** `suggest-refs` finds keyword overlap ≥2, but the overlapping keywords are generic (e.g., "type", "error", "module") rather than domain-specific.

**Rule:** The agent MUST ask when:
- Overlap keywords are all in the STOPWORDS list or are single-character
- The candidate unit is in a distant index (e.g., `phya` → `desa`)
- Adding the ref would create a circular reference chain

**Dialogue template:**
```
suggest-refs proposes $ref from {source_alias}/{source_unit} → {target_alias}/{target_unit}
  Overlap: {overlap_keywords}
  But: {concern — e.g., "all overlapping words are generic terms"}
Add this reference? Or skip?
```

---

### 5. Ontological role override (onto)

**Trigger:** A unit's content answers a different ontological question than the index default.

**Rule:** The agent MUST ask when:
- The unit's primary narrative is "why" but the index default onto is "WHAT"
- The unit contains both definition (WHAT) and rationale (WHY) in roughly equal proportions
- `suggest-keywords` output doesn't clearly indicate one role

**Dialogue template:**
```
Unit "{name}" in index {alias} (default onto: {default}).
Section content:
  • {hint_what} — points to WHAT
  • {hint_why} — points to WHY
Which onto to assign? Or keep default ({default})?
```

---

## Resolution protocol

1. **Ask once** — do not re-ask the same decision in the same session
2. **Propose a default** — always recommend an option (mark as "Recommended:")
3. **Accept silence as confirmation** — if the human responds "ok" or "yes", proceed with the recommendation
4. **Log the decision** — after human confirms, note the decision in the session summary for future reference
5. **Batch when possible** — if multiple decisions are pending for the same prefix, present them together (max 4 per batch)

## Non-decisions (do NOT ask)

These are handled automatically by the tooling:

| Situation | Automated resolution |
|-----------|---------------------|
| Chain address format | `/all` for ≤3 children, explicit for >3 |
| Keyword extraction | Profile-aware pattern matching + ranking |
| Coverage check | `scan --inclusive` with parent `/all` expansion |
| Unit naming | camelCase from heading title |
| Validation | `check` command (structural + schema) |
| Keyword enrichment | T&D + co-occurrence pipeline in MCP |
