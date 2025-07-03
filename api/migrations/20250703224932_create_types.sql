-- +goose Up
-- +goose StatementBegin
CREATE TYPE plan_type AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE queue_type AS ENUM ('fifo', 'standard');
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TYPE IF EXISTS plan_type;
DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS queue_type;
-- +goose StatementEnd