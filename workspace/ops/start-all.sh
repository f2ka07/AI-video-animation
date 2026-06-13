#!/bin/bash
# Start Remotion Studio (3000) + GUI Server (3001) on the host
# Does NOT start Docker app/remotion containers (avoids port conflicts).
# For Docker-only mode, use launch.sh instead.
# Gentle (word timings) optional: docker-compose up -d gentle

echo "Starting My Slides (host mode)..."
echo ""

port_in_use() {
	local port=$1
	if command -v netstat &>/dev/null; then
		netstat -ano 2>/dev/null | grep -q ":${port} .*LISTENING"
	elif command -v ss &>/dev/null; then
		ss -ltn 2>/dev/null | grep -q ":${port} "
	else
		return 1
	fi
}

if port_in_use 3001; then
	echo "WARNING: Port 3001 is already in use."
	echo "  http://localhost:3001 should be the GUI (Skilleo AI), not Remotion."
	echo ""
fi

if port_in_use 3000; then
	echo "NOTE: Port 3000 is already in use (Remotion may already be running)."
	echo ""
fi

# Optional: Gentle for word timings
if command -v docker &>/dev/null && docker info &>/dev/null 2>&1; then
	echo "Starting Gentle container (word timings)..."
	docker-compose up -d gentle 2>/dev/null || true
fi

echo "Starting GUI Server on http://localhost:3001 ..."
npm run gui > gui.log 2>&1 &
GUI_PID=$!

sleep 2

echo "Starting Remotion Studio on http://localhost:3000 ..."
npm start > remotion.log 2>&1 &
REMOTION_PID=$!

echo ""
echo "Services starting..."
echo "  GUI (Skilleo AI):  http://localhost:3001"
echo "  Remotion Studio:   http://localhost:3000"
echo ""
echo "Verify GUI: curl http://localhost:3001/api/health"
echo ""

sleep 3
if command -v open &>/dev/null; then
	open http://localhost:3001
elif command -v xdg-open &>/dev/null; then
	xdg-open http://localhost:3001
fi

echo "GUI PID: $GUI_PID"
echo "Remotion PID: $REMOTION_PID"
echo "To stop: kill $GUI_PID $REMOTION_PID"
echo "Or run: ./stop.sh"
