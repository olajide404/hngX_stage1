CREATE TABLE strings (
    id CHAR(64) PRIMARY KEY,
    value TEXT NOT NULL,
    length INTEGER NOT NULL,
    is_palindrome BOOLEAN NOT NULL,
    unique_characters INTEGER NOT NULL,
    word_count INTEGER NOT NULL,
    sha256_hash CHAR(64) NOT NULL,
    character_frequency_map JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE INDEX IF NOT EXISTS strings_length_idx ON strings (length);
CREATE INDEX IF NOT EXISTS strings_word_count_idx ON strings (word_count);
CREATE INDEX IF NOT EXISTS strings_is_palindrome_idx ON strings (is_palindrome);
CREATE INDEX IF NOT EXISTS strings_charfreq_gin_idx ON strings USING GIN (character_frequency_map);