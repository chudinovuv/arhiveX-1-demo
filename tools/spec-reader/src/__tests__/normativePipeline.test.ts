import { describe, it, expect } from 'vitest';
import {
  classifyNormative,
  extractTermsFromLine,
  runNdp,
  applyNdpScoring,
  type NormativeLevel,
  type NdpResult,
} from '../lib/normativePipeline.js';
import type { IndexUnit } from '../lib/types.js';

// ─── classifyNormative ──────────────────────────────────────────────

describe('classifyNormative', () => {
  it('classifies MUST and SHALL as MUST', () => {
    expect(classifyNormative('MUST')).toBe('MUST');
    expect(classifyNormative('SHALL')).toBe('MUST');
    expect(classifyNormative('REQUIRED')).toBe('MUST');
  });

  it('classifies MUST NOT and SHALL NOT as MUST_NOT', () => {
    expect(classifyNormative('MUST NOT')).toBe('MUST_NOT');
    expect(classifyNormative('SHALL NOT')).toBe('MUST_NOT');
    expect(classifyNormative('MUST  NOT')).toBe('MUST_NOT'); // extra space
  });

  it('classifies SHOULD as SHOULD', () => {
    expect(classifyNormative('SHOULD')).toBe('SHOULD');
    expect(classifyNormative('RECOMMENDED')).toBe('SHOULD');
  });

  it('classifies SHOULD NOT as SHOULD_NOT', () => {
    expect(classifyNormative('SHOULD NOT')).toBe('SHOULD_NOT');
  });

  it('classifies MAY and OPTIONAL as MAY', () => {
    expect(classifyNormative('MAY')).toBe('MAY');
    expect(classifyNormative('OPTIONAL')).toBe('MAY');
  });
});

// ─── extractTermsFromLine ───────────────────────────────────────────

describe('extractTermsFromLine', () => {
  it('extracts backtick-quoted terms', () => {
    const terms = extractTermsFromLine('A binder MUST NOT invoke `action`, `flow`, or `delegate` constructs.');
    expect(terms).toContain('action');
    expect(terms).toContain('flow');
    expect(terms).toContain('delegate');
  });

  it('extracts bold terms', () => {
    const terms = extractTermsFromLine('A binder MUST be **deterministic** and MUST be **side-effect free**.');
    expect(terms).toContain('deterministic');
    expect(terms).toContain('side-effect free');
  });

  it('extracts both backtick and bold terms', () => {
    const terms = extractTermsFromLine('A `record` MUST be **immutable** once created.');
    expect(terms).toContain('record');
    expect(terms).toContain('immutable');
  });

  it('falls back to bare words when no backtick/bold terms', () => {
    const terms = extractTermsFromLine('Records are data contracts that evolve only through extensions.');
    // Should find significant words (4+ chars)
    expect(terms.some(t => t === 'records' || t === 'contracts' || t === 'evolve')).toBe(true);
  });

  it('excludes stop words', () => {
    const terms = extractTermsFromLine('A binder MUST be declared using the canonical form.');
    expect(terms).not.toContain('the');
    expect(terms).not.toContain('must');
    expect(terms).not.toContain('be');
    expect(terms).not.toContain('using');
  });

  it('extracts hyphenated compound terms', () => {
    const terms = extractTermsFromLine('This ensures compile-time validation of side-effect freedom.');
    expect(terms).toContain('compile-time');
    expect(terms).toContain('side-effect');
  });

  it('deduplicates terms', () => {
    const terms = extractTermsFromLine('A `binder` must reference `binder` declarations.');
    const binderCount = terms.filter(t => t === 'binder').length;
    expect(binderCount).toBe(1);
  });

  it('returns empty for very short lines', () => {
    const terms = extractTermsFromLine('');
    expect(terms).toEqual([]);
  });
});

// ─── runNdp ─────────────────────────────────────────────────────────

