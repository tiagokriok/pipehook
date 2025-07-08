package domain

import (
	"context"
	"crypto/rand"
	"encoding/hex"
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
	Secret      string      `json:"secret"`

	OrganizationID string `json:"organizationId"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	DeletedAt time.Time `json:"deletedAt"`
}

type WebhookRepository interface {
	Strore(context context.Context, organizationID string, webhook *Webhook) error
	UpdateById(context context.Context, organizationID, id string, webhook *Webhook) error
	FindById(context context.Context, organizationID, id string) (*Webhook, error)
	FindAllByOrganizationId(context context.Context, organizationID string, query *port.QueryParams) ([]Webhook, error)
	DestroyById(context context.Context, organizationID, id string) error
	SoftDelete(context context.Context, organizationID, id string) error
}

func generateWebhookSecret() string {
	bytes := make([]byte, 32)
	rand.Read(bytes)
	return "whsec_" + hex.EncodeToString(bytes) // whsec_abc123...
}

func NewWebhook(label, endpoint, organizationID string, enabled bool, delay, concurrency int, queueType QueueType) (*Webhook, error) {
	if err := id.ValidatePrefix(organizationID, id.OrganizationPrefix); err != nil {
		return nil, err
	}

	if label = strings.TrimSpace(label); label == "" {
		return nil, errors.New("label is required")
	}

	parsedURL, err := url.Parse(endpoint)
	if err != nil || parsedURL.Scheme == "" || parsedURL.Host == "" {
		return nil, err
	}

	if delay < 0 {
		return nil, errors.New("delay must be greater than or equal to 0")
	}

	if concurrency < 0 {
		return nil, errors.New("concurrency must be greater than or equal to 0")
	}

	if queueType != QueueTypeFifo && queueType != QueueTypeStandard {
		return nil, errors.New("invalid queue type")
	}

	if isLocalhost(parsedURL.Host) {
		return nil, errors.New("invalid endpoint")
	}

	return &Webhook{
		ID:          id.NewWebhook().String(),
		Label:       label,
		Endpoint:    endpoint,
		Enabled:     enabled,
		Delay:       delay,
		Concurrency: concurrency,
		Queue:       queueType,
		Secret:      generateWebhookSecret(),
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}, nil
}