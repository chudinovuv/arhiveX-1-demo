import { describe, it, expect, beforeEach } from 'vitest';
import { XRefLoader, type XRefIndex, type XRefType } from '../lib/xrefLoader.js';

// ─── We test the scoring/filtering logic by injecting mock data ─────
// XRefLoader.load() reads from disk; we bypass it by setting the private `data` field.

function createLoader(mockData: XRefIndex): XRefLoader {
  const loader = new XRefLoader('.');
  // Inject mock data via private field
  (loader as any).data = mockData;
  return loader;
}

const MOCK_DATA: XRefIndex = {
  meta: {
    alias: 'xref',
    generated: '2024-01-01',
    version: '1.0',
    fileCount: 3,
    sectionCount: 4,
    totalRefs: 8,
    refsByType: { section: 4, standard: 2, url: 1, person: 1 },
  },
  sections: {
    '2.7.3': {
      file: '2_7_3_semantic_interface.md',
      title: 'Semantic Interface',
      refs: [
        { type: 'section', target: '2.7.4', context: 'see delegate', line: 10 },
        { type: 'section', target: '4.0', context: 'semantic model', line: 20 },
        { type: 'standard', target: 'GDPR', context: 'compliance', line: 30 },
        { type: 'url', target: 'https://example.com', context: 'docs', line: 40 },
      ],
    },
    '8.1': {
      file: '8_0_resilience_model.md',
      title: 'Resilience',
      refs: [
        { type: 'section', target: '2.7.3', context: 'back-ref', line: 5 },
        { type: 'standard', target: 'DORA', context: 'regulation', line: 15 },
        { type: 'person', target: 'Jan Doe', context: 'contact', line: 25 },
      ],
    },
    '5.0': {
      file: '5_0_domain_semantic_authority.md',
      title: 'Authority Model',
      refs: [
        { type: 'section', target: '2.7.3', context: 'depends on', line: 8 },
      ],
    },
    '6.0': {
      file: '6_0_domain_driven_flow_design.md',
      title: 'Flow Design',
      refs: [],
    },
  },
};

// ─── lookup (forward) ───────────────────────────────────────────────

describe('lookup (forward)', () => {
  let loader: XRefLoader;
  beforeEach(() => { loader = createLoader(MOCK_DATA); });

  it('returns all refs for a section', async () => {
    const results = await loader.lookup(['2.7.3'], 1);
    expect(results).toHaveLength(4);
    expect(results.map(r => r.target)).toContain('2.7.4');
    expect(results.map(r => r.target)).toContain('GDPR');
  });

  it('scores with formula: 30 × metaRank + typeWeight', async () => {
    const results = await loader.lookup(['2.7.3'], 2);
    const sectionRef = results.find(r => r.type === 'section')!;
    const standardRef = results.find(r => r.type === 'standard')!;
    const urlRef = results.find(r => r.type === 'url')!;
    // section: 30×2 + 0 = 60
    expect(sectionRef.score).toBe(60);
    // standard: 30×2 + 5 = 65
    expect(standardRef.score).toBe(65);
    // url: 30×2 + 10 = 70
    expect(urlRef.score).toBe(70);
  });

  it('sorts by score ascending', async () => {
    const results = await loader.lookup(['2.7.3'], 1);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeGreaterThanOrEqual(results[i - 1].score);
    }
  });

  it('filters by refType', async () => {
    const results = await loader.lookup(['2.7.3'], 1, ['standard' as XRefType]);
    expect(results).toHaveLength(1);
    expect(results[0].target).toBe('GDPR');
  });

  it('handles multiple sections', async () => {
    const results = await loader.lookup(['2.7.3', '8.1'], 1);
    expect(results.length).toBeGreaterThan(4); // 4 from 2.7.3 + 3 from 8.1
  });

  it('returns empty for unknown section', async () => {
    const results = await loader.lookup(['99.99'], 1);
    expect(results).toHaveLength(0);
  });

  it('returns empty for section with no refs', async () => {
    const results = await loader.lookup(['6.0'], 1);
    expect(results).toHaveLength(0);
  });
});

// ─── reverseLookup ──────────────────────────────────────────────────

describe('reverseLookup', () => {
  let loader: XRefLoader;
  beforeEach(() => { loader = createLoader(MOCK_DATA); });

  it('finds sections that reference a target section', async () => {
    const results = await loader.reverseLookup('2.7.3');
    expect(results).toHaveLength(2); // 8.1 and 5.0 both reference 2.7.3
    const sources = results.map(r => r.fromSection);
    expect(sources).toContain('8.1');
    expect(sources).toContain('5.0');
  });

  it('is case-insensitive', async () => {
    const results = await loader.reverseLookup('gdpr');
    expect(results).toHaveLength(1);
    expect(results[0].fromSection).toBe('2.7.3');
  });

  it('scores at 0 for reverse lookups', async () => {
    const results = await loader.reverseLookup('2.7.4');
    for (const r of results) {
      expect(r.score).toBe(0);
    }
  });

  it('returns empty for target not referenced anywhere', async () => {
    const results = await loader.reverseLookup('nonexistent');
    expect(results).toHaveLength(0);
  });
});

