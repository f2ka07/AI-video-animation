# My Slides — Deployment Guide

Deploy the Skilleo AI stack (GUI + Remotion render + Gentle word alignment) using **GitHub Actions** to build images and **Portainer** to run the stack. Secrets live in a `.env` file uploaded through Portainer — never committed to git.

## Architecture

| Service | Port | Role |
|---------|------|------|
| **app** | 3001 | Web GUI, course pipeline API, headless Remotion renders |
| **gentle** | internal | Word-level timing extraction (used by Step 4 in the wizard) |
| **remotion** | 3000 (localhost only) | Remotion Studio preview — optional; bind to `127.0.0.1` for SSH tunnel |

Persistent data is mounted from the host:

- `./courses` — course content and scripts
- `./public` — audio, timings, assets (generated at runtime)
- `./out` — rendered MP4 files
- `./workspace` — voice settings and local config

---

## Overview

```
push to main
    |
    v
GitHub Actions  -->  build Docker image  -->  push to ghcr.io
    |
    v
Portainer stack  -->  pull :latest  -->  redeploy with .env
```

1. **GitHub Actions** builds and publishes the app image to GitHub Container Registry (GHCR).
2. **Portainer** runs `docker-compose.prod.yml`, pulls the new image, and injects environment variables from your uploaded `.env`.
3. You open the GUI on port **3001**, sign in, and run the processing wizard (generic slides are fine to start).

---

## Part 1 — GitHub Actions (build and push)

