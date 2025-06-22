# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PipeHook is a Webhook-as-a-Service platform similar to Svix. The project is currently in transition from a NestJS + Supabase architecture to a dual Go server setup with PostgreSQL and Clerk authentication.

**Current Architecture:**
- **Frontend**: React 19 + TypeScript + Vite with SWC compiler
- **API Server**: Go with Air hot reload (development)
- **Event Server**: Go with Air hot reload (development)
- **Database**: PostgreSQL via Docker Compose (migrated from Supabase)
- **Authentication**: Clerk (migrated from Supabase Auth)
- **Package Manager**: pnpm for React app, Go modules for servers
- **Build System**: Makefile with unified commands

## Development Commands

### Makefile Commands (Recommended)
```bash
# Show all available commands
make help

# Development - Run all services
make dev

# Development - Individual services
make dev-api      # API server with hot reload
make dev-events   # Event server with hot reload  
make dev-web      # React development server

# Database management
make db-up        # Start PostgreSQL
make db-down      # Stop PostgreSQL
make db-reset     # Reset database with clean volumes

# Build commands
make build        # Build all projects
make build-api    # Build API server only
make build-events # Build event server only
make build-web    # Build React app only

# Setup and dependencies
make install      # Install all dependencies
make deps-go      # Install Go deps + Air hot reload
make deps-web     # Install React dependencies

# Utility commands
make clean        # Clean all build artifacts
make fmt          # Format code (Go + React)
make lint         # Lint all projects
make test         # Run all tests
```


### Individual Project Commands

**Frontend (web/) Commands:**
```bash
cd web
pnpm dev          # Development server
pnpm build        # Build for production
pnpm lint         # Lint React code
pnpm format       # Format with Prettier
pnpm preview      # Preview production build
```

**Go Projects:**
```bash
cd api
go run cmd/server/main.go    # Run API server
air                          # Run with hot reload

cd event-server  
go run cmd/server/main.go    # Run event server
air                          # Run with hot reload
```


### Database Commands
```bash
# Start PostgreSQL database
docker-compose up -d

# Stop database
docker-compose down

# Reset database with volume cleanup
docker-compose down -v && docker-compose up -d
```

## Architecture Details

### Frontend Architecture
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS v4 with custom components using Radix UI
- **State Management**: TanStack Query for server state, React Context for auth
- **Routing**: React Router DOM v7 with layout-based routing
- **Authentication**: Clerk with custom AuthProvider wrapper
- **Icons**: Unplugin Icons with auto-install
- **Font**: Sora font family via @fontsource

### Component Structure
- `src/components/`: Reusable UI components (Button, Card, Input, etc.)
- `src/pages/`: Route-specific page components
- `src/layouts/`: Layout components (App, Auth)
- `src/contexts/`: React contexts (AuthContext)
- `src/providers/`: Provider components (AuthProvider)
- `src/hooks/`: Custom hooks (useAuth)

### Go Server Architecture
- **API Server** (`api/`): Serves React app and provides API endpoints
- **Event Server** (`event-server/`): Handles webhook events and SQS processing
- **Hot Reload**: Air configuration for both servers with auto-rebuild
- **Project Structure**: Expected `cmd/server/main.go` entry point for both projects

### Authentication Flow
- **Provider**: `ClerkProvider` wraps the entire app in `main.tsx`
- **Context**: Custom `AuthContext` provides unified auth interface
- **Routes**: Public routes use `AuthLayout`, private routes use `PrivateRoute` + `AppLayout`
- **Environment**: Requires `VITE_CLERK_PUBLISHABLE_KEY` environment variable


### Database Configuration
- **Database**: PostgreSQL 15 in Docker
- **Connection**: `localhost:5432`
- **Credentials**: `postgres/postgres` (development)
- **Database Name**: `pipehook`
- **Volume**: Persistent storage via Docker volume

## Migration Status

**Completed:**
- ✅ Removed Supabase dependencies and configuration
- ✅ Removed Prisma ORM dependencies
- ✅ Removed NestJS server and dependencies
- ✅ Added Clerk authentication
- ✅ Set up PostgreSQL with Docker Compose
- ✅ Updated React app for Clerk integration
- ✅ Created Makefile with unified development commands
- ✅ Set up Air hot reload for Go servers
- ✅ Configured Go project structure

**Pending:**
- 🔄 Implement Go API server (serve React app + API endpoints)
- 🔄 Implement Go event server (webhook processing)
- 🔄 Add SQS integration for event queuing
- 🔄 Database schema and Go models implementation
- 🔄 Docker configuration for Go servers

## Environment Variables

### Required for Frontend
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_... # From Clerk dashboard
```

### Database Connection (Future Go servers)
```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/pipehook
```

## Key File Paths

- **Build System**: `Makefile` (root-level commands)
- **Frontend Entry**: `web/src/main.tsx`
- **App Router**: `web/src/App.tsx`
- **Auth Context**: `web/src/contexts/AuthContext.tsx`
- **Auth Provider**: `web/src/providers/AuthProvider.tsx`
- **Vite Config**: `web/vite.config.ts`
- **Database**: `docker-compose.yml`
- **API Server**: `api/cmd/server/main.go` (expected structure)
- **Event Server**: `event-server/cmd/server/main.go` (expected structure)
- **Air Config**: `api/.air.toml`, `event-server/.air.toml`

## Project Structure

The project uses a clean multi-language structure with no root-level Node.js dependencies:
- **Go Projects**: `api/` and `event-server/` with individual `go.mod` files
- **React App**: `web/` as standalone pnpm package with its own formatting tools
- **Unified Commands**: Use `make` commands from root for best developer experience
- **No Root Dependencies**: Pure Makefile-based coordination without package.json

### Quick Start
```bash
# Install all dependencies
make install

# Start all development services
make dev

# Start individual services
make dev-api    # Go API server with hot reload
make dev-events # Go event server with hot reload
make dev-web    # React app with Vite

# Database
make db-up      # Start PostgreSQL
```