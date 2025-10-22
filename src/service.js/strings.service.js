import { query } from '../db/index.js';
import { SQL } from '../db/sql.js';
import { analyzeString,  getIdFromOriginal } from '../utils/analyze.js';
import { Errors } from '../utils/errors.js';

export async function createString(value) {
  const analyzed = analyzeString(value);
  const {
    id,
    value: storedValue,
    properties: {
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map
    }
  } = analyzed;

  try {
    const result = await query(SQL.insertString, [
      id,
      storedValue,
      length,
      is_palindrome,
      unique_characters,
      word_count,
      sha256_hash,
      character_frequency_map
    ]);

    // Only access result.rows if the query succeeded
    if (!result || !result.rows || result.rows.length === 0) {
      throw Errors.BadRequest('Unexpected DB response.');
    }

    const row = result.rows[0];

    return {
      id: row.id,
      value: row.value,
      properties: {
        length: row.length,
        is_palindrome: row.is_palindrome,
        unique_characters: row.unique_characters,
        word_count: row.word_count,
        sha256_hash: row.sha256_hash,
        character_frequency_map: row.character_frequency_map
      },
      created_at: new Date(row.created_at).toISOString()
    };
  } catch (err) {
    // Handle duplicate string gracefully
    if (err.code === '23505') {
      throw Errors.Conflict('String already exists.');
    }

    // Pass other DB errors upward
    throw err;
  }
}

export async function getStringByOriginalValue(originalValue) {

  const id = getIdFromOriginal(originalValue);

  const result = await query(SQL.selectStringbyId, [id]);
  if (!result || !result.rows || result.rows.length === 0) {
    throw Errors.NotFound('String not found.');
  }

  const row = result.rows[0];

  return {
    id: row.id,
    value: row.value,
    properties: {
      length: row.length,
      is_palindrome: row.is_palindrome,
      unique_characters: row.unique_characters,
      word_count: row.word_count,
      sha256_hash: row.sha256_hash,
      character_frequency_map: row.character_frequency_map
    },
    created_at: new Date(row.created_at).toISOString()
  }
}

