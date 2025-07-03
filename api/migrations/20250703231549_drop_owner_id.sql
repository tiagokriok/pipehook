-- +goose Up
-- +goose StatementBegin
ALTER TABLE organizations DROP COLUMN owner_id;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE organizations ADD COLUMN owner_id VARCHAR(30) NOT NULL;
ALTER TABLE organizations ADD CONSTRAINT fk_organizations_owner FOREIGN KEY(owner_id) REFERENCES users(id);
-- +goose StatementEnd