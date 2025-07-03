package domain

import (
	"context"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
	"time"
)

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

type OrganizationRepository interface {
	Store(context context.Context, organization *Organization) error
	UpdateById(context context.Context, id string, organization *Organization) error
	UpdateAvatar(context context.Context, id string, avatar string) error
	FindById(context context.Context, id string) (*Organization, error)
	FindAllByOrganizationId(context context.Context, query *port.QueryParams) ([]Organization, error)
	DestroyById(context context.Context, id string) error
}

func NewOrganization(name string) *Organization {
	return &Organization{
		ID:        id.NewOrganization().String(),
		Name:      name,
		Plan:      PlanFree,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}