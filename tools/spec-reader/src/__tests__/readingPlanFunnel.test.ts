import { describe, it, expect } from 'vitest';
import { buildReadingPlan, planToChainList, tierChains, formatReadingPlan, chainTierMap } from '../lib/readingPlanFunnel.js';
import type { IndexRegistry } from '../lib/readingPlanFunnel.js';
import type { IndexUnit, IndexFile } from '../lib/types.js';

// ─── Helpers ────────────────────────────────────────────────────────

function makeUnit(seqEntries: Array<{ Order: number; chain: string[]; H1?: string; H2?: string; H3?: string; H4?: string; enumTag?: string; normTag?: string }>): IndexUnit {
  return {
    keywords: ['test'],
    seq: seqEntries.map(e => {
      const entry: Record<string, unknown> = { Order: e.Order, chain: e.chain };
      if (e.H1) entry.H1 = e.H1;
      if (e.H2) entry.H2 = e.H2;
      if (e.H3) entry.H3 = e.H3;
      if (e.H4) entry.H4 = e.H4;
      if (e.enumTag) entry.enumTag = e.enumTag;
      if (e.normTag) entry.normTag = e.normTag;
      return entry as unknown as import('../lib/types.js').SeqEntry;
    }),
  };
}

function makeMatch(alias: string, unitName: string, unit: IndexUnit, ontoMatch = false) {
  return { alias, unitName, unit, matchedKeywords: ['test'], ontoMatch };
}

// ─── Scoring formula ────────────────────────────────────────────────

describe('scoring formula', () => {
  it('score = metaRank×30 + order×10 for basic case', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'testUnit', unit)],
      ['phya'],
    );
    // metaRank = indexOf('phya') + 1 = 1, order=1
    // score = 1×30 + 1×10 = 40
    expect(plan.chains[0].score).toBe(40);
  });

  it('applies onto bonus (-15) when ontoMatch=true', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'testUnit', unit, true)],
      ['phya'],
    );
    // score = 1×30 + 1×10 - 15 = 25
    expect(plan.chains[0].score).toBe(25);
  });

  it('higher metaRank increases score', () => {
    const u1 = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const u2 = makeUnit([{ Order: 1, chain: ['3.1'] }]);
    const plan = buildReadingPlan(
      [
        makeMatch('phya', 'u1', u1),
        makeMatch('sema', 'u2', u2),
      ],
      ['phya', 'sema'],
    );
    const chain1 = plan.chains.find(c => c.address === '2.1')!;
    const chain2 = plan.chains.find(c => c.address === '3.1')!;
    // phya: rank=1 → 30+10=40; sema: rank=2 → 60+10=70 + territory penalty(+20, '3.' not in phya/sema zone) = 90
    expect(chain1.score).toBe(40);
    expect(chain2.score).toBe(90);
  });

  it('higher order increases score by 10 per step', () => {
    const unit = makeUnit([
      { Order: 1, chain: ['2.1'] },
      { Order: 3, chain: ['2.3'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'testUnit', unit)],
      ['phya'],
    );
    const c1 = plan.chains.find(c => c.address === '2.1')!;
    const c3 = plan.chains.find(c => c.address === '2.3')!;
    expect(c1.score).toBe(40); // 30 + 10
    expect(c3.score).toBe(60); // 30 + 30
  });

  it('unknown alias gets last+1 rank', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('unknown', 'u', unit)],
      ['phya', 'sema'],
    );
    // indexOf('unknown') = -1 → rank = 2+1 = 3 → score = 3×30+10 = 100
    expect(plan.chains[0].score).toBe(100);
  });
});

// ─── Tier assignment ────────────────────────────────────────────────

describe('tier assignment', () => {
  it('score ≤60 → Tier 1', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    // score=40 → Tier 1
    const t1 = tierChains(plan, 1);
    expect(t1).toContain('2.1');
  });

  it('score 61-95 → Tier 2', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('sema', 'u', unit)],
      ['phya', 'sema'],
    );
    // rank=2, score=70 → Tier 2
    const t2 = tierChains(plan, 2);
    expect(t2).toContain('2.1');
  });

  it('score 96-125 → Tier 3', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('ont', 'u', unit)],
      ['phya', 'sema', 'ont'],
    );
    // rank=3, score=100 → Tier 3
    const t3 = tierChains(plan, 3);
    expect(t3).toContain('2.1');
  });

  it('score >125 → Tier 4', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('far', 'u', unit)],
      ['a', 'b', 'c', 'd', 'far'],
    );
    // rank=5, score=160 → Tier 4
    const t4 = tierChains(plan, 4);
    expect(t4).toContain('2.1');
  });

  it('onto bonus can promote from Tier 2 to Tier 1', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    // rank=2 → score=70. With onto: 70-15=55 → Tier 1
    const plan = buildReadingPlan(
      [makeMatch('sema', 'u', unit, true)],
      ['phya', 'sema'],
    );
    const t1 = tierChains(plan, 1);
    expect(t1).toContain('2.1');
  });
});

