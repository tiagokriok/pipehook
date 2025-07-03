package port

import (
	"context"
	"pipehook/api/internal/core/domain"
)

type OrganizationRepository interface {
	Create(context context.Context, organization *domain.Organization) error
	Update(context context.Context, id string, organization *domain.Organization) error
	FindOne(context context.Context, id string) (*domain.Organization, error)
	FindAll(context context.Context, query *QueryParams) ([]domain.Organization, error)
	Delete(context context.Context, id string) error
}

type OrganizationService interface {
	Create(context context.Context, organization *domain.Organization) error
	Update(context context.Context, id string, organization *domain.Organization) error
	FindOne(context context.Context, id string) (*domain.Organization, error)
	FindAll(context context.Context, query *QueryParams) ([]domain.Organization, error)
	Delete(context context.Context, id string) error
}