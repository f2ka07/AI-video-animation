#!/bin/bash
# Stop My Slides - Docker containers + host processes on 3000/3001

echo "Stopping My Slides..."
echo ""

stop_port() {
	local port=$1
	if ! command -v lsof &>/dev/null; then
		return
	fi
	local pids
	pids=$(lsof -ti :"$port" 2>/dev/null || true)
	if [ -z "$pids" ]; then
		echo "  Port ${port}: nothing listening"
		return
	fi
	for pid in $pids; do
		kill -9 "$pid" 2>/dev/null && echo "  Port ${port}: stopped PID $pid"
	done
}

echo "Stopping host processes..."
stop_port 3001
stop_port 3000

echo ""
echo "Stopping Docker containers..."
if command -v docker &>/dev/null; then
	docker-compose down 2>/dev/null && echo "  Docker containers stopped" || echo "  Docker not running or already stopped"
else
	echo "  Docker not installed"
fi

echo ""
echo "Done. Ports 3000 (Remotion) and 3001 (GUI) should be free."
