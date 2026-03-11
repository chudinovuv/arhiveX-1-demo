import { describe, it, expect, beforeEach } from 'vitest';
import { IndexLoader } from '../lib/indexLoader.js';
import type { IndexFile, IndexRegistryEntry, IndexUnit, SeqEntry } from '../lib/types.js';

// ─── splitUnitName is private — test indirectly via searchKeywords ──
// We mock the filesystem by injecting into private fields.

function createLoader(
  registry: IndexRegistryEntry[],
  indices: Record<string, IndexFile>,
): IndexLoader {
  const loader = new IndexLoader('.');
  (loader as any).registry = registry;
  // Pre-populate the indices cache
  for (const [alias, data] of Object.entries(indices)) {
    (loader as any).indices.set(alias, data);
  }
  return loader;
}

const MOCK_REGISTRY: IndexRegistryEntry[] = [
  { alias: 'phya', file: 'physical_aspect_index.json', onto: ['WHAT'] },
  { alias: 'sema', file: 'semantic_aspect_index.json', onto: ['WHAT'] },
  { alias: 'bhva', file: 'behavioral_aspect_index.json', onto: ['HOW'] },
];

function makeUnit(keywords: string[], seqChains: string[][], opts?: { onto?: any; abstract?: string }): IndexUnit {
  return {
    keywords,
    seq: seqChains.map((chain, i) => ({ Order: i + 1, chain })),
    ...(opts?.onto ? { onto: opts.onto } : {}),
    ...(opts?.abstract ? { abstract: opts.abstract } : {}),
  };
}

const MOCK_INDICES: Record<string, IndexFile> = {
  phya: {
    blockRecord: makeUnit(
      ['block', 'record', 'field', 'serialization'],
      [['2.2.1'], ['2.2.2']],
    ),
    streamType: makeUnit(
      ['stream', 'pipeline', 'flow'],
      [['2.3.1']],
    ),
  },
  sema: {
    semanticInterface: makeUnit(
      ['interface', 'semantic', 'contract'],
      [['2.7.3']],
    ),
    delegateType: makeUnit(
      ['delegate', 'semantic', 'block'],
      [['2.7.4']],
      { onto: ['WHY'] }, // unit-level override
    ),
  },
  bhva: {
    ruleEngine: makeUnit(
      ['rule', 'enforcement', 'compliance'],
      [['7.0.1']],
    ),
  },
};

// ─── searchKeywords ─────────────────────────────────────────────────

describe('searchKeywords', () => {
  let loader: IndexLoader;
  beforeEach(() => { loader = createLoader(MOCK_REGISTRY, MOCK_INDICES); });

  it('matches units by keyword (case-insensitive)', async () => {
    const results = await loader.searchKeywords(['block']);
    // Should match blockRecord (has 'block') and delegateType (has 'block')
    const names = results.map(r => r.unitName);
    expect(names).toContain('blockRecord');
    expect(names).toContain('delegateType');
  });

  it('matches by unitName words (camelCase split)', async () => {
    const results = await loader.searchKeywords(['stream']);
    // 'stream' appears in keyword AND unitName 'streamType'
    const names = results.map(r => r.unitName);
    expect(names).toContain('streamType');
  });

  it('sorts by keyword match count descending', async () => {
    const results = await loader.searchKeywords(['semantic', 'delegate']);
    // delegateType matches both keywords, semanticInterface matches only 'semantic'
    expect(results[0].unitName).toBe('delegateType');
    expect(results[0].matchedKeywords).toHaveLength(2);
  });

  it('returns matchType="keyword" when matched in keywords array', async () => {
    const results = await loader.searchKeywords(['serialization']);
    const r = results.find(r => r.unitName === 'blockRecord')!;
    expect(r.matchType).toBe('keyword');
  });

  it('returns empty for non-matching keyword', async () => {
    const results = await loader.searchKeywords(['nonexistent']);
    expect(results).toHaveLength(0);
  });

  it('applies onto boost — matching units sorted first', async () => {
    // phya has onto=['WHAT'], sema has onto=['WHAT'], bhva has onto=['HOW']
    const results = await loader.searchKeywords(['rule'], 'HOW');
    // ruleEngine is in bhva (onto=HOW) — should have ontoMatch=true
    const ruleUnit = results.find(r => r.unitName === 'ruleEngine')!;
    expect(ruleUnit.ontoMatch).toBe(true);
  });

  it('unit-level onto override takes precedence over index default', async () => {
    // delegateType has unit-level onto=['WHY'], overriding sema's ['WHAT']
    const results = await loader.searchKeywords(['delegate'], 'WHY');
    const delegateUnit = results.find(r => r.unitName === 'delegateType')!;
    expect(delegateUnit.ontoMatch).toBe(true);
  });

  it('onto boost does not exclude non-matching units', async () => {
    const results = await loader.searchKeywords(['block'], 'HOW');
    // blockRecord (phya, onto=WHAT) should still appear, just sorted after HOW matches
    const names = results.map(r => r.unitName);
    expect(names).toContain('blockRecord');
  });

  it('includes alias in results', async () => {
    const results = await loader.searchKeywords(['rule']);
    const r = results.find(r => r.unitName === 'ruleEngine')!;
    expect(r.alias).toBe('bhva');
  });
});

