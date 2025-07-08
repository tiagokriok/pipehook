package domain

import (
	"context"
	"errors"
	"pipehook/api/internal/core/port"
	"pipehook/api/pkg/id"
	"strings"
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
	DeletedAt time.Time `json:"deletedAt"`
}

type UserRepository interface {
	Invite(context context.Context, organizationID string, user *User) error
	UpdateById(context context.Context, organizationID, id string, user *User) error
	FindById(context context.Context, organizationID, id string) (*User, error)
	FindAllByOrganizationId(context context.Context, organizationID string, query *port.QueryParams) ([]User, error)
	DestroyById(context context.Context, organizationID, id string) error
	SoftDelete(context context.Context, organizationID, id string) error
}

func NewUser(name, email, username string, role UserRole) (*User, error) {
	email = strings.TrimSpace(strings.ToLower(email))

	if email == "" || !isValidEmail(email) {
		return nil, errors.New("invalid email")
	}

	return &User{
		ID:        id.NewUser().String(),
		Name:      name,
		Email:     email,
		Username:  username,
		Role:      role,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}, nil
}

func (u *User) IsOwner() bool {
	return u.Role == UserRoleOwner
}

func (u *User) IsAdmin() bool {
	return u.Role == UserRoleAdmin || u.Role == UserRoleOwner
}

func (u *User) IsMember() bool {
	return u.Role == UserRoleMember || u.Role == UserRoleAdmin || u.Role == UserRoleOwner
}

func (u *User) ChangeRole(newRole UserRole) error {
	if u.Role == UserRoleOwner && newRole != UserRoleOwner {
		return errors.New("cannot change owner role")
	}

	u.Role = newRole
	u.UpdatedAt = time.Now()
	return nil
}
