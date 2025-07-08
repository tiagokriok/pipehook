package postgres

import (
	"context"
	"database/sql"
	"fmt"
	"pipehook/api/internal/adapters/storages/postgres/sqlc"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
	config  *Config
	queries *sqlc.Queries
}

func NewPostgres(ctx context.Context, config *Config) (*DB, error) {
	db, err := sql.Open("postgres", config.DSN())
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	sqlcQueries := sqlc.New(db)

	return &DB{
		DB:      db,
		config:  config,
		queries: sqlcQueries,
	}, nil
}

func (db *DB) Close() error {
	return db.DB.Close()
}