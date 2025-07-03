package domain

import (
	"context"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
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

func NewWebhook(label, url string, enabled bool, delay, concurrency int, queueType QueueType) *Webhook {
	return &Webhook{
		ID:          id.NewWebhook().String(),
		Label:       label,
		URL:         url,
		Enabled:     enabled,
		Delay:       delay,
		Concurrency: concurrency,
		Queue:       queueType,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}
}