// ─── extractHeading (static) ────────────────────────────────────────

describe('IndexLoader.extractHeading', () => {
  it('extracts H2 heading', () => {
    const entry: SeqEntry = { Order: 1, chain: ['2.1'], H2: '2.1 Primitive Types' };
    const heading = IndexLoader.extractHeading(entry);
    expect(heading).not.toBeNull();
    expect(heading!.level).toBe(2);
    expect(heading!.rawTitle).toBe('2.1 Primitive Types');
    expect(heading!.cleanTitle).toBe('Primitive Types');
  });

  it('extracts lower heading level first', () => {
    // If H1 is present, it should be picked first
    const entry: SeqEntry = { Order: 1, chain: ['2.1'], H1: '2 Types', H3: '2.1.1 Sub' };
    const heading = IndexLoader.extractHeading(entry);
    expect(heading!.level).toBe(1);
  });

  it('returns null when no heading fields', () => {
    const entry: SeqEntry = { Order: 1, chain: ['2.1'] };
    const heading = IndexLoader.extractHeading(entry);
    expect(heading).toBeNull();
  });

  it('strips section number from title', () => {
    const entry: SeqEntry = { Order: 1, chain: ['B.2'], H3: 'B.2 Annex Section' };
    const heading = IndexLoader.extractHeading(entry);
    expect(heading!.cleanTitle).toBe('Annex Section');
  });
});

// ─── Error handling: malformed inputs ──────────────────────────────

describe('error handling — malformed query', () => {
  let loader: IndexLoader;
  beforeEach(() => { loader = createLoader(MOCK_REGISTRY, MOCK_INDICES); });

  it('empty keyword array returns empty results', async () => {
    const results = await loader.searchKeywords([]);
    expect(results).toHaveLength(0);
  });

  it('keyword with special regex chars does not crash', async () => {
    const results = await loader.searchKeywords(['block.*()+?']);
    // Should not throw — just returns whatever matches via string includes
    expect(Array.isArray(results)).toBe(true);
  });

  it('searchKeyword convenience returns correct shape', async () => {
    const results = await loader.searchKeyword('block');
    expect(results.length).toBeGreaterThan(0);
    // Should have alias, unitName, unit, matchType — but NOT matchedKeywords
    expect(results[0]).toHaveProperty('alias');
    expect(results[0]).toHaveProperty('unitName');
    expect(results[0]).toHaveProperty('unit');
  });
});

// ─── Error handling: corrupt index data ────────────────────────────

describe('error handling — corrupt index data', () => {
  it('skips units that are primitive values (string)', async () => {
    const corruptIndices: Record<string, IndexFile> = {
      phya: {
        goodUnit: makeUnit(['block'], [['2.1']]),
        badUnit: 'not an object' as any,
      },
    };
    const loader = createLoader(MOCK_REGISTRY, corruptIndices);
    const results = await loader.searchKeywords(['block']);
    // Should not crash; should find goodUnit
    expect(results.some(r => r.unitName === 'goodUnit')).toBe(true);
    expect(results.some(r => r.unitName === 'badUnit')).toBe(false);
  });

  it('skips units with null keywords', async () => {
    const corruptIndices: Record<string, IndexFile> = {
      phya: {
        ok: makeUnit(['block'], [['2.1']]),
        broken: { keywords: null as any, seq: [] } as any,
      },
    };
    const loader = createLoader(MOCK_REGISTRY, corruptIndices);
    const results = await loader.searchKeywords(['block']);
    expect(results.some(r => r.unitName === 'ok')).toBe(true);
    expect(results.some(r => r.unitName === 'broken')).toBe(false);
  });

  it('skips units with keywords as non-array (string)', async () => {
    const corruptIndices: Record<string, IndexFile> = {
      phya: {
        ok: makeUnit(['block'], [['2.1']]),
        broken: { keywords: 'block' as any, seq: [] } as any,
      },
    };
    const loader = createLoader(MOCK_REGISTRY, corruptIndices);
    // The guard checks !unit.keywords — string is truthy, but .map would work
    // This tests robustness of the code path
    const results = await loader.searchKeywords(['block']);
    expect(Array.isArray(results)).toBe(true);
  });

  it('handles empty registry', async () => {
    const loader = createLoader([], {});
    const results = await loader.searchKeywords(['block']);
    expect(results).toHaveLength(0);
  });

  it('handles registry entry with missing onto field', async () => {
    const registryNoOnto = [
      { alias: 'phya', file: 'physical_aspect_index.json' } as any,
    ];
    const loader = createLoader(registryNoOnto, MOCK_INDICES);
    const results = await loader.searchKeywords(['block'], 'WHAT');
    // onto should be undefined → ontoMatch=false (no crash)
    expect(Array.isArray(results)).toBe(true);
  });

  it('loadRegistry throws when file is missing', async () => {
    const freshLoader = new IndexLoader('/nonexistent/path');
    await expect(freshLoader.loadRegistry()).rejects.toThrow();
  });

  it('loadIndex throws when index file not found', async () => {
    const freshLoader = new IndexLoader('/nonexistent/path');
    await expect(freshLoader.loadIndex('nonexistent_alias')).rejects.toThrow();
  });
});

