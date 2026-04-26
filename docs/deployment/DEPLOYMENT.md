# Deployment Guide

This guide covers deploying the Kauppalista application to production.

## Prerequisites

- Docker Engine and Docker Compose plugin on the production server
- Auth0 tenant with:
  - A SPA application configured for production URLs
  - An API with the desired audience
  - An M2M application for Auth0 Management API (if user management is used)
- Domain name and SSL certificates (via reverse proxy or Let's Encrypt)

## Configuration

### Environment Variables

Copy the environment template and configure production values:

```bash
cp .env.example .env
```

Required variables in `.env`:

| Variable | Description |
|---|---|
| `VITE_AUTH_AUTHORITY` | Production Auth0 tenant URL |
| `VITE_AUTH_CLIENT_ID` | Production SPA app client ID |
| `VITE_AUTH_SCOPE` | OIDC scope (default: `openid profile email`) |
| `VITE_AUTH_AUDIENCE` | API audience (optional) |
| `AUTH0_MANAGEMENT_CLIENT_SECRET` | Production M2M secret |

### Auth0 Setup

1. **SPA Application**: Create or update a SPA application in Auth0 with:
   - Allowed Callback URLs: `https://<your-domain>/`
   - Allowed Logout URLs: `https://<your-domain>/`
   - Allowed Web Origins: `https://<your-domain>`

2. **API**: Create or configure an API in Auth0 with the identifier matching `VITE_AUTH_AUDIENCE` (if used).

3. **M2M Application**: Create an M2M application authorized for Auth0 Management API:
   - Set `auth0.management_client_id` in `api/config.yaml`
   - Set `AUTH0_MANAGEMENT_CLIENT_SECRET` environment variable

## Deployment

### Using Docker Compose

The project includes `docker-compose.prod.yaml` for production deployments:

```bash
# Build and start all services
docker compose -f docker-compose.prod.yaml up --build -d

# Check service status
docker compose -f docker-compose.prod.yaml ps

# View logs
docker compose -f docker-compose.prod.yaml logs -f
```

### Building and Pushing Images

For air-gapped or registry-based deployments:

```bash
# Build the client image
docker build -t ekelhala/kauppalista-client:latest -f client/Dockerfile client/

# Build the API image
docker build -t ekelhala/kauppalista-api:latest -f api/Dockerfile api/

# Push to registry
docker push ekelhala/kauppalista-client:latest
docker push ekelhala/kauppalista-api:latest
```

Update `docker-compose.prod.yaml` to use the tagged images:

```yaml
services:
  client:
    image: ekelhala/kauppalista-client:latest
  api:
    image: ekelhala/kauppalista-api:latest
```

### Database Migration

If using database migrations, run them before deploying the API:

```bash
docker compose -f docker-compose.prod.yaml exec api go run ./cmd/server migrate up
```

## Health Checks and Monitoring

### Health Endpoints

The API exposes health check endpoints. Verify the API is running:

```bash
curl http://localhost:9000/health
```

### Docker Health Checks

Ensure `docker-compose.prod.yaml` includes health check configurations:

```yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
  client:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Log Management

View all service logs:

```bash
docker compose -f docker-compose.prod.yaml logs -f
```

View individual service logs:

```bash
docker compose -f docker-compose.prod.yaml logs -f api
docker compose -f docker-compose.prod.yaml logs -f client
docker compose -f docker-compose.prod.yaml logs -f db
```

## Updating the Deployment

To update to a new version:

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yaml up --build -d

# Or pull pre-built images from registry
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d
```

## Rolling Back

To roll back to a previous version:

```bash
# Revert git changes
git revert HEAD

# Rebuild with previous code
docker compose -f docker-compose.prod.yaml up --build -d

# Or use a previous image tag
# Update image tags in docker-compose.prod.yaml and run:
docker compose -f docker-compose.prod.yaml up -d
```

## Security Considerations

- Never commit `.env` files to version control
- Use strong secrets for Auth0 M2M applications
- Enable HTTPS in production via a reverse proxy (nginx, Caddy, etc.)
- Keep Docker images updated to use patched base images
- Restrict database access to the API container only (internal network)
