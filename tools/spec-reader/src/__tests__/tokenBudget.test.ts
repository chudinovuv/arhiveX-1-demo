import { describe, it, expect } from 'vitest';
import { estimateTokens, applyBudget, DEFAULT_BUDGET } from '../lib/tokenBudget.js';

// ─── estimateTokens ─────────────────────────────────────────────────

describe('estimateTokens', () => {
  it('returns 0 for empty string', () => {
    expect(estimateTokens('')).toBe(0);
  });

  it('returns 1 for 1-4 chars', () => {
    expect(estimateTokens('ab')).toBe(1);
    expect(estimateTokens('abcd')).toBe(1);
  });

  it('returns correct count for longer text', () => {
    // 100 chars → 25 tokens
    expect(estimateTokens('a'.repeat(100))).toBe(25);
    // 101 chars → 26 tokens (ceil)
    expect(estimateTokens('a'.repeat(101))).toBe(26);
  });

  it('handles unicode text', () => {
    const text = 'Привет мир'; // 10 chars
    expect(estimateTokens(text)).toBe(Math.ceil(text.length / 4));
  });
});

// ─── applyBudget — under budget ────────────────────────────────────

describe('applyBudget — under budget', () => {
  it('returns original text when within budget', () => {
    const text = 'Hello world'; // 11 chars → 3 tokens
    const result = applyBudget(text, 100);
    expect(result.trimmed).toBe(false);
    expect(result.text).toBe(text);
    expect(result.tokens).toBe(3);
    expect(result.originalTokens).toBe(3);
    expect(result.budget).toBe(100);
  });

  it('returns original at exact boundary', () => {
    // Budget 5 tokens = 20 chars max
    const text = 'a'.repeat(20); // exactly 5 tokens
    const result = applyBudget(text, 5);
    expect(result.trimmed).toBe(false);
    expect(result.text).toBe(text);
  });
});

// ─── applyBudget — over budget, no sections ────────────────────────

describe('applyBudget — over budget, no section markers', () => {
  it('does hard char cut when no section markers', () => {
    const text = 'a'.repeat(200); // 50 tokens
    const result = applyBudget(text, 10);
    expect(result.trimmed).toBe(true);
    expect(result.originalTokens).toBe(50);
    // 10 tokens × 4 chars = 40 chars kept
    expect(result.text.startsWith('a'.repeat(40))).toBe(true);
    expect(result.text).toContain('TRUNCATED');
    expect(result.text).toContain('50 tokens exceeded budget of 10');
  });
});

// ─── applyBudget — over budget, with sections ─────────────────────

describe('applyBudget — over budget, with section markers', () => {
  const makeSection = (id: string, size: number) =>
    `▸ ${id}\n${'x'.repeat(size)}\n`;

  it('trims at section boundaries', () => {
    const header = 'HEADER\n\n';
    const s1 = makeSection('2.1', 100);
    const s2 = makeSection('2.2', 100);
    const s3 = makeSection('2.3', 100);
    const text = header + s1 + s2 + s3;
    // Total ~308 chars → ~77 tokens. Budget 40 → ~160 chars
    const result = applyBudget(text, 40);
    expect(result.trimmed).toBe(true);
    expect(result.text).toContain('▸ 2.1');
    expect(result.text).toContain('sections truncated');
  });

  it('keeps at least one section even if over budget', () => {
    const header = '';
    const s1 = makeSection('big', 1000); // ~250 tokens
    const text = header + s1;
    const result = applyBudget(text, 10);
    // Should keep the one section (always keeps at least 1 with keptSections=0 guard)
    expect(result.text).toContain('▸ big');
  });

  it('returns untrimmed if all sections fit after split', () => {
    const s1 = makeSection('1.0', 20);
    const s2 = makeSection('1.1', 20);
    const text = s1 + s2;
    // ~60 chars → ~15 tokens, budget 100 → fits
    const result = applyBudget(text, 100);
    expect(result.trimmed).toBe(false);
    expect(result.text).toContain('▸ 1.0');
    expect(result.text).toContain('▸ 1.1');
  });

  it('truncation notice includes correct counts', () => {
    const header = 'H\n';
    const sections = Array.from({ length: 10 }, (_, i) =>
      makeSection(`s${i}`, 80)
    );
    const text = header + sections.join('');
    // ~820 chars → ~205 tokens, budget 30 → ~120 chars
    const result = applyBudget(text, 30);
    expect(result.trimmed).toBe(true);
    // Should mention how many sections were truncated
    expect(result.text).toMatch(/\d+ of 10 sections truncated/);
  });
});

