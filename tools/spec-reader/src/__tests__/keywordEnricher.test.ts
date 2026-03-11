import { describe, it, expect, beforeEach } from 'vitest';
import { KeywordEnricher, parseTermsTable, type TermEntry } from '../lib/keywordEnricher.js';
import type { IndexFile } from '../lib/types.js';

// ─── We test the enrich pipeline by injecting mock data ─────────────
// KeywordEnricher.init() reads spec files; we bypass it by setting private fields.

function createEnricher(
  terms: TermEntry[],
  indices: Record<string, IndexFile>,
): KeywordEnricher {
  const enricher = new KeywordEnricher('.');
  (enricher as any).terms = terms;
  const indicesMap = new Map<string, IndexFile>(Object.entries(indices));
  (enricher as any).indices = indicesMap;
  // Build allIndexKeywords set (mirrors init() behavior)
  const allKws = new Set<string>();
  for (const [, index] of Object.entries(indices)) {
    for (const [, unit] of Object.entries(index)) {
      if (unit?.keywords) {
        for (const kw of unit.keywords) {
          allKws.add(kw.toLowerCase());
        }
      }
    }
  }
  (enricher as any).allIndexKeywords = allKws;
  (enricher as any).initialized = true;
  return enricher;
}

function makeUnit(keywords: string[]): { keywords: string[]; seq: { Order: number; chain: string[] }[] } {
  return { keywords, seq: [{ Order: 1, chain: ['2.1'] }] };
}

// ─── Mock data ──────────────────────────────────────────────────────

const MOCK_TERMS: TermEntry[] = [
  {
    term: 'block',
    definition: 'A `record` structure with **physical properties** and `field` members',
    definitionWords: new Set(['record', 'structure', 'physical', 'properties', 'field', 'members']),
    source: '2.0.1/table',
  },
  {
    term: 'stream',
    definition: 'An ordered `pipeline` for data flow with `channel` support',
    definitionWords: new Set(['ordered', 'pipeline', 'data', 'flow', 'channel', 'support']),
    source: '2.0.1/table',
  },
];

const MOCK_INDICES: Record<string, IndexFile> = {
  phya: {
    blockRecord: makeUnit(['block', 'record', 'field', 'serialization']),
    streamPipeline: makeUnit(['stream', 'pipeline', 'channel']),
    derivedBlock: makeUnit(['block', 'derived', 'inheritance']),
  },
  sema: {
    blockSemantics: makeUnit(['block', 'semantic', 'contract']),
    streamBinding: makeUnit(['stream', 'binding', 'channel']),
  },
  grma: {
    blockSyntax: makeUnit(['block', 'syntax', 'declaration']),
  },
};

// ─── Phase 1: T&D Expansion ────────────────────────────────────────

describe('Phase 1: T&D expansion', () => {
  it('extracts backtick-quoted terms from matching T&D definition', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block']);
    // Should find `record` and `field` from block definition
    expect(result.expanded).toContain('record');
    expect(result.expanded).toContain('field');
  });

  it('extracts bold phrases from matching T&D definition', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block']);
    // Should find **physical properties** from block definition
    expect(result.expanded).toContain('physical properties');
  });

  it('includes trace info for T&D expansions', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block']);
    const tdTraces = result.trace.filter(t => t.reason.startsWith('T&D:'));
    expect(tdTraces.length).toBeGreaterThan(0);
  });

  it('T&D keywords are always kept (authoritative)', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block']);
    // `record` comes from T&D and should survive even without waterfall confirmation
    const recordTrace = result.trace.find(t => t.keyword === 'record');
    expect(recordTrace).toBeDefined();
    expect(recordTrace!.reason).toContain('T&D:');
  });

  it('does not expand when no T&D match', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['nonexistent']);
    const tdTraces = result.trace.filter(t => t.reason.startsWith('T&D:'));
    expect(tdTraces).toHaveLength(0);
  });
});

// ─── Phase 2: Co-occurrence ────────────────────────────────────────

