-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS users (
	id VARCHAR(30) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL,
	username VARCHAR(255) NOT NULL,
	avatar TEXT,
	role user_role NOT NULL DEFAULT 'member',
	organization_id VARCHAR(30) NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
	CONSTRAINT fk_users_organizations FOREIGN KEY(organization_id) REFERENCES organizations(id)
);

CREATE UNIQUE INDEX	idx_users_email ON users(LOWER(email));
CREATE UNIQUE INDEX	idx_users_username ON users(LOWER(username));
CREATE UNIQUE INDEX idx_users_org_email ON users(organization_id, LOWER(email));

ALTER TABLE organizations ADD CONSTRAINT fk_organizations_owner FOREIGN KEY(owner_id) REFERENCES users(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE organizations DROP CONSTRAINT IF EXISTS fk_organizations_owner;
DROP TABLE IF EXISTS users;
-- +goose StatementEnd