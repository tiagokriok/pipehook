package domain

import "time"

type PlanType string

const (
	PlanFree  PlanType = "free"
	PlanPro   PlanType = "pro"
	PlanTrial PlanType = "trial"
)

type Organization struct {
	ID     string   `json:"id"`
	Name   string   `json:"name"`
	Avatar string   `json:"avatar,omitempty"` // URL
	Plan   PlanType `json:"plan"`

	OwnerID string `json:"ownerId"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}