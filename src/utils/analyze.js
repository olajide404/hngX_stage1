import crypto from 'crypto';

// Count the unicode code points accurately
function codePointLength(str) {
  return Array.from(str).length;
}

// Reverse string safely by Unicode code points
function reverseByCodePoint(str) {
  return Array.from(str).reverse().join('');
}

// Converts string to lowercase (casefold)
function casefold(str) {
  return str.toLocaleLowerCase('en'); // ✅ safe locale
}

// Split strings into words by any Unicode whitespace
function splitWordsByUnicodeWhitespace(str) {
  const tokens = str.trim().split(/\p{White_Space}+/u).filter(Boolean);
  return tokens;
}

// Count how many times each character appears (case-insensitive)
function characterFrequencyMap(str) {
  const map = Object.create(null);
  for (const cp of Array.from(str)) {
    map[cp] = (map[cp] || 0) + 1;
  }
  return map;
}

// Compute SHA-256 hash (lowercase hex)
function sha256Hex(originalValue) {
  return crypto
    .createHash('sha256')
    .update(originalValue.toString(), 'utf8')
    .digest('hex')
    .toLowerCase();
}

// Used to derive ID from original string
export function getIdFromOriginal(originalValue) {
  // ✅ Normalize to NFC for stable hashing
  const normalized = originalValue.normalize('NFC');
  return sha256Hex(normalized);
}

/**
 * Analyze the string and return computed properties
 * Hash uses NFC-normalized version for consistency.
 */
export function analyzeString(originalValue) {
  const normalized = originalValue.normalize('NFC');
  const id = sha256Hex(normalized);

  const folded = casefold(normalized);
  const reversed = reverseByCodePoint(folded);
  const length = codePointLength(normalized);
  const is_palindrome = folded === reversed;

  const unique_characters = new Set(Array.from(normalized)).size;
  const word_count = splitWordsByUnicodeWhitespace(normalized).length;
  const character_frequency_map = characterFrequencyMap(normalized);

  return {
    id,
    value: originalValue,
    properties: {
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash: id,
      character_frequency_map
    }
  };
}
