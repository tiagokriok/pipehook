package domain

import (
	"context"
	"encoding/json"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
	"time"
)

type EventStatus string

const (
	EventStatusPending   EventStatus = "pending"
	EventStatusDelivered EventStatus = "delivered"
	EventStatusFailed    EventStatus = "failed"
	EventStatusExpired   EventStatus = "expired"
)

type DeliveryAttempt struct {
	AttemptedAt    time.Time     `json:"attemptedAt"`
	ResponseStatus int           `json:"responseStatus"`
	ResponseBody   string        `json:"responseBody"`
	ResponseTime   time.Duration `json:"responseTime"`
	Error          string        `json:"error,omitempty"`
}

type Event struct {
	ID       string              `json:"id"`
	Method   string              `json:"method"`
	Headers  map[string][]string `json:"headers"`
	Payload  json.RawMessage     `json:"payload"`
	Status   EventStatus         `json:"status"`
	Attempts []DeliveryAttempt   `json:"attempts"`

	WebhookID string `json:"webhook_id"`

	CreatedAt time.Time  `json:"createdAt"`
	ProcessAt *time.Time `json:"processAt"`
	ExpireAt  time.Time  `json:"expireAt"`
}

type EventRepository interface {
	Store(context context.Context, organizationID string, event Event) error
	UpdateById(context context.Context, organizationID, id string, event *Event) error
	FindById(context context.Context, id string) (*Event, error)
	FindAllByOrganizationId(context context.Context, organizationID string, query *port.QueryParams) ([]Event, error)
	DestroyById(context context.Context, organizationID, id string) error
}

func NewEvent(method string, headers map[string][]string, payload interface{}, webhookID string) (*Event, error) {
	if err := id.ValidatePrefix(webhookID, id.WebhookPrefix); err != nil {
		return nil, err
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}

	return &Event{
		ID:        id.NewEvent().String(),
		Method:    method,
		Headers:   headers,
		Payload:   payloadBytes,
		Status:    EventStatusPending,
		WebhookID: webhookID,
		CreatedAt: time.Now(),
		ExpireAt:  time.Now().Add(7 * 24 * time.Hour),
	}, nil
}
