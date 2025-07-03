package id

import (
	"fmt"
	"strings"
	"sync"

	"github.com/nrednav/cuid2"
)

var (
	once      sync.Once
	generator func() string
)

func init() {
	once.Do(func() {
		generator, _ = cuid2.Init(cuid2.WithLength(24), cuid2.WithFingerprint("pipehook"))
	})
}

func New(prefix Prefix) ID {
	return ID{
		prefix: prefix,
		value:  generator(),
	}
}

func NewWebhook() ID {
	return New(WebhookPrefix)
}

func NewUser() ID {
	return New(UserPrefix)
}

func NewOrganization() ID {
	return New(OrganizationPrefix)
}

func NewEvent() ID {
	return New(EventPrefix)
}

func Parse(id string) (ID, error) {
	parts := strings.SplitN(id, "_", 2)

	if len(parts) != 2 {
		return ID{}, fmt.Errorf("invalid ID format: %s", id)
	}

	prefix := Prefix(parts[0])
	value := parts[1]

	if len(value) != 24 {
		return ID{}, fmt.Errorf("invalid CUID2 length: expected 24, got %d", len(value))
	}

	return ID{
		prefix: prefix,
		value:  value,
	}, nil
}

func MustParse(id string) ID {
	parsed, err := Parse(id)
	if err != nil {
		panic(err)
	}
	return parsed
}

func IsValid(id string) bool {
	_, err := Parse(id)
	return err == nil
}

func ValidatePrefix(id string, expectedPrefix Prefix) error {
	parsed, err := Parse(id)
	if err != nil {
		return err
	}
	if parsed.prefix != expectedPrefix {
		return fmt.Errorf("invalid prefix: expected %s, got %s", expectedPrefix, parsed.prefix)
	}
	return nil
}
