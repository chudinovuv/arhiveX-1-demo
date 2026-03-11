import { readFile } from 'fs/promises';
import { resolve } from 'path';
import type { ChainAddress, ExtractedBlock } from './types.js';

// ─── Fenced code block extraction ───────────────────────────────────

/** A single fenced code block extracted from text */
export interface CodeBlockEntry {
  /** Language tag after opening ```, e.g. "ebnf", "" */
  lang: string;
  /** Content between opening and closing ``` (no fences) */
  content: string;
  /** 0-based line number of opening ``` in source */
  startLine: number;
  /** 0-based line number of closing ``` in source */
  endLine: number;
}

const FENCE_OPEN_RE = /^```(\w*)$/;
const FENCE_CLOSE_RE = /^```$/;

/**
 * Extract all fenced code blocks from raw text.
 * Returns array of CodeBlockEntry with language, content, and line positions.
 */
export function extractCodeBlocks(text: string): CodeBlockEntry[] {
  const lines = text.split('\n');
  const result: CodeBlockEntry[] = [];
  let inside = false;
  let lang = '';
  let startLine = 0;
  let body: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (!inside) {
      const m = lines[i].match(FENCE_OPEN_RE);
      if (m) {
        inside = true;
        lang = m[1] || '';
        startLine = i;
        body = [];
      }
    } else {
      if (FENCE_CLOSE_RE.test(lines[i])) {
        result.push({ lang, content: body.join('\n'), startLine, endLine: i });
        inside = false;
      } else {
        body.push(lines[i]);
      }
    }
  }
  return result;
}

// ─── Reference extraction ───────────────────────────────────────────

/** A reference found in spec text */
export interface ReferenceEntry {
  /** Reference type: section | internal | web | person */
  type: 'section' | 'internal' | 'web' | 'person';
  /** Raw matched text */
  raw: string;
  /** Normalized target — section number, URL, or contact */
  target: string;
  /** 0-based line number in source */
  line: number;
}

// Ordered from most specific to least to avoid overlapping matches
const REF_PATTERNS: Array<{ type: ReferenceEntry['type']; re: RegExp; target: (m: RegExpMatchArray) => string }> = [
  // (ask: Name: email|link)
  {
    type: 'person',
    re: /\(ask:\s*([^:]+):\s*(email|link)\)/g,
    target: m => m[1].trim(),
  },
  // Section X.Y.Z  or  Section A.Y.Z  (with optional "See" prefix)
  // Requires at least one digit to avoid false positives like "section specification"
  {
    type: 'section',
    re: /(?:See\s+)?Section\s+(\d+(?:\.\d+)*|[A-Z]\.\d+(?:\.\d+)*)/gi,
    target: m => m[1],
  },
  // [in Section X.Y.Z]
  {
    type: 'section',
    re: /\[in\s+Section\s+([A-Z0-9]+(?:\.\d+)*)\]/gi,
    target: m => m[1],
  },
  // (See <{Section}1/title>) — internal cross-ref
  {
    type: 'internal',
    re: /\(See\s+<([^>]+)>\)/g,
    target: m => m[1],
  },
  // [title: <url>] — web (custom format)
  {
    type: 'web',
    re: /\[([^\]]+):\s*<([^>]+)>\]/g,
    target: m => m[2],
  },
  // [text](url) — standard markdown links
  {
    type: 'web',
    re: /\[([^\]]+)\]\(([^)]+)\)/g,
    target: m => m[2],
  },
];

/**
 * Extract all references (section, internal, web, person) from raw text.
 * Uses patterns from patterns.json reference section.
 */
