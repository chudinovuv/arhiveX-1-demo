import type { Tape, TapeSegment, ExtractedBlock, SeqEntry, IndexUnit } from './types.js';
import { IndexLoader } from './indexLoader.js';
import { ChainResolver } from './chainResolver.js';
import { extractText, clearFileCache } from './textExtractor.js';

/**
 * Assembles a tape from an index unit: resolves all chain addresses,
 * extracts text, and produces an ordered tape.
 */
export async function assembleTape(
  unitName: string,
  unit: IndexUnit,
  indexAlias: string,
  matchedKeywords: string[],
  resolver: ChainResolver,
): Promise<Tape> {
  // Clear file cache for fresh reads
  clearFileCache();

  const segments: TapeSegment[] = [];

  // Process seq entries in Order
  const sortedSeq = [...unit.seq]
    .filter((e): e is SeqEntry => typeof e === 'object' && e !== null)
    .sort((a, b) => a.Order - b.Order);

  for (const entry of sortedSeq) {
    // Skip $ref entries (cross-index references) — not yet resolved
    if (!Array.isArray(entry.chain) || entry.chain.length === 0) continue;

    const heading = IndexLoader.extractHeading(entry);
    const headingStr = heading
      ? `${heading.fieldName}: ${heading.cleanTitle}`
      : `Order ${entry.Order}`;

    const blocks: ExtractedBlock[] = [];

    for (const rawAddr of entry.chain) {
      const parsed = resolver.parseChainAddress(rawAddr);

      // Expand ranges into individual addresses
      if (parsed.suffixType === 'aspect-range' || parsed.suffixType === 'paragraph-range') {
        const expanded = resolver.expandRange(parsed);
        for (const expandedRaw of expanded) {
          const expandedParsed = resolver.parseChainAddress(expandedRaw);
          const filePath = await resolver.resolveFile(expandedParsed.base);
          if (!filePath) {
            blocks.push({ address: expandedRaw, text: `[MISSING_CONTENT: ${expandedParsed.base}]` });
            continue;
          }
          const block = await extractText(filePath, expandedParsed);
          if (block) blocks.push(block);
        }
      } else {
        const filePath = await resolver.resolveFile(parsed.base);
        if (!filePath) {
          blocks.push({ address: rawAddr, text: `[MISSING_CONTENT: ${parsed.base}]` });
          continue;
        }
        const block = await extractText(filePath, parsed);
        if (block) blocks.push(block);
      }
    }

    segments.push({
      order: entry.Order,
      heading: headingStr,
      blocks,
    });
  }

  return {
    unitName,
    indexAlias,
    matchedKeywords,
    segments,
    missingChains: resolver.unresolvedChains,
  };
}

/**
 * Format a tape into a readable text string for the agent.
 */
export function formatTape(tape: Tape): string {
  const lines: string[] = [];

  lines.push(`═══ UNIT: ${tape.unitName} (${tape.indexAlias}) ═══`);
  lines.push(`Keywords matched: ${tape.matchedKeywords.join(', ')}`);
  lines.push('');

  for (const seg of tape.segments) {
    lines.push(`─── [${seg.order}] ${seg.heading} ───`);

    for (const block of seg.blocks) {
      if (block.heading) {
        lines.push(`  ▸ ${block.address}`);
      } else {
        lines.push(`  ▸ ${block.address}`);
      }
      lines.push(block.text);
      lines.push('');
    }
  }

  // Append missing-content summary if any chains were unresolvable
  if (tape.missingChains && tape.missingChains.length > 0) {
    lines.push('─── MISSING CONTENT ───');
    lines.push(`The following sections have no backing file in current/. Skip these chains — content is absent.`);
    for (const chain of tape.missingChains) {
      lines.push(`  ✗ ${chain}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format multiple tapes from different units into a combined output.
 */
export function formatMultipleTapes(tapes: Tape[]): string {
  if (tapes.length === 0) {
    return '[No matching units found]';
  }
  return tapes.map(formatTape).join('\n\n');
}
