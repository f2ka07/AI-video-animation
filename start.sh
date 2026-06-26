#!/usr/bin/env bash
# One-command server bootstrap: Docker, stack, course activation, health checks.
#
# Usage:
#   ./start.sh
#   SLIDES_COURSE_ID=my-course ./start.sh
#   USE_HOST_NETWORK=1 ./start.sh          # RunPod / host networking
#   INSTALL_DOCKER=1 ./start.sh            # Install Docker if missing (Ubuntu)
#   SLIDES_IMAGE=ghcr.io/f2ka07/ai-video-animation:latest ./start.sh  # Pull image
#
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# --- config (override via environment or .env) ---
if [[ -f .env ]]; then
	set -a
	# shellcheck disable=SC1091
	source .env
	set +a
fi

SLIDES_COURSE_ID="${SLIDES_COURSE_ID:-network-automation-program-networks}"
INSTALL_DOCKER="${INSTALL_DOCKER:-0}"
USE_HOST_NETWORK="${USE_HOST_NETWORK:-0}"
SKIP_ACTIVATE="${SKIP_ACTIVATE:-0}"
GUI_PORT="${GUI_PORT:-3001}"
COMPOSE_CMD=(docker compose)

log() { echo "[start.sh] $*"; }
warn() { echo "[start.sh] WARNING: $*" >&2; }
die() { echo "[start.sh] ERROR: $*" >&2; exit 1; }

docker_cmd() {
	if docker info &>/dev/null; then
		docker "$@"
	elif sudo docker info &>/dev/null; then
		sudo docker "$@"
	else
		die "Docker daemon is not running. Start Docker or run: sudo systemctl start docker"
	fi
}

compose() {
	if docker info &>/dev/null; then
		docker compose "$@"
	else
		sudo docker compose "$@"
	fi
}

# --- 1. Install Docker (optional) ---
install_docker_ubuntu() {
	if command -v docker &>/dev/null && docker compose version &>/dev/null 2>&1; then
		return 0
	fi
	log "Installing Docker (Ubuntu/Debian via get.docker.com)..."
	curl -fsSL https://get.docker.com | sudo sh
	sudo usermod -aG docker "$USER" 2>/dev/null || true
	log "Docker installed. If 'docker' permission denied, run: newgrp docker  (or log out/in)"
}

if ! command -v docker &>/dev/null; then
	if [[ "$INSTALL_DOCKER" == "1" ]] || [[ -f /etc/os-release ]]; then
		install_docker_ubuntu
	else
		die "Docker not found. Install Docker or run: INSTALL_DOCKER=1 ./start.sh"
	fi
fi

if ! docker compose version &>/dev/null 2>&1 && ! sudo docker compose version &>/dev/null 2>&1; then
	die "docker compose plugin not found. Re-run with INSTALL_DOCKER=1 or install docker-compose-plugin"
fi

docker_cmd info >/dev/null || die "Cannot connect to Docker daemon"

# --- 2. Prepare directories and env ---
log "Preparing directories..."
mkdir -p \
	public/timings \
	public/audio \
	public/assets \
	out \
	workspace/config \
	workspace/logs \
	courses

touch courses/.gitkeep 2>/dev/null || true

if [[ ! -f .env ]]; then
	if [[ -f .env.example ]]; then
		cp .env.example .env
		warn "Created .env from .env.example — add API keys before using audio/planning features"
	else
		warn "No .env file — using defaults only"
	fi
fi

# Sensible defaults for small vCPU instances (append if missing)
ensure_env_default() {
	local key="$1"
	local value="$2"
	if [[ -f .env ]] && ! grep -q "^${key}=" .env; then
		echo "${key}=${value}" >> .env
		log "Added default to .env: ${key}=${value}"
	fi
}
ensure_env_default "REMOTION_CPU_RESERVE" "0"
ensure_env_default "SLIDES_COURSE_ID" "$SLIDES_COURSE_ID"

# Reload .env after possible edits
if [[ -f .env ]]; then
	set -a
	# shellcheck disable=SC1091
	source .env
	set +a
fi
SLIDES_COURSE_ID="${SLIDES_COURSE_ID:-network-automation-program-networks}"

