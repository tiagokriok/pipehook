-- name: CreateWebhook :one
INSERT INTO webhooks
	(id, label, endpoint, enabled, delay, concurrency, queue, retry_policy, organization_id, secret)
VALUES
	($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING *;

-- name: UpdateWebhook :one
UPDATE webhooks
SET
	label = $3,
	endpoint = $4,
	enabled = $5,
	delay = $6,
	concurrency = $7,
	queue = $8,
	retry_policy = $9,
	updated_at = now()
WHERE
	id = $1 AND organization_id = $2 AND deleted_at IS NULL
RETURNING *;

-- name: UpdateWebhookStatus :exec
UPDATE webhooks
SET
	enabled = $3
WHERE
	id = $1 AND organization_id = $2 AND deleted_at IS NULL;

-- name: UpdateWebhookSecret :exec
UPDATE webhooks
SET
	secret = $3
WHERE
	id = $1 AND organization_id = $2 AND deleted_at IS NULL;

-- name: UpdateWebhookRetryPolicy :exec
UPDATE webhooks
SET
	retry_policy = $3
WHERE
	id = $1 AND organization_id = $2 AND deleted_at IS NULL;

-- name: GetWebhook :one
SELECT id, label, endpoint, enabled, delay, concurrency, queue, retry_policy, organization_id, created_at, updated_at FROM webhooks
WHERE
	id = $1 AND organization_id = $2 AND deleted_at IS NULL;

-- name: GetAllWebhooks :many
SELECT id, label, endpoint, enabled, delay, concurrency, queue, retry_policy, organization_id, created_at, updated_at FROM webhooks
WHERE
	organization_id = $1 AND deleted_at IS NULL
ORDER BY created_at;

-- name: SoftDeleteWebhook :exec
UPDATE webhooks
SET
	deleted_at = now()
WHERE
	id = $1 AND organization_id = $2;