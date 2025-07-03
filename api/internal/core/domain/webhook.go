package domain

import "time"

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