// ─── expandToChains ─────────────────────────────────────────────────

describe('expandToChains', () => {
  let loader: XRefLoader;
  beforeEach(() => { loader = createLoader(MOCK_DATA); });

  it('returns only section-type targets', async () => {
    const chains = await loader.expandToChains(['2.7.3']);
    expect(chains).toContain('2.7.4');
    expect(chains).toContain('4.0');
    // Should NOT include standards/urls
    expect(chains).not.toContain('GDPR');
    expect(chains).not.toContain('https://example.com');
  });

  it('deduplicates targets across sections', async () => {
    // Both 8.1 and 5.0 reference 2.7.3
    const chains = await loader.expandToChains(['8.1', '5.0']);
    const count273 = chains.filter(c => c === '2.7.3').length;
    expect(count273).toBe(1); // deduplicated
  });

  it('returns empty for unknown section', async () => {
    const chains = await loader.expandToChains(['99.99']);
    expect(chains).toHaveLength(0);
  });

  it('returns empty for section with no refs', async () => {
    const chains = await loader.expandToChains(['6.0']);
    expect(chains).toHaveLength(0);
  });
});

// ─── Error handling: malformed inputs ──────────────────────────────

describe('error handling — malformed inputs', () => {
  let loader: XRefLoader;
  beforeEach(() => { loader = createLoader(MOCK_DATA); });

  it('lookup — empty sections array returns empty', async () => {
    const results = await loader.lookup([], 1);
    expect(results).toHaveLength(0);
  });

  it('lookup — metaRank=0 produces score equal to typeWeight only', async () => {
    const results = await loader.lookup(['2.7.3'], 0);
    const sectionRef = results.find(r => r.type === 'section')!;
    // 30×0 + 0 = 0
    expect(sectionRef.score).toBe(0);
  });

  it('lookup — negative metaRank produces negative scores', async () => {
    const results = await loader.lookup(['2.7.3'], -1);
    const sectionRef = results.find(r => r.type === 'section')!;
    // 30×(-1) + 0 = -30
    expect(sectionRef.score).toBe(-30);
  });

  it('reverseLookup — empty string target returns empty', async () => {
    const results = await loader.reverseLookup('');
    expect(results).toHaveLength(0);
  });

  it('expandToChains — empty sections array returns empty', async () => {
    const chains = await loader.expandToChains([]);
    expect(chains).toHaveLength(0);
  });
});

// ─── Error handling: corrupt data ──────────────────────────────────

describe('error handling — corrupt index data', () => {
  it('lookup — section with null refs array throws TypeError', async () => {
    const corruptData: XRefIndex = {
      ...MOCK_DATA,
      sections: {
        '9.9': { file: 'test.md', title: 'Corrupt', refs: null as any },
      },
    };
    const loader = createLoader(corruptData);
    // Iterating over null throws
    await expect(loader.lookup(['9.9'], 1)).rejects.toThrow();
  });

  it('lookup — ref with unknown type uses fallback weight 10', async () => {
    const customData: XRefIndex = {
      ...MOCK_DATA,
      sections: {
        '9.9': {
          file: 'test.md',
          title: 'Custom',
          refs: [
            { type: 'custom_unknown' as any, target: 'X', context: 'ctx', line: 1 },
          ],
        },
      },
    };
    const loader = createLoader(customData);
    const results = await loader.lookup(['9.9'], 1);
    // 30×1 + 10 (fallback) = 40
    expect(results[0].score).toBe(40);
  });

  it('load — throws when cross_ref_index.json is missing', async () => {
    const freshLoader = new XRefLoader('/nonexistent/path');
    await expect(freshLoader.load()).rejects.toThrow();
  });

  it('handles empty sections object', async () => {
    const emptyData: XRefIndex = {
      meta: { ...MOCK_DATA.meta, sectionCount: 0, totalRefs: 0 },
      sections: {},
    };
    const loader = createLoader(emptyData);
    const results = await loader.lookup(['anything'], 1);
    expect(results).toHaveLength(0);
  });

  it('getMeta returns meta after load', async () => {
    const loader = createLoader(MOCK_DATA);
    const meta = await loader.getMeta();
    expect(meta.alias).toBe('xref');
    expect(meta.totalRefs).toBe(8);
  });
});