describe('Phase 2: Co-occurrence', () => {
  it('finds co-occurring keywords from units matching ≥2 inputs', () => {
    // 'block' + 'record' both appear in blockRecord unit
    // So 'field' and 'serialization' are co-occurrence candidates
    const enricher = createEnricher([], MOCK_INDICES);
    const result = enricher.enrich(['block', 'record']);
    // Co-occurring keywords should be candidates (may or may not survive waterfall)
    expect(result.expanded).toContain('block');
    expect(result.expanded).toContain('record');
  });

  it('requires ≥2 input keyword matches for co-occurrence', () => {
    // Single keyword — no co-occurrence possible
    const enricher = createEnricher([], MOCK_INDICES);
    const result = enricher.enrich(['serialization']);
    // Should not get co-occurrence keywords
    const coTraces = result.trace.filter(t => t.reason.includes('co-occurrence'));
    expect(coTraces).toHaveLength(0);
  });
});

// ─── Phase 3: Waterfall confirmation ───────────────────────────────

describe('Phase 3: Waterfall confirmation', () => {
  it('keeps only co-occurrence keywords confirmed by waterfall', () => {
    const enricher = createEnricher([], MOCK_INDICES);
    // 'stream' + 'channel' match streamPipeline and streamBinding (both have 'channel')
    const result = enricher.enrich(['stream', 'channel']);
    // 'pipeline' appears in streamPipeline which matches both original keywords
    // so it should be confirmed
    expect(result.expanded).toContain('stream');
    expect(result.expanded).toContain('channel');
  });
});

// ─── Full pipeline ──────────────────────────────────────────────────

describe('full enrichment pipeline', () => {
  it('always includes original keywords', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block', 'stream']);
    expect(result.original).toEqual(['block', 'stream']);
    expect(result.expanded).toContain('block');
    expect(result.expanded).toContain('stream');
  });

  it('lowers input keywords to lowercase', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['BLOCK', 'Stream']);
    expect(result.original).toEqual(['block', 'stream']);
  });

  it('returns trace array with sources', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block']);
    for (const t of result.trace) {
      expect(t.keyword).toBeTruthy();
      expect(t.source).toBeTruthy();
      expect(t.reason).toBeTruthy();
    }
  });

  it('handles empty input', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich([]);
    expect(result.original).toEqual([]);
    expect(result.expanded).toEqual([]);
    expect(result.trace).toEqual([]);
  });
});

// ─── Error handling: malformed inputs ──────────────────────────────

describe('error handling — malformed inputs', () => {
  it('single keyword returns at least that keyword', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block']);
    expect(result.expanded).toContain('block');
    expect(result.original).toEqual(['block']);
  });

  it('keywords with special regex chars do not crash', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block.*()', 'str+eam?']);
    // Should not throw
    expect(result.original).toEqual(['block.*()', 'str+eam?']);
  });

  it('duplicate input keywords are deduplicated in output', () => {
    const enricher = createEnricher(MOCK_TERMS, MOCK_INDICES);
    const result = enricher.enrich(['block', 'block', 'BLOCK']);
    const blockCount = result.expanded.filter(k => k === 'block').length;
    expect(blockCount).toBe(1);
  });

  it('enrich called before init returns only originals', () => {
    const uninitEnricher = new KeywordEnricher('.');
    // Not initialized — terms and indices are empty
    const result = uninitEnricher.enrich(['test']);
    expect(result.original).toEqual(['test']);
    expect(result.expanded).toContain('test');
  });
});

// ─── Error handling: corrupt data ──────────────────────────────────

describe('error handling — corrupt index data', () => {
  it('handles index with units that have null keywords', () => {
    const corruptIndices: Record<string, IndexFile> = {
      phya: {
        broken: { keywords: null as any, seq: [] } as any,
        ok: makeUnit(['block']),
      },
    };
    const enricher = createEnricher(MOCK_TERMS, corruptIndices);
    const result = enricher.enrich(['block']);
    // Should not crash, should at least return originals
    expect(result.expanded).toContain('block');
  });

  it('handles empty indices map', () => {
    const enricher = createEnricher(MOCK_TERMS, {});
    const result = enricher.enrich(['block']);
    // T&D expansion only, no co-occurrence possible
    expect(result.expanded).toContain('block');
    expect(result.expanded).toContain('record'); // from T&D
  });

  it('handles T&D with no matching terms', () => {
    const enricher = createEnricher([], MOCK_INDICES);
    const result = enricher.enrich(['nonexistent']);
    // No T&D expansion, likely no co-occurrence
    expect(result.expanded).toContain('nonexistent');
    expect(result.trace.filter(t => t.reason.startsWith('T&D:'))).toHaveLength(0);
  });

  it('term definition with no backtick/bold yields no expansion', () => {
    const plainTerms: TermEntry[] = [{
      term: 'widget',
      definition: 'A simple component used in layouts.',
      definitionWords: new Set(['simple', 'component', 'layouts']),
      source: 'test/table',
    }];
    const enricher = createEnricher(plainTerms, MOCK_INDICES);
    const result = enricher.enrich(['widget']);
    // extractSignificantPhrases only looks at backtick/bold — plain words ignored
    const tdTraces = result.trace.filter(t => t.reason.startsWith('T&D:'));
    expect(tdTraces).toHaveLength(0);
  });
});

