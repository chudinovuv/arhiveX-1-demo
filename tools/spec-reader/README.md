# elia-spec-reader

MCP server for reading the E.L.I.A. language specification via aspect indices.

Provides 5 tools for AI agents (GitHub Copilot, Claude, etc.) to search, extract, and navigate the spec without loading the entire document into context.

## Requirements

- Node.js ≥ 22
- TypeScript ≥ 5.7

## Quick Start

```bash
npm install
npm run build
npm start
```

## MCP Tools

| Tool | Purpose |
|------|---------|
| `search_spec` | Keyword search → index matching → chain resolution → text extraction with reading plan, token budget, keyword filter, onto boost |
| `read_chain` | Read spec content by chain address directly (e.g. `2.7.3`, `2.5.3/A.`, `B.1.1/table-1`) |
| `list_units` | Discovery: list index units matching a keyword without extracting text |
| `fulltext_search` | Broad fulltext search across all spec sections by vocabulary terms |
| `lookup_xref` | Cross-reference lookup — forward (outgoing refs) or reverse (who references X?) |

## Architecture

```
src/
├── server.ts                  # MCP server entry point (5 tools)
├── lib/
│   ├── indexLoader.ts         # Load & search aspect indices (11 indices)
│   ├── chainResolver.ts       # Parse chain addresses, resolve to files
│   ├── textExtractor.ts       # Extract markdown text by chain address
│   ├── tapeAssembler.ts       # Assemble extracted sections into reading tape
│   ├── readingPlanFunnel.ts   # Score, dedup, subsume, tier-assign chains
│   ├── tokenBudget.ts         # Token estimation & auto-trimming (budget: 5000)
│   ├── keywordEnricher.ts     # 3-phase keyword expansion (T&D → co-occurrence → waterfall)
│   ├── xrefLoader.ts          # Cross-reference graph (267 refs, 148 sections)
│   ├── linearIndex.ts         # Linear index search for fulltext_search
│   └── types.ts               # Shared types
├── scripts/
│   ├── rebuildAll.ts          # Unified 4-phase index rebuild pipeline
│   ├── buildAspectIndices.ts  # Build grma, suggest bhva, validate manual indices
│   ├── buildLinearIndex.ts    # Build linear_index.json from aspect indices
│   ├── buildCrossRefIndex.ts  # Build cross_ref_index.json
│   ├── generateAbstracts.ts   # Generate one-line abstracts for all index units
│   ├── generateTerminologyIndex.mjs  # Build trma (terminology index)
│   ├── generateOntologicalIndex.mjs  # Build onma (ontological role index)
│   └── addToIndex.ts         # CLI tool for managing manual aspect indices
├── __tests__/                 # Vitest unit tests (140 tests)
indexes/                       # All generated index JSON files (12 files)
```

## Indices (11)

| Alias | Scope | Default Onto | Managed |
|-------|-------|-------------|---------|
| `phya` | Physical: data types, serialization, materialization | WHAT | semi-automated |
| `sema` | Semantic: interfaces, domains, delegates | WHAT | semi-automated |
| `ont` | Ontological: type system overview, classification | WHAT | semi-automated |
| `desa` | Design: decisions, architectural patterns | WHY | semi-automated |
| `grma` | Grammar: syntax, declarations, block structure | HOW | auto |
| `bhva` | Behavioral: rules, enforcement, compliance | HOW | semi-automated |
| `phla` | Philosophy: design principles | WHY | semi-automated |
| `trma` | Terminology: terms & definitions (78 entries) | WHAT | auto |
| `onma` | Ontological mapping (67 entries) | WHAT | auto |
| `linear` | Linear section index (917 entries) | — | auto |
| `xref` | Cross-reference graph (267 refs) | — | auto |

## Weight Model

```
score = META_WEIGHT(30) × metaRank + ORDER_WEIGHT(10) × order
      - (ontoMatch ? ONTO_BONUS(15) : 0)
      + (isRef ? REF_PENALTY(2) : 0)
```

### Tier Boundaries

| Tier | Score | Label |
|------|-------|-------|
| 1 | ≤ 60 | Core definitions |
| 2 | ≤ 95 | Normative properties |
| 3 | ≤ 125 | Registry & cross-refs |
| 4 | > 125 | Supplementary context |

## Scripts

```bash
# Build TypeScript
npm run build

# Rebuild all indices (4 phases: tsc → parallel indices → linear → abstracts)
npm run build:all

# Quick rebuild (skip abstracts)
npm run build:all:quick

# Check index staleness (no rebuild)
npm run build:check

# Individual index builders
npm run build:xref
npm run build:aspects
npm run build:terminology
npm run build:ontological
npm run build:abstracts

# Index management CLI (manual indices: phya/sema/ont/desa/phla/bhva)
npm run index -- help
npm run index:scan -- D1
npm run index:check -- ont
npm run index:show -- ont compilerEnforcementModel

# Run tests
npm test

# Watch mode
npm run test:watch

# Dev mode (tsc --watch)
npm run dev
```

