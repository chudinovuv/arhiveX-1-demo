// questionAnalyzer.ts — Embedding-based question ontology analyzer
// Embeds the full question via MiniLM and compares against unit description vectors.
// This bypasses keyword decomposition entirely — the model "understands" the question
// as a semantic unit and maps it to the most relevant spec concepts.

import type { IndexFile, IndexRegistryEntry, OntoRole } from './types.js';

// ── Lazy MiniLM imports (shared singleton from semanticParser) ─────
let embedder: any = null;
let loading: Promise<any> | null = null;
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

async function getEmbedder() {
  if (embedder) return embedder;
  if (loading) return loading;
  loading = (async () => {
    const { pipeline: createPipeline } = await import('@huggingface/transformers');
    embedder = await createPipeline('feature-extraction', MODEL_ID, { dtype: 'fp32' });
    loading = null;
    return embedder;
  })();
  return loading;
}

async function embed(text: string): Promise<Float32Array> {
  const emb = await getEmbedder();
  const out = await emb(text, { pooling: 'mean', normalize: true });
  return new Float32Array(out.data);
}

function cosine(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

// ── Unit descriptor: pre-computed embedding of unit abstract + keywords ──

export interface UnitDescriptor {
  alias: string;
  unitName: string;
  abstract: string;
  keywords: string[];
  onto: OntoRole[];
  embedding: Float32Array;
}

export interface QuestionMatch {
  alias: string;
  unitName: string;
  abstract: string;
  onto: OntoRole[];
  similarity: number;
  keywords: string[];
}

/** Supported onto roles for question classification */
type SearchOntoRole = 'WHAT' | 'WHY' | 'HOW' | 'WHEN' | 'WHERE';

export interface AnalysisResult {
  question: string;
  matches: QuestionMatch[];
  suggestedOnto: SearchOntoRole | null;
  suggestedKeywords: string[];
  detectedConstructs: string[];
  trace: string;
}

// ── Concept-anchor: construct detection ────────────────────────────

/** Construct names recognized for concept-anchor detection */
const CONSTRUCT_NAMES = [
  'domain', 'module', 'definition', 'record', 'interface',
  'event', 'rule', 'action', 'flow', 'class', 'delegate', 'method',
] as const;

/** Primary type-definition unit for each construct.
 *  Used by concept-anchor to guarantee a type-identity slot
 *  when the question explicitly names a construct. */
export const CONSTRUCT_ANCHOR: Record<string, { alias: string; unitName: string }> = {
  delegate:   { alias: 'sema', unitName: 'delegate' },
  domain:     { alias: 'sema', unitName: 'domain' },
  definition: { alias: 'sema', unitName: 'definition' },
  record:     { alias: 'phya', unitName: 'record_type' },
  interface:  { alias: 'phya', unitName: 'interface_type' },
  event:      { alias: 'phya', unitName: 'event_type' },
  rule:       { alias: 'phya', unitName: 'rule_type' },
  action:     { alias: 'phya', unitName: 'action_type' },
  flow:       { alias: 'phya', unitName: 'flow_type' },
  class:      { alias: 'phya', unitName: 'class_type' },
  method:     { alias: 'phya', unitName: 'method_type' },
};

/** Detect construct names mentioned in the question text.
 *  Returns constructs in order of their first appearance. */
export function detectConstructs(question: string): string[] {
  const q = question.toLowerCase();
  const detected: { construct: string; pos: number }[] = [];
  for (const c of CONSTRUCT_NAMES) {
    const m = new RegExp(`\\b${c}\\b`).exec(q);
    if (m) detected.push({ construct: c, pos: m.index });
  }
  return detected.sort((a, b) => a.pos - b.pos).map(d => d.construct);
}

// ── Pre-computed descriptor cache ──────────────────────────────────

let descriptorCache: UnitDescriptor[] | null = null;
let descriptorPromise: Promise<UnitDescriptor[]> | null = null;

/**
 * Build unit descriptors from all loaded indices.
 * Each unit's "description text" = abstract + keywords joined.
 * The embedding is computed once and cached.
 */
export async function buildDescriptors(
  indices: Map<string, IndexFile>,
  registry: IndexRegistryEntry[]
): Promise<UnitDescriptor[]> {
  if (descriptorCache) return descriptorCache;
  if (descriptorPromise) return descriptorPromise;

  descriptorPromise = (async () => {
    const descriptors: UnitDescriptor[] = [];

    for (const entry of registry) {
      const index = indices.get(entry.alias);
      if (!index) continue;

      for (const [unitName, unit] of Object.entries(index)) {
        if (!unit || typeof unit !== 'object' || !Array.isArray(unit.keywords)) continue;

        const abstract = unit.abstract ?? '';
        const target = unit.target;

        // Build embedding text:
        // - If unit has "target" phrases → use them (intent-based matching)
        // - Otherwise fall back to abstract + keywords (topic-based matching)
        const descText = target && target.length > 0
          ? target.join('. ')
          : abstract
            ? `${abstract}. Keywords: ${unit.keywords.join(', ')}`
            : unit.keywords.join(', ');

        const onto = unit.onto ?? entry.onto ?? [];
        const embedding = await embed(descText);

        descriptors.push({
          alias: entry.alias,
          unitName,
          abstract,
          keywords: unit.keywords,
          onto: onto as OntoRole[],
          embedding,
        });
      }
    }

    descriptorCache = descriptors;
    descriptorPromise = null;
    return descriptors;
  })();

  return descriptorPromise;
}

/** Invalidate descriptor cache (e.g. when indices reload) */
export function clearDescriptorCache(): void {
  descriptorCache = null;
  descriptorPromise = null;
}

// ── Onto classification heuristics ─────────────────────────────────

const ONTO_PATTERNS: { role: SearchOntoRole; patterns: RegExp[] }[] = [
  {
    role: 'WHAT',
    patterns: [
      /what\s+is/i, /что\s+такое/i, /define\b/i, /meaning\s+of/i,
      /what\s+does.*mean/i, /что\s+означает/i, /определи/i,
    ],
  },
  {
    role: 'WHY',
    patterns: [
      /why\s/i, /зачем/i, /purpose\s+of/i, /rationale/i,
      /для\s+чего/i, /почему/i, /motivation/i,
    ],
  },
  {
    role: 'HOW',
    patterns: [
      /how\s+(?:to|do|does|is|are|can)/i, /как\s/i, /syntax\b/i,
      /declare\b/i, /implement/i, /объявить/i, /реализовать/i,
      /каким\s+образом/i,
    ],
  },
  {
    role: 'WHEN',
    patterns: [
      /when\s/i, /когда/i, /under\s+what\s+conditions/i,
      /в\s+каких\s+случаях/i, /при\s+каких\s+условиях/i,
    ],
  },
  {
    role: 'WHERE',
    patterns: [
      /where\s+(?:is|are|can|does|do|should)/i, /где\s/i,
      /в\s+каком\s+контексте/i, /applicab/i, /applicable/i,
      /in\s+which\s+(?:context|scope|block)/i, /допустим/i,
      /where\s+.*\ballowed\b/i, /where\s+.*\bvalid\b/i,
      /scope\s+of/i, /visibility\s+of/i,
    ],
  },
];

function classifyOnto(question: string): SearchOntoRole | null {
  for (const { role, patterns } of ONTO_PATTERNS) {
    if (patterns.some(p => p.test(question))) return role;
  }
  return null;
}

// ── Main analysis function ─────────────────────────────────────────

/** Minimum similarity for a unit to be considered a match */
const UNIT_MATCH_THRESHOLD = 0.35;
/** Maximum units to return */
const MAX_MATCHES = 6;

/**
 * Analyze a natural-language question against the spec's concept space.
 * Returns ranked unit matches with similarity scores, suggested onto, and keywords.
 */
export async function analyzeQuestion(
  question: string,
  indices: Map<string, IndexFile>,
  registry: IndexRegistryEntry[]
): Promise<AnalysisResult> {
  const descriptors = await buildDescriptors(indices, registry);
  const questionVec = await embed(question);

  // Score every unit descriptor against the question
  const scored: QuestionMatch[] = [];
  for (const desc of descriptors) {
    const sim = cosine(questionVec, desc.embedding);
    if (sim >= UNIT_MATCH_THRESHOLD) {
      scored.push({
        alias: desc.alias,
        unitName: desc.unitName,
        abstract: desc.abstract,
        onto: desc.onto,
        similarity: sim,
        keywords: desc.keywords,
      });
    }
  }

  scored.sort((a, b) => b.similarity - a.similarity);
  const matches = scored.slice(0, MAX_MATCHES);

  // Classify onto from question text
  const suggestedOnto = classifyOnto(question);

  // Extract suggested keywords from top matches, gated by MiniLM relevance
  // Collect all keywords from top-3 units with frequency counts
  const kwFreq = new Map<string, number>();
  for (const m of matches.slice(0, 3)) {
    for (const kw of m.keywords) {
      const lower = kw.toLowerCase();
      kwFreq.set(lower, (kwFreq.get(lower) ?? 0) + 1);
    }
  }

  // MiniLM gate: embed each candidate keyword, keep only those semantically
  // relevant to the original question (prevents index detail keywords like
  // "aml", "basel" from overriding structural search terms)
  const KW_GATE_THRESHOLD = 0.15;
  const candidates = [...kwFreq.entries()];
  const kwEmbeddings = await Promise.all(
    candidates.map(async ([kw, freq]) => {
      const kwVec = await embed(kw);
      const sim = cosine(questionVec, kwVec);
      return { kw, freq, sim };
    })
  );
  const gated = kwEmbeddings.filter(k => k.sim >= KW_GATE_THRESHOLD);

  // Sort by (frequency × similarity) desc to balance topical relevance and coverage
  const rankedKws = gated
    .sort((a, b) => (b.freq * b.sim) - (a.freq * a.sim))
    .map(k => k.kw)
    .slice(0, 8);

  // Concept-anchor: detect construct names in original question
  const detectedConstructs = detectConstructs(question);

  // Build trace
  const totalUnits = descriptors.length;
  const aboveThreshold = scored.length;
  const trace = [
    `Question: "${question}"`,
    `Onto (heuristic): ${suggestedOnto ?? 'unclassified'}`,
    ...(detectedConstructs.length > 0 ? [`Detected constructs: [${detectedConstructs.join(', ')}]`] : []),
    `Units scanned: ${totalUnits}, above threshold (${UNIT_MATCH_THRESHOLD}): ${aboveThreshold}`,
    '',
    'Top matches:',
    ...matches.map((m, i) =>
      `  ${i + 1}. [${m.alias}/${m.unitName}] sim=${m.similarity.toFixed(3)} onto=[${m.onto.join(',')}]${m.abstract ? `\n     "${m.abstract.slice(0, 100)}${m.abstract.length > 100 ? '...' : ''}"` : ''}`
    ),
    '',
    `Suggested keywords: [${rankedKws.join(', ')}]`,
    ...(kwEmbeddings.length > gated.length ? [
      `KW gate (≥${KW_GATE_THRESHOLD}): ${kwEmbeddings.length} → ${gated.length} keywords`,
      ...kwEmbeddings
        .filter(k => k.sim < KW_GATE_THRESHOLD)
        .sort((a, b) => b.sim - a.sim)
        .map(k => `  ✗ "${k.kw}" [${k.sim.toFixed(3)}]`),
    ] : []),
  ].join('\n');

  return { question, matches, suggestedOnto, suggestedKeywords: rankedKws, detectedConstructs, trace };
}