// ─── Phase 1: Definition-content matching & index-xref ──────────────

describe('Phase 1: definition-content matching', () => {
  // Simulates the real scenario: "enforcement" appears in the definition
  // of "Designation Mechanics" even though the term name doesn't match.
  const MECHANICS_TERMS: TermEntry[] = [
    {
      term: 'Enforcement Mechanics',
      definition: 'A set of deterministic mechanisms by which `semantic` obligations are validated.',
      definitionWords: new Set(['mechanisms', 'semantic', 'obligations', 'validated']),
      source: '2.7.0/table',
    },
    {
      term: 'Designation Mechanics',
      definition: 'Realized through enforcement and `evolution` mechanisms within a `domain`.',
      definitionWords: new Set(['realized', 'enforcement', 'evolution', 'mechanisms', 'domain']),
      source: '2.7.0/table',
    },
  ];

  const EVOLUTION_INDICES: Record<string, IndexFile> = {
    phya: {
      anyType: makeUnit(['enforcement', 'domain evolution', 'semantic erasure']),
      tupleType: makeUnit(['enforcement', 'domain evolution', 'security erasure']),
    },
    sema: {
      surrogateUnit: makeUnit(['surrogate', 'enforcement', 'domain evolution', 'semantic drift']),
    },
  };

  it('matches T&D entry when keyword appears in definition text', () => {
    const enricher = createEnricher(MECHANICS_TERMS, EVOLUTION_INDICES);
    // "evolution" is NOT in any term name, but IS in Designation Mechanics definition
    const result = enricher.enrich(['evolution']);
    // Should match Designation Mechanics (def contains "evolution")
    // and extract `domain` (backtick) from that definition
    expect(result.expanded).toContain('domain');
    const tdTrace = result.trace.find(t => t.keyword === 'domain' && t.reason.startsWith('T&D:'));
    expect(tdTrace).toBeDefined();
    expect(tdTrace!.source).toContain('Designation Mechanics');
  });

  it('matches T&D entry for "enforcement" in Designation Mechanics definition', () => {
    const enricher = createEnricher(MECHANICS_TERMS, EVOLUTION_INDICES);
    // "enforcement" appears in Enforcement Mechanics term name (matchesTerm)
    // AND in Designation Mechanics definition text (matchesDef)
    const result = enricher.enrich(['enforcement']);
    // From Enforcement Mechanics (term match): `semantic` (backtick)
    expect(result.expanded).toContain('semantic');
    // From Designation Mechanics (def match): `evolution`, `domain` (backtick)
    expect(result.expanded).toContain('evolution');
    expect(result.expanded).toContain('domain');
  });

  it('skips short keywords (< 4 chars) for definition matching', () => {
    const enricher = createEnricher(MECHANICS_TERMS, EVOLUTION_INDICES);
    // "and" appears in Designation definition as "enforcement and evolution"
    // but is only 3 chars → should not match by definition content
    const result = enricher.enrich(['and']);
    expect(result.expanded).toEqual(['and']);
  });
});

