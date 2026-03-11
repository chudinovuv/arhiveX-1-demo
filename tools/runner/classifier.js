// classifier.js — Code-based question classifier (replaces LLM Phase 1a)
// Extracts keywords, onto, intent, indexRanking, directChains from question text.
// Zero LLM tokens.

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Stop words ─────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  // English
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall',
  'should', 'may', 'might', 'must', 'can', 'could',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'this', 'that', 'these', 'those',
  'what', 'which', 'who', 'whom', 'whose', 'where', 'when', 'why', 'how',
  'if', 'then', 'else', 'so', 'but', 'and', 'or', 'not', 'no', 'nor',
  'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'as',
  'into', 'about', 'between', 'through', 'after', 'before', 'during',
  'up', 'down', 'out', 'off', 'over', 'under',
  'again', 'further', 'once', 'here', 'there', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own',
  'same', 'than', 'too', 'very', 'just', 'also',
  // Question fillers
  'exactly', 'does', 'happen', 'happens', 'many',
  // Russian common
  'что', 'как', 'какой', 'какие', 'зачем', 'почему', 'когда', 'где',
  'для', 'чего', 'это', 'ли', 'не', 'да', 'нет',
]);

// ─── TOC index ──────────────────────────────────────────────────────

/** @type {{ chain: string, title: string, words: string[] }[]} */
let tocEntries = null;

function loadToc() {
  if (tocEntries) return tocEntries;

  const raw = readFileSync(resolve(__dirname, 'spec-toc.txt'), 'utf-8');
  tocEntries = [];

  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Parse: "2.7.2 Data Interface" or "  2.7.2.1 Overview"
    const m = trimmed.match(/^([A-Z]?\d[\d.]*(?:\.\d+)*)\s+(.+)/);
    if (!m) {
      // Annex: "A.1 Type Registry" or "B.2.1 ..."
      const am = trimmed.match(/^([A-Z]\.\d[\d.]*)\s+(.+)/);
      if (am) {
        tocEntries.push({
          chain: am[1],
          title: am[2],
          words: am[2].toLowerCase().split(/\s+/).filter(w => w.length > 2),
        });
      }
      continue;
    }

    tocEntries.push({
      chain: m[1],
      title: m[2],
      words: m[2].toLowerCase().split(/\s+/).filter(w => w.length > 2),
    });
  }

  return tocEntries;
}

// ─── Onto classification ────────────────────────────────────────────

const ONTO_PATTERNS = [
  { onto: 'HOW', re: /\b(how to|syntax|declare|declar|define|defin|body constructs?|grammar)\b/i },
  { onto: 'WHY', re: /\b(why|purpose|reason|rationale|design decision|motivation)\b/i },
  { onto: 'WHEN', re: /\b(when (to|should|is)|condition|trigger|timing)\b/i },
  // WHAT is default — but detect strong signals
  { onto: 'WHAT', re: /\b(what is|what are|list|describe|fields?|contain|how many|minimum|maximum|limit|allowed|forbidden|return)\b/i },
];

function classifyOnto(question) {
  // Strong WHAT signals at start of question override everything
  if (/^(what|how many|how much|list|describe)\b/i.test(question)) return 'WHAT';

  // Check patterns in priority order (HOW > WHY > WHEN > WHAT)
  for (const { onto, re } of ONTO_PATTERNS) {
    if (re.test(question)) return onto;
  }
  return 'WHAT'; // default
}

// ─── Intent classification ──────────────────────────────────────────

const INTENT_PATTERNS = [
  { intent: 'declaration', re: /\b(syntax|declare|declaration|define|definition|how to write)\b/i },
  { intent: 'grammar', re: /\b(body constructs?|grammar|allowed inside|block syntax)\b/i },
  { intent: 'normative_rules', re: /\b(rules?|constraint|normative|governance|enforcement|forbidden|prohibit|restrict|immutab)\b/i },
  { intent: 'semantic_role', re: /\b(role|relationship|correlat|connect|depend|interact)\b/i },
  { intent: 'canonical_example', re: /\b(example|show me|sample code)\b/i },
];

function classifyIntent(question) {
  for (const { intent, re } of INTENT_PATTERNS) {
    if (re.test(question)) return intent;
  }
  return 'full';
}

// ─── Index ranking ──────────────────────────────────────────────────