# Do not overwrite a course already activated in moduleContent.ts (common dev mistake).
if [[ -f src/videos/moduleContent.ts ]]; then
	MC_COURSE=$(grep -m1 'courseId:' src/videos/moduleContent.ts | sed -n 's/.*"\([^"]*\)".*/\1/p')
	if [[ -n "${MC_COURSE}" && "${MC_COURSE}" != "${SLIDES_COURSE_ID}" ]]; then
		warn "SLIDES_COURSE_ID=${SLIDES_COURSE_ID} but moduleContent.ts is ${MC_COURSE} — activating ${MC_COURSE}"
		SLIDES_COURSE_ID="${MC_COURSE}"
	fi
fi

if [[ ! -d "courses/${SLIDES_COURSE_ID}" ]]; then
	die "Course not found: courses/${SLIDES_COURSE_ID}/ — set SLIDES_COURSE_ID or clone the course content"
fi

# --- 3. Compose files ---
COMPOSE_ARGS=(-f docker-compose.yml -f docker-compose.cloud.yml)
if [[ "$USE_HOST_NETWORK" == "1" ]]; then
	COMPOSE_ARGS+=(-f docker-compose.runpod.yml)
	log "Using host networking (RunPod profile)"
fi

# --- 4. Start stack ---
USE_REGISTRY_IMAGE=0
if [[ -n "${SLIDES_IMAGE:-}" ]] && [[ "${SLIDES_IMAGE}" == ghcr.io/* ]]; then
	USE_REGISTRY_IMAGE=1
	COMPOSE_ARGS=(-f docker-compose.prod.yml -f docker-compose.cloud.yml)
	[[ "$USE_HOST_NETWORK" == "1" ]] && COMPOSE_ARGS+=(-f docker-compose.runpod.yml)
	export SLIDES_IMAGE
	log "Pulling production image: $SLIDES_IMAGE"
	compose "${COMPOSE_ARGS[@]}" pull app || warn "Image pull failed — falling back to local build"
fi

if [[ "$USE_REGISTRY_IMAGE" == "1" ]] && docker_cmd image inspect "${SLIDES_IMAGE}" &>/dev/null; then
	log "Starting production stack (app + gentle from registry)..."
	compose "${COMPOSE_ARGS[@]}" up -d
else
	log "Starting local Docker helpers (Gentle only; GUI runs on host — not containerized)..."
	compose "${COMPOSE_ARGS[@]}" pull gentle || warn "Gentle pull failed — is Docker running?"
	compose "${COMPOSE_ARGS[@]}" up -d gentle
fi

# --- 5. Wait for Gentle + GUI ---
log "Waiting for Gentle (up to 3 min)..."
for i in $(seq 1 36); do
	if docker_cmd inspect slides-gentle --format '{{.State.Health.Status}}' 2>/dev/null | grep -q healthy; then
		log "Gentle is healthy"
		break
	fi
	if [[ "$i" -eq 36 ]]; then
		warn "Gentle healthcheck slow — continuing anyway"
	fi
	sleep 5
done

log "Waiting for GUI on port ${GUI_PORT}..."
if [[ "$USE_REGISTRY_IMAGE" == "1" ]]; then
	for i in $(seq 1 30); do
		if curl -sf "http://127.0.0.1:${GUI_PORT}/api/health" >/dev/null 2>&1; then
			log "GUI is ready"
			break
		fi
		if [[ "$i" -eq 30 ]]; then
			die "GUI did not start. Check: docker logs slides-app"
		fi
		sleep 2
	done
else
	if curl -sf "http://127.0.0.1:${GUI_PORT}/api/health" >/dev/null 2>&1; then
		log "GUI already running on host"
	else
		log "Starting GUI on host (npm run gui)..."
		nohup npm run gui > workspace/logs/gui.log 2>&1 &
		for i in $(seq 1 30); do
			if curl -sf "http://127.0.0.1:${GUI_PORT}/api/health" >/dev/null 2>&1; then
				log "GUI is ready"
				break
			fi
			if [[ "$i" -eq 30 ]]; then
				warn "GUI did not start in time — run: npm run gui"
			fi
			sleep 2
		done
	fi
fi

# --- 6. Activate course (timings, SVGs, moduleContent, Remotion modules) ---
if [[ "$SKIP_ACTIVATE" != "1" ]]; then
	log "Activating course: ${SLIDES_COURSE_ID} (timings, assets, Remotion modules)..."
	if [[ "$USE_REGISTRY_IMAGE" == "1" ]]; then
		if ! docker_cmd exec slides-app npx tsx scripts/activateCourse.ts "${SLIDES_COURSE_ID}"; then
			die "Course activation failed. Check: docker logs slides-app"
		fi
	else
		if ! npx tsx scripts/activateCourse.ts "${SLIDES_COURSE_ID}"; then
			die "Course activation failed on host"
		fi
	fi
	log "Course activated"
else
	log "Skipping activation (SKIP_ACTIVATE=1)"
fi

# --- 7. Verify runtime assets ---
log "Verifying runtime assets..."
TIMING_COUNT=$(find public/timings -maxdepth 1 -name '*.json' 2>/dev/null | wc -l | tr -d ' ')
AUDIO_COUNT=$(find "public/audio/${SLIDES_COURSE_ID}" -maxdepth 1 -name '*.wav' 2>/dev/null | wc -l | tr -d ' ')
ASSET_DIR="public/assets/${SLIDES_COURSE_ID}"
SVG_COUNT=$(find "$ASSET_DIR" -name '*.svg' 2>/dev/null | wc -l | tr -d ' ')
if [[ "$TIMING_COUNT" -eq 0 ]]; then
	warn "No files in public/timings/ — diagrams will not sync to narration"
fi
if [[ "$AUDIO_COUNT" -eq 0 ]]; then
	warn "No audio in public/audio/${SLIDES_COURSE_ID}/ — git pull or generate audio in the GUI (Step 2)"
fi
if [[ ! -d "$ASSET_DIR" ]] || [[ "$SVG_COUNT" -eq 0 ]]; then
	if [[ "$USE_REGISTRY_IMAGE" == "1" ]]; then
		die "No SVG assets in ${ASSET_DIR} — run: docker exec slides-app npx tsx scripts/copySvgsToPublic.ts ${SLIDES_COURSE_ID}"
	else
		die "No SVG assets in ${ASSET_DIR} — run: npx tsx scripts/copySvgsToPublic.ts ${SLIDES_COURSE_ID}"
	fi
fi
log "Found ${SVG_COUNT} SVG files in ${ASSET_DIR}"

# --- 8. System info ---
SYSTEM_INFO=$(curl -sf "http://127.0.0.1:${GUI_PORT}/api/system-info" 2>/dev/null || echo '{}')
PUBLIC_IP=""
if curl -sf --max-time 1 http://169.254.169.254/latest/meta-data/public-ipv4 &>/dev/null; then
	PUBLIC_IP=$(curl -sf http://169.254.169.254/latest/meta-data/public-ipv4)
else
	PUBLIC_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
fi

echo ""
echo "========================================"
echo "  Skilleo AI is ready"
echo "========================================"
echo ""
echo "  Course:     ${SLIDES_COURSE_ID}"
echo "  Timings:    ${TIMING_COUNT} json files in public/timings/"
echo "  SVG assets: ${SVG_COUNT} files in ${ASSET_DIR}"
echo "  Audio:      ${AUDIO_COUNT} wav files"
echo "  System:     ${SYSTEM_INFO}"
echo ""
if [[ -n "$PUBLIC_IP" ]]; then
	echo "  GUI:        http://${PUBLIC_IP}:${GUI_PORT}/"
	echo "  Wizard:     http://${PUBLIC_IP}:${GUI_PORT}/processing-wizard.html?course=${SLIDES_COURSE_ID}"
	echo "  Videos:     http://${PUBLIC_IP}:${GUI_PORT}/out/${SLIDES_COURSE_ID}/"
else
	echo "  GUI:        http://localhost:${GUI_PORT}/"
fi
echo ""
if [[ "$USE_REGISTRY_IMAGE" == "1" ]]; then
	echo "  Logs:       docker logs -f slides-app"
	echo "  Stop:       docker compose -f docker-compose.prod.yml down"
	echo "  Re-activate: docker exec slides-app npx tsx scripts/activateCourse.ts ${SLIDES_COURSE_ID}"
	echo ""
	echo "  Render one module:"
	echo "    docker exec slides-app npx remotion render src/index.tsx module-1 \\"
	echo "      /app/out/${SLIDES_COURSE_ID}/module-1.mp4 --concurrency=1 --timeout=120000"
else
	echo "  Logs:       tail -f workspace/logs/gui.log"
	echo "  Stop:       docker compose down  (Gentle only; stop GUI separately)"
	echo "  Re-activate: npx tsx scripts/activateCourse.ts ${SLIDES_COURSE_ID}"
fi
echo "========================================"
