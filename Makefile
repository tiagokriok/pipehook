.PHONY: help dev dev-api dev-events dev-web build build-api build-events build-web clean install db-up db-down db-reset deps-go deps-web

# Default target
help: ## Show this help message
	@echo "PipeHook Development Commands"
	@echo "================================"
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development Commands

dev: db-up ## Run all services in development mode
	@echo "🚀 Starting all development services..."
	@make -j3 dev-api dev-events dev-web

dev-api: ## Run API server with hot reload
	@echo "🔥 Starting API server with hot reload..."
	@cd api && air

dev-events: ## Run event server with hot reload
	@echo "🔥 Starting event server with hot reload..."
	@cd event-server && air

dev-web: ## Run React development server
	@echo "⚛️  Starting React development server..."
	@cd web && pnpm dev

##@ Build Commands

build: build-api build-events build-web ## Build all projects

build-api: ## Build API server
	@echo "🏗️  Building API server..."
	@cd api && go build -o bin/api ./cmd/server

build-events: ## Build event server
	@echo "🏗️  Building event server..."
	@cd event-server && go build -o bin/event-server ./cmd/server

build-web: ## Build React app for production
	@echo "🏗️  Building React app..."
	@cd web && pnpm build

##@ Database Commands

db-up: ## Start PostgreSQL database
	@echo "🐘 Starting PostgreSQL database..."
	@docker-compose up -d postgres

db-down: ## Stop PostgreSQL database
	@echo "🛑 Stopping PostgreSQL database..."
	@docker-compose down

db-reset: ## Reset database (remove volumes and restart)
	@echo "🔄 Resetting PostgreSQL database..."
	@docker-compose down -v
	@docker-compose up -d postgres

##@ Setup Commands

install: deps-go deps-web ## Install all dependencies
	@echo "✅ All dependencies installed!"

deps-go: ## Install Go dependencies and Air
	@echo "📦 Installing Go dependencies..."
	@cd api && go mod tidy && go install github.com/air-verse/air@latest
	@cd event-server && go mod tidy && go install github.com/air-verse/air@latest

deps-web: ## Install React dependencies
	@echo "📦 Installing React dependencies..."
	@cd web && pnpm install

##@ Utility Commands

clean: ## Clean build artifacts and dependencies
	@echo "🧹 Cleaning build artifacts..."
	@rm -rf api/bin
	@rm -rf event-server/bin
	@rm -rf web/dist
	@rm -rf web/node_modules
	@cd api && go clean -cache
	@cd event-server && go clean -cache

fmt: ## Format code (Go and React)
	@echo "🎨 Formatting code..."
	@cd api && go fmt ./...
	@cd event-server && go fmt ./...
	@cd web && pnpm format

lint: ## Lint all projects
	@echo "🔍 Linting projects..."
	@cd api && go vet ./...
	@cd event-server && go vet ./...
	@cd web && pnpm lint

test: ## Run tests for all projects
	@echo "🧪 Running tests..."
	@cd api && go test ./...
	@cd event-server && go test ./...

##@ Docker Commands

docker-build: ## Build Docker images for all services
	@echo "🐳 Building Docker images..."
	@docker build -t pipehook-api ./api
	@docker build -t pipehook-events ./event-server

docker-up: ## Start all services with Docker Compose
	@echo "🐳 Starting all services with Docker..."
	@docker compose up -d

docker-down: ## Stop all Docker services
	@echo "🛑 Stopping Docker services..."
	@docker compose down

docker-logs: ## Show Docker logs
	@docker compose logs -f