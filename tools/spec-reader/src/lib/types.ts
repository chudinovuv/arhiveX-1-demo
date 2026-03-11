// Shared types for the spec-reader MCP server

/** Content classification tags (set by scan-tags.mjs) */
export type EnumTag = 'normative' | 'behavioral' | 'structural' | 'example' | 'identity';
export type NormTag = 'behavioral' | 'structural' | 'declarative' | 'semantic';

/** A single seq entry from an index unit */
export interface SeqEntry {
  Order: number;
  chain: string[];
  /** What kind of bold-letter enumerations (A., B., ...) this section contains */
  enumTag?: EnumTag;
  /** What kind of MUST/SHALL/SHOULD normative statements this section contains */
  normTag?: NormTag;
  /** Heading field — key is H1..H6, value is title text */
  [key: string]: unknown;
}

/** Ontological role: what kind of question does this unit answer? */
export type OntoRole = 'WHAT' | 'WHY' | 'HOW' | 'WHEN' | 'WHERE';

/** An index unit (e.g. "typeMetadata") */
export interface IndexUnit {
  keywords: string[];
  /** Target phrases for semantic (MiniLM) matching — describes what questions this unit answers */
  target?: string[];
  /** One-line summary extracted from the first meaningful sentence of the primary chain */
  abstract?: string;
  /** Unit-level ontological role override (if different from index default) */
  onto?: OntoRole[];
  seq: SeqEntry[];
}

/** Parsed index file: unitName → IndexUnit */
export type IndexFile = Record<string, IndexUnit>;

/** Registry entry from aspect_index.json */
export interface IndexRegistryEntry {
  alias: string;
  file: string;
  /** Default ontological roles for all units in this index */
  onto?: OntoRole[];
}

/** Parsed chain address */
export interface ChainAddress {
  /** Base chain number, e.g. "2.7.3" or "B.2.1" */
  base: string;
  /** Suffix type */
  suffixType: 'none' | 'all' | 'aspect' | 'aspect-range' | 'paragraph' | 'paragraph-range' | 'table' | 'block';
  /** Suffix value (letter, range, or number) */
  suffixValue?: string;
  /** For ranges: start and end */
  rangeStart?: string;
  rangeEnd?: string;
  /** Original raw address */
  raw: string;
}

/** Resolved file location for a chain */
export interface ResolvedLocation {
  /** Absolute path to the markdown file */
  filePath: string;
  /** The chain address that was resolved */
  chain: ChainAddress;
}

/** Extracted text block */
export interface ExtractedBlock {
  /** Chain address this was extracted from */
  address: string;
  /** The heading text (if section-level) */
  heading?: string;
  /** Extracted text content */
  text: string;
  /** Line range in source file */
  lines?: { start: number; end: number };
}

/** A tape segment — one seq entry's worth of extracted text */
export interface TapeSegment {
  /** Order from the seq entry */
  order: number;
  /** Heading level + title from the seq entry */
  heading: string;
  /** Extracted blocks for each chain address in this seq entry */
  blocks: ExtractedBlock[];
}

/** Complete tape — the final output */
export interface Tape {
  /** The unit name that produced this tape */
  unitName: string;
  /** Index file alias (phya/sema/ont/desa) */
  indexAlias: string;
  /** Keywords that matched */
  matchedKeywords: string[];
  /** Ordered segments */
  segments: TapeSegment[];
  /** Chain bases that could not be resolved (missing files in current/) */
  missingChains?: string[];
}

/** Search intent from specification_struct.json */
export type Intent =
  | 'canonical_example'
  | 'grammar'
  | 'normative_rules'
  | 'semantic_role'
  | 'declaration'
  | 'full';

/** Heading field extracted from a seq entry */
export interface HeadingInfo {
  level: number;        // 1-6
  fieldName: string;    // "H1", "H2", etc.
  rawTitle: string;     // may include section number prefix
  cleanTitle: string;   // stripped of section number
}
