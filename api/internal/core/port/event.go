package port

import (
	"context"
	"pipehook/api/internal/core/domain"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EventRepository interface {
	Create(context context.Context, organizationID string, event *domain.Event) error
	Update(context context.Context, organizationID string, id primitive.ObjectID, event *domain.Event) error
	FindOne(context context.Context, id primitive.ObjectID) (*domain.Event, error)
	FindAll(context context.Context, organizationID string, query *QueryParams) ([]domain.Event, error)
	Delete(context context.Context, organizationID string, id primitive.ObjectID) error
}

type EventService interface {
	Create(context context.Context, organizationID string, event *domain.Event) error
	Update(context context.Context, organizationID string, id primitive.ObjectID, event *domain.Event) error
	FindOne(context context.Context, id primitive.ObjectID) (*domain.Event, error)
	FindAll(context context.Context, organizationID string, query *QueryParams) ([]domain.Event, error)
	Delete(context context.Context, organizationID string, id primitive.ObjectID) error
}