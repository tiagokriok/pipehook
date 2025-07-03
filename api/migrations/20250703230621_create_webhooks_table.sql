-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS webhooks (
    id VARCHAR(27) PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    endpoint TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    delay INTEGER NOT NULL DEFAULT 0 CHECK (delay >= 0),
    concurrency INTEGER NOT NULL DEFAULT 1 CHECK (concurrency >= 1 AND concurrency <= 100),
    queue queue_type NOT NULL DEFAULT 'standard',
    retry_policy JSONB NOT NULL DEFAULT '{"maxAttempts": 3,"backoff": 5000000000}'::JSONB,
    organization_id VARCHAR(27) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_webhooks_organization FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS webhooks;
-- +goose StatementEnd