-- name: CreateOrganization :one
INSERT INTO organizations
	(id, name, plan, settings)
VALUES
	($1, $2, $3, $4)
RETURNING *;

-- name: UpdateOrganization :one
UPDATE organizations
SET
	name = $2,
	plan = $3,
	settings = $4,
	updated_at = now()
WHERE
	id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: GetOrganization :one
SELECT id, name, plan, settings, created_at, updated_at FROM organizations
WHERE
	id = $1 AND deleted_at IS NULL;

-- name: UpdateOrganizationPlan :exec
UPDATE organizations
SET
	plan = $2,
	settings = $3,
	updated_at = now()
WHERE
	id = $1 AND deleted_at IS NULL;

-- name: UpdateOrganizationAvatar :exec
UPDATE organizations
SET
	avatar = $2,
	updated_at = now()
WHERE
	id = $1 AND deleted_at IS NULL;

-- name: SoftDeleteOrganization :exec
UPDATE organizations
SET
	deleted_at = now()
WHERE
	id = $1;