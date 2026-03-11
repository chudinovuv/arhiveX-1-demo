/**
 * Quick smoke test: runs the pipeline without MCP transport.
 * Usage: node dist/test.js <keyword>
 */
import { IndexLoader } from './lib/indexLoader.js';
import { ChainResolver } from './lib/chainResolver.js';
import { assembleTape, formatTape } from './lib/tapeAssembler.js';
import { initExtractor } from './lib/textExtractor.js';
import { resolve } from 'path';

const SPEC_ROOT = resolve(import.meta.dirname, '..', '..', '..');

async function main() {
  await initExtractor(SPEC_ROOT);
  const keyword = process.argv[2] || 'envelope';
  console.log(`\n🔍 Searching for: "${keyword}"\n`);

  const loader = new IndexLoader(SPEC_ROOT);
  const resolver = new ChainResolver(SPEC_ROOT);

  // 1. Search
  const matches = await loader.searchKeyword(keyword);
  console.log(`Found ${matches.length} matching unit(s):\n`);
  for (const m of matches) {
    console.log(`  • ${m.unitName} (${m.alias}, via ${m.matchType})`);
  }

  if (matches.length === 0) {
    console.log('No results.');
    return;
  }

  // 2. Assemble tape for first match
  const first = matches[0];
  console.log(`\n📋 Assembling tape for: ${first.unitName}\n`);

  const tape = await assembleTape(
    first.unitName,
    first.unit,
    first.alias,
    [keyword],
    resolver,
  );

  // 3. Format and print
  const output = formatTape(tape);
  console.log(output);

  // Stats
  const totalChars = output.length;
  const totalSegments = tape.segments.length;
  const totalBlocks = tape.segments.reduce((s, seg) => s + seg.blocks.length, 0);
  console.log(`\n📊 Stats: ${totalSegments} segments, ${totalBlocks} blocks, ${totalChars} chars`);
}

main().catch(console.error);
