package domain

import (
	"encoding/json"
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