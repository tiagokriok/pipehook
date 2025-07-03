package domain

import (
	"context"
	"pipehook/api/internal/core/port"
	"time"
)

type User struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
	Avatar   string `json:"avatar,omitempty"` // URL

	OrganizationID string `json:"organizationId"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type UserRepository interface {
	Invite(context context.Context, organizationID string, user *User) error
	UpdateById(context context.Context, organizationID, id string, user *User) error
	FindById(context context.Context, organizationID, id string) (*User, error)
	FindAllByOrganizationId(context context.Context, organizationID string, query *port.QueryParams) ([]User, error)
	DestroyById(context context.Context, organizationID, id string) error
	SignUp(context context.Context, user *User) error
	SignIn(context context.Context, user *User) (string, error)
}