export function extractReferences(text: string): ReferenceEntry[] {
  const lines = text.split('\n');
  const result: ReferenceEntry[] = [];
  const seen = new Set<string>();  // deduplicate by type+target+line

  for (let i = 0; i < lines.length; i++) {
    // Skip inside code blocks
    if (FENCE_OPEN_RE.test(lines[i]) || FENCE_CLOSE_RE.test(lines[i])) continue;

    for (const pat of REF_PATTERNS) {
      const re = new RegExp(pat.re.source, pat.re.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(lines[i])) !== null) {
        const target = pat.target(m);
        const key = `${pat.type}:${target}:${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({ type: pat.type, raw: m[0], target, line: i });
        }
      }
    }
  }
  return result;
}

// ─── Table extraction ────────────────────────────────────────────────

/** A single markdown table extracted from text */
export interface TableEntry {
  /** Header row cells */
  headers: string[];
  /** Data rows (each row = array of cells) */
  rows: string[][];
  /** Raw text of the table (all lines including separator) */
  raw: string;
  /** 0-based line number of first table line in source */
  startLine: number;
  /** 0-based line number of last table line in source */
  endLine: number;
}

const TABLE_ROW_RE = /^\|(.+)\|\s*$/;
const TABLE_SEP_RE = /^\|[\s:|-]+\|\s*$/;

/**
 * Extract all markdown tables from raw text.
 * A table is a consecutive block of lines matching |...|.
 */
export function extractTables(text: string): TableEntry[] {
  const lines = text.split('\n');
  const result: TableEntry[] = [];
  let tableLines: string[] = [];
  let tableStart = -1;
  let inCodeBlock = false;

  const flush = (endLine: number) => {
    if (tableLines.length < 2) { tableLines = []; return; } // need at least header + separator
    const headers = parseTableRow(tableLines[0]);
    const dataStart = TABLE_SEP_RE.test(tableLines[1]) ? 2 : 1;
    const rows = tableLines.slice(dataStart).map(parseTableRow);
    result.push({ headers, rows, raw: tableLines.join('\n'), startLine: tableStart, endLine });
    tableLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    if (FENCE_OPEN_RE.test(lines[i]) || FENCE_CLOSE_RE.test(lines[i])) {
      if (tableLines.length) flush(i - 1);
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    if (TABLE_ROW_RE.test(lines[i])) {
      if (!tableLines.length) tableStart = i;
      tableLines.push(lines[i]);
    } else {
      if (tableLines.length) flush(i - 1);
    }
  }
  if (tableLines.length) flush(lines.length - 1);
  return result;
}

function parseTableRow(line: string): string[] {
  return line.split('|').slice(1, -1).map(c => c.trim());
}

// ─── Normative extraction ───────────────────────────────────────────

/** A normative statement extracted from spec text */
export interface NormativeEntry {
  /** The keyword: MUST, MUST NOT, SHOULD, SHOULD NOT, SHALL, SHALL NOT, MAY */
  keyword: string;
  /** Full line text containing the normative */
  line: string;
  /** 0-based line number in source */
  lineNumber: number;
  /** Nearest heading above this line (for context) */
  heading: string;
}

/**
 * RFC 2119 / RFC 8174 keywords.
 * Matched as whole words, case-sensitive (per RFC: uppercase only is normative).
 */
const NORMATIVE_KW_RE = /\b(MUST\s+NOT|MUST|SHALL\s+NOT|SHALL|SHOULD\s+NOT|SHOULD|MAY|REQUIRED|RECOMMENDED|OPTIONAL)\b/;

/** Heading pattern (outside code blocks) */
const HEADING_RE = /^#{1,6}\s+/;

/**
 * Extract all normative statements from raw text.
 * Returns lines containing RFC 2119 keywords + their nearest heading context.
 * Skips lines inside fenced code blocks.
 */
export function extractNormatives(text: string): NormativeEntry[] {
  const lines = text.split('\n');
  const result: NormativeEntry[] = [];
  let inCodeBlock = false;
  let currentHeading = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (FENCE_OPEN_RE.test(line) || FENCE_CLOSE_RE.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Track headings
    if (HEADING_RE.test(line)) {
      currentHeading = line.replace(/^#{1,6}\s+/, '').trim();
      continue;
    }

    // Match normative keywords
    const m = line.match(NORMATIVE_KW_RE);
    if (m) {
      result.push({
        keyword: m[1],
        line: line.trim(),
        lineNumber: i,
        heading: currentHeading,
      });
    }
  }
  return result;
}

/**
 * Format extracted normatives into compact text.
 * Groups by heading, shows keyword + statement.
 */
export function formatNormatives(entries: NormativeEntry[]): string {
  if (!entries.length) return '[no normative statements found]';

  const groups = new Map<string, NormativeEntry[]>();
  for (const e of entries) {
    const key = e.heading || '(no heading)';
    const list = groups.get(key) ?? [];
    list.push(e);
    groups.set(key, list);
  }

  const parts: string[] = [];
  for (const [heading, items] of groups) {
    parts.push(`**${heading}**`);
    for (const item of items) {
      parts.push(`  [${item.keyword}] ${item.line}`);
    }
    parts.push('');
  }
  return parts.join('\n');
}

// ─── Block filter config ────────────────────────────────────────────

interface BlockFilterEntry {
  name: string;
  open: string;   // regex pattern
  close: string;  // regex pattern
}

interface BlockFilterConfig {
  blocks: BlockFilterEntry[];
}

/** Compiled block filter — pair of RegExp */
interface CompiledFilter {
  name: string;
  open: RegExp;
  close: RegExp;
  /** true when open === close (toggle mode, like ```) */
  isToggle: boolean;
}

let compiledFilters: CompiledFilter[] | null = null;

/** Load and compile block filters from config/block-filters.json */
async function getFilters(specRoot: string): Promise<CompiledFilter[]> {
  if (compiledFilters) return compiledFilters;
  const cfgPath = resolve(specRoot, 'tools', 'spec-reader', 'config', 'block-filters.json');
  const raw = await readFile(cfgPath, 'utf-8');
  const cfg = JSON.parse(raw) as BlockFilterConfig;
  compiledFilters = cfg.blocks.map(b => ({
    name: b.name,
    open: new RegExp(b.open),
    close: new RegExp(b.close),
    isToggle: b.open === b.close,
  }));
  return compiledFilters;
}

// ─── File cache ─────────────────────────────────────────────────────

interface CachedFile {
  lines: string[];
  /** Set of line indices that are INSIDE any filtered block */
  maskedLines: Set<number>;
}

const fileCache = new Map<string, CachedFile>();

/**
 * Build a set of line indices that fall inside any configured block filter.
 * Boundary lines (open/close) are also masked.
 * Supports both toggle blocks (open === close, e.g. ```) and paired blocks (open !== close).
 */
function buildMask(lines: string[], filters: CompiledFilter[]): Set<number> {
  const mask = new Set<number>();

  for (const filter of filters) {
    let inside = false;

    for (let i = 0; i < lines.length; i++) {
      if (filter.isToggle) {
        // Toggle mode: same pattern opens and closes (e.g. ```)
        if (filter.open.test(lines[i])) {
          mask.add(i);
          inside = !inside;
        } else if (inside) {
          mask.add(i);
        }
      } else {
        // Paired mode: different open/close patterns (e.g. <grammar>...</grammar>)
        if (!inside && filter.open.test(lines[i])) {
          inside = true;
          mask.add(i);
        } else if (inside && filter.close.test(lines[i])) {
          mask.add(i);
          inside = false;
        } else if (inside) {
          mask.add(i);
        }
      }
    }
  }

  return mask;
}

let specRootPath = '';

/** Initialize the extractor with the spec root path. Must be called before extractText. */
export async function initExtractor(specRoot: string): Promise<void> {
  specRootPath = specRoot;
  await getFilters(specRoot);
}

async function getCachedFile(filePath: string): Promise<CachedFile> {
  let cached = fileCache.get(filePath);
  if (!cached) {
    const filters = await getFilters(specRootPath);
    const content = await readFile(filePath, 'utf-8');
    const lines = content.replace(/^\uFEFF/, '').split('\n');
    cached = { lines, maskedLines: buildMask(lines, filters) };
    fileCache.set(filePath, cached);
  }
  return cached;
}

/** Clear the file cache (e.g. between requests if files may change) */
export function clearFileCache(): void {
  fileCache.clear();
}

/**
 * Find the line range for a section identified by its chain number.
 * Returns { start, end } where start is the heading line and end is exclusive.
 */
function findSection(
  lines: string[],
  mask: Set<number>,
  chainBase: string,
): { start: number; end: number } | null {
  const escaped = chainBase.replace(/\./g, '\\.');
  const headingRe = new RegExp(`^(#{1,6})\\s+${escaped}(\\s+|$)`);

  let start = -1;
  let level = 0;

  for (let i = 0; i < lines.length; i++) {
    if (mask.has(i)) continue;
    const m = lines[i].match(headingRe);
    if (m) {
      start = i;
      level = m[1].length;
      break;
    }
  }

  if (start === -1) return null;

  for (let i = start + 1; i < lines.length; i++) {
    if (mask.has(i)) continue;
    const hm = lines[i].match(/^(#{1,6})\s+/);
    if (hm && hm[1].length <= level) {
      return { start, end: i };
    }
  }

  return { start, end: lines.length };
}

/**
 * Extract the heading + first paragraph (text before first structural element).
 * "Structural element" = another heading, aspect marker, code block, table, or blockquote.
 */
function extractHeadingAndFirstParagraph(
  lines: string[], start: number, end: number, mask: Set<number>,
): string {
  const result: string[] = [lines[start]];
  const structuralRe = /^(#{1,6}\s+|(\*\*)?[A-Z]\.\s+|\([A-Z]\)\s+|```|>\s+|\|.*\|)/;

  for (let i = start + 1; i < end; i++) {
    const line = lines[i];
    if (line.trim() === '' && result.length === 1) continue;
    if (line.trim() === '' && result.length > 1) break;
    if (!mask.has(i) && structuralRe.test(line)) break;
    result.push(line);
  }

  return result.join('\n');
}

/**
 * Extract entire section (for /all suffix).
 */
function extractAll(lines: string[], start: number, end: number): string {
  return lines.slice(start, end).join('\n');
}

/**
 * Extract a specific aspect (e.g. "A.") within a section.
 * Aspect starts with ^[LETTER].\s+ and ends at next aspect or section boundary.
 */
function extractAspect(
  lines: string[], start: number, end: number, letter: string, mask: Set<number>,
): string | null {
  const aspectRe = new RegExp(`^(\\*\\*)?${letter}\\.\\s+`);
  const nextAspectRe = /^(\*\*)?[A-Z]\.\s+/;

  let aspectStart = -1;
  for (let i = start; i < end; i++) {
    if (mask.has(i)) continue;
    if (aspectRe.test(lines[i])) {
      aspectStart = i;
      break;
    }
  }

  if (aspectStart === -1) return null;

  for (let i = aspectStart + 1; i < end; i++) {
    if (mask.has(i)) continue;
    if (nextAspectRe.test(lines[i]) || /^#{1,6}\s+/.test(lines[i])) {
      return lines.slice(aspectStart, i).join('\n');
    }
  }

  return lines.slice(aspectStart, end).join('\n');
}

/**
 * Extract a specific sequential paragraph (e.g. "(B)") within a section.
 */
function extractParagraph(
  lines: string[], start: number, end: number, letter: string, mask: Set<number>,
): string | null {
  const paraRe = new RegExp(`^\\(${letter}\\)\\s+`);
  const nextParaRe = /^\([A-Z]\)\s+/;

  let paraStart = -1;
  for (let i = start; i < end; i++) {
    if (mask.has(i)) continue;
    if (paraRe.test(lines[i])) {
      paraStart = i;
      break;
    }
  }

  if (paraStart === -1) return null;

  for (let i = paraStart + 1; i < end; i++) {
    if (mask.has(i)) continue;
    if (nextParaRe.test(lines[i]) || /^#{1,6}\s+/.test(lines[i]) || /^(\*\*)?[A-Z]\.\s+/.test(lines[i])) {
      return lines.slice(paraStart, i).join('\n');
    }
    if (lines[i].trim() === '' && i > paraStart + 1) {
      if (i + 1 < end && !mask.has(i + 1) &&
          (nextParaRe.test(lines[i + 1]) || /^#{1,6}\s+/.test(lines[i + 1]) || /^(\*\*)?[A-Z]\.\s+/.test(lines[i + 1]))) {
        return lines.slice(paraStart, i).join('\n');
      }
    }
  }

  return lines.slice(paraStart, end).join('\n');
}

/**
 * Extract the Nth table within a section.
 * A table is a consecutive block of lines containing |.
 */
function extractTable(
  lines: string[], start: number, end: number, n: number, mask: Set<number>,
): string | null {
  let tableCount = 0;
  let tableStart = -1;
  let inTable = false;

  for (let i = start + 1; i < end; i++) {
    if (mask.has(i)) {
      if (inTable) {
        inTable = false;
        if (tableCount === n) return lines.slice(tableStart, i).join('\n');
      }
      continue;
    }
    const isTableLine = /\|.*\|/.test(lines[i]);
    if (isTableLine && !inTable) {
      inTable = true;
      tableStart = i;
      tableCount++;
    } else if (!isTableLine && inTable) {
      inTable = false;
      if (tableCount === n) return lines.slice(tableStart, i).join('\n');
    }
  }

  if (inTable && tableCount === n) return lines.slice(tableStart, end).join('\n');
  return null;
}

/**
 * Extract the Nth code block within a section.
 */
function extractCodeBlock(lines: string[], start: number, end: number, n: number): string | null {
  let blockCount = 0;
  let blockStart = -1;
  let inBlock = false;

  for (let i = start + 1; i < end; i++) {
    if (/^```/.test(lines[i])) {
      if (!inBlock) {
        inBlock = true;
        blockStart = i;
        blockCount++;
      } else {
        inBlock = false;
        if (blockCount === n) {
          return lines.slice(blockStart, i + 1).join('\n');
        }
      }
    }
  }

  return null;
}

/**
 * Filter extracted text by keyword patterns (grep -C style).
 * Always retains: heading lines, aspect markers, paragraph markers.
 * Adds `contextLines` around each matching line.
 * Returns filtered text with `[...]` gap markers.
 */
export function filterByKeywords(
  text: string,
  patterns: RegExp[],
  contextLines: number = 2,
): string {
  const lines = text.split('\n');
  if (lines.length <= 1) return text;

  // Always include structural lines: headings, aspect markers, paragraph markers
  const structural = /^(#{1,6}\s+|(\*\*)?[A-Z]\.\s+|\([A-Z]\)\s+)/;
  const included = new Set<number>();

  // Always include first line (section heading)
  included.add(0);

  // Find matching lines and add with context window
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (structural.test(line)) {
      included.add(i);
      continue;
    }
    if (patterns.some(p => p.test(line))) {
      for (let j = Math.max(0, i - contextLines); j <= Math.min(lines.length - 1, i + contextLines); j++) {
        included.add(j);
      }
    }
  }

  // If everything matches, return original
  if (included.size >= lines.length) return text;

  // Build result with gap markers
  const sorted = [...included].sort((a, b) => a - b);
  const result: string[] = [];
  let last = -1;

  for (const idx of sorted) {
    if (last >= 0 && idx > last + 1) {
      result.push('  [...]');
    }
    result.push(lines[idx]);
    last = idx;
  }

  return result.join('\n');
}

/**
 * Build keyword patterns for filterByKeywords from a list of search keywords.
 * Creates case-insensitive regexps for each keyword.
 */
export function buildKeywordPatterns(keywords: string[]): RegExp[] {
  return keywords.map(k => {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  });
}

/**
 * Main extraction function: given a file path and parsed chain address,
 * extract the relevant text.
 */
export async function extractText(
  filePath: string,
  chain: ChainAddress,
): Promise<ExtractedBlock | null> {
  const { lines, maskedLines: mask } = await getCachedFile(filePath);

  const section = findSection(lines, mask, chain.base);
  if (!section) {
    return {
      address: chain.raw,
      text: `[Section ${chain.base} not found in ${filePath}]`,
    };
  }

  let text: string | null = null;

  switch (chain.suffixType) {
    case 'none':
      text = extractHeadingAndFirstParagraph(lines, section.start, section.end, mask);
      break;

    case 'all':
      text = extractAll(lines, section.start, section.end);
      break;

    case 'aspect':
      text = extractAspect(lines, section.start, section.end, chain.suffixValue!, mask);
      break;

    case 'paragraph':
      text = extractParagraph(lines, section.start, section.end, chain.suffixValue!, mask);
      break;

    case 'table':
      text = extractTable(lines, section.start, section.end, parseInt(chain.suffixValue!, 10), mask);
      break;

    case 'block':
      text = extractCodeBlock(lines, section.start, section.end, parseInt(chain.suffixValue!, 10));
      break;

    case 'aspect-range':
    case 'paragraph-range':
      // These should be expanded before calling extractText
      text = `[Range ${chain.raw} should be expanded before extraction]`;
      break;
  }

  if (text === null) {
    return {
      address: chain.raw,
      text: `[${chain.suffixType} "${chain.suffixValue}" not found in section ${chain.base}]`,
    };
  }

  return {
    address: chain.raw,
    heading: lines[section.start],
    text,
    lines: { start: section.start + 1, end: section.end },
  };
}