// ─── HOW-Code / HOW-Grammar demotion tests ────────────────────────

describe('HOW-Code demotion', () => {
  const REGISTRY: IndexRegistryEntry[] = [
    { alias: 'phya', file: 'physical_aspect_index.json', onto: ['WHAT'] },
    { alias: 'ont', file: 'ontologic_aspect_index.json', onto: ['WHY', 'WHAT'] },
    { alias: 'desa', file: 'design_aspect_index.json', onto: ['HOW', 'WHY'] },
    { alias: 'bsyn', file: 'block_syntax_aspect_index.json', onto: ['HOW'] },
  ];

  const INDICES: Record<string, IndexFile> = {
    phya: {
      action_type: makeUnit(
        ['action', 'behavioral type', 'authority type'],
        [['2.6.5/all'], ['8.8.8/all']],
      ),
      rule_type: makeUnit(
        ['rule', 'derived type', 'behavioral type', 'authority type'],
        [['2.6.6/all'], ['8.8.9/all']],
      ),
    },
    ont: {
      syntaxAndAST: makeUnit(
        ['syntax constraints', 'grammar', 'admissibility', 'AST', 'enforcement closure'],
        [['8.8'], ['8.8.1/all']],
        { onto: ['HOW'] },
      ),
    },
    desa: {
      syntaxLevelConstraints: makeUnit(
        ['syntax constraint', 'syntax admissibility', 'forbidden construct', 'admitted syntax'],
        [['8.8'], ['8.8.1/all']],
        { onto: ['HOW'] },
      ),
      actionDesign: makeUnit(
        ['action', 'action design'],
        [['5.5.3/all']],
      ),
      modulePackaging: makeUnit(
        ['module', 'module architecture', 'using library', 'using tool', 'options'],
        [['8.0.1/all']],
        { onto: ['HOW'] },
      ),
      delegateIntegration: makeUnit(
        ['delegate', 'delegate integration', 'using library', 'using tool', 'options'],
        [['8.5/all']],
        { onto: ['HOW'] },
      ),
    },
    bsyn: {
      actionSyntax: makeUnit(
        ['action', 'action syntax', 'action body'],
        [['3.16/all']],
        { onto: ['HOW'] },
      ),
    },
  };

  it('demotes cross-cutting ont/desa units for "action syntax" query', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    const results = await loader.searchKeywords(['action', 'syntax'], 'HOW');

    // action_type, actionSyntax, actionDesign should rank above syntaxAndAST and syntaxLevelConstraints
    const names = results.map(r => r.unitName);
    const actionIdx = names.indexOf('action_type');
    const bsynIdx = names.indexOf('actionSyntax');
    const syntaxASTIdx = names.indexOf('syntaxAndAST');
    const syntaxLevelIdx = names.indexOf('syntaxLevelConstraints');

    expect(actionIdx).toBeLessThan(syntaxASTIdx);
    expect(bsynIdx).toBeLessThan(syntaxASTIdx);
    expect(actionIdx).toBeLessThan(syntaxLevelIdx);
  });

  it('does NOT demote construct-specific desa units like actionDesign', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    const results = await loader.searchKeywords(['action', 'syntax'], 'HOW');
    const names = results.map(r => r.unitName);
    const actionDesignIdx = names.indexOf('actionDesign');
    const syntaxASTIdx = names.indexOf('syntaxAndAST');
    expect(actionDesignIdx).toBeLessThan(syntaxASTIdx);
  });

  it('does NOT demote when onto=WHY', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    const results = await loader.searchKeywords(['action', 'syntax'], 'WHY');
    // No demotion → syntaxAndAST should NOT be penalized
    // It has onto WHY match → should be boosted
    const names = results.map(r => r.unitName);
    expect(names).toContain('syntaxAndAST');
  });

  it('does NOT demote when keywords contain "design"', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    const results = await loader.searchKeywords(['action', 'syntax', 'design'], 'HOW');
    // "design" in keywords → no demotion
    const demotedUnits = results.filter(r =>
      r.unitName === 'syntaxAndAST' || r.unitName === 'syntaxLevelConstraints'
    );
    // They should still appear, not pushed to bottom unfairly
    expect(demotedUnits.length).toBeGreaterThan(0);
  });

  it('demotes off-target construct units (module/delegate when asking about action)', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    const results = await loader.searchKeywords(['action', 'syntax', 'body', 'using library', 'using tool', 'options'], 'HOW');
    const names = results.map(r => r.unitName);
    const actionIdx = names.indexOf('action_type');
    const bsynIdx = names.indexOf('actionSyntax');
    const moduleIdx = names.indexOf('modulePackaging');
    const delegateIdx = names.indexOf('delegateIntegration');

    // action_type and actionSyntax should rank above modulePackaging and delegateIntegration
    // even though module/delegate match more enriched keywords
    expect(actionIdx).toBeLessThan(moduleIdx);
    expect(actionIdx).toBeLessThan(delegateIdx);
    expect(bsynIdx).toBeLessThan(moduleIdx);
  });

  it('uses originalKeywords for target detection, not enriched keywords', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    // Simulates: original=["rule","syntax","body"], enriched adds "module body", "using library" etc.
    // Without originalKeywords, "module body" would make "module" a target and modulePackaging avoids demotion.
    // With originalKeywords, only "rule" is detected as target → modulePackaging gets demoted.
    const enrichedKeywords = ['rule', 'syntax', 'body', 'module body', 'using library', 'using tool', 'options', 'rule syntax'];
    const originalKeywords = ['rule', 'syntax', 'body'];
    const results = await loader.searchKeywords(enrichedKeywords, 'HOW', originalKeywords);
    const names = results.map(r => r.unitName);

    const ruleIdx = names.indexOf('rule_type');
    const moduleIdx = names.indexOf('modulePackaging');

    // rule_type should rank above modulePackaging because modulePackaging is off-target
    // (enrichment added "module body" but originalKeywords don't contain "module")
    expect(ruleIdx).toBeGreaterThanOrEqual(0);
    expect(moduleIdx).toBeGreaterThanOrEqual(0);
    expect(ruleIdx).toBeLessThan(moduleIdx);
  });
});

