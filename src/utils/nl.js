import { Errors } from './errors.js';

/**
 * Parses a natural-language query into structured filters.
 * Returns { filters } or throws HttpError(400/422).
 *
 * Supported:
 * - "single word" → word_count = 1
 * - "palindromic"/"palindrome" → is_palindrome = true
 * - "longer than N characters" → min_length = N + 1
 * - "at least N characters" → min_length = N
 * - "at most N characters" → max_length = N
 * - "exactly N characters" → min_length = N, max_length = N
 * - "contain the first vowel" → contains_character = 'a'
 * - "containing the letter z" → contains_character = 'z'
 * - "containing x" → contains_character = x
 */
export function parseNaturalLanguageQuery(original) {
  if (typeof original !== 'string' || original.trim() === '') {
    throw Errors.BadRequest('Unable to parse natural language query');
  }

  const normalized = original.trim().toLowerCase();
  const filters = {};

  // Single word
  if (/\bsingle\s+word\b/.test(normalized)) {
    filters.word_count = 1;
  }

  // Palindromic / palindrome
  if (/\bpalindrom(ic|e)\b/.test(normalized)) {
    filters.is_palindrome = true;
  }

  // Longer than N characters → min_length = N + 1
  let m = normalized.match(/\blonger\s+than\s+(\d+)\s+characters?\b/);
  if (m) {
    const n = Number(m[1]);
    filters.min_length = Number.isFinite(n) ? n + 1 : undefined;
  }

  // At least N characters → min_length = N
  m = normalized.match(/\bat\s+least\s+(\d+)\s+characters?\b/);
  if (m) {
    const n = Number(m[1]);
    if (Number.isFinite(n)) filters.min_length = n;
  }

  // At most N characters → max_length = N
  m = normalized.match(/\bat\s+most\s+(\d+)\s+characters?\b/);
  if (m) {
    const n = Number(m[1]);
    if (Number.isFinite(n)) filters.max_length = n;
  }

  // Exactly N characters → min_length = max_length = N
  m = normalized.match(/\bexactly\s+(\d+)\s+characters?\b/);
  if (m) {
    const n = Number(m[1]);
    if (Number.isFinite(n)) {
      filters.min_length = n;
      filters.max_length = n;
    }
  }

  // Containing the first vowel
  if (/\bcontain(?:s|ing)?\s+the\s+first\s+vowel\b/.test(normalized)) {
    filters.contains_character = 'a';
  }

  // Containing the letter z
  m = normalized.match(/\bcontain(?:s|ing)?\s+the\s+letter\s+([a-z])\b/);
  if (m) {
    filters.contains_character = m[1];
  }

  // Fallback: "containing x"
  if (!filters.contains_character) {
    m = normalized.match(/\bcontain(?:s|ing)?\s+([^\s])\b/);
    if (m && Array.from(m[1]).length === 1) {
      filters.contains_character = m[1];
    }
  }

  // If no filters matched → 400
  if (Object.keys(filters).length === 0) {
    throw Errors.BadRequest('Unable to parse natural language query');
  }

  // Logical conflicts → 422
  if (
    filters.min_length != null &&
    filters.max_length != null &&
    filters.min_length > filters.max_length
  ) {
    throw Errors.Unprocessable('Query parsed but resulted in conflicting filters');
  }

  // contains_character must be 1 Unicode codepoint
  if (filters.contains_character != null) {
    const cps = Array.from(filters.contains_character);
    if (cps.length !== 1) {
      throw Errors.Unprocessable('Query parsed but resulted in conflicting filters');
    }
  }

  return { filters };
}