// ─── applyBudget — default budget ──────────────────────────────────

describe('applyBudget — default budget', () => {
  it('uses 4000 as default budget', () => {
    const text = 'x'.repeat(100); // 25 tokens, well under 4000
    const result = applyBudget(text);
    expect(result.budget).toBe(DEFAULT_BUDGET);
    expect(result.trimmed).toBe(false);
  });
});

// ─── Error handling: malformed inputs ──────────────────────────────

describe('error handling — malformed inputs', () => {
  it('estimateTokens throws on null input', () => {
    expect(() => estimateTokens(null as any)).toThrow();
  });

  it('estimateTokens throws on undefined input', () => {
    expect(() => estimateTokens(undefined as any)).toThrow();
  });

  it('applyBudget throws on null text', () => {
    expect(() => applyBudget(null as any, 100)).toThrow();
  });

  it('applyBudget with budget=0 trims everything', () => {
    const result = applyBudget('hello world', 0);
    expect(result.trimmed).toBe(true);
    expect(result.text).toContain('TRUNCATED');
  });

  it('applyBudget with negative budget trims everything', () => {
    const result = applyBudget('hello world', -5);
    expect(result.trimmed).toBe(true);
  });

  it('applyBudget with Infinity budget returns untrimmed', () => {
    const text = 'x'.repeat(100000);
    const result = applyBudget(text, Infinity);
    expect(result.trimmed).toBe(false);
    expect(result.text).toBe(text);
  });
});

// ─── Error handling: corrupt data ──────────────────────────────────

describe('error handling — corrupt/edge-case text', () => {
  it('text with only section markers and no content', () => {
    const text = '▸ section1\n▸ section2\n▸ section3\n';
    const result = applyBudget(text, 100);
    // Should not crash; returns something parseable
    expect(result.text).toBeTruthy();
  });

  it('text with malformed section marker (partial ▸)', () => {
    const text = '▸ valid\nsome text\n▸missing-space\n';
    const result = applyBudget(text, 100);
    expect(result.text).toBeTruthy();
  });

  it('text containing only newlines', () => {
    const text = '\n\n\n\n\n';
    const result = applyBudget(text, 100);
    expect(result.trimmed).toBe(false);
  });
});

// ─── Tier-aware trimming ───────────────────────────────────────────

