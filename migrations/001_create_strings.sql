CREATE TABLE IF NOT EXISTS strings (
  id CHAR(64) PRIMARY KEY,                -- sha256 hex (lowercase)
  value TEXT NOT NULL,                    -- original, verbatim
  length INTEGER NOT NULL,
  is_palindrome BOOLEAN NOT NULL,
  unique_characters INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  sha256_hash CHAR(64) NOT NULL,          -- same as id for clarity
  character_frequency_map JSONB NOT NULL, -- stores char frequencies
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Helpful indexes for performance
CREATE INDEX IF NOT EXISTS strings_length_idx ON strings (length);
CREATE INDEX IF NOT EXISTS strings_word_count_idx ON strings (word_count);
CREATE INDEX IF NOT EXISTS strings_is_palindrome_idx ON strings (is_palindrome);
CREATE INDEX IF NOT EXISTS strings_charfreq_gin_idx ON strings USING GIN (character_frequency_map);
