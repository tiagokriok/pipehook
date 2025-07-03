package domain

import "time"

type Webhook struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	URL         string `json:"url"`
	Enabled     bool   `json:"enabled"`
	Slug        string `json:"slug"`
	Delay       int    `json:"delay"`
	Concurrency int    `json:"concurrency"`

	OrganizationID string `json:"organizationId"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}