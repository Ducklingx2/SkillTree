CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,

    uid VARCHAR(100) NOT NULL,

    author_name VARCHAR(100) NOT NULL,

    skill VARCHAR(200) NOT NULL,

    description TEXT NOT NULL,

    image_url TEXT,

    meeting_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_created_at_idx
ON posts (created_at DESC);
