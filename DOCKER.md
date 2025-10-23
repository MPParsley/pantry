# Pantry - Docker Deployment Guide

Complete gids voor het draaien van Pantry met Docker en Docker Compose.

## Table of Contents

- [Quick Start](#quick-start)
- [Docker Compose](#docker-compose)
- [Production Deployment](#production-deployment)
- [Development with Docker](#development-with-docker)
- [GitHub Container Registry](#github-container-registry)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### Vereisten

- Docker 20.10+
- Docker Compose 2.0+

### 1. Start met Docker Compose (meest eenvoudig)

```bash
# Clone repository
git clone <repository-url>
cd pantry

# Start alle services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

**Services beschikbaar op:**
- Frontend: http://localhost
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api

### 2. Stop services

```bash
docker compose down

# Stop en verwijder volumes (data wordt gewist!)
docker compose down -v
```

---

## Docker Compose

### Production Setup (docker-compose.yml)

```yaml
services:
  backend:    # Node.js API op poort 3000
  frontend:   # Nginx serving React app op poort 80
```

**Features:**
- Multi-stage builds voor kleine images
- Health checks voor beide services
- Persistent volume voor database
- Bridge network voor inter-service communicatie
- Restart policy: unless-stopped

### Commands

```bash
# Build images
docker compose build

# Start in detached mode
docker compose up -d

# Start en rebuild
docker compose up --build

# View logs
docker compose logs
docker compose logs backend
docker compose logs -f frontend

# Check health status
docker compose ps

# Stop services
docker compose stop

# Remove containers
docker compose down

# Remove containers + volumes
docker compose down -v

# Exec into container
docker compose exec backend sh
docker compose exec frontend sh
```

---

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone repository op productie server
git clone <repository-url>
cd pantry

# 2. (Optioneel) Pas environment variables aan
# Maak .env bestand indien nodig

# 3. Start services
docker compose up -d

# 4. Seed database met voorbeelddata (eerste keer)
docker compose exec backend npx tsx backend/src/seed.ts

# 5. Check logs
docker compose logs -f
```

### Option 2: Pull Pre-built Images from GitHub Container Registry

```bash
# 1. Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# 2. Pull images
docker pull ghcr.io/mpparsley/pantry/backend:latest
docker pull ghcr.io/mpparsley/pantry/frontend:latest

# 3. Run containers
docker run -d \
  --name pantry-backend \
  -p 3000:3000 \
  -v pantry-data:/app/data \
  ghcr.io/mpparsley/pantry/backend:latest

docker run -d \
  --name pantry-frontend \
  -p 80:80 \
  --link pantry-backend:backend \
  ghcr.io/mpparsley/pantry/frontend:latest
```

### Environment Variables

Create `.env` file in project root:

```env
# Backend
NODE_ENV=production
DATABASE_PATH=/app/data/pantry.db

# Optional: Configure ports
BACKEND_PORT=3000
FRONTEND_PORT=80
```

Update `docker-compose.yml` to use env file:

```yaml
services:
  backend:
    env_file: .env
```

---

## Development with Docker

### Development Setup (docker-compose.dev.yml)

Hot-reload enabled voor beide services.

```bash
# Start development environment
docker compose -f docker-compose.dev.yml up

# Rebuild en start
docker compose -f docker-compose.dev.yml up --build

# Stop
docker compose -f docker-compose.dev.yml down
```

**Features:**
- Volume mounts voor hot-reload
- Development dependencies included
- Vite dev server met HMR
- Backend watches TypeScript files

**Services:**
- Frontend: http://localhost:5173 (Vite dev server)
- Backend: http://localhost:3000

### Development Workflow

```bash
# 1. Start development containers
docker compose -f docker-compose.dev.yml up -d

# 2. Edit code - changes auto-reload
# Frontend: src/**/*.tsx
# Backend: backend/src/**/*.ts

# 3. View logs
docker compose -f docker-compose.dev.yml logs -f

# 4. Exec into backend for debugging
docker compose -f docker-compose.dev.yml exec backend sh

# 5. Run tests (wanneer geïmplementeerd)
docker compose -f docker-compose.dev.yml exec backend npm test
```

---

## GitHub Container Registry

### Automatic Publishing

Docker images worden automatisch gepubliceerd naar GitHub Container Registry (ghcr.io) via GitHub Actions.

**Triggers:**
- Push naar `main` branch → tagged als `latest`
- Push naar `claude/**` branches → tagged met branch naam
- Git tags `v*.*.*` → tagged als semver
- Pull requests → build only (niet gepusht)

**Workflows:**
- `.github/workflows/docker-publish.yml` - Build en publish images
- `.github/workflows/docker-test.yml` - Test Docker Compose setup

### Image Naming

```
ghcr.io/mpparsley/pantry/backend:latest
ghcr.io/mpparsley/pantry/backend:main
ghcr.io/mpparsley/pantry/backend:v1.0.0
ghcr.io/mpparsley/pantry/backend:claude-pantry-mvp-development-<hash>

ghcr.io/mpparsley/pantry/frontend:latest
ghcr.io/mpparsley/pantry/frontend:main
ghcr.io/mpparsley/pantry/frontend:v1.0.0
```

### Manual Build & Push

```bash
# 1. Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin

# 2. Build images
docker build -t ghcr.io/mpparsley/pantry/backend:latest -f backend/Dockerfile .
docker build -t ghcr.io/mpparsley/pantry/frontend:latest -f frontend/Dockerfile ./frontend

# 3. Push images
docker push ghcr.io/mpparsley/pantry/backend:latest
docker push ghcr.io/mpparsley/pantry/frontend:latest
```

### Pull Images

Images zijn public (indien repository public is):

```bash
# Geen login vereist voor publieke images
docker pull ghcr.io/mpparsley/pantry/backend:latest
docker pull ghcr.io/mpparsley/pantry/frontend:latest

# Voor private images:
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
docker pull ghcr.io/mpparsley/pantry/backend:latest
```

---

## Multi-Architecture Support

Images worden gebouwd voor meerdere platformen:
- `linux/amd64` (x86_64)
- `linux/arm64` (Apple Silicon, ARM servers)

Dit gebeurt automatisch via GitHub Actions met buildx.

### Local Multi-Arch Build

```bash
# Setup buildx
docker buildx create --use

# Build voor meerdere platformen
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/mpparsley/pantry/backend:latest \
  -f backend/Dockerfile \
  --push \
  .
```

---

## Production Best Practices

### 1. Use Specific Tags

```yaml
services:
  backend:
    image: ghcr.io/mpparsley/pantry/backend:v1.0.0  # Niet :latest
  frontend:
    image: ghcr.io/mpparsley/pantry/frontend:v1.0.0
```

### 2. Persistent Volumes

```yaml
volumes:
  pantry-data:
    driver: local
    driver_opts:
      type: none
      o: bind
      device: /data/pantry  # Absolute path op host
```

### 3. Resource Limits

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### 4. Logging

```yaml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### 5. Reverse Proxy (Nginx/Traefik)

```yaml
services:
  frontend:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.pantry.rule=Host(`pantry.example.com`)"
      - "traefik.http.services.pantry.loadbalancer.server.port=80"
```

---

## Health Checks

Beide services hebben health checks:

**Backend:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

**Frontend:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Check health status:
```bash
docker compose ps
docker inspect pantry-backend --format='{{.State.Health.Status}}'
```

---

## Database Management

### Backup

```bash
# Stop backend om consistente backup te maken
docker compose stop backend

# Backup database
docker compose cp backend:/app/data/pantry.db ./backup-$(date +%Y%m%d).db

# Start backend
docker compose start backend
```

### Restore

```bash
# Stop backend
docker compose stop backend

# Restore database
docker compose cp ./backup-20251023.db backend:/app/data/pantry.db

# Start backend
docker compose start backend
```

### Seed Database

```bash
# Seed met voorbeelddata
docker compose exec backend npx tsx backend/src/seed.ts
```

---

## Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs backend
docker compose logs frontend

# Check container status
docker compose ps

# Inspect container
docker inspect pantry-backend
```

### Port already in use

```bash
# Find process using port
lsof -i :3000
lsof -i :80

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
ports:
  - "8080:80"  # Use port 8080 instead of 80
```

### Database issues

```bash
# Remove and recreate volume
docker compose down -v
docker compose up -d
docker compose exec backend npx tsx backend/src/seed.ts
```

### Network issues

```bash
# Recreate network
docker compose down
docker network prune
docker compose up -d
```

### Build cache issues

```bash
# Rebuild without cache
docker compose build --no-cache

# Or individual service
docker compose build --no-cache backend
```

### Permission issues

```bash
# Fix volume permissions (Linux)
sudo chown -R 1001:1001 /var/lib/docker/volumes/pantry_pantry-data
```

---

## Performance Optimization

### 1. Use Multi-Stage Builds

Already implemented in Dockerfiles.

### 2. Layer Caching

```bash
# Build with buildkit for better caching
DOCKER_BUILDKIT=1 docker compose build
```

### 3. Image Size

Check image sizes:
```bash
docker images | grep pantry
```

Expected sizes:
- Backend: ~150-200MB (Alpine + Node + dependencies)
- Frontend: ~50-80MB (Nginx + static files)

### 4. Production Optimization

Frontend uses:
- Gzip compression
- Static asset caching (1 year)
- Security headers

---

## CI/CD Integration

### GitHub Actions

Workflows automatically:
1. Build Docker images on push
2. Run tests with Docker Compose
3. Push to GitHub Container Registry
4. Create deployment artifacts

### Deployment Webhook

```bash
# On production server
git pull
docker compose pull
docker compose up -d
```

---

## Monitoring

### Container Stats

```bash
# Real-time stats
docker stats pantry-backend pantry-frontend

# One-time snapshot
docker stats --no-stream
```

### Logs

```bash
# Follow all logs
docker compose logs -f

# Filter by service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100

# Timestamps
docker compose logs -t
```

---

## Security

### 1. Non-Root User

Containers run as non-root user (UID 1001).

### 2. Security Scanning

```bash
# Scan images for vulnerabilities
docker scout cves ghcr.io/mpparsley/pantry/backend:latest
docker scout cves ghcr.io/mpparsley/pantry/frontend:latest
```

### 3. Network Isolation

Services communicate via bridge network, niet direct exposed.

### 4. Secrets Management

Never commit secrets. Use:
- Environment variables
- Docker secrets
- External secret managers (Vault, AWS Secrets Manager)

---

## Advanced Topics

### Docker Swarm Deployment

```bash
docker stack deploy -c docker-compose.yml pantry
```

### Kubernetes

Convert docker-compose.yml to Kubernetes:
```bash
kompose convert
```

---

## Support

Voor vragen of problemen:
- GitHub Issues: https://github.com/mpparsley/pantry/issues
- Documentatie: README.md, QUICKSTART.md

---

**Happy Dockerizing!** 🐳
