const fs = require('fs');
const path = require('path');

const indexDir = path.join(__dirname, '..', 'spec-reader', 'indexes');

const indexFiles = [
  ['phya', 'physical_aspect_index.json'],
  ['sema', 'semantic_aspect_index.json'],
  ['ont', 'ontologic_aspect_index.json'],
  ['desa', 'design_aspect_index.json'],
  ['grma', 'grammar_aspect_index.json'],
  ['bhva', 'behavioral_aspect_index.json'],
  ['phla', 'philosophical_aspect_index.json'],
  ['trma', 'terminology_aspect_index.json'],
  ['onma', 'ontological_role_index.json'],
  ['bsyn', 'block_syntax_aspect_index.json'],
  ['grix', 'grammar_index.json']
];

const allUnits = [];
for (const [alias, file] of indexFiles) {
  let raw = fs.readFileSync(path.join(indexDir, file), 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const idx = JSON.parse(raw);
  for (const [name, unit] of Object.entries(idx)) {
    if (name === '$specVersion') continue;
    if (unit.keywords) {
      allUnits.push({
        name,
        alias,
        keywords: unit.keywords.map(k => k.toLowerCase()),
        hasAbstract: !!unit.abstract
      });
    }
  }
}

console.log(`Loaded ${allUnits.length} units from ${indexFiles.length} indexes\n`);

const questions = [
  { id: 'A-001', terms: ['fixed string', 'capacity', 'constraint'] },
  { id: 'A-002', terms: ['binary encoding', 'primitive', 'inline threshold'] },
  { id: 'A-003', terms: ['null', 'void', 'nothing'] },
  { id: 'A-004', terms: ['implicit conversion', 'numeric', 'type compatibility'] },
  { id: 'A-005', terms: ['identifiers', 'guid', 'riid'] },
  { id: 'A-006', terms: ['boolean', 'encoding', 'binary'] },
  { id: 'A-007', terms: ['date', 'time', 'normative'] },
  { id: 'A-008', terms: ['enum', 'default', 'initialization'] },
  { id: 'A-009', terms: ['inline', 'external', 'performance', 'optimization'] },
  { id: 'A-010', terms: ['conversion', 'non-numeric', 'explicit'] },
  { id: 'B-001', terms: ['integral', 'integer', 'bit width'] },
  { id: 'B-002', terms: ['decimal', 'floating', 'normative'] },
  { id: 'B-003', terms: ['integer', 'encoding', 'binary'] },
  { id: 'B-004', terms: ['floating-point', 'decimal', 'encoding'] },
  { id: 'B-005', terms: ['temporal', 'date', 'time', 'encoding'] },
  { id: 'B-006', terms: ['identifier', 'guid', 'riid', 'encoding'] },
  { id: 'B-007', terms: ['parser', 'obligations', 'binary decoding'] },
  { id: 'B-008', terms: ['block type', 'compatibility', 'assignment'] },
  { id: 'B-009', terms: ['derived type', 'record', 'array', 'compatibility'] },
  { id: 'B-010', terms: ['semantic type', 'compatibility', 'normative'] },
];

for (const q of questions) {
  const matches = [];
  for (const unit of allUnits) {
    let matchCount = 0;
    const matchedTerms = [];
    for (const term of q.terms) {
      const tl = term.toLowerCase();
      if (unit.keywords.some(kw => kw.includes(tl) || tl.includes(kw))) {
        matchCount++;
        matchedTerms.push(term);
      }
    }
    if (matchCount >= 1) {
      matches.push({
        id: unit.alias + '/' + unit.name,
        matchCount,
        matchedTerms,
        hasAbstract: unit.hasAbstract
      });
    }
  }
  matches.sort((a, b) => b.matchCount - a.matchCount);

  const top = matches.slice(0, 5);
  const best = top[0]?.matchCount || 0;
  const status = best >= 3 ? 'STRONG' : best >= 2 ? 'OK' : best >= 1 ? 'WEAK' : 'MISS';

  console.log(`${q.id} [${status}]`);
  if (top.length === 0) {
    console.log('  NO MATCHES');
  } else {
    for (const m of top) {
      const abs = m.hasAbstract ? '' : ' !NO-ABS';
      console.log(`  ${m.id} (${m.matchCount}/${q.terms.length}: ${m.matchedTerms.join(', ')})${abs}`);
    }
  }
}
