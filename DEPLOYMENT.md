# UCCIS – Production Deployment & Infrastructure Guide

## 1. System Overview & Architecture

**UCCIS** (Unified Command & Control Intelligence System) is containerized as a multi-service architecture comprising:
- **Backend Service (`uccis-backend`)**: Node.js & Express API with MongoDB Atlas and an integrated SQLite compatibility data layer.
  - Container Port: `5000`
  - Production VM Mapped Port: `5005` (`http://<VM_IP>:5005`)
  - Health Endpoint: `http://localhost:5005/api/health`
- **Frontend Service (`uccis-frontend`)**: React.js production build served using `serve`
  - Container Port: `3000`
  - Production VM Mapped Port: `3010` (`http://<VM_IP>:3010`)
  - Health Endpoint: `http://localhost:3010/`

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Remote VM                     │
│                                                             │
│   Host Port: 3010                       Host Port: 5005     │
│          │                                     │            │
│          ▼                                     ▼            │
│   ┌──────────────┐     uccis_network    ┌──────────────┐    │
│   │uccis-frontend│ ───────────────────> │uccis-backend │    │
│   │ (Port 3000)  │                      │ (Port 5000)  │    │
│   └──────────────┘                      └──────┬───────┘    │
│                                                │            │
│                                                ▼            │
│                                         ┌─────────────┐     │
│                                         │MongoDB Atlas│     │
│                                         └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Port Allocations

| Service | Container Port | VM Host Port | Health Check | Description |
|---|---|---|---|---|
| `uccis-backend` | `5000` | **`5005`** | `GET /api/health` | Express REST & WebSocket API |
| `uccis-frontend` | `3000` | **`3010`** | `GET /` | React Production Application |

*(Note: Host ports 5000–5004 and 3000–3009 are reserved for other services on the VM; 5005 and 3010 are allocated for UCCIS).*

---

## 3. Environment Configurations

### Backend (`backend/.env`)
Configured from `c:\Users\ASUS\OneDrive\Desktop\BHIV-Tasks\UCCIS_deployment\new.env`:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://3madhumati_db_user:XAtVdYlMrjMpqYiG@cluster0.fc4me8o.mongodb.net/UCCISFinal?appName=Cluster0
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=madhurohi0331$
DB_NAME=uccis
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=madhurohi0331$
MYSQL_DATABASE=uccis
TASK32_DB_NAME=uccis_runtime
TASK33_DB_NAME=uccis_run
TASK34_DB_NAME=uccis_123
JWT_SECRET=uccis_super_secret_key
FRONTEND_URL=http://localhost:3010
```

### Frontend (`frontend/.env`)
Configured from `c:\Users\ASUS\OneDrive\Desktop\BHIV-Tasks\UCCIS_deployment\frontend.env`:
```env
REACT_APP_API_URL=https://uccis-backend.onrender.com
```

---

## 4. GitHub Actions CI/CD Pipeline

The automated deployment pipeline is located at [`.github/workflows/cicd.yml`](.github/workflows/cicd.yml) and executes on every push to the `main` branch:

1. **`validate`**:
   - Generates `docker-compose.production.yml` with the short Git commit SHA.
   - Verifies the compose schema and service definitions using `docker compose config`.
   - Uploads validated compose templates as build artifacts.

2. **`build`**:
   - Builds multi-stage Docker images for backend (`bhiv/uccis-backend`) and frontend (`bhiv/uccis-frontend`).
   - Tags each image with both `:latest` and the 7-character Git commit SHA.
   - Pushes images to Docker Hub.

3. **`deploy`**:
   - Downloads compose artifacts and dynamically generates `backend/.env` and `frontend/.env` from GitHub Secrets.
   - Bundles deployment files into a tarball and transfers it via SSH (`sshpass` / SCP) to `~/UCCIS` on the target VM.
   - Pulls newly built container images and launches the stack with `docker compose -f docker-compose.production.yml up -d --remove-orphans`.
   - Runs a 12-iteration healthcheck verification loop checking container status and verifying connectivity on ports **`5005`** and **`3010`**.
   - Records successful deployments in `docs/RELEASE_HISTORY.md` and backs up the registry to `/var/tmp/UCCIS/RELEASE_HISTORY.md`.
   - Prunes outdated images older than 168 hours to conserve VM disk space.

4. **`rollback`**:
   - Triggers automatically if the `deploy` job fails.
   - Inspects `docs/RELEASE_HISTORY.md` for the last known healthy commit SHA.
   - Re-deploys and re-validates the previous stable release, ensuring zero-downtime recovery.

---

## 5. Required GitHub Secrets

Configure the following secrets in GitHub (**Settings → Secrets and variables → Actions**):

| Secret Name | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub personal access token or password |
| `VM_IP` | Public IP address of the target VM |
| `VM_PORT` | SSH port (e.g., `22`) |
| `VM_USERNAME` | SSH username on the target VM |
| `VM_PASSWORD` | SSH password for the VM user |
| `UCCIS_BACKEND_ENV_FILE` (or `BACKEND_ENV_FILE`) | Entire content of `backend/.env` |
| `UCCIS_FRONTEND_ENV_FILE` (or `FRONTEND_ENV_FILE`) | Entire content of `frontend/.env` |
| `REACT_APP_API_URL` | Backend URL passed to the frontend build |
| `MONGO_URI` (or `MONGODB_URI`) | Atlas MongoDB connection string |

---

## 6. Local Development Execution

To run the full stack locally with Docker Compose:

```bash
# 1. Ensure .env files are in place
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2. Start all services in the background
docker compose up -d --build

# 3. Check running status
docker compose ps

# 4. View logs
docker compose logs -f

# 5. Stop stack
docker compose down
```

Access points:
- Frontend: `http://localhost:3010`
- Backend: `http://localhost:5005`
- Backend Healthcheck: `http://localhost:5005/api/health`
