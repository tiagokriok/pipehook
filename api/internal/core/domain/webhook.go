package domain

import (
	"context"
	"errors"
	"net/url"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
	"strings"
	"time"
)

type QueueType string

const (
	QueueTypeFifo     QueueType = "fifo"
	QueueTypeStandard QueueType = "standard"
)

type RetryPolicy struct {
	MaxAttempts int           `json:"maxAttempts"`
	Backoff     time.Duration `json:"backoff"`
}

type Webhook struct {
	ID          string      `json:"id"`
	Label       string      `json:"label"`
	Endpoint    string      `json:"endpoint"`
	Enabled     bool        `json:"enabled"`
	Delay       int         `json:"delay"`
	Concurrency int         `json:"concurrency"`
	Queue       QueueType   `json:"queueType"`
	RetryPolicy RetryPolicy `json:"retryPolicy"`

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

func NewWebhook(label, endpoint, organizationID string, enabled bool, delay, concurrency int, queueType QueueType) (*Webhook, error) {
	if err := id.ValidatePrefix(organizationID, id.OrganizationPrefix); err != nil {
		return nil, err
	}

	if label := strings.TrimSpace(label); label == "" {
		return nil, errors.New("label is required")
	}

	parsedURL, err := url.Parse(endpoint)
	if err != nil || parsedURL.Scheme == "" || parsedURL.Host == "" {
		return nil, err
	}

	return &Webhook{
		ID:          id.NewWebhook().String(),
		Label:       label,
		Endpoint:    endpoint,
		Enabled:     enabled,
		Delay:       delay,
		Concurrency: concurrency,
		Queue:       queueType,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}, nil
}