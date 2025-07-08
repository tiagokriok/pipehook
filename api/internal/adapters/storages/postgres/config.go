package postgres

import "fmt"

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
}

func NewConfig(host, user, password, database string, port int) *Config {
	return &Config{
		Host:     host,
		Port:     port,
		User:     user,
		Password: password,
		Database: database,
	}
}

func (c *Config) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s",
		c.Host, c.Port, c.User, c.Password, c.Database,
	)
}