const ONTO_TO_RANKING = {
  'WHAT': ['phya', 'sema'],
  'WHY':  ['ont', 'phla', 'desa'],
  'HOW':  ['bsyn', 'phya'],
  'WHEN': ['bhva', 'desa'],
};

const INTENT_RANKING_OVERRIDE = {
  'normative_rules': ['sema', 'bhva', 'phya'],
  'grammar':         ['bsyn', 'phya'],
  'declaration':     ['bsyn', 'phya'],
};

function classifyIndexRanking(onto, intent) {
  return INTENT_RANKING_OVERRIDE[intent] ?? ONTO_TO_RANKING[onto] ?? ['phya', 'sema'];
}

// ─── Keyword extraction ─────────────────────────────────────────────

/**
 * Extract meaningful keywords from question.
 * Strategy: tokenize, remove stop words, keep multi-word spec terms.
 */
function extractKeywords(question) {
  const lower = question.toLowerCase().replace(/[?!.,;:()]/g, ' ');

  // First: detect multi-word spec terms (greedy, case-insensitive)
  const COMPOUND_TERMS = [
    'data interface', 'semantic interface', 'design principles',
    'block syntax', 'block type', 'block types',
    'stream type', 'stream types',
    'derived type', 'derived types',
    'behavioral type', 'behavioral types',
    'semantic type', 'semantic types',
    'primitive type', 'primitive types',
    'specialized type', 'specialized types',
    'canonical envelope', 'raw string', 'raw binary',
    'type registry', 'type metadata', 'type envelope',
    'on error', 'bind to', 'fall back', 'fallback',
    'error type', 'error propagation',
    'integer type', 'version literal',
    'domain authority', 'semantic authority',
    'normative class', 'normative classes',
    'implicit conversion', 'record immutability',
    'modifier weakening', 'governance directive', 'governance directives',
    'process algorithm', 'control flow', 'inversion of control',
  ];

  const found = [];
  let remaining = lower;

  for (const term of COMPOUND_TERMS) {
    if (remaining.includes(term)) {
      found.push(term);
      remaining = remaining.replace(term, ' ');
    }
  }

  // Then: extract single words from what's left
  const words = remaining.split(/\s+/).filter(w =>
    w.length > 2 && !STOP_WORDS.has(w)
  );

  // Combine, dedup, cap at 5
  const all = [...found, ...words];
  const deduped = [...new Set(all)];
  return deduped.slice(0, 5);
}

// ─── Direct chains matching ─────────────────────────────────────────

/**
 * Match keywords against TOC titles to find directChains.
 * Returns up to 3 chain addresses with /all suffix.
 */
function matchDirectChains(keywords) {
  const toc = loadToc();
  const lowerKw = keywords.map(k => k.toLowerCase());

  // Score each TOC entry by how many keywords match its title
  const scored = toc.map(entry => {
    let score = 0;
    const titleLower = entry.title.toLowerCase();

    for (const kw of lowerKw) {
      // Exact substring match in title
      if (titleLower.includes(kw)) {
        // Bonus for longer keyword matches (compound terms)
        score += kw.includes(' ') ? 3 : 1;
      }
    }

    return { chain: entry.chain, title: entry.title, score };
  }).filter(e => e.score > 0);

  // Sort by score desc, take top 3
  scored.sort((a, b) => b.score - a.score);

  // Only include entries with score >= 2 (at least 2 single-word matches or 1 compound)
  // OR if score is 1 but the entry title is very short (exact match)
  const result = scored
    .filter(e => e.score >= 2 || (e.score >= 1 && e.title.split(' ').length <= 3))
    .slice(0, 3)
    .map(e => `${e.chain}/all`);

  // Dedup (same chain can match via different keywords)
  return [...new Set(result)];
}

// ─── Main API ───────────────────────────────────────────────────────

/**
 * Classify a question entirely in code. Zero LLM tokens.
 * @param {string} question — the user's question text
 * @returns {{ keywords: string[], onto: string, intent: string, indexRanking: string[], directChains: string[] }}
 */
export function classifyQuestion(question) {
  const keywords = extractKeywords(question);
  const onto = classifyOnto(question);
  const intent = classifyIntent(question);
  const indexRanking = classifyIndexRanking(onto, intent);
  const directChains = matchDirectChains(keywords);

  return { keywords, onto, intent, indexRanking, directChains };
}
