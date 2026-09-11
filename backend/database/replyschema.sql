CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,

    post_id BIGINT NOT NULL
        REFERENCES posts(id)
        ON DELETE CASCADE,

    author_id TEXT NOT NULL,

    author_name TEXT NOT NULL,

    content TEXT NOT NULL
        CHECK (char_length(content) BETWEEN 1 AND 2000),

    parent_comment_id BIGINT
        REFERENCES comments(id)
        ON DELETE CASCADE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id
    ON comments(post_id);

CREATE INDEX IF NOT EXISTS idx_comments_parent_id
    ON comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_comments_created_at
    ON comments(created_at);

CREATE INDEX IF NOT EXISTS idx_comments_post_parent
    ON comments(post_id, parent_comment_id);