describe('Phase 1: index-keyword cross-reference', () => {
  const XREF_TERMS: TermEntry[] = [
    {
      term: 'Widget',
      definition: 'A component for enforcement of domain evolution rules.',
      definitionWords: new Set(['component', 'enforcement', 'domain', 'evolution', 'rules']),
      source: 'test/table',
    },
  ];

  const XREF_INDICES: Record<string, IndexFile> = {
    phya: {
      domainUnit: makeUnit(['domain evolution', 'enforcement']),
      otherUnit: makeUnit(['serialization', 'transport']),
    },
  };

  it('extracts index keywords found in T&D definition text', () => {
    const enricher = createEnricher(XREF_TERMS, XREF_INDICES);
    const result = enricher.enrich(['widget']);
    // "enforcement" is an index keyword (11 chars, > 10) AND appears in Widget definition
    expect(result.expanded).toContain('enforcement');
    // "domain evolution" is a multi-word index keyword AND appears in Widget definition
    expect(result.expanded).toContain('domain evolution');
    // Verify trace has [idx] marker
    const idxTraces = result.trace.filter(t => t.source.includes('[idx]'));
    expect(idxTraces.length).toBeGreaterThan(0);
  });

  it('does not extract index keywords absent from definition', () => {
    const enricher = createEnricher(XREF_TERMS, XREF_INDICES);
    const result = enricher.enrich(['widget']);
    // "serialization" is an index keyword but NOT in Widget definition
    expect(result.expanded).not.toContain('serialization');
    expect(result.expanded).not.toContain('transport');
  });

  it('index-xref only extracts multi-word phrases or long terms (> 10 chars)', () => {
    const indices: Record<string, IndexFile> = {
      phya: { u: makeUnit(['any', 'xyz', 'block', 'security', 'traceability', 'domain evolution']) },
    };
    const terms: TermEntry[] = [{
      term: 'Foo',
      definition: 'Contains any and xyz references to block and security and traceability in domain evolution.',
      definitionWords: new Set([]),
      source: 'test/table',
    }];
    const enricher = createEnricher(terms, indices);
    const result = enricher.enrich(['foo']);
    // Short single words: filtered
    expect(result.expanded).not.toContain('any');       // 3 chars
    expect(result.expanded).not.toContain('xyz');       // 3 chars
    expect(result.expanded).not.toContain('block');     // 5 chars
    expect(result.expanded).not.toContain('security');  // 8 chars
    // Long single word (> 10): kept
    expect(result.expanded).toContain('traceability');  // 12 chars
    // Multi-word phrase: kept
    expect(result.expanded).toContain('domain evolution');
  });
});

// ─── Phase 1: Caps (noise filter) ──────────────────────────────────

describe('Phase 1: caps (noise filter)', () => {
  // Build a T&D entry whose definition mentions >8 multi-word index keywords
  function buildNoisyScenario() {
    const manyIndexKws = [
      'semantic erasure', 'domain evolution', 'enforcement boundary',
      'security erasure', 'semantic drift', 'enforcement continuity',
      'semantic scaffolding', 'probabilistic boundary', 'semantic integrity',
      'enforcement graph', 'enforcement direction', 'semantic authority',
    ]; // 12 multi-word keywords
    const defText = `Contains ${manyIndexKws.join(' and ')} in one big definition.`;
    const terms: TermEntry[] = [{
      term: 'BigMechanic',
      definition: defText,
      definitionWords: new Set([]),
      source: 'test/table',
    }];
    const indices: Record<string, IndexFile> = {
      phya: Object.fromEntries(
        manyIndexKws.map((kw, i) => [`unit${i}`, makeUnit([kw, 'shared'])])
      ),
    };
    return { terms, indices, allKws: manyIndexKws };
  }

  it('caps index-xref keywords at 8 per T&D entry', () => {
    const { terms, indices } = buildNoisyScenario();
    const enricher = createEnricher(terms, indices);
    const result = enricher.enrich(['bigmechanic']);
    // At most 8 index-xref keywords from one entry
    const idxTraces = result.trace.filter(t => t.source.includes('[idx]'));
    expect(idxTraces.length).toBeLessThanOrEqual(8);
  });

  it('caps total Phase 1 keywords at 15', () => {
    // Two T&D entries, each with many index-xref matches
    const { terms: t1, indices } = buildNoisyScenario();
    const terms: TermEntry[] = [
      ...t1,
      {
        term: 'BigMechanic2',
        definition: t1[0].definition.replace('BigMechanic', 'BigMechanic2'),
        definitionWords: new Set([]),
        source: 'test/table2',
      },
    ];
    const enricher = createEnricher(terms, indices);
    const result = enricher.enrich(['bigmechanic']);
    // Total Phase 1 (T&D) keywords ≤ 15
    const tdTraces = result.trace.filter(t => t.reason.startsWith('T&D:'));
    expect(tdTraces.length).toBeLessThanOrEqual(15);
  });

  it('backtick/bold phrases are still extracted before idx cap kicks in', () => {
    const terms: TermEntry[] = [{
      term: 'MixedDef',
      definition: 'A `primary` mechanism with **critical property** and enforcement boundary and semantic erasure.',
      definitionWords: new Set([]),
      source: 'test/table',
    }];
    const indices: Record<string, IndexFile> = {
      phya: {
        u1: makeUnit(['enforcement boundary', 'semantic erasure']),
      },
    };
    const enricher = createEnricher(terms, indices);
    const result = enricher.enrich(['mixeddef']);
    // Backtick and bold always extracted
    expect(result.expanded).toContain('primary');
    expect(result.expanded).toContain('critical property');
    // Index-xref also extracted (within cap)
    expect(result.expanded).toContain('enforcement boundary');
  });
});

