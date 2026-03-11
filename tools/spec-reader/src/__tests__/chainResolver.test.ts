import { describe, it, expect } from 'vitest';
import { ChainResolver } from '../lib/chainResolver.js';

// We only test the pure/sync methods: parseChainAddress, expandRange.
// resolveFile is async and needs real filesystem — tested via integration.

const resolver = new ChainResolver('.');

// ─── parseChainAddress ──────────────────────────────────────────────

describe('parseChainAddress', () => {
  it('parses bare section number', () => {
    const a = resolver.parseChainAddress('2.7.3');
    expect(a.base).toBe('2.7.3');
    expect(a.suffixType).toBe('none');
    expect(a.raw).toBe('2.7.3');
  });

  it('parses annex section number', () => {
    const a = resolver.parseChainAddress('B.2.1');
    expect(a.base).toBe('B.2.1');
    expect(a.suffixType).toBe('none');
  });

  it('parses /all suffix (lowercase)', () => {
    const a = resolver.parseChainAddress('2.5.3/all');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('all');
  });

  it('parses /All suffix (mixed case)', () => {
    const a = resolver.parseChainAddress('2.5.3/All');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('all');
  });

  it('parses single aspect (e.g. /A.)', () => {
    const a = resolver.parseChainAddress('2.5.3/A.');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('aspect');
    expect(a.suffixValue).toBe('A');
  });

  it('parses aspect range (e.g. /A.-D.)', () => {
    const a = resolver.parseChainAddress('2.5.3/A.-D.');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('aspect-range');
    expect(a.rangeStart).toBe('A');
    expect(a.rangeEnd).toBe('D');
  });

  it('parses single paragraph (e.g. /(B))', () => {
    const a = resolver.parseChainAddress('2.5.3/(B)');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('paragraph');
    expect(a.suffixValue).toBe('B');
  });

  it('parses paragraph range (e.g. /(A)-(F))', () => {
    const a = resolver.parseChainAddress('2.5.3/(A)-(F)');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('paragraph-range');
    expect(a.rangeStart).toBe('A');
    expect(a.rangeEnd).toBe('F');
  });

  it('parses table suffix (e.g. /table-1)', () => {
    const a = resolver.parseChainAddress('2.0.1/table-1');
    expect(a.base).toBe('2.0.1');
    expect(a.suffixType).toBe('table');
    expect(a.suffixValue).toBe('1');
  });

  it('parses block suffix (e.g. /block-2)', () => {
    const a = resolver.parseChainAddress('3.0/block-2');
    expect(a.base).toBe('3.0');
    expect(a.suffixType).toBe('block');
    expect(a.suffixValue).toBe('2');
  });

  it('treats unknown suffix as none', () => {
    const a = resolver.parseChainAddress('2.5.3/unknown');
    expect(a.base).toBe('2.5.3');
    expect(a.suffixType).toBe('none');
  });
});

// ─── expandRange ────────────────────────────────────────────────────

describe('expandRange', () => {
  it('expands aspect range A-D into 4 addresses', () => {
    const addr = resolver.parseChainAddress('2.5.3/A.-D.');
    const expanded = resolver.expandRange(addr);
    expect(expanded).toEqual([
      '2.5.3/A.',
      '2.5.3/B.',
      '2.5.3/C.',
      '2.5.3/D.',
    ]);
  });

  it('expands paragraph range (A)-(C) into 3 addresses', () => {
    const addr = resolver.parseChainAddress('2.5.3/(A)-(C)');
    const expanded = resolver.expandRange(addr);
    expect(expanded).toEqual([
      '2.5.3/(A)',
      '2.5.3/(B)',
      '2.5.3/(C)',
    ]);
  });

  it('returns raw for non-range addresses', () => {
    const addr = resolver.parseChainAddress('2.5.3/A.');
    const expanded = resolver.expandRange(addr);
    expect(expanded).toEqual(['2.5.3/A.']);
  });

  it('returns raw for /all', () => {
    const addr = resolver.parseChainAddress('2.5.3/all');
    const expanded = resolver.expandRange(addr);
    expect(expanded).toEqual(['2.5.3/all']);
  });

  it('single-letter range returns one address', () => {
    const addr = resolver.parseChainAddress('2.1/A.-A.');
    const expanded = resolver.expandRange(addr);
    expect(expanded).toEqual(['2.1/A.']);
  });
});

// ─── Error handling: malformed inputs ──────────────────────────────

describe('parseChainAddress — malformed inputs', () => {
  it('empty string returns suffixType none with empty base', () => {
    const a = resolver.parseChainAddress('');
    expect(a.suffixType).toBe('none');
    expect(a.base).toBe('');
    expect(a.raw).toBe('');
  });

  it('string with only slash returns suffixType none', () => {
    const a = resolver.parseChainAddress('/');
    expect(a.base).toBe('');
    // suffix is empty string after /, doesn't match any pattern
    expect(a.suffixType).toBe('none');
  });

  it('multiple slashes treats only first as separator', () => {
    const a = resolver.parseChainAddress('2.5/A./B.');
    expect(a.base).toBe('2.5');
    // suffix is "A./B." which doesn't match any pattern
    expect(a.suffixType).toBe('none');
  });

  it('lowercase aspect suffix (e.g. /a.) returns none — not a valid aspect', () => {
    const a = resolver.parseChainAddress('2.5/a.');
    expect(a.suffixType).toBe('none');
  });

  it('trailing dot in base does not crash', () => {
    const a = resolver.parseChainAddress('2.7./A.');
    expect(a.base).toBe('2.7.');
    expect(a.suffixType).toBe('aspect');
  });
});