## Rebuild Pipeline

`npm run build:all` executes `rebuildAll.ts` in 4 phases:

| Phase | Action | Parallelism |
|-------|--------|-------------|
| 0 | `tsc` | Sequential |
| 1 | trma + onma + xref + grma + bhva (suggest-only) | Parallel |
| 2 | linear index (depends on aspect indices) | Sequential |
| 3 | abstracts (modifies all indices in-place) | Sequential |

Options: `--skip-tsc`, `--skip-abstracts`, `--phase N`, `--dry-run`, `--check`.

## Index Maintenance (addToIndex)

CLI tool for managing **manual** aspect indices (`phya`, `sema`, `ont`, `desa`, `phla`, `bhva`).

Auto-generated indices (`grma`, `trma`, `onma`, `linear`, `xref`, `grix`) are rebuilt by `buildAspectIndices.ts` and other scripts.
Manual indices require explicit management when spec sections are added, moved, or removed.

> **Write guard**: all mutation commands (`add-unit`, `add-chain`, `add-ref`, `remove-chain`, `reorder`) reject auto-generated index aliases with a clear error message. This prevents accidental data loss on the next rebuild.

### Commands

| Command | Purpose |
|---------|---------|
| `scan <prefix>` | Scan spec for headings matching prefix, show covered/uncovered status |
| `show <alias> [unit]` | Display index structure or unit details |
| `add-unit <alias> <name>` | Create new unit with keywords + chain entries |
| `add-chain <alias> <name>` | Add chain entries to existing unit |
| `add-ref <alias> <name>` | Add `$ref` cross-reference to a unit |
| `remove-chain <alias> <name>` | Remove chain entries from a unit |
| `reorder <alias> <name>` | Renumber `Order` fields sequentially |
| `check <alias>` | Validate all chains against spec headings, detect duplicates |

### Safety Features

- **Chain validation** — every chain base is checked against actual spec headings
- **Duplicate detection** — warns when a chain is already covered in the same index
- **$ref validation** — verifies target unit exists in the referenced index
- **Auto-heading detection** — reads heading level and title from spec automatically (both numbered `## D1.2 Title` and plain-text `# ANNEX D1 — Title` headings)
- **Backup** — creates `.bak` before overwriting (use `--no-backup` to skip)
- **Dry-run** — preview changes without writing (`--dry-run`)

### Workflow: Adding a New Annex to Indices

```bash
# 1. Discover uncovered headings
node dist/scripts/addToIndex.js scan D1

# 2. Create new unit in primary index
node dist/scripts/addToIndex.js add-unit ont compilerEnforcementModel \
  --keywords "compiler,enforcement,SNC,EER" \
  --chains "D1.1/all,D1.2/all,D1.3/all" \
  --onto HOW

# 3. Add cross-references from related indices
node dist/scripts/addToIndex.js add-ref desa ruleDesign \
  --target '$ont/compilerEnforcementModel'

# 4. Validate
node dist/scripts/addToIndex.js check ont

# 5. Verify scan shows full coverage
node dist/scripts/addToIndex.js scan D1

# 6. Rebuild linear index + abstracts
npm run build:all
```

## Tests

140 unit tests across 6 modules (Vitest):

| File | Tests | Coverage |
|------|:-----:|----------|
| `tokenBudget.test.ts` | 21 | Token estimation, budget trimming, section boundaries, edge cases |
| `readingPlanFunnel.test.ts` | 27 | Scoring formula, tier assignment, dedup, subsumption, corrupt seq |
| `chainResolver.test.ts` | 24 | All suffix types, range expansion, malformed inputs, filesystem |
| `indexLoader.test.ts` | 23 | Keyword search, onto boost, heading extraction, corrupt data |
| `xrefLoader.test.ts` | 25 | Forward/reverse lookup, scoring, refType filter, corrupt data |
| `keywordEnricher.test.ts` | 20 | T&D expansion, co-occurrence, waterfall, corrupt data |

## MCP Configuration

Add to VS Code `settings.json` or `.vscode/mcp.json`:

```json
{
  "mcpServers": {
    "elia-spec-reader": {
      "command": "node",
      "args": ["tools/spec-reader/dist/server.js"],
      "cwd": "${workspaceFolder}"
    }
  }
}
```

## License

See [LICENSE.txt](../../LICENSE.txt) in the spec root.