describe('applyBudget — tier-aware trimming', () => {
  const makeTierSection = (tier: number, id: string, size: number) =>
    `▸ [T${tier}] ${id}\n${'x'.repeat(size)}\n`;

  it('drops Tier 4 first when over budget', () => {
    const header = 'H\n';
    const s1 = makeTierSection(1, '2.6.8', 100);
    const s2 = makeTierSection(2, '2.6.8.3', 100);
    const s3 = makeTierSection(4, 'D.4.1', 100);
    const text = header + s1 + s2 + s3;
    // ~346 chars → ~87 tokens. Budget 62 → ~248 chars.
    // After T4 drop: ~232 chars → fits. T1+T2 survive.
    const result = applyBudget(text, 62);
    expect(result.trimmed).toBe(true);
    expect(result.text).toContain('[T1] 2.6.8');
    expect(result.text).toContain('[T2] 2.6.8.3');
    expect(result.text).not.toContain('[T4] D.4.1');
    // No pressure — only T4 dropped
    expect(result.pressure).toBeDefined();
    expect(result.pressure!.expandRecommended).toBe(false);
    expect(result.pressure!.droppedByTier[4]).toBe(1);
  });

  it('drops Tier 3 and 4 before Tier 1-2', () => {
    const header = '';
    const s1 = makeTierSection(1, 'core', 80);
    const s2 = makeTierSection(2, 'norm', 80);
    const s3 = makeTierSection(3, 'reg', 80);
    const s4 = makeTierSection(4, 'supp', 80);
    const text = header + s1 + s2 + s3 + s4;
    // ~360 chars → ~90 tokens, budget 50 → ~200 chars
    const result = applyBudget(text, 50);
    expect(result.trimmed).toBe(true);
    expect(result.text).toContain('[T1] core');
    expect(result.text).toContain('[T2] norm');
    expect(result.text).not.toContain('[T3] reg');
    expect(result.text).not.toContain('[T4] supp');
    expect(result.pressure!.expandRecommended).toBe(false);
  });

  it('sets expandRecommended when Tier 1-2 content is dropped', () => {
    const header = '';
    const s1 = makeTierSection(1, 'core1', 200);
    const s2 = makeTierSection(1, 'core2', 200);
    const s3 = makeTierSection(2, 'norm1', 200);
    const text = header + s1 + s2 + s3;
    // ~620 chars → ~155 tokens, budget 30 → ~120 chars
    const result = applyBudget(text, 30);
    expect(result.trimmed).toBe(true);
    expect(result.pressure).toBeDefined();
    expect(result.pressure!.expandRecommended).toBe(true);
    expect(result.pressure!.suggestedBudget).toBeGreaterThan(30);
  });

  it('suggestedBudget includes 10% headroom', () => {
    const header = '';
    const s1 = makeTierSection(1, 'big', 400); // ~100 tokens
    const s2 = makeTierSection(2, 'med', 200); // ~50 tokens
    const text = header + s1 + s2;
    // Budget too small to fit even T1
    const result = applyBudget(text, 20);
    expect(result.pressure!.expandRecommended).toBe(true);
    // Suggested = ceil((20 + droppedCoreTokens) * 1.1)
    expect(result.pressure!.suggestedBudget).toBeGreaterThan(20);
    expect(result.pressure!.suggestedBudget).toBeLessThan(250);
  });

  it('returns no pressure when all content fits', () => {
    const s1 = makeTierSection(1, '2.6.8', 20);
    const s2 = makeTierSection(2, '2.6.8.3', 20);
    const text = s1 + s2;
    const result = applyBudget(text, 100);
    expect(result.trimmed).toBe(false);
    expect(result.pressure).toBeUndefined();
  });

  it('includes BUDGET_PRESSURE text when core dropped', () => {
    const s1 = makeTierSection(1, 'x', 300);
    const s2 = makeTierSection(1, 'y', 300);
    const text = s1 + s2;
    const result = applyBudget(text, 20);
    expect(result.text).toContain('BUDGET_PRESSURE');
    expect(result.text).toContain('Protected content');
    expect(result.text).toContain('Suggested budget');
  });

  it('includes gentle message when only supplementary dropped', () => {
    const s1 = makeTierSection(1, 'core', 80);
    const s2 = makeTierSection(4, 'supp', 80);
    const text = s1 + s2;
    // budget 30 → 120 chars → keeps T1, drops T4
    const result = applyBudget(text, 30);
    expect(result.text).toContain('Only supplementary content dropped');
    expect(result.text).not.toContain('BUDGET_PRESSURE');
  });

  it('tracks droppedByTier correctly across multiple tiers', () => {
    const header = '';
    const sections = [
      makeTierSection(1, 'a', 40),
      makeTierSection(2, 'b', 40),
      makeTierSection(3, 'c', 40),
      makeTierSection(3, 'd', 40),
      makeTierSection(4, 'e', 40),
      makeTierSection(4, 'f', 40),
      makeTierSection(4, 'g', 40),
    ];
    const text = header + sections.join('');
    // ~350 chars → ~88 tokens, budget 30 → ~120 chars
    const result = applyBudget(text, 30);
    expect(result.trimmed).toBe(true);
    expect(result.pressure).toBeDefined();
    // T4 dropped first (3 sections), then T3 (2 sections)
    expect(result.pressure!.droppedByTier[4]).toBe(3);
  });

  it('droppedTotal matches sum of droppedByTier', () => {
    const sections = [
      makeTierSection(1, 'a', 100),
      makeTierSection(3, 'b', 100),
      makeTierSection(4, 'c', 100),
    ];
    const text = sections.join('');
    const result = applyBudget(text, 30);
    expect(result.pressure).toBeDefined();
    const sumByTier = Object.values(result.pressure!.droppedByTier).reduce((s, n) => s + n, 0);
    expect(result.pressure!.droppedTotal).toBe(sumByTier);
  });
});

