-- +goose Up
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE organizations ADD COLUMN deleted_at TIMESTAMPTZ;
ALTER TABLE webhooks ADD COLUMN deleted_at TIMESTAMPTZ;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP COLUMN deleted_at;
ALTER TABLE organizations DROP COLUMN deleted_at;
ALTER TABLE webhooks DROP COLUMN deleted_at;
-- +goose StatementEnd