describe('runNdp', () => {
  const binderSection = `
## 2.6.2 Binder — Data Transformation Contract
A **Binder** is a *capable behavioral construct* that defines a **deterministic transformation contract**.

### 2.6.2.3 Behavioral Properties

1. A binder MUST be **deterministic** and MUST be **side-effect free**.
2. A binder MUST be total for its declared input domain, or MUST fail explicitly.
3. A binder MAY reshape \`record\`s, map fields, project/drop/rename attributes.
4. A binder MUST NOT encode **business semantics** or domain rules.
5. A binder MUST NOT introduce **non-determinism** and MUST NOT depend on runtime state.
6. A binder MUST NOT perform I/O, emit events, or interact with external systems.
7. A binder MUST NOT invoke \`inline\`, \`delegate\`, \`action\`, or \`flow\`.
8. A binder MAY reference and evaluate \`rule\` constructs strictly as **deterministic decision inputs**.
9. A binder SHOULD be **auditable** and traceable.
10. A binder MAY reference statically declared \`primitives\`, literal values, and compile-time constants.
`;

  it('produces enrichment terms from MUST lines', () => {
    const result = runNdp(binderSection, ['binder']);
    const enrichTerms = result.enrichTerms.map(t => t.term);
    expect(enrichTerms).toContain('deterministic');
    expect(enrichTerms).toContain('side-effect free');
  });

  it('produces filter terms from MUST NOT lines', () => {
    const result = runNdp(binderSection, ['binder']);
    const filterTerms = result.filterTerms.map(t => t.term);
    // MUST NOT invoke action, flow, delegate, inline
    expect(filterTerms).toContain('action');
    expect(filterTerms).toContain('flow');
    expect(filterTerms).toContain('delegate');
    expect(filterTerms).toContain('inline');
  });

  it('produces conditional terms from MAY lines', () => {
    const result = runNdp(binderSection, ['binder']);
    const condTerms = result.conditionalTerms.map(t => t.term);
    // MAY reshape records, MAY reference rule
    expect(condTerms.some(t => t === 'record' || t === 'rule' || t === 'primitives')).toBe(true);
  });

  it('SHOULD lines produce priority enrichment (weight 2)', () => {
    const result = runNdp(binderSection, ['binder']);
    const auditable = result.enrichTerms.find(t => t.term === 'auditable');
    expect(auditable).toBeDefined();
    expect(auditable!.weight).toBe(2);
  });

  it('MUST lines have weight 3', () => {
    const result = runNdp(binderSection, ['binder']);
    const determ = result.enrichTerms.find(t => t.term === 'deterministic');
    expect(determ).toBeDefined();
    expect(determ!.weight).toBe(3);
  });

  it('MUST NOT filter terms have negative weight', () => {
    const result = runNdp(binderSection, ['binder']);
    const actionFilter = result.filterTerms.find(t => t.term === 'action');
    expect(actionFilter).toBeDefined();
    expect(actionFilter!.weight).toBeLessThan(0);
  });

  it('excludes query keywords from NDP output', () => {
    const result = runNdp(binderSection, ['binder', 'deterministic']);
    const enrichTerms = result.enrichTerms.map(t => t.term);
    // 'binder' should not appear in enrichment (it's the query keyword)
    expect(enrichTerms).not.toContain('binder');
    // 'deterministic' is also a query keyword
    expect(enrichTerms).not.toContain('deterministic');
  });

  it('produces trace output', () => {
    const result = runNdp(binderSection, ['binder']);
    expect(result.trace).toContain('NDP');
    expect(result.trace).toContain('enrich:');
    expect(result.trace).toContain('filter:');
  });

  it('handles empty section text', () => {
    const result = runNdp('', ['binder']);
    expect(result.enrichTerms).toEqual([]);
    expect(result.filterTerms).toEqual([]);
    expect(result.conditionalTerms).toEqual([]);
    expect(result.trace).toBe('');
  });

  it('handles section with no normative keywords', () => {
    const result = runNdp('This is a simple description without any RFC 2119 words.', ['test']);
    expect(result.enrichTerms).toEqual([]);
    expect(result.filterTerms).toEqual([]);
    expect(result.conditionalTerms).toEqual([]);
  });
});

// ─── applyNdpScoring ────────────────────────────────────────────────

describe('applyNdpScoring', () => {
  function makeMatch(unitName: string, keywords: string[], matched: string[] = []) {
    return {
      alias: 'test',
      unitName,
      unit: { keywords, seq: [] } as unknown as IndexUnit,
      matchType: 'keyword' as const,
      matchedKeywords: matched,
      strongKeywords: new Set<string>(),
      ontoMatch: false,
    };
  }

  it('demotes units whose keywords overlap with filter terms', () => {
    const matches = [
      makeMatch('binderDesign', ['binder', 'transformation', 'deterministic']),
      makeMatch('actionDesign', ['action', 'flow', 'execution']),
      makeMatch('ruleDesign', ['rule', 'validation', 'deterministic']),
    ];
    const ndp: NdpResult = {
      enrichTerms: [],
      filterTerms: [
        { term: 'action', weight: -3 },
        { term: 'flow', weight: -3 },
      ],
      conditionalTerms: [],
      rawEntries: [],
      trace: '',
    };

    const sorted = applyNdpScoring(matches, ndp);
    // actionDesign has 2 filter overlaps, should be last
    expect(sorted[sorted.length - 1].unitName).toBe('actionDesign');
    // binderDesign and ruleDesign have 0 overlaps, should be first
    expect(sorted[0].unitName).not.toBe('actionDesign');
  });

  it('returns unchanged order when no filter terms', () => {
    const matches = [
      makeMatch('a', ['x']),
      makeMatch('b', ['y']),
    ];
    const ndp: NdpResult = {
      enrichTerms: [{ term: 'z', weight: 3 }],
      filterTerms: [],
      conditionalTerms: [],
      rawEntries: [],
      trace: '',
    };

    const sorted = applyNdpScoring(matches, ndp);
    expect(sorted[0].unitName).toBe('a');
    expect(sorted[1].unitName).toBe('b');
  });

  it('handles substring overlap with partial penalty', () => {
    const matches = [
      makeMatch('cleanUnit', ['record', 'schema']),
      makeMatch('noisy', ['action flow', 'delegate context']),
    ];
    const ndp: NdpResult = {
      enrichTerms: [],
      filterTerms: [{ term: 'action', weight: -3 }],
      conditionalTerms: [],
      rawEntries: [],
      trace: '',
    };

    const sorted = applyNdpScoring(matches, ndp);
    // 'noisy' has "action flow" which contains "action" as substring → penalty
    expect(sorted[sorted.length - 1].unitName).toBe('noisy');
  });

  it('preserves original matches array reference', () => {
    const matches = [makeMatch('a', ['x'])];
    const ndp: NdpResult = {
      enrichTerms: [],
      filterTerms: [{ term: 'y', weight: -3 }],
      conditionalTerms: [],
      rawEntries: [],
      trace: '',
    };
    const result = applyNdpScoring(matches, ndp);
    expect(result).toBe(matches);
  });
});
