
# Kauppalista

Kauppalista is a full-stack shopping list application (API + single-page client) implemented in Go and TypeScript/React. It provides shopping list and item management, list sharing, and collaborative editing functionalities. The repository uses Docker Compose for containerized local deployment.

## Highlights / Features

- REST API (Go)
	- CRUD for shopping lists and items
	- User registration and management
	- Authentication middleware (Auth0/OIDC integration)
- Single-page client (React + Vite + TypeScript)
	- Views for lists and items
	- Reusable components (dialogs, account menu, item rows)
	- Client-side services for calling the API
- Containerization & Deployment
	- Dockerfiles for API and client (client built with Bun)
	- Docker Compose stack for database, API, and client
- Documentation
	- [docs/](docs/) — Project documentation index
	- [Local Development](docs/getting-started/LOCAL_DEV.md) — Setup and run locally
	- [Deployment](docs/deployment/DEPLOYMENT.md) — Production deployment guide

## Architecture (high level)

1. Client (React) communicates with API over HTTPS.
2. API performs authentication/authorization via OIDC middleware.
3. Business logic lives in `service/` and persists via `repository/` to the database (Postgres expected in manifests).
4. Container images are built from the Dockerfiles and orchestrated with `docker-compose.yaml`.

## Configuration

- The API reads configuration from `api/config.yaml` (production/dev values). Check `internal/config` for loader utilities.
- Auth is configured with an `auth0` block in `api/config.yaml`:
	- `issuer` (for example `https://<tenant>.auth0.com`)
	- `api_audience` (API audience used for bearer token verification)
	- `management_audience` (typically `https://<tenant>.auth0.com/api/v2/`)
	- `management_client_id` (M2M application client id for user search)
- API also requires `AUTH0_MANAGEMENT_CLIENT_SECRET` as an environment variable for Management API access.
- Dockerfiles for `api/` and `client/` are present at the repository root under their respective folders.
- `docker-compose.yaml` defines the full stack: `db`, `api`, and `client`.

## Quickstart - Docker Compose

Prerequisites: [Bun](https://bun.sh/) ≥ 1.2.0, Docker Engine + Docker Compose plugin.

1. Copy environment template and fill Auth0 values:

```bash
cp .env.example .env
```

2. Configure Auth0:
	- Create a SPA application for the client.
	- Create or configure an API in Auth0 and set its identifier to match `auth0.api_audience`.
	- Create an M2M application authorized for Auth0 Management API and set `auth0.management_client_id` plus `AUTH0_MANAGEMENT_CLIENT_SECRET`.
	- Configure SPA app callback/logout URLs for your local client (for example `http://localhost:3000` and `http://localhost:3000/silent-renew`).

3. Start the full stack:

```bash
docker compose up --build
```

4. Open the application:

```bash
http://localhost:3000
```

Client auth configuration is provided via Vite env vars in `.env`:
- `VITE_AUTH_AUTHORITY` (for example `https://<tenant>.auth0.com`)
- `VITE_AUTH_CLIENT_ID` (SPA app client id)
- `VITE_AUTH_SCOPE` (defaults to `openid profile email`)
- `VITE_AUTH_AUDIENCE` (optional, requested via `audience` auth parameter)

The client proxies `/api` to the API container through nginx using `API_URL=http://api:9000`.

## Useful Commands

- Stop stack and remove containers:

```bash
docker compose down
```

- Stop stack and remove containers + DB volume:

```bash
docker compose down -v
```

