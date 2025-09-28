
# Kauppalista

Kauppalista is a full-stack shopping list application (API + single-page client) implemented in Go and TypeScript/React. It provides shopping list and item management, list sharing, and collaborative editing functionalities. The repository includes Docker and Kubernetes manifests for containerized deployment.

## Highlights / Features

- REST API (Go)
	- CRUD for shopping lists and items
	- User registration and management
	- Authentication middleware (Keycloak integration)
- Single-page client (React + Vite + TypeScript)
	- Views for lists and items
	- Reusable components (dialogs, account menu, item rows)
	- Client-side services for calling the API
- Containerization & Deployment
	- Dockerfiles for API and client
	- Kubernetes manifests and configmaps under `manifests/` (deployments, services, ingress routes, PVC)
    - 

## Architecture (high level)

1. Client (React) communicates with API over HTTPS.
2. API performs authentication/authorization via Keycloak middleware.
3. Business logic lives in `service/` and persists via `repository/` to the database (Postgres expected in manifests).
4. Container images are built from the Dockerfiles and can be deployed with the Kubernetes manifests in `manifests/`.

## Configuration

- The API reads configuration from `api/config.yaml` (production/dev values). Check `internal/config` for loader utilities.
- Dockerfiles for `api/` and `client/` are present at the repository root under their respective folders.
- Kubernetes manifests and configmaps under `manifests/` contain an example deployment setup (database PVC, services, ingress routes).

## Quickstart - local development

Prerequisites: Go toolchain (see `go.mod` for version), Node.js and npm/yarn (check `client/package.json`), Make, Docker (optional for containers).

1. Start a Postgres instance (local Docker) or point the API to an existing DB. Example (adjust credentials and ports):

```bash
# run a Postgres container (example)
docker run --name kauppalista-db -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=kauppa -e POSTGRES_DB=kauppalista -p 5432:5432 -d postgres:15
```

2. (Optional) Start Keycloak or another OIDC provider and configure a client/realm per `internal/service/keycloak.go`.

3. Run the API server from the `/api`-directory:

```bash
make run
```

4. Start the client:

```bash
cd client
npm install
npm run dev
```

The client expects the API at the configured API base URL. Check `client/src/services/api.ts` and `api/config.yaml` for the configured endpoints and CORS settings.

## Docker & Kubernetes

- Build API image:

```bash
docker build -t kauppalista-api:local ./api
```

- Build client image:

```bash
docker build -t kauppalista-client:local ./client
```

- Kubernetes manifests for deployment, services, and ingress are under `manifests/`. There is also a PVC manifest for Postgres storage.

## Live deployment

This project is currently deployed to a personal k3s cluster for development and testing. The same manifests under `manifests/` were used for that deployment — adjust image tags, namespace, and context as needed to reproduce locally.