// ─── Tier-aware trimming — mixed tags ──────────────────────────────

describe('applyBudget — mixed tier-tagged and untagged sections', () => {
  it('uses tier-aware trimming when tier tags are present', () => {
    const s1 = `▸ [T1] 2.6.8\n${'a'.repeat(80)}\n`;
    const s2 = `▸ [T4] D.1\n${'b'.repeat(80)}\n`;
    const text = s1 + s2;
    const result = applyBudget(text, 30);
    expect(result.trimmed).toBe(true);
    expect(result.text).toContain('[T1] 2.6.8');
    expect(result.text).not.toContain('[T4] D.1');
  });

  it('falls back to legacy trimming when no tier tags', () => {
    const s1 = `▸ 2.6.8\n${'a'.repeat(200)}\n`;
    const s2 = `▸ D.1\n${'b'.repeat(200)}\n`;
    const text = s1 + s2;
    // ~416 chars → ~104 tokens, budget 30 → ~120 chars
    const result = applyBudget(text, 30);
    expect(result.trimmed).toBe(true);
    // Legacy mode: keeps first section
    expect(result.text).toContain('▸ 2.6.8');
    expect(result.pressure).toBeUndefined();
  });
});

// ─── Budget parameter override ─────────────────────────────────────

describe('applyBudget — custom budget parameter', () => {
  it('accepts larger budget without trimming', () => {
    const sections = Array.from({ length: 10 }, (_, i) =>
      `▸ [T${(i % 4) + 1}] s${i}\n${'z'.repeat(80)}\n`
    );
    const text = sections.join('');
    // ~900 chars → ~225 tokens
    const result = applyBudget(text, 300);
    expect(result.trimmed).toBe(false);
    expect(result.budget).toBe(300);
  });

  it('applies smaller budget trimming', () => {
    const sections = Array.from({ length: 5 }, (_, i) =>
      `▸ [T1] s${i}\n${'z'.repeat(200)}\n`
    );
    const text = sections.join('');
    const result = applyBudget(text, 50);
    expect(result.trimmed).toBe(true);
    expect(result.budget).toBe(50);
    expect(result.pressure!.expandRecommended).toBe(true);
  });
});

// ─── Aspect-aware trimming (autoExpand + context) ──────────────────

