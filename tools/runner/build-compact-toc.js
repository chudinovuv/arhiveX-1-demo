#!/usr/bin/env node
// build-compact-toc.js — Generate a compact TOC from spec-toc.txt
// Removes repetitive generic subheadings (Designation, Syntax, AST Grammar, etc.)
// Keeps: depth 0 + non-generic depth 1 + non-generic depth 2
// Uses case-insensitive matching, strips encoding artifacts (Â, NBSP)
// Output: spec-toc-compact.txt

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tocPath = resolve(__dirname, 'spec-toc.txt');
const outPath = resolve(__dirname, 'spec-toc-compact.txt');

const toc = readFileSync(tocPath, 'utf-8').split('\n');

// Generic titles that repeat across many sections (noise)
// All lowercased for case-insensitive matching
const GENERIC_TITLES = new Set([
  'designation',
  'semantic role',
  'normative properties',
  'behavioral properties',
  'interaction constraints',
  'interaction surface',
  'syntax',
  'syntax (normative)',
  'normative syntax',
  'formal syntax',
  'canonical syntax',
  'normative rules',
  'declaration (normative)',
  'ast grammar',
  'canonic declaration',
  'canonical declaration',
  'canonical examples',
  'canonical example',
  'cross-reference summary',
  'bnf summary',
  'syntax forms',
  'contextual admissibility',
  'examples',
  'semantic data binding',
  'semantic guarantees',
  'general',
  'constraints',
  'enforcement',
  'summary table',
  'verification algorithm constraints',
  'parameters',
  'purpose',
  'rules',
  'semantics',
  'forward references',
  'compiler constraints',
  'formation (normative)',
  'declaration syntax (normative)',
  'example',
  'scope',
]);

function getDepth(line) {
  const match = line.match(/^(\s*)/);
  return match ? match[1].length / 2 : 0;
}

function stripToTitle(line) {
  let t = line.replace(/^\s+/, '');
  // Strip section number: "2.5.1.3 Title" → "Title"
  t = t.replace(/^\d[\d.]*\s*/, '');
  // Strip annex number: "A.1.2 Title" → "Title"  
  t = t.replace(/^[A-Z]\.[\d.]*\s*/, '');
  // Strip encoding artifacts (Â, NBSP, bold markers)
  t = t.replace(/[\u00C2\u00A0]/g, '').replace(/\*\*/g, '').trim();
  return t;
}

function isGeneric(title) {
  return GENERIC_TITLES.has(title.toLowerCase());
}

const kept = [];
let stats = { d0: 0, d1: 0, d1filtered: 0, d2: 0, d2filtered: 0, d3plus: 0 };

for (const line of toc) {
  if (!line.trim()) continue;
  
  const depth = getDepth(line);
  
  // Always drop depth 3+ (too deep)
  if (depth >= 3) { stats.d3plus++; continue; }
  
  // Depth 0: always keep (top-level sections)
  if (depth === 0) {
    kept.push(line);
    stats.d0++;
    continue;
  }
  
  // Depth 1 and 2: keep only non-generic titles
  const title = stripToTitle(line);
  if (isGeneric(title)) {
    if (depth === 1) stats.d1filtered++;
    else stats.d2filtered++;
    continue;
  }
  
  kept.push(line);
  if (depth === 1) stats.d1++;
  else stats.d2++;
}

const output = kept.join('\n');
writeFileSync(outPath, output, 'utf-8');

console.log(`Original: ${toc.length} lines, ${toc.join('\n').length} chars, ~${Math.round(toc.join('\n').length / 4)} tokens`);
console.log(`Compact:  ${kept.length} lines, ${output.length} chars, ~${Math.round(output.length / 4)} tokens`);
console.log(`Stats: d0=${stats.d0} d1=${stats.d1}(−${stats.d1filtered}) d2=${stats.d2}(−${stats.d2filtered}) d3+=${stats.d3plus}`);
console.log(`Saved:    ${outPath}`);