describe('expandRange — malformed inputs', () => {
  it('reversed aspect range D.-A. returns empty array', () => {
    const addr = resolver.parseChainAddress('2.5.3/D.-A.');
    const expanded = resolver.expandRange(addr);
    // D(68) > A(65) → for loop doesn't execute
    expect(expanded).toEqual([]);
  });

  it('reversed paragraph range (F)-(A) returns empty array', () => {
    const addr = resolver.parseChainAddress('2.5.3/(F)-(A)');
    const expanded = resolver.expandRange(addr);
    expect(expanded).toEqual([]);
  });
});

describe('resolveFile — filesystem edge cases', () => {
  it('throws when currentDir does not exist', async () => {
    const badResolver = new ChainResolver('/nonexistent/path/xyz');
    await expect(badResolver.resolveFile('2.1')).rejects.toThrow();
  });
});

// ─── resolveFile — annex disambiguation (real filesystem) ───────────

import { resolve } from 'path';

const SPEC_ROOT = resolve(__dirname, '..', '..', '..', '..');

describe('resolveFile — annex D vs D1 disambiguation', () => {
  const realResolver = new ChainResolver(SPEC_ROOT);

  it('D.3 resolves to annex_d_rule_normative_classes.md', async () => {
    const file = await realResolver.resolveFile('D.3');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_d_rule_normative_classes.md');
  });

  it('D.4.1 resolves to annex_d_rule_normative_classes.md', async () => {
    const file = await realResolver.resolveFile('D.4.1');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_d_rule_normative_classes.md');
  });

  it('D1.3 resolves to annex_d_1_compiler_enforcement_model.md', async () => {
    const file = await realResolver.resolveFile('D1.3');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_d_1_compiler_enforcement_model.md');
  });

  it('G.10 resolves to annex_g_compilation_errors.md', async () => {
    const file = await realResolver.resolveFile('G.10');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_g_compilation_errors.md');
  });

  it('G1.1 resolves to annex_g_1_diagnostic_compilation_reaction_model.md', async () => {
    const file = await realResolver.resolveFile('G1.1');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_g_1_diagnostic_compilation_reaction_model.md');
  });

  it('A.6 resolves to annex_a_type_registry.md', async () => {
    const file = await realResolver.resolveFile('A.6');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_a_type_registry.md');
  });

  it('B.2 resolves to annex_b_type_metadata.md', async () => {
    const file = await realResolver.resolveFile('B.2');
    expect(file).toBeTruthy();
    expect(file!).toContain('annex_b_type_metadata.md');
  });
});

// ─── resolveFile — prefix shortening safety (real filesystem) ──────

describe('resolveFile — no single-segment fallback', () => {
  const realResolver = new ChainResolver(SPEC_ROOT);

  it('2.5.6 resolves to 2_5_derived_types.md (not 2_1_primitive_types.md)', async () => {
    const file = await realResolver.resolveFile('2.5.6');
    expect(file).toBeTruthy();
    expect(file!).toContain('2_5_derived_types.md');
  });

  it('2.7.3 resolves to 2_7_3_semantic_interface.md', async () => {
    const file = await realResolver.resolveFile('2.7.3');
    expect(file).toBeTruthy();
    expect(file!).toContain('2_7_3_semantic_interface.md');
  });

  it('2.1 resolves to 2_1_primitive_types.md', async () => {
    const file = await realResolver.resolveFile('2.1');
    expect(file).toBeTruthy();
    expect(file!).toContain('2_1_primitive_types.md');
  });
});

// ─── unresolvedChains tracking ─────────────────────────────────────

describe('unresolvedChains tracking', () => {
  const realResolver = new ChainResolver(SPEC_ROOT);

  it('starts empty', () => {
    realResolver.clearUnresolved();
    expect(realResolver.unresolvedChains).toEqual([]);
  });

  it('tracks chains that resolve to null', async () => {
    realResolver.clearUnresolved();
    // Use a chain that cannot possibly match any file
    const result = await realResolver.resolveFile('99.99.99');
    expect(result).toBeNull();
    expect(realResolver.unresolvedChains).toContain('99.99.99');
  });

  it('does not track chains that resolve successfully', async () => {
    realResolver.clearUnresolved();
    const result = await realResolver.resolveFile('2.1');
    expect(result).toBeTruthy();
    expect(realResolver.unresolvedChains).toEqual([]);
  });

  it('clearUnresolved resets the list', async () => {
    realResolver.clearUnresolved();
    await realResolver.resolveFile('99.99.99');
    expect(realResolver.unresolvedChains.length).toBeGreaterThan(0);
    realResolver.clearUnresolved();
    expect(realResolver.unresolvedChains).toEqual([]);
  });

  it('deduplicates repeated unresolved chains', async () => {
    realResolver.clearUnresolved();
    await realResolver.resolveFile('88.1');
    await realResolver.resolveFile('88.1');
    await realResolver.resolveFile('88.1');
    expect(realResolver.unresolvedChains).toEqual(['88.1']);
  });
});
