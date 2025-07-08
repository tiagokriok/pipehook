package domain

import (
	"context"
	"errors"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
	"strings"
	"time"
)

type Plan string

const (
	PlanFree       Plan = "free"
	PlanStarter    Plan = "starter"
	PlanPro        Plan = "pro"
	PlanEnterprise Plan = "enterprise"
)

type Settings struct {
	WebhookLimit   int `json:"webhookLimit"`
	EventRetention int `json:"eventRetentionDays"`
	TeamMembers    int `json:"teamMembers"`
}

type Organization struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Avatar   string   `json:"avatar,omitempty"` // URL
	Plan     Plan     `json:"plan"`
	Settings Settings `json:"settings"`

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

func NewOrganization(name, ownerID string) (*Organization, error) {
	name = strings.TrimSpace(name)

	if name == "" {
		return nil, errors.New("organization name is required")
	}

	if err := id.ValidatePrefix(ownerID, id.UserPrefix); err != nil {
		return nil, errors.New("owner id is required")
	}

	return &Organization{
		ID:   id.NewOrganization().String(),
		Name: name,
		Plan: PlanFree,
		Settings: Settings{
			WebhookLimit:   10,
			EventRetention: 7,
			TeamMembers:    3,
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (o *Organization) UpgradePlan(newPlan Plan) {
	o.Plan = newPlan
	o.UpdatedAt = time.Now()

	switch newPlan {
	case PlanStarter:
		o.Settings.WebhookLimit = 50
		o.Settings.EventRetention = 30
		o.Settings.TeamMembers = 10
	case PlanPro:
		o.Settings.WebhookLimit = 500
		o.Settings.EventRetention = 90
		o.Settings.TeamMembers = 50
	case PlanEnterprise:
		o.Settings.WebhookLimit = -1 // Unlimited
		o.Settings.EventRetention = 365
		o.Settings.TeamMembers = -1 // Unlimited
	}
}

func (o *Organization) CanCreateWebhook(currentCount int) bool {
	if o.Settings.WebhookLimit == -1 {
		return true
	}
	return currentCount < o.Settings.WebhookLimit
}
