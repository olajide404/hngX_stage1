export const SQL = {
    insertString: `
    INSERT INTO strings (
      id, value, length, is_palindrome, unique_characters, word_count,
      sha256_hash, character_frequency_map
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING id, value, length, is_palindrome, unique_characters, word_count,
              sha256_hash, character_frequency_map, created_at
    `,

    selectStringbyId: `
      SELECT id, value, length, is_palindrome, unique_characters, word_count,
              sha256_hash, character_frequency_map, created_at
    FROM strings
    WHERE id = $1
    `,

    deleteStringById: `
      DELETE FROM strings
      WHERE id = $1
      RETURNING id
    `,
}
