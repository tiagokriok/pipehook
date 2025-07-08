-- name: CreateUser :one
INSERT INTO users
	(id, name, email, username, role, organization_id)
VALUES
	($1, $2, $3, $4, $5, $6)
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET
	name = $3,
	email = $4,
	username = $5,
	updated_at = now()
WHERE
	id = $1 AND organization_id = $2
RETURNING *;

-- name: UpdateUserAvatar :exec
UPDATE users
SET
	avatar = $3,
	updated_at = now()
WHERE
	id = $1 AND organization_id = $2;

-- name: UpdateUserRole :exec
UPDATE users
SET
	role = $3,
	updated_at = now()
WHERE
	id = $1 AND organization_id = $2;

-- name: GetUser :one
SELECT id, name, email, username, role, avatar, created_at, updated_at FROM users
WHERE
	id = $1 AND organization_id = $2;

-- name: GetAllUsers :many
SELECT id, name, email, username, role, avatar, created_at, updated_at FROM users
WHERE
	organization_id = $1
ORDER BY created_at;