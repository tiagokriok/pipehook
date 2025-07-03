-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS organizations (
	id VARCHAR(30) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	avatar TEXT,
	plan plan_type NOT NULL DEFAULT 'free',
	settings JSONB NOT NULL DEFAULT '{"webhookLimit": 10, "eventRetention": 7, "teamMembers": 3}'::JSONB,
	owner_id VARCHAR(30) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS organizations;
-- +goose StatementEnd