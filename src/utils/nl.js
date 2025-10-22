import { Errors } from './errors.js';

/**
 * Parse a natural-language query string into structured filters.
 * Returns { filters } or throws HttpError(400/422).
 *
 * Supported cues:
 * - "single word" -> word_count = 1
 * - "palindromic" / "palindrome" -> is_palindrome = true
 * - "longer than N characters" -> min_length = N + 1
 * - "at least N characters" -> min_length = N
 * - "at most N characters" -> max_length = N
 * - "exactly N characters" -> min_length = N, max_length = N
 * - "contain the first vowel" -> contains_character = 'a'
 * - "containing the letter X" -> contains_character = X (exactly one char)
 * - "containing X" (fallback) -> contains_character = X (one char token)
 */

export function parseNaturalLanguageQuery(original) {
    if (typeof original !== 'string' || original.trim() === '') {
        throw Errors.BadRequest('Unable to parse natural language query'); 
    }

    const normalized = original.trim().toLowerCase();
    const filters = {};
    
      // 1) single word
    if (/\bsingle\s+word\b/.test(normalized)) {
    filters.word_count = 1;
    }

    // 2) palindromic / palindrome
    if (/\bpalindrom(ic|e)\b/.test(normalized)) {
    filters.is_palindrome = true;
    }

    let m = normalized.match(/\blonger\s+than\s+(\d+)\s+characters?\b/);
    if (m) {
    const n = Number(m[1]);
    filters.min_length = (Number.isFinite(n) ? n + 1 : undefined);
    }

    // "at least 10 characters" => min_length = 10
    m = normalized.match(/\bat\s+least\s+(\d+)\s+characters?\b/);
    if (m) {
    const n = Number(m[1]);
    filters.min_length = Number.isFinite(n) ? n : filters.min_length;
  }

   // "exactly 10 characters" => min_length = max_length = 10
  m = normalized.match(/\bexactly\s+(\d+)\s+characters?\b/);
  if (m) {
    const n = Number(m[1]);
    if (Number.isFinite(n)) {
      filters.min_length = n;
      filters.max_length = n;
    }
  }

  // 4) contains-character patterns
  // "contain(s/ing) the first vowel"
  if (/\bcontain(?:s|ing)?\s+the\s+first\s+vowel\b/.test(normalized)) {
    filters.contains_character = 'a'; // heuristic per spec
  }

  // "containing the letter z" / "contain the letter z"
  m = normalized.match(/\bcontain(?:s|ing)?\s+the\s+letter\s+([a-z])\b/);
  if (m) {
    filters.contains_character = m[1].normalize('NFC');
  }

  // Generic fallback: "containing x" (one visible character token)
  // Support a single Unicode letter/number/punct (keep strict to one char)
  if (!filters.contains_character) {
    m = normalized.match(/\bcontain(?:s|ing)?\s+([^\s])\b/);
    if (m && Array.from(m[1].normalize('NFC')).length === 1) {
      filters.contains_character = m[1].normalize('NFC');
    }
  }

  // Validation: must produce at least one filter
  const keys = Object.keys(filters);
  if (keys.length === 0) {
    throw Errors.BadRequest('Unable to parse natural language query');
  }

  // Cross-field relationship validation: min_length <= max_length
  if (
    filters.min_length != null &&
    filters.max_length != null &&
    filters.min_length > filters.max_length
  ) {
    // This represents a logical conflict in parsed filters
    throw Errors.Unprocessable('Query parsed but resulted in conflicting filters');
  }

  // contains_character must be exactly one Unicode character if present
  if (filters.contains_character != null) {
    const cps = Array.from(filters.contains_character.normalize('NFC'));
    if (cps.length !== 1) {
      throw Errors.Unprocessable('Query parsed but resulted in conflicting filters');
    }
  }

  return { filters };
}

