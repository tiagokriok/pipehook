package id

type Prefix string

const (
	WebhookPrefix      Prefix = "wbh"
	UserPrefix         Prefix = "usr"
	OrganizationPrefix Prefix = "org"
	EventPrefix        Prefix = "evn"
	DeliveryPrefix     Prefix = "dly"
)

type ID struct {
	prefix Prefix
	value  string
}

func (id ID) String() string {
	if id.prefix == "" {
		return id.value
	}
	return string(id.prefix) + "_" + id.value
}

func (id ID) Prefix() Prefix {
	return id.prefix
}

func (id ID) Value() string {
	return id.value
}