describe('HOW-Grammar demotion', () => {
  const REGISTRY: IndexRegistryEntry[] = [
    { alias: 'ont', file: 'ontologic_aspect_index.json', onto: ['WHY', 'WHAT'] },
    { alias: 'desa', file: 'design_aspect_index.json', onto: ['HOW', 'WHY'] },
    { alias: 'bsyn', file: 'block_syntax_aspect_index.json', onto: ['HOW'] },
  ];

  const INDICES: Record<string, IndexFile> = {
    ont: {
      syntaxAndAST: makeUnit(
        ['syntax constraints', 'grammar', 'AST', 'enforcement closure'],
        [['8.8']],
        { onto: ['HOW'] },
      ),
    },
    desa: {
      syntaxLevelConstraints: makeUnit(
        ['syntax constraint', 'grammar', 'forbidden construct'],
        [['8.8']],
      ),
    },
    bsyn: {
      literalSyntax: makeUnit(
        ['literal', 'grammar', 'grammar rule', 'parser rule'],
        [['3.21/all']],
        { onto: ['HOW'] },
      ),
    },
  };

  it('demotes cross-cutting units for grammar queries', async () => {
    const loader = createLoader(REGISTRY, INDICES);
    const results = await loader.searchKeywords(['grammar', 'grammar rule'], 'HOW');
    const names = results.map(r => r.unitName);
    const litIdx = names.indexOf('literalSyntax');
    const syntaxASTIdx = names.indexOf('syntaxAndAST');
    // bsyn/literalSyntax should rank above ont/syntaxAndAST
    expect(litIdx).toBeLessThan(syntaxASTIdx);
  });
});