// questions.js — Parse benchmark questions from text file
import { readFileSync } from 'fs';
import { resolve } from 'path';

/**
 * @typedef {{ qid: string, category: string, number: number, text: string }} Question
 */

const CATEGORIES = {
  A: 'factual',
  B: 'cross-referential',
  C: 'abstract',
  D: 'normative',
};

/**
 * Parse benchmark_hard_37_en.txt into structured question objects.
 * @param {string} [filePath] — path to questions file
 * @returns {Question[]}
 */
export function parseQuestions(filePath) {
  const defaultPath = resolve(import.meta.dirname, '..', 'benchmark_hard_37_en.txt');
  const raw = readFileSync(filePath ?? defaultPath, 'utf-8');
  const lines = raw.split(/\r?\n/);
  const questions = [];
  let seqNum = 0;

  for (const line of lines) {
    // Match lines like: A-010. What is the in-memory limit...
    const m = line.match(/^([A-D])-(\d{3})\.\s+(.+)$/);
    if (!m) continue;

    const [, cat, num, text] = m;
    seqNum++;
    questions.push({
      qid: `${cat}-${num}`,
      category: CATEGORIES[cat],
      number: seqNum,
      text: text.trim(),
    });
  }

  return questions;
}
