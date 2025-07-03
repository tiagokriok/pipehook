package domain

import (
	"context"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
	"time"
)

type UserRole string

const (
	UserRoleOwner  UserRole = "owner"
	UserRoleAdmin  UserRole = "admin"
	UserRoleMember UserRole = "member"
)

type User struct {
	ID       string   `json:"id"`
	Name     string   `json:"name"`
	Email    string   `json:"email"`
	Username string   `json:"username"`
	Avatar   string   `json:"avatar,omitempty"` // URL
	Role     UserRole `json:"role"`

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

func NewUser(name, email, username string, role UserRole) *User {
	return &User{
		ID:        id.NewUser().String(),
		Name:      name,
		Email:     email,
		Username:  username,
		Role:      role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}