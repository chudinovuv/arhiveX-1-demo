// tools-manual.js — Manual mode tools: grep_search + read_file
// Scoped to current/ only — no access to benchmark results or staging
import { execFileSync } from 'child_process';
import { readFileSync, readdirSync } from 'fs';
import { resolve, relative, join } from 'path';

const SPEC_ROOT = resolve(import.meta.dirname, '..', '..', '..', 'current');

/**
 * Tool definitions for Claude API (tool_use format)
 */
export const MANUAL_TOOL_DEFS = [
  {
    name: 'grep_search',
    description:
      'Search for a text pattern across all spec markdown files in current/. ' +
      'Returns matching lines with file paths and line numbers. ' +
      'Use isRegexp=true for regex patterns. Case-insensitive by default.',
    input_schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'The text or regex pattern to search for.',
        },
        isRegexp: {
          type: 'boolean',
          description: 'Whether query is a regex pattern (default: false).',
        },
        includePattern: {
          type: 'string',
          description: 'Glob pattern to restrict search to specific files (e.g. "2_5_*.md").',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'read_file',
    description:
      'Read a section of a spec file by path and line range. ' +
      'Files are in the current/ directory. Use relative names (e.g. "2_5_derived_types.md"). ' +
      'Line numbers are 1-based.',
    input_schema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description: 'File name or relative path within current/ (e.g. "2_5_derived_types.md").',
        },
        startLine: {
          type: 'number',
          description: 'Start line (1-based). Default: 1.',
        },
        endLine: {
          type: 'number',
          description: 'End line (1-based, inclusive). Default: startLine + 100.',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'list_files',
    description: 'List all spec markdown files available in current/.',
    input_schema: {
      type: 'object',
      properties: {},
    },
  },
];

/**
 * Execute a manual tool call.
 * @param {string} name
 * @param {Record<string, any>} input
 * @returns {string} — text result
 */
export function executeManualTool(name, input) {
  switch (name) {
    case 'grep_search':
      return grepSearch(input);
    case 'read_file':
      return readSpecFile(input);
    case 'list_files':
      return listFiles();
    default:
      return `Unknown tool: ${name}`;
  }
}

// ─── Implementation ─────────────────────────────────────────────────

function grepSearch({ query, isRegexp = false, includePattern }) {
  if (!query || typeof query !== 'string') return 'Error: query is required';

  // Build rg args array — search only in current/ (spec files)
  const rgArgs = [
    '--no-heading',
    '--line-number',
    '-i',          // case insensitive
    '-M', '500',   // max line length
    '-m', '50',    // max matches per file
  ];

  if (!isRegexp) rgArgs.push('-F');  // fixed string

  // Restrict to glob BEFORE the -- separator
  if (includePattern) {
    rgArgs.push('-g', includePattern);
  } else {
    rgArgs.push('-g', '*.md');
  }

  // -- separates options from pattern; pattern then path
  rgArgs.push('--', query, '.');

  try {
    const result = execFileSync('rg', rgArgs, {
      cwd: SPEC_ROOT,
      encoding: 'utf-8',
      timeout: 10000,
      maxBuffer: 1024 * 256,
      windowsHide: true,
    });
    // Trim to reasonable size
    const lines = result.split('\n');
    if (lines.length > 60) {
      return lines.slice(0, 60).join('\n') + `\n... (${lines.length - 60} more matches truncated)`;
    }
    return result || '(no matches)';
  } catch (err) {
    if (err.status === 1) return '(no matches)';
    return `grep error: ${err.message}`;
  }
}

function readSpecFile({ filePath, startLine, endLine }) {
  if (!filePath || typeof filePath !== 'string') return 'Error: filePath is required';

  // Sanitize: ensure path stays within SPEC_ROOT
  const cleaned = filePath.replace(/\\/g, '/').replace(/^(\.\/|current\/)+/, '');
  const fullPath = resolve(SPEC_ROOT, cleaned);
  const rel = relative(SPEC_ROOT, fullPath);
  if (rel.startsWith('..') || rel.includes('..')) {
    return 'Error: path escapes spec directory';
  }

  try {
    const content = readFileSync(fullPath, 'utf-8');
    const lines = content.split('\n');

    const start = Math.max(1, startLine ?? 1);
    const end = Math.min(lines.length, endLine ?? start + 100);

    const slice = lines.slice(start - 1, end);
    return `[${cleaned} L${start}-L${end}, ${lines.length} total lines]\n` + slice.join('\n');
  } catch (err) {
    return `Error reading file: ${err.message}`;
  }
}

function listFiles() {
  try {
    const files = readdirSync(SPEC_ROOT)
      .filter(f => f.endsWith('.md'))
      .sort();
    return `Spec files in current/ (${files.length}):\n` + files.map(f => `  ${f}`).join('\n');
  } catch (err) {
    return `Error listing files: ${err.message}`;
  }
}