describe('applyBudget — aspect-aware trimming', () => {
  const makeTierSection = (tier: number, id: string, size: number) =>
    `▸ [T${tier}] ${id}\n${'x'.repeat(size)}\n`;

  /** Helper: build a minimal ScoredChain */
  function makeChain(address: string, indexAlias: string, opts?: {
    score?: number; heading?: string; territory?: 'in' | 'out'; isRef?: boolean;
  }): import('../lib/readingPlanFunnel.js').ScoredChain {
    return {
      address,
      score: opts?.score ?? 60,
      indexAlias,
      unitName: `${indexAlias}/test`,
      order: 1,
      isRef: opts?.isRef ?? false,
      heading: opts?.heading ?? address,
      territory: opts?.territory ?? 'in',
    };
  }

  /** Helper: build a minimal ReadingPlan from chains */
  function makePlan(chains: import('../lib/readingPlanFunnel.js').ScoredChain[]): import('../lib/readingPlanFunnel.js').ReadingPlan {
    return {
      chains,
      tiers: [],
      stats: { totalUnits: chains.length, totalChainsBefore: chains.length, totalChainsAfter: chains.length, dedupedCount: 0, subsumedCount: 0 },
    };
  }

  it('always preserves T1+T2 and expands budget to fit them', () => {
    const s1 = makeTierSection(1, '2.6.8', 200);       // ~52 tokens
    const s2 = makeTierSection(2, '2.6.8.3', 200);     // ~52 tokens
    const s3 = makeTierSection(3, 'A.1', 200);          // ~52 tokens
    const text = s1 + s2 + s3;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('2.6.8.3', 'sema'),
      makeChain('A.1', 'ont'),
    ]);

    // Budget = 50, but T1+T2 need ~104 tokens → budget must expand
    const result = applyBudget(text, {
      budget: 50,
      autoExpand: true,
      context: { plan, keywords: ['test'], onto: 'WHAT' as any },
    });

    // T1+T2 content must be present
    expect(result.text).toContain('▸ [T1] 2.6.8');
    expect(result.text).toContain('▸ [T2] 2.6.8.3');
    // Budget was expanded from original 50
    expect(result.expandedFrom).toBe(50);
  });

  it('scores T3/T4 by keyword relevance and keeps matching ones', () => {
    const s1 = makeTierSection(1, '2.6.8', 100);
    // T3 with relevant keyword in content
    const s2Content = `▸ [T3] A.1\ndelegate trust boundary enforcement rules\n`;
    // T3 with irrelevant content
    const s3Content = `▸ [T3] D.1\nirrelevant filler content nothing to see here\n`;
    // T4 with relevant keyword
    const s4Content = `▸ [T4] B.1\ntrust boundary delegate architecture patterns\n`;
    const text = s1 + s2Content + s3Content + s4Content;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('A.1', 'sema', { heading: 'Trust boundary' }),
      makeChain('D.1', 'ont', { heading: 'Filler section' }),
      makeChain('B.1', 'desa', { heading: 'Delegate architecture' }),
    ]);

    // Budget enough for T1 + 1 supplementary section
    const result = applyBudget(text, {
      budget: 80,
      autoExpand: true,
      context: { plan, keywords: ['delegate', 'trust boundary'], onto: 'WHAT' as any },
    });

    // T1 must be present
    expect(result.text).toContain('▸ [T1] 2.6.8');
    // Relevant T3 (A.1 with keyword match) should be kept over irrelevant T3 (D.1)
    expect(result.text).toContain('▸ [T3] A.1');
  });

  it('onto-affinity boosts sections from matching indices', () => {
    const s1 = makeTierSection(1, '2.6.8', 60);
    // T3 from bsyn (HOW affinity=3×5=15)
    const s2 = `▸ [T3] 3.0.1\nsyntax and declarations code grammar\n`;
    // T3 from phla (HOW affinity=0)
    const s3 = `▸ [T3] A.2\nphilosophical foundations of design\n`;
    const text = s1 + s2 + s3;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('3.0.1', 'bsyn', { heading: 'Block syntax' }),
      makeChain('A.2', 'phla', { heading: 'Philosophy' }),
    ]);

    // Budget for T1 + 1 of the two T3 sections
    const result = applyBudget(text, {
      budget: 45,
      autoExpand: true,
      context: { plan, keywords: ['syntax'], onto: 'HOW' as any },
    });

    // T1 always present
    expect(result.text).toContain('▸ [T1] 2.6.8');
    // bsyn section should be kept (HOW affinity + keyword match)
    expect(result.text).toContain('▸ [T3] 3.0.1');
  });

  it('expandRecommended is always false in aspect-aware mode', () => {
    const s1 = makeTierSection(1, '2.6.8', 200);
    const s2 = makeTierSection(3, 'A.1', 200);
    const s3 = makeTierSection(4, 'D.1', 200);
    const text = s1 + s2 + s3;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('A.1', 'sema'),
      makeChain('D.1', 'ont'),
    ]);

    const result = applyBudget(text, {
      budget: 60,
      autoExpand: true,
      context: { plan, keywords: ['test'], onto: 'WHAT' as any },
    });

    // In aspect-aware mode T1+T2 are always preserved, so expandRecommended is false
    if (result.pressure) {
      expect(result.pressure.expandRecommended).toBe(false);
    }
  });

  it('isRef chains get relevance penalty', () => {
    const s1 = makeTierSection(1, '2.6.8', 60);
    // T3: direct (not $ref) with same keywords
    const s2 = `▸ [T3] A.1\ndelegate enforcement chain\n`;
    // T3: $ref with same keywords
    const s3 = `▸ [T3] A.2\ndelegate enforcement chain\n`;
    const text = s1 + s2 + s3;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('A.1', 'sema', { isRef: false, heading: 'Direct section' }),
      makeChain('A.2', 'sema', { isRef: true, heading: 'Ref section' }),
    ]);

    // Budget for T1 + 1 supplementary
    const result = applyBudget(text, {
      budget: 30,
      autoExpand: true,
      context: { plan, keywords: ['delegate'], onto: 'WHAT' as any },
    });

    // Direct (non-ref) should be preferred
    expect(result.text).toContain('▸ [T3] A.1');
  });

  it('returns all content when budget is large enough', () => {
    const s1 = makeTierSection(1, '2.6.8', 100);
    const s2 = makeTierSection(3, 'A.1', 100);
    const s3 = makeTierSection(4, 'D.1', 100);
    const text = s1 + s2 + s3;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('A.1', 'sema'),
      makeChain('D.1', 'ont'),
    ]);

    const result = applyBudget(text, {
      budget: 500,
      autoExpand: true,
      context: { plan, keywords: ['test'] },
    });

    expect(result.trimmed).toBe(false);
    expect(result.text).toContain('▸ [T1] 2.6.8');
    expect(result.text).toContain('▸ [T3] A.1');
    expect(result.text).toContain('▸ [T4] D.1');
  });

  it('does not activate without autoExpand + context', () => {
    // Without autoExpand, should use tier-aware (not aspect-aware)
    const s1 = makeTierSection(1, '2.6.8', 200);
    const s2 = makeTierSection(4, 'D.4.1', 200);
    const text = s1 + s2;

    const result = applyBudget(text, { budget: 60 });
    // Should use tier-aware: drops T4 first, may set pressure
    expect(result.trimmed).toBe(true);
    expect(result.text).toContain('▸ [T1] 2.6.8');
    expect(result.text).not.toContain('aspect scoring');
  });

  it('drops irrelevant T3/T4 (relevance ≤ 0) even with large budget', () => {
    const s1 = makeTierSection(1, '2.6.8', 60);
    // T3 with no keyword match, no chain in plan → relevance = 0
    const s2 = `▸ [T3] X.99\ncompletely unrelated filler content\n`;
    // T4 with no keyword match, no chain in plan → relevance = 0
    const s3 = `▸ [T4] Y.99\nanother unrelated section about nothing\n`;
    const text = s1 + s2 + s3;

    // Only T1 chain in plan — T3/T4 addresses not in plan → no chain lookup → no bonuses
    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
    ]);

    const result = applyBudget(text, {
      budget: 500, // plenty of room
      autoExpand: true,
      context: { plan, keywords: ['delegate', 'trust boundary'] },
    });

    // T1 preserved
    expect(result.text).toContain('▸ [T1] 2.6.8');
    // Irrelevant sections should be dropped regardless of budget
    expect(result.trimmed).toBe(true);
    expect(result.text).not.toContain('completely unrelated');
    expect(result.text).not.toContain('another unrelated');
  });

  it('expands budget beyond requested to include all relevant T3/T4', () => {
    const s1 = makeTierSection(1, '2.6.8', 100);    // ~27 tokens
    // Three relevant T3 sections — all contain keyword
    const s2 = `▸ [T3] A.1\ndelegate trust boundary enforcement patterns\n`;
    const s3 = `▸ [T3] A.2\ndelegate materialization pipeline rules\n`;
    const s4 = `▸ [T3] A.3\ntrust boundary crossing semantics here\n`;
    const text = s1 + s2 + s3 + s4;

    const plan = makePlan([
      makeChain('2.6.8', 'phya'),
      makeChain('A.1', 'sema', { heading: 'Trust boundary' }),
      makeChain('A.2', 'sema', { heading: 'Materialization' }),
      makeChain('A.3', 'sema', { heading: 'Boundary crossing' }),
    ]);

    const result = applyBudget(text, {
      budget: 30, // way too small for all content
      autoExpand: true,
      context: { plan, keywords: ['delegate', 'trust boundary'] },
    });

    // ALL relevant T3 sections should be included despite budget:30
    expect(result.text).toContain('▸ [T3] A.1');
    expect(result.text).toContain('▸ [T3] A.2');
    expect(result.text).toContain('▸ [T3] A.3');
    expect(result.expandedFrom).toBe(30);
  });
});
