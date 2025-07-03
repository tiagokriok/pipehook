package domain

import (
	"context"
	"encoding/json"
	"pipehook/api/internal/core/port"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
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
	UpdateById(context context.Context, organizationID string, id primitive.ObjectID, event *Event) error
	FindById(context context.Context, id primitive.ObjectID) (*Event, error)
	FindAllByOrganizationId(context context.Context, organizationID string, query *port.QueryParams) ([]Event, error)
	DestroyById(context context.Context, organizationID string, id primitive.ObjectID) error
}