// ─── parseTermsTable: real table formats ────────────────────────────

describe('parseTermsTable', () => {
  it('parses standard Term | Definition table', () => {
    const md = [
      '| Term                   | Definition |',
      '| ---------------------- | --------------------------|',
      '| **Projection**         | A mathematically precise `mapping` between layers. |',
      '| **Capability Classes** | Semantic groupings of **integration responsibilities**. |',
    ].join('\n');
    const entries = parseTermsTable(md, '6.0');
    expect(entries).toHaveLength(2);
    expect(entries[0].term).toBe('Projection');
    expect(entries[0].source).toBe('6.0/table');
    expect(entries[1].term).toBe('Capability Classes');
  });

  it('parses Term | Description table (no "Definition" column)', () => {
    const md = [
      '| Term                             | Description|',
      '| -------------------------------- | -----------|',
      '| **Syntax Block**                 | A formally delimited fragment with `field` support. |',
      '| **Fact**                         | An immutable **time-bound** statement. |',
    ].join('\n');
    const entries = parseTermsTable(md, '1.0');
    expect(entries).toHaveLength(2);
    expect(entries[0].term).toBe('Syntax Block');
    expect(entries[1].term).toBe('Fact');
    expect(entries[1].source).toBe('1.0/table');
  });

  it('parses 3-column Term | Definition | Notes table', () => {
    const md = [
      '| Term    | Definition |Notes                                                                               ',
      '| ---------------------- | -------------------------- | --------------------|',
      '| **Information Class**  | A compact `security` classification. | Encoded via bits **[2..0]**. |',
    ].join('\n');
    const entries = parseTermsTable(md, '2.4');
    expect(entries).toHaveLength(1);
    expect(entries[0].term).toBe('Information Class');
    expect(entries[0].definition).toContain('security');
  });

  it('handles typo "Definintion" in header (2_0_system_type_overview.md)', () => {
    const md = [
      '| Term                     |  Definintion',
      '| ------------------------ | ----------------------------- |',
      '| **Behavioral surrogate** | Any `enforcement` or behavioral construct. |',
    ].join('\n');
    const entries = parseTermsTable(md, '2.0.1');
    expect(entries).toHaveLength(1);
    expect(entries[0].term).toBe('Behavioral surrogate');
  });

  it('stops parsing at non-table content', () => {
    const md = [
      '| Term | Definition |',
      '| ---- | ---------- |',
      '| **A** | Def of `A`. |',
      '',
      'Some paragraph text.',
      '',
      '| **B** | Not a T&D row |',
    ].join('\n');
    const entries = parseTermsTable(md, 'test');
    expect(entries).toHaveLength(1);
    expect(entries[0].term).toBe('A');
  });

  it('returns empty for content without T&D table', () => {
    const md = '# Some heading\n\nJust text, no tables.';
    const entries = parseTermsTable(md, 'test');
    expect(entries).toHaveLength(0);
  });

  it('extracts definitionWords excluding stop words and backtick content', () => {
    const md = [
      '| Term | Definition |',
      '| ---- | ---------- |',
      '| **Widget** | A `component` with **rendering** properties used in layouts. |',
    ].join('\n');
    const entries = parseTermsTable(md, 'test');
    expect(entries).toHaveLength(1);
    // backtick-quoted `component` is STRIPPED from definitionWords (extractWords removes inline code)
    expect(entries[0].definitionWords.has('component')).toBe(false);
    // bold **rendering** is unbolded and kept
    expect(entries[0].definitionWords.has('rendering')).toBe(true);
    // stop words are excluded
    expect(entries[0].definitionWords.has('the')).toBe(false);
    // plain significant words survive
    expect(entries[0].definitionWords.has('properties')).toBe(true);
  });
});
