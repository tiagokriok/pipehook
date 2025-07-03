package port

import (
	"context"
	"pipehook/api/internal/core/domain"
)

type UserRepository interface {
	Invite(context context.Context, organizationID string, user *domain.User) error
	Update(context context.Context, organizationID, id string, user *domain.User) error
	FindOne(context context.Context, organizationID, id string) (*domain.User, error)
	FindAll(context context.Context, organizationID string, query *QueryParams) ([]domain.User, error)
	Delete(context context.Context, organizationID, id string) error
	SignUp(context context.Context, user *domain.User) error
	SignIn(context context.Context, user *domain.User) (string, error)
}

type UserService interface {
	Invite(context context.Context, organizationID string, user *domain.User) error
	Update(context context.Context, organizationID, id string, user *domain.User) error
	FindOne(context context.Context, organizationID, id string) (*domain.User, error)
	FindAll(context context.Context, organizationID string, query *QueryParams) ([]domain.User, error)
	Delete(context context.Context, organizationID, id string) error
	SignUp(context context.Context, user *domain.User) error
	SignIn(context context.Context, user *domain.User) (string, error)
}