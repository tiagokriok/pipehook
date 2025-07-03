package domain

import (
	"context"
	"pipehook/api/internal/core/port"
	"time"
)

type QueueType string

const (
	QueueTypeFifo     QueueType = "fifo"
	QueueTypeStandard QueueType = "standard"
)

type Webhook struct {
	ID          string    `json:"id"`
	Label       string    `json:"label"`
	URL         string    `json:"url"`
	Enabled     bool      `json:"enabled"`
	Slug        string    `json:"slug"`
	Delay       int       `json:"delay"`
	Concurrency int       `json:"concurrency"`
	Queue       QueueType `json:"queueType"`

	OrganizationID string `json:"organizationId"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type WebhookRepository interface {
	Strore(context context.Context, organizationID string, webhook *Webhook) error
	UpdateById(context context.Context, organizationID, id string, webhook *Webhook) error
	FindById(context context.Context, organizationID, id string) (*Webhook, error)
	FindAllByOrganizationId(context context.Context, organizationID string, query *port.QueryParams) ([]Webhook, error)
	DestroyById(context context.Context, organizationID, id string) error
}