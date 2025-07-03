package port

import (
	"context"
	"pipehook/api/internal/core/domain"
)

type WebhookRepository interface {
	Create(context context.Context, organizationID string, webhook *domain.Webhook) error
	Update(context context.Context, organizationID, id string, webhook *domain.Webhook) error
	FindOne(context context.Context, organizationID, id string) (*domain.Webhook, error)
	FindAll(context context.Context, organizationID string, query *QueryParams) ([]domain.Webhook, error)
	Delete(context context.Context, organizationID, id string) error
}

type WebhookService interface {
	Create(context context.Context, organizationID string, webhook *domain.Webhook) error
	Update(context context.Context, organizationID, id string, webhook *domain.Webhook) error
	FindOne(context context.Context, organizationID, id string) (*domain.Webhook, error)
	FindAll(context context.Context, organizationID string, query *QueryParams) ([]domain.Webhook, error)
	Delete(context context.Context, organizationID, id string) error
}