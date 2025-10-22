import crypto from 'crypto';

// Count the unicode code points
function codePointLength(str) {
  return Array.from(str).length;
}
// Reverse the string(palindrome)
function reverseByCodePoint(str) {
  return Array.from(str).reverse().join('');
}
// Converts the string to lowercase
function casefold(str) {
  return str.toLocaleLowerCase('und');
}
// Split strings into words.
function splitWordsByUnicodeWhitespace(str) {
  const tokens = str.trim().split(/\p{White_Space}+/u).filter(Boolean);
  return tokens;
}

// now ,i have to build an object showing how many times each character appears
function characterFrequencyMap(nfc) {
  const map = Object.create(null);
  for (const cp of nfc) {
    map[cp] = (map[cp] || 0) + 1;
  }
  return map;
}

// hashing
function sha256Hex(original) {
  return crypto.createHash('sha256').update(Buffer.from(original, 'utf8')).digest('hex');
}

export function getIdFromOriginal(originalValue) {
  return sha256Hex(originalValue); 
}


/**
 * Analyze the string. Hash uses the ORIGINAL (UTF-8).
 * Other analysis can use NFC-normalized string.
 */
export function analyzeString(originalValue) {
  const id = sha256Hex(originalValue);
  const nfc = originalValue.normalize('NFC');

  const cf = casefold(nfc);
  const length = codePointLength(nfc);
  const is_palindrome = cf === reverseByCodePoint(cf);

  const unique_characters = new Set(Array.from(nfc)).size;
  const word_count = splitWordsByUnicodeWhitespace(nfc).length;
  const character_frequency_map = characterFrequencyMap(nfc);

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
