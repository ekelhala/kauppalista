# Local Development Guide

This guide covers setting up and running the Kauppalista project locally for development.

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.2.0 (package manager for the client)
- [Go](https://golang.org/dl/) ≥ 1.22 (for the API)
- [Docker](https://docs.docker.com/) + [Docker Compose](https://docs.docker.com/compose/) (for database and full-stack orchestration)
- Auth0 account configured with:
  - A SPA application (for the client)
  - An API with the desired audience
  - An M2M application (for Auth0 Management API access)

## Configuration

1. Copy the environment template and fill in the required values:

```bash
cp .env.example .env
```

2. Edit `.env` and configure the following variables:

| Variable | Description |
|---|---|
| `VITE_AUTH_AUTHORITY` | Auth0 tenant URL (e.g. `https://<tenant>.auth0.com`) |
| `VITE_AUTH_CLIENT_ID` | SPA app client ID |
| `VITE_AUTH_SCOPE` | OIDC scope (default: `openid profile email`) |
| `VITE_AUTH_AUDIENCE` | API audience (optional) |
| `AUTH0_MANAGEMENT_CLIENT_SECRET` | M2M application secret |

## Installing Dependencies

### Client (TypeScript/React)

```bash
cd client
bun install
```

This installs all dependencies and generates a `bun.lock` file.

### API (Go)

```bash
cd api
go mod download
```

## Running the Application

### Option 1: Full Stack with Docker Compose (Recommended)

This is the simplest way to run the entire application stack (database, API, and client):

```bash
docker compose up --build
```

The application will be available at `http://localhost:3000`.

### Option 2: Local Development (API + Client separately)

#### Run the API locally

```bash
cd api
go run ./cmd/server
```

The API will start on port `9000` by default.

#### Run the client locally

```bash
cd client
bun dev
```

The Vite dev server will start on port `5173` by default. Configure your reverse proxy or update the `API_URL` to point to the local API (`http://localhost:9000`).

## Useful Commands

### Docker Compose

```bash
# Start and build the full stack
docker compose up --build

# Stop the stack and remove containers
docker compose down

# Stop the stack and remove containers + DB volume
docker compose down -v

# Rebuild a specific service
docker compose up --build api

# View logs
docker compose logs -f
```

### Client (Bun)

```bash
# Start development server
bun dev

# Build for production
bun run build

# Preview production build
bun run preview

# Run linter
bun lint
```

### API (Go)

```bash
# Run the server
go run ./cmd/server

# Run tests
go test ./...

# Run linter (if golangci-lint is installed)
golangci-lint run
```

## Troubleshooting

### Port already in use

If port `3000` (client), `9000` (API), or `5432` (database) is already in use, either stop the conflicting service or modify the port mappings in `docker-compose.yaml`.

### Auth0 configuration issues

Ensure the Auth0 SPA application callback and logout URLs include your local development URL (e.g., `http://localhost:3000` and `http://localhost:3000/silent-renew`).

### Dependency issues

If you encounter dependency conflicts, remove the lockfile and reinstall:

```bash
cd client
rm bun.lock
bun install
```