Workflow file: [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

### What it does on every push to `main`

- Builds the Docker image from [`Dockerfile`](Dockerfile)
- Pushes to `ghcr.io/<your-github-user>/<repo-name>:latest` (and a commit SHA tag)

### What it does *not* do (Portainer workflow)

When you manage deployment through Portainer, you typically **do not** use the SSH deploy step. Either:

- Leave the repo variable `DEPLOY_ENABLED` unset (or not `true`), **or**
- Only run the workflow manually without SSH secrets configured

The image push still runs on every push to `main`; Portainer handles pulling and restarting.

### Optional: SSH deploy (alternative)

If you prefer Actions to SSH into the server and run `docker compose` directly, set these **GitHub repository secrets**:

| Secret | Example |
|--------|---------|
| `DEPLOY_HOST` | `203.0.113.10` |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | Private key (full PEM) |
| `DEPLOY_PATH` | `/opt/my-slides` |
| `DEPLOY_PORT` | `22` (optional) |

And set repository variable `DEPLOY_ENABLED` = `true`.

For the Portainer-based flow described below, **skip this** and use image pull in Portainer instead.

### GHCR visibility

Portainer must be able to pull your image:

- **Public package** — simplest: in GitHub, go to the package → Package settings → Change visibility to Public.
- **Private package** — add a **Registry** in Portainer (see Part 2) with a GitHub PAT that has `read:packages`.

Image reference format:

```text
ghcr.io/<github-owner>/<repo-name>:latest
```

Example:

```text
ghcr.io/myorg/my-slides:latest
```

---

## Part 2 — Portainer stack

### Prerequisites on the host

1. Docker and Portainer already running (your setup).
2. A directory for the stack, e.g. `/opt/my-slides`.
3. Git installed on the host (if using a Git-based stack).

### Prepare host directories

On the server:

```bash
sudo mkdir -p /opt/my-slides/{courses,public,out,workspace/config,workspace/logs}
sudo chown -R $USER:$USER /opt/my-slides
```

Clone the repo (first time only):

```bash
cd /opt
git clone https://github.com/<owner>/<repo>.git my-slides
cd my-slides
git checkout main
```

Course content ships in `courses/` from git. Generated audio, timings, and renders stay on the mounted volumes and are not overwritten by image updates.

---

### Create the stack in Portainer

1. Open Portainer → **Stacks** → **Add stack**.
2. Name: `my-slides` (or your choice).
3. Build method: **Repository** (recommended) or **Web editor**.

#### Option A — Git repository (recommended)

| Field | Value |
|-------|--------|
| Repository URL | `https://github.com/<owner>/<repo>.git` |
| Repository reference | `refs/heads/main` |
| Compose path | `docker-compose.prod.yml` |
| Authentication | Add credentials if the repo is private |

Set **Stack root** / deployment path so relative volumes resolve correctly. The stack should run with working directory `/opt/my-slides` (or wherever you cloned).

#### Option B — Web editor

Paste the contents of [`docker-compose.prod.yml`](docker-compose.prod.yml). You still need the repo cloned on the host for `./courses`, `./public`, `./out`, and `./workspace` volume mounts.

---

### Registry in Portainer (private GHCR only)

1. Portainer → **Registries** → **Add registry**.
2. Provider: **Custom**.
3. Name: `GHCR`
4. Registry URL: `ghcr.io`
5. Username: your GitHub username
6. Password: GitHub PAT with `read:packages` scope

---

### Environment variables (.env via Portainer)

Do **not** commit `.env`. Copy [`.env.example`](.env.example) locally, fill in values, then load it in Portainer.

**In the stack UI:**

1. Scroll to **Environment variables**.
2. Either:
   - **Advanced mode** → paste key=value pairs, or
   - **Load variables from .env file** → upload your filled `.env`.

Required for a secure cloud deployment:

```env
SLIDES_IMAGE=ghcr.io/<owner>/<repo>:latest
GUI_AUTH_USERNAME=admin
GUI_AUTH_PASSWORD=<strong-password>
GUI_SESSION_SECRET=<random-long-string>
```

Required for the course creation pipeline (generic slides):

```env
OPENAI_API_KEY=sk-...
```

Optional — voice providers (use whichever you configure in the GUI):

```env
RUNPOD_API_KEY=
MINIMAX_API_KEY=
MINIMAX_GROUP_ID=
RESEMBLE_API_KEY=
```

Render tuning (optional; app auto-detects CPU if unset):

```env
REMOTION_CPU_RESERVE=1
REMOTION_CONCURRENCY=
```

Internal URLs (keep as-is for Docker networking):

```env
GENTLE_URL=http://gentle:8765
REMOTION_URL=http://remotion:3000
```

| Variable | Required | Notes |
|----------|----------|-------|
| `SLIDES_IMAGE` | Yes | Must match the GHCR image Actions publishes |
| `GUI_AUTH_PASSWORD` | Strongly recommended | Without it, the GUI has no login |
| `OPENAI_API_KEY` | Yes for planning/audio via OpenAI | Needed for Plan Course and OpenAI TTS |
| `RUNPOD_API_KEY` / `MINIMAX_*` | If using those providers | Set in GUI voice settings |

---

### Deploy and update the stack

1. Click **Deploy the stack**.
2. Wait for **gentle** to pass its healthcheck (can take 1–2 minutes on first boot).
3. Confirm **slides-app** is running.

**After a new image is pushed to GHCR:**

1. Portainer → your stack → **Pull and redeploy** (or **Update** with pull enabled).
2. Only the `app` and `remotion` containers need the new image; `gentle` uses the public `lowerquality/gentle` image.

Optional: enable **Webhook** on the stack and call it from a GitHub Actions step after push for automatic redeploy.

---

### Ports and access

| URL | Access |
|-----|--------|
| `http://<server-ip>:3001` | GUI (login if `GUI_AUTH_PASSWORD` is set) |
| `http://127.0.0.1:3000` on server | Remotion Studio — use SSH tunnel only |

SSH tunnel for Remotion preview:

```bash
ssh -L 3000:127.0.0.1:3000 user@<server-ip>
```

Then open `http://localhost:3000` locally.

Put a reverse proxy (Traefik, Caddy, nginx) in front of port 3001 for HTTPS in production.

---

## Part 3 — Cloud-optimized profile (optional)

For render-focused servers that do not need Remotion Studio in the stack, merge the cloud overlay when deploying manually on the host:

```bash
cd /opt/my-slides
export SLIDES_IMAGE=ghcr.io/<owner>/<repo>:latest
docker compose -f docker-compose.prod.yml -f docker-compose.cloud.yml up -d
```

In Portainer, if your edition supports multiple compose files, set:

- `docker-compose.prod.yml`
- `docker-compose.cloud.yml`

The cloud file disables the **remotion** service by default (`studio` profile) and tightens CPU reserve for batch renders.

---

## RunPod testing (host networking)

RunPod pods often need **host networking** so HTTP proxies can reach the GUI. Use the RunPod overlay (does not change Portainer/bridge deploys):

```bash
docker compose -f docker-compose.yml -f docker-compose.runpod.yml up -d --build
```

Or with a pulled image:

```bash
export SLIDES_IMAGE=ghcr.io/f2ka07/ai-video-animation:latest
docker compose -f docker-compose.prod.yml -f docker-compose.runpod.yml up -d
```

The overlay sets `network_mode: host` on **app**, **gentle**, and **remotion**, and points the app at Gentle via `http://127.0.0.1:8765`.

| Service | Host port |
|---------|-----------|
| GUI | 3001 |
| Remotion Studio | 3000 |
| Gentle | 8765 |

Open the GUI through RunPod’s **Connect** / HTTP proxy on port **3001**. Upload `.env` values on the pod (or export them in the shell before `docker compose up`).

Combine with cloud profile if you want auth + no Studio container:

```bash
docker compose -f docker-compose.yml -f docker-compose.cloud.yml -f docker-compose.runpod.yml up -d --build
```

---

## Part 4 — Using the pipeline after deploy

1. Open `http://<server>:3001` and sign in.
2. Create or select a course (generic slide-based courses work end-to-end).
3. Processing wizard:
   - **Step 1** — Generate segments
   - **Step 2** — Generate audio
   - **Step 3** — Measure audio
   - **Step 4** — Extract timings (uses Gentle in Docker)
   - **Step 5** — Diagram pipeline (Mermaid; skip for SVG scene courses)
4. **Render Video** or **Render Entire Course** — uses all available CPU threads (`/api/system-info` shows recommended concurrency).
5. Download MP4s from `out/<course-id>/` on the host or via the GUI `/out` route.

CLI on the server (inside the app container or host with Node):

```bash
docker exec -it slides-app npx tsx scripts/renderAllModules.ts \
  --course=your-course-id --preset=fast
```

---

## Part 5 — Troubleshooting

### Stack stuck waiting for Gentle

Gentle can take up to two minutes to become healthy on first start. Check logs:

```bash
docker logs slides-gentle
```

### GUI returns 401

Set `GUI_AUTH_PASSWORD` in the Portainer stack env and redeploy. Clear browser session storage or use a private window after changing the password.

### Cannot pull image from GHCR

- Verify `SLIDES_IMAGE` matches the package path exactly (lowercase owner/repo).
- For private packages, confirm the Portainer registry credentials and PAT scopes.

### Render is slow or OOM

- Increase host CPU/RAM.
- Set `REMOTION_CPU_RESERVE=1` on large machines.
- Ensure `shm_size: 2gb` is present on the `app` service (already in `docker-compose.prod.yml`).

### Wizard Step 4 fails

Confirm `GENTLE_URL=http://gentle:8765` and that the `slides-gentle` container is healthy on the same Docker network (`slides-network`).

### Course content missing after deploy

Volumes mount `./courses` from the host clone. Run `git pull` in `/opt/my-slides` on the server when the activated course changes in the repo, then redeploy if needed. Image updates do not replace mounted course files.

Only the **activated** course folder is tracked in git. Archived courses stay on your dev machine but are detached from deploy.

---

## Course deploy policy (active vs archived)

Only the **activated** course (the one in `src/videos/moduleContent.ts`) is deployable to git. Archived courses are detached from the runtime and git index.

| Action | What happens |
|--------|----------------|
| **Activate** course | `.gitignore` whitelists `courses/<id>/` and `public/audio/<id>/`; other course folders are ignored |
| **Archive** course | Removes `public/audio/<id>/`, `public/assets/<id>/`; clears Remotion state if it was activated; prunes course from git index |
| **Restore** archived course | Re-activates and sets it as the only deployable course |

Before committing or pushing:

```bash
npm run sync:deploy-policy -- --prune-git
```

CI runs `node scripts/syncCourseDeployPolicy.js --check` on every build to ensure only one course folder is tracked.

**Local archived courses** remain in `courses/` on disk for history, but they are not pushed to the server. To work on an archived course again, use **Restore** in the GUI.

---

## Part 6 — What stays out of git

Already ignored (see [`.gitignore`](.gitignore)):

- `.env` / `.env.local`
- `out/` (renders)
- `workspace/logs/`
- Most `public/audio/*` (except whitelisted course folders you choose to track)

Keep API keys only in Portainer’s environment / uploaded `.env`.

---

## Quick reference

```bash
# On server — update course content from git
cd /opt/my-slides && git pull origin main

# On server — manual pull of latest image (if not using Portainer UI)
export SLIDES_IMAGE=ghcr.io/<owner>/<repo>:latest
docker compose -f docker-compose.prod.yml pull app
docker compose -f docker-compose.prod.yml up -d

# Health check
curl http://localhost:3001/api/health
curl http://localhost:3001/api/system-info
```

**Typical release flow:** merge to `main` → Actions pushes image → Portainer **Pull and redeploy** → verify GUI on port 3001.