// ─── Deduplication ──────────────────────────────────────────────────

describe('deduplication', () => {
  it('keeps lowest score when same address from multiple units', () => {
    const u1 = makeUnit([{ Order: 1, chain: ['2.5.3'] }]); // rank1 → score 40
    const u2 = makeUnit([{ Order: 1, chain: ['2.5.3'] }]); // rank2 → score 70
    const plan = buildReadingPlan(
      [
        makeMatch('phya', 'u1', u1),
        makeMatch('sema', 'u2', u2),
      ],
      ['phya', 'sema'],
    );
    expect(plan.chains.filter(c => c.address === '2.5.3')).toHaveLength(1);
    expect(plan.chains.find(c => c.address === '2.5.3')!.score).toBe(40);
    expect(plan.stats.dedupedCount).toBe(1);
  });
});

// ─── Subsumption ────────────────────────────────────────────────────

describe('subsumption', () => {
  it('"base/all" subsumes "base" and "base/A."', () => {
    const unit = makeUnit([
      { Order: 1, chain: ['2.5.3/all'] },
      { Order: 2, chain: ['2.5.3'] },
      { Order: 3, chain: ['2.5.3/A.'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    const addrs = plan.chains.map(c => c.address);
    expect(addrs).toContain('2.5.3/all');
    expect(addrs).not.toContain('2.5.3');
    expect(addrs).not.toContain('2.5.3/A.');
    expect(plan.stats.subsumedCount).toBe(2);
  });

  it('bare "base" does NOT subsume "base/A."', () => {
    const unit = makeUnit([
      { Order: 1, chain: ['2.5.3'] },
      { Order: 2, chain: ['2.5.3/A.'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    const addrs = plan.chains.map(c => c.address);
    expect(addrs).toContain('2.5.3');
    expect(addrs).toContain('2.5.3/A.');
  });
});

// ─── planToChainList ────────────────────────────────────────────────

describe('planToChainList', () => {
  it('returns addresses sorted by score', () => {
    const u1 = makeUnit([{ Order: 1, chain: ['high'] }]); // rank1→40
    const u2 = makeUnit([{ Order: 1, chain: ['low'] }]);  // rank2→70
    const plan = buildReadingPlan(
      [
        makeMatch('phya', 'u1', u1),
        makeMatch('sema', 'u2', u2),
      ],
      ['phya', 'sema'],
    );
    const list = planToChainList(plan);
    expect(list[0]).toBe('high');
    expect(list[1]).toBe('low');
  });
});

// ─── formatReadingPlan ──────────────────────────────────────────────

describe('formatReadingPlan', () => {
  it('includes stats line and tier headers', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'], H2: 'Test Section' }]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    const text = formatReadingPlan(plan);
    expect(text).toContain('═══ READING PLAN ═══');
    expect(text).toContain('Units: 1');
    expect(text).toContain('Tier 1');
  });
});

// ─── Edge cases ─────────────────────────────────────────────────────

describe('edge cases', () => {
  it('handles empty matches', () => {
    const plan = buildReadingPlan([], ['phya']);
    expect(plan.chains).toHaveLength(0);
    expect(plan.tiers).toHaveLength(0);
    expect(plan.stats.totalUnits).toBe(0);
  });

  it('handles unit with empty seq', () => {
    const unit: IndexUnit = { keywords: ['test'], seq: [] };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(plan.chains).toHaveLength(0);
  });

  it('includes abstracts when available', () => {
    const unit: IndexUnit = {
      keywords: ['test'],
      abstract: 'This is a summary.',
      seq: [{ Order: 1, chain: ['2.1'] }],
    };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(plan.unitAbstracts).toHaveLength(1);
    expect(plan.unitAbstracts![0].abstract).toBe('This is a summary.');
  });
});

// ─── Error handling: malformed inputs ──────────────────────────────

describe('error handling — malformed inputs', () => {
  it('empty indexRanking puts all chains in Tier 1', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      [], // empty ranking
    );
    // indexOf returns -1 → metaWeight = 0+1 = 1 → score = 10+10 = 20 → Tier 1
    const t1 = tierChains(plan, 1);
    expect(t1).toContain('2.1');
  });

  it('tierChains with non-existent tier returns empty', () => {
    const unit = makeUnit([{ Order: 1, chain: ['2.1'] }]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(tierChains(plan, 99)).toEqual([]);
    expect(tierChains(plan, 0)).toEqual([]);
    expect(tierChains(plan, -1)).toEqual([]);
  });

  it('planToChainList on empty plan returns empty', () => {
    const plan = buildReadingPlan([], ['phya']);
    expect(planToChainList(plan)).toEqual([]);
  });

  it('formatReadingPlan on empty plan does not crash', () => {
    const plan = buildReadingPlan([], []);
    const text = formatReadingPlan(plan);
    expect(text).toContain('═══ READING PLAN ═══');
    expect(text).toContain('Units: 0');
  });
});

// ─── Error handling: corrupt seq data ──────────────────────────────

describe('error handling — corrupt seq entries', () => {
  it('skips null entries in seq', () => {
    const unit: IndexUnit = {
      keywords: ['test'],
      seq: [
        null as any,
        { Order: 1, chain: ['2.1'] },
      ],
    };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(plan.chains).toHaveLength(1);
    expect(plan.chains[0].address).toBe('2.1');
  });

  it('skips string entries in seq', () => {
    const unit: IndexUnit = {
      keywords: ['test'],
      seq: [
        'garbage' as any,
        { Order: 1, chain: ['2.1'] },
      ],
    };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(plan.chains).toHaveLength(1);
  });

  it('skips entries with missing chain field', () => {
    const unit: IndexUnit = {
      keywords: ['test'],
      seq: [
        { Order: 1 } as any,
        { Order: 2, chain: ['2.2'] },
      ],
    };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(plan.chains).toHaveLength(1);
    expect(plan.chains[0].address).toBe('2.2');
  });

  it('skips entries with empty chain array', () => {
    const unit: IndexUnit = {
      keywords: ['test'],
      seq: [
        { Order: 1, chain: [] },
        { Order: 2, chain: ['2.2'] },
      ],
    };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    expect(plan.chains).toHaveLength(1);
  });

  it('skips $ref entries (no chain produced)', () => {
    const unit: IndexUnit = {
      keywords: ['test'],
      seq: [
        { $ref: 'sema/otherUnit', Order: 0, chain: [] } as any,
        { Order: 1, chain: ['2.1'] },
      ],
    };
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u', unit)],
      ['phya'],
    );
    // $ref entry should be skipped, only Order:1 chain kept
    expect(plan.chains).toHaveLength(1);
    expect(plan.chains[0].address).toBe('2.1');
  });
});

// ─── chainTierMap ───────────────────────────────────────────────────

describe('chainTierMap', () => {
  it('maps chain addresses to their tier number', () => {
    const unit = makeUnit([
      { Order: 1, chain: ['2.1'], H2: 'Core' },       // score=40 → Tier 1
      { Order: 5, chain: ['2.2'], H2: 'Props' },       // score=80 → Tier 2
      { Order: 10, chain: ['2.3'], H2: 'Syntax' },     // score=130 → Tier 4
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'testUnit', unit)],
      ['phya'],
    );
    const map = chainTierMap(plan);
    expect(map.get('2.1')).toBe(1);
    expect(map.get('2.2')).toBe(2);
    expect(map.get('2.3')).toBe(4);
  });

  it('returns empty map for empty plan', () => {
    const unit = makeUnit([]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'testUnit', unit)],
      ['phya'],
    );
    const map = chainTierMap(plan);
    expect(map.size).toBe(0);
  });

  it('handles multiple units with overlapping addresses', () => {
    const u1 = makeUnit([{ Order: 1, chain: ['2.1'] }]); // score=40 → T1
    const u2 = makeUnit([{ Order: 1, chain: ['3.1'] }]); // score=70 → T2
    const plan = buildReadingPlan(
      [makeMatch('phya', 'u1', u1), makeMatch('sema', 'u2', u2)],
      ['phya', 'sema'],
    );
    const map = chainTierMap(plan);
    expect(map.get('2.1')).toBe(1);
    expect(map.get('3.1')).toBe(2);
  });
});

// ─── 2D Heading pair resonance ──────────────────────────────────────

describe('heading pair resonance', () => {
  it('H3 "Grammar" gets HOW primary pair bonus with structural dimension', () => {
    const unit = makeUnit([
      { Order: 1, H1: 'Method — Execution Unit', chain: ['2.6.8'] },
      { Order: 6, H3: 'AST Grammar', chain: ['2.6.8.5.2/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'method_type', unit, true)],
      ['phya'],
      ['method', 'grammar'],
      'HOW',
    );
    const h1 = plan.chains.find(c => c.address === '2.6.8')!;
    const h3 = plan.chains.find(c => c.address === '2.6.8.5.2/all')!;
    // dim=structural ('grammar')
    // H1 "Method — Execution Unit": pairBonus=0, kwRes('method')=8 → 30+10-15-0-8 = 17
    // H3 "AST Grammar": pair "grammar"→[HOW,WHAT,structural], HOW=primary→25+5(dim)=30, kwRes('grammar')=8 → 30+60-15-30-8 = 37
    expect(h1.score).toBe(17);
    expect(h3.score).toBe(37);
  });

  it('H3 "Designation" gets WHAT primary pair bonus', () => {
    const unit = makeUnit([
      { Order: 1, H1: 'Rule — Semantic Reasoning', chain: ['2.6.6'] },
      { Order: 5, H3: 'Designation', chain: ['2.6.6.1/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'rule_type', unit, true)],
      ['phya'],
      ['rule'],
      'WHAT',
    );
    const h3 = plan.chains.find(c => c.address === '2.6.6.1/all')!;
    // dim=mixed ('rule' — no structural/behavioral signal)
    // pair "designation"→[WHAT,WHY,structural], WHAT=primary→25+5(dim=mixed)=30
    // kwRes: 'rule' not in 'designation' → 0
    // 30+50-15-30-0 = 35
    expect(h3.score).toBe(35);
  });

  it('H2 "Syntax" NOW gets pair bonus (all levels, not just H3+)', () => {
    const unit = makeUnit([
      { Order: 3, H2: 'Syntax', chain: ['2.6.8.5/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'method_type', unit, true)],
      ['phya'],
      ['method', 'syntax'],
      'HOW',
    );
    const h2 = plan.chains.find(c => c.address === '2.6.8.5/all')!;
    // dim=structural ('syntax')
    // pair "syntax"→[HOW,WHAT,structural], HOW=primary→25+5(dim)=30, kwRes('syntax')=8
    // 30+30-15-30-8 = 7
    expect(h2.score).toBe(7);
  });

  it('no pair bonus when onto is undefined', () => {
    const unit = makeUnit([
      { Order: 5, H3: 'AST Grammar', chain: ['2.6.8.5.2/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'method_type', unit)],
      ['phya'],
      ['grammar'],
      undefined,
    );
    const h3 = plan.chains.find(c => c.address === '2.6.8.5.2/all')!;
    // pairBonus=0 (onto undefined), kwRes('grammar')=8
    // 30+50-0-0-8 = 72
    expect(h3.score).toBe(72);
  });

  it('keyword resonance works without onto', () => {
    const unit = makeUnit([
      { Order: 4, H3: 'Normative Rules', chain: ['3.12.5/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'method_type', unit)],
      ['phya'],
      ['normative'],
    );
    const h3 = plan.chains.find(c => c.address === '3.12.5/all')!;
    // pairBonus=0, kwRes('normative')=8, territory('3.' not in phya)=+20
    // 30+40-0-0-8+20 = 82
    expect(h3.score).toBe(82);
  });

  it('behavioral dimension: "Enforcement" gets WHY/WHEN pair with WHEN query', () => {
    const unit = makeUnit([
      { Order: 7, H3: 'Enforcement Constraints', chain: ['7.5/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bhva', 'enfNorm', unit, true)],
      ['bhva'],
      ['enforcement'],
      'WHEN',
    );
    const h3 = plan.chains.find(c => c.address === '7.5/all')!;
    // dim=behavioral ('enforcement')
    // pair "enforcement"→[WHEN,WHY,behavioral], WHEN=primary→25+5(dim)=30, kwRes('enforcement')=8
    // 30+70-15-30-8 = 47
    expect(h3.score).toBe(47);
  });

  it('no pair match falls back to zero (keyword resonance only)', () => {
    const unit = makeUnit([
      { Order: 8, H4: 'Compilation Phases', chain: ['D.3.1/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bhva', 'compPhases', unit, true)],
      ['bhva'],
      ['compilation'],
      'HOW',
    );
    const h4 = plan.chains.find(c => c.address === 'D.3.1/all')!;
    // dim=mixed ('compilation' not in signal lists)
    // "Compilation Phases" — no pair term matches. pairBonus=0. kwRes('compilation')=8
    // 30+80-15-0-8 = 87
    expect(h4.score).toBe(87);
  });

  it('admissibility gets WHEN/WHERE pair with WHERE query', () => {
    const unit = makeUnit([
      { Order: 1, H1: 'Invoke — Call Syntax', chain: ['3.9'] },
      { Order: 5, H3: 'Contextual Admissibility', chain: ['3.9.5/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'invokeSyntax', unit, true)],
      ['bsyn'],
      ['invoke', 'admissibility'],
      'WHERE',
    );
    const h1 = plan.chains.find(c => c.address === '3.9')!;
    const h3 = plan.chains.find(c => c.address === '3.9.5/all')!;
    // dim=behavioral ('admissibility')
    // H1 "Invoke — Call Syntax": pair "syntax"→[HOW,WHAT,structural], WHERE≠HOW,WHAT, dim beh≠struct → 0. kwRes('invoke')=8 → 30+10-15-0-8 = 17
    // H3 "Contextual Admissibility": pair "admissibility"→[WHEN,WHERE,behavioral], WHERE=secondary→15+5(dim)=20. kwRes('admissibility')=8 → 30+50-15-20-8 = 37
    expect(h1.score).toBe(17);
    expect(h3.score).toBe(37);
  });

  it('admissibility heading gives small dim bonus even for WHAT query', () => {
    const unit = makeUnit([
      { Order: 5, H3: 'Contextual Admissibility', chain: ['3.9.5/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'invokeSyntax', unit, true)],
      ['bsyn'],
      ['invoke'],
      'WHAT',
    );
    const h3 = plan.chains.find(c => c.address === '3.9.5/all')!;
    // dim=mixed ('invoke' — no signal)
    // pair "admissibility"→[WHEN,WHERE,behavioral], WHAT≠WHEN,WHERE, dimBonus(mixed→beh)=5 → pairBonus=5
    // kwRes: 'invoke' not in 'contextual admissibility' → 0
    // 30+50-15-5-0 = 60
    expect(h3.score).toBe(60);
  });

  it('gate heading gets WHEN/WHERE pair with WHERE query + behavioral dim', () => {
    const unit = makeUnit([
      { Order: 6, H3: 'Semantic Gate Restrictions', chain: ['7.3.2/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('desa', 'enfDesign', unit, true)],
      ['desa'],
      ['gate'],
      'WHERE',
    );
    const h3 = plan.chains.find(c => c.address === '7.3.2/all')!;
    // dim=behavioral ('gate')
    // pair "gate"→[WHEN,WHERE,behavioral], WHERE=secondary→15+5(dim)=20. kwRes('gate')=8
    // territory: '7.' not in desa → +20
    // 30+60-15-20-8+20 = 67
    expect(h3.score).toBe(67);
  });

  it('tier promotion: T3→T2 via pair bonus', () => {
    // rank=2, Order=5 → base 110, normally T3 (96-125)
    // With pair primary (30) → 110-30=80 → T2
    const unit = makeUnit([
      { Order: 5, H2: 'Normative Properties', chain: ['2.7.2.3/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('sema', 'dataIface', unit, true)],
      ['phya', 'sema'],
      ['normative'],
      'WHEN',
    );
    const chain = plan.chains.find(c => c.address === '2.7.2.3/all')!;
    // dim=mixed ('normative' — no signal)
    // rank=2 → meta=2×30=60. Order=5→50. onto=−15.
    // pair "normative properties"→[WHAT,WHEN,structural], WHEN=secondary→15+5(dim=mixed)=20
    // kwRes('normative')=8
    // 60+50-15-20-8 = 67 → T2
    expect(chain.score).toBe(67);
    const t2 = tierChains(plan, 2);
    expect(t2).toContain('2.7.2.3/all');
  });

  it('tier promotion: T4→T3 via behavioral WHY/WHEN pair', () => {
    // rank=2, Order=8 → base 140, normally T4 (>125)
    // With WHY/WHEN behavioral pair + dim bonus → promoted
    const unit = makeUnit([
      { Order: 8, H3: 'Enforcement Propagation', chain: ['2.7.3.3.10/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('sema', 'semIface', unit, true)],
      ['phya', 'sema'],
      ['enforcement', 'propagation'],
      'WHEN',
    );
    const chain = plan.chains.find(c => c.address === '2.7.3.3.10/all')!;
    // dim=behavioral ('enforcement')
    // rank=2→60. Order=8→80. onto=−15.
    // pair "enforcement propagation"→[WHY,WHEN,behavioral], WHEN=secondary→15+5(dim)=20
    // kwRes('enforcement' in heading)=8
    // 60+80-15-20-8 = 97 → T3 (was T4=140)
    expect(chain.score).toBe(97);
    const t3 = tierChains(plan, 3);
    expect(t3).toContain('2.7.3.3.10/all');
  });
});

// ─── Cross-index $ref resolution ────────────────────────────────────

describe('cross-index $ref resolution', () => {
  /** Build an IndexRegistry from alias→units pairs */
  function makeRegistry(entries: Array<[string, Record<string, IndexUnit>]>): IndexRegistry {
    const map = new Map<string, IndexFile>();
    for (const [alias, units] of entries) {
      map.set(alias, units as IndexFile);
    }
    return map;
  }

  it('resolves external $alias/unit chain addresses into real chains', () => {
    // bsyn/methodSyntax has a $ref to $bhva/methodNormatives
    const bsynUnit = makeUnit([
      { Order: 1, H1: 'method', chain: ['3.12/all'] },
      { Order: 10, H2: '$ref: $bhva/methodNormatives', chain: ['$bhva/methodNormatives'] },
    ]);
    // bhva/methodNormatives has real chains
    const bhvaUnit = makeUnit([
      { Order: 1, H1: 'Method Norms', chain: ['2.6.8.3/all'] },
      { Order: 2, H2: 'Visibility', chain: ['2.6.8.4/all'] },
    ]);
    const registry = makeRegistry([
      ['bsyn', { methodSyntax: bsynUnit }],
      ['bhva', { methodNormatives: bhvaUnit }],
    ]);

    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'methodSyntax', bsynUnit)],
      ['bsyn', 'bhva'],
      undefined,
      undefined,
      registry,
    );

    const addrs = plan.chains.map(c => c.address);
    // Real chain from bsyn
    expect(addrs).toContain('3.12/all');
    // Expanded from $bhva/methodNormatives
    expect(addrs).toContain('2.6.8.3/all');
    expect(addrs).toContain('2.6.8.4/all');
    // $bhva/methodNormatives itself should NOT be in the list (replaced by real chains)
    expect(addrs).not.toContain('$bhva/methodNormatives');
  });

  it('applies REF_PENALTY (+2 metaWeight) to expanded $ref chains', () => {
    const bsynUnit = makeUnit([
      { Order: 1, H1: 'method', chain: ['3.12/all'] },
      { Order: 5, H2: '$ref: $bhva/methodNormatives', chain: ['$bhva/methodNormatives'] },
    ]);
    const bhvaUnit = makeUnit([
      { Order: 1, H1: 'Method Norms', chain: ['2.6.8.3/all'] },
    ]);
    const registry = makeRegistry([
      ['bsyn', { methodSyntax: bsynUnit }],
      ['bhva', { methodNormatives: bhvaUnit }],
    ]);

    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'methodSyntax', bsynUnit)],
      ['bsyn', 'bhva'],
      undefined,
      undefined,
      registry,
    );

    const direct = plan.chains.find(c => c.address === '3.12/all')!;
    const ref = plan.chains.find(c => c.address === '2.6.8.3/all')!;
    // direct: meta=1, Order=1 → 1×30 + 1×10 = 40
    expect(direct.score).toBe(40);
    // ref: meta=1+2=3, Order=1 → 3×30 + 1×10 = 100 + 20(territory: '2.6' not in bsyn/bhva top-2) = 120
    expect(ref.score).toBe(120);
    expect(ref.score).toBeGreaterThan(direct.score);
  });

  it('resolves internal $ref within same index', () => {
    // Unit with internal $ref
    const mainUnit: IndexUnit = {
      keywords: ['test'],
      seq: [
        { Order: 1, chain: ['2.1/all'], H1: 'Main' } as unknown as import('../lib/types.js').SeqEntry,
        { $ref: '/subUnit', Order: 2 } as unknown as import('../lib/types.js').SeqEntry,
      ],
    };
    const subUnit = makeUnit([
      { Order: 1, H1: 'Sub Content', chain: ['B.1.1/all'] },
    ]);
    const registry = makeRegistry([
      ['phya', { mainUnit, subUnit }],
    ]);

    const plan = buildReadingPlan(
      [makeMatch('phya', 'mainUnit', mainUnit)],
      ['phya'],
      undefined,
      undefined,
      registry,
    );

    const addrs = plan.chains.map(c => c.address);
    expect(addrs).toContain('2.1/all');
    // Internal ref expanded to subUnit's chains
    expect(addrs).toContain('B.1.1/all');
  });

  it('prevents cycles in $ref resolution', () => {
    // Two units referencing each other
    const unitA = makeUnit([
      { Order: 1, H1: 'A', chain: ['2.1/all'] },
      { Order: 5, H2: '$ref: $phya/unitB', chain: ['$phya/unitB'] },
    ]);
    const unitB = makeUnit([
      { Order: 1, H1: 'B', chain: ['2.2/all'] },
      { Order: 5, H2: '$ref: $phya/unitA', chain: ['$phya/unitA'] },
    ]);
    const registry = makeRegistry([
      ['phya', { unitA, unitB }],
    ]);

    const plan = buildReadingPlan(
      [makeMatch('phya', 'unitA', unitA)],
      ['phya'],
      undefined,
      undefined,
      registry,
    );

    const addrs = plan.chains.map(c => c.address);
    expect(addrs).toContain('2.1/all');
    expect(addrs).toContain('2.2/all');
    // Should not infinite loop — test passes if we get here
  });

  it('gracefully handles unresolvable $ref', () => {
    const unit = makeUnit([
      { Order: 1, H1: 'main', chain: ['3.1/all'] },
      { Order: 5, H2: '$ref: $unknown/missingUnit', chain: ['$unknown/missingUnit'] },
    ]);
    // Registry doesn't include 'unknown' alias
    const registry = makeRegistry([
      ['bsyn', { testUnit: unit }],
    ]);

    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'testUnit', unit)],
      ['bsyn'],
      undefined,
      undefined,
      registry,
    );

    const addrs = plan.chains.map(c => c.address);
    expect(addrs).toContain('3.1/all');
    // Unresolvable ref emitted as-is with high score
    expect(addrs).toContain('$unknown/missingUnit');
    const refChain = plan.chains.find(c => c.address === '$unknown/missingUnit')!;
    expect(refChain.isRef).toBe(true);
  });

  it('works without indexRegistry (backward compat)', () => {
    const unit = makeUnit([
      { Order: 1, H1: 'method', chain: ['3.12/all'] },
      { Order: 10, H2: '$ref: $bhva/methodNormatives', chain: ['$bhva/methodNormatives'] },
    ]);

    // No registry passed — $ref chains stay as-is
    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'methodSyntax', unit)],
      ['bsyn'],
    );

    const addrs = plan.chains.map(c => c.address);
    expect(addrs).toContain('3.12/all');
    // Without registry, $-addr passes through as regular chain
    expect(addrs).toContain('$bhva/methodNormatives');
  });
});

// ─── Content tag scoring ────────────────────────────────────────────

describe('content tag scoring (enumTag / normTag)', () => {
  it('enumTag=normative + intent=normative_rules gives -15 bonus', () => {
    const unit = makeUnit([
      { Order: 3, H3: '2.6.6.3 Normative Properties', chain: ['2.6.6.3/all'], enumTag: 'normative' },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bhva', 'ruleNorm', unit, true)],
      ['bhva'],
      ['normative'],
      'WHEN',
      undefined,
      'normative_rules',
    );
    const c = plan.chains.find(c => c.address === '2.6.6.3/all')!;
    // meta=1×30 + Order=3×10 - onto=15
    // - pairBonus ('normative properties'→WHAT/WHEN: WHEN=secondary=15+dim(mixed)=5 → 20)
    // - kwRes('normative')=8 - tagBonus(enumIntent=15)=15
    // + territory(2.6.6.3 not in bhva→+20)
    // = 30+30-15-20-8-15+20 = 22
    expect(c.score).toBe(22);
  });

  it('enumTag=structural + structural dimension gives -10 bonus', () => {
    const unit = makeUnit([
      { Order: 5, H3: '2.5.3 Derived Array Types', chain: ['2.5.3/all'], enumTag: 'structural' },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'derivedArr', unit)],
      ['phya'],
      ['type', 'syntax'],
      'HOW',
    );
    const c = plan.chains.find(c => c.address === '2.5.3/all')!;
    // meta=1×30 + Order=5×10 - onto=0 - pairBonus=0 (heading "derived array types" no pair match)
    // - kwRes('type' in 'derived array types')=8 - tagBonus(enumDim=10)=10
    // = 30+50-0-0-8-10 = 62
    expect(c.score).toBe(62);
  });

  it('normTag=behavioral + behavioral dimension gives -8 bonus', () => {
    const unit = makeUnit([
      { Order: 4, H3: '7.5 Enforcement Graph', chain: ['7.5/all'], normTag: 'behavioral' },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bhva', 'enfGraph', unit, true)],
      ['bhva'],
      ['enforcement'],
      'WHEN',
    );
    const c = plan.chains.find(c => c.address === '7.5/all')!;
    // meta=1×30 + Order=4×10 - onto=15 - pairBonus("enforcement"→WHEN primary=25+dim=5=30)
    // - kwRes('enforcement')=8 - tagBonus(normDim=8 + normOnto=5)=13
    // = 30+40-15-30-8-13 = 4
    expect(c.score).toBe(4);
  });

  it('normTag + onto=WHEN gives -5 mild boost regardless of dimension', () => {
    const unit = makeUnit([
      { Order: 2, H3: '3.12.5 Method Normatives', chain: ['3.12.5/all'], normTag: 'declarative' },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bsyn', 'methodNorm', unit, true)],
      ['bsyn'],
      ['method'],
      'WHEN',
    );
    const c = plan.chains.find(c => c.address === '3.12.5/all')!;
    // meta=1×30 + Order=2×10 - onto=15
    // - pairBonus ('normative' in 'method normatives'→WHAT/WHEN: WHEN=secondary=15+dim(mixed)=5 → 20)
    // - kwRes('method')=8 - tagBonus(normOnto=5)=5
    // = 30+20-15-20-8-5 = 2
    expect(c.score).toBe(2);
  });

  it('enumTag=example + intent=canonical_example gives -15 bonus', () => {
    const unit = makeUnit([
      { Order: 6, H3: 'B.9.3 Example Configuration', chain: ['B.9.3/all'], enumTag: 'example' },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'exConfig', unit)],
      ['phya'],
      ['configuration'],
      undefined,
      undefined,
      'canonical_example',
    );
    const c = plan.chains.find(c => c.address === 'B.9.3/all')!;
    // meta=1×30 + Order=6×10 - onto=0 - pairBonus=0
    // - kwRes('configuration' in 'example configuration')=8 - tagBonus(enumIntent=15)=15
    // = 30+60-0-0-8-15 = 67
    expect(c.score).toBe(67);
  });

  it('no tags → tagBonus=0 (backward compatible)', () => {
    const unit = makeUnit([
      { Order: 3, chain: ['2.1.1/all'] },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('phya', 'integral', unit)],
      ['phya'],
    );
    const c = plan.chains.find(c => c.address === '2.1.1/all')!;
    // meta=1×30 + Order=3×10 = 60 (no tags, no keywords, no onto)
    expect(c.score).toBe(60);
  });

  it('tier promotion: T3→T2 via normTag+enumTag combined bonus', () => {
    const unit = makeUnit([
      { Order: 7, H3: '7.3 Enforcement Invariants', chain: ['7.3/all'],
        enumTag: 'normative', normTag: 'behavioral' },
    ]);
    const plan = buildReadingPlan(
      [makeMatch('bhva', 'enfInv', unit, true)],
      ['bhva'],
      ['enforcement'],
      'WHEN',
      undefined,
      'normative_rules',
    );
    const c = plan.chains.find(c => c.address === '7.3/all')!;
    // meta=1×30 + Order=7×10 - onto=15
    // - pairBonus('enforcement invariant'→WHEN primary=25+dim=5=30)
    // - kwRes('enforcement')=8
    // - tagBonus(enumIntent=15 + enumDim=10 + normDim=8 + normOnto=5)=38
    // = 30+70-15-30-8-38 = 9
    expect(c.score).toBe(9);
    // T1 (≤60) — was T3 without tags (30+70-15-30-8-0=47 → already T1,
    //   but without pair: 30+70-15-0-8-0=77 → T2; with tags: drops to 9)
    expect(c.score).toBeLessThanOrEqual(60);
  });
});
