#!/bin/bash
# Stop My Slides - Docker containers + host processes on 3000/3001

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "Stopping My Slides..."
echo ""

kill_pid() {
	local pid=$1
	local port=$2
	if kill -9 "$pid" 2>/dev/null; then
		echo "  Port ${port}: stopped PID $pid"
	elif taskkill.exe //F //PID "$pid" >/dev/null 2>&1; then
		echo "  Port ${port}: stopped PID $pid (taskkill)"
	else
		echo "  Port ${port}: could not stop PID $pid"
	fi
}

stop_port_lsof() {
	local port=$1
	local pids
	pids=$(lsof -ti :"$port" 2>/dev/null || true)
	if [ -z "$pids" ]; then
		return 1
	fi
	for pid in $pids; do
		kill_pid "$pid" "$port"
	done
	return 0
}

stop_port_netstat() {
	local port=$1
	local pids=""
	if command -v netstat.exe &>/dev/null; then
		pids=$(netstat.exe -ano 2>/dev/null | grep ":${port} " | grep LISTENING | awk '{print $NF}' | sort -u)
	elif command -v netstat &>/dev/null; then
		pids=$(netstat -ano 2>/dev/null | grep ":${port} " | grep LISTENING | awk '{print $NF}' | sort -u)
	fi
	if [ -z "$pids" ]; then
		return 1
	fi
	for pid in $pids; do
		[ "$pid" = "0" ] && continue
		kill_pid "$pid" "$port"
	done
	return 0
}

stop_port() {
	local port=$1
	if command -v lsof &>/dev/null && stop_port_lsof "$port"; then
		return
	fi
	if stop_port_netstat "$port"; then
		return
	fi
	echo "  Port ${port}: nothing listening"
}

echo "Stopping host processes..."
stop_port 3001
stop_port 3000

echo ""
echo "Stopping Docker containers..."

compose_down() {
	local files=(-f docker-compose.yml)
	if [ -f docker-compose.cloud.yml ]; then
		files+=(-f docker-compose.cloud.yml)
	fi
	if [ "${USE_HOST_NETWORK:-0}" = "1" ] && [ -f docker-compose.runpod.yml ]; then
		files+=(-f docker-compose.runpod.yml)
	fi
	if [ -n "${SLIDES_IMAGE:-}" ] && [ -f docker-compose.prod.yml ]; then
		files=(-f docker-compose.prod.yml -f docker-compose.cloud.yml)
		[ "${USE_HOST_NETWORK:-0}" = "1" ] && [ -f docker-compose.runpod.yml ] && files+=(-f docker-compose.runpod.yml)
	fi

	if docker compose version &>/dev/null 2>&1; then
		docker compose "${files[@]}" down --remove-orphans 2>/dev/null && return 0
	fi
	if command -v docker-compose &>/dev/null; then
		docker-compose "${files[@]}" down --remove-orphans 2>/dev/null && return 0
	fi
	return 1
}

if [ -f .env ]; then
	set -a
	# shellcheck disable=SC1091
	source .env
	set +a
fi

if command -v docker &>/dev/null; then
	if compose_down; then
		echo "  Docker containers stopped"
	else
		echo "  Docker not running or already stopped"
	fi
else
	echo "  Docker not installed"
fi

echo ""
echo "Done. Ports 3000 (Remotion) and 3001 (GUI) should be free."
echo "On Windows, you can also run: .\\stop.ps1"
