#!/bin/bash
# Start both Remotion Studio and GUI Server (Mac/Linux)

echo "Starting My Slides Application..."
echo ""

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    exit 1
fi

# Start Docker containers
echo "Starting Docker containers..."

# Remove old network if it exists and has issues
docker network rm my-slides_slides-network 2>/dev/null || true

# Try to start containers
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Network recreation needed, cleaning up..."
    docker-compose down 2>/dev/null || true
    docker network rm my-slides_slides-network 2>/dev/null || true
    echo "Retrying..."
    docker-compose up -d
    
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to start containers"
        exit 1
    fi
fi

echo "Waiting for services to be ready..."
sleep 5

# Start Remotion Studio in background
echo "Starting Remotion Studio..."
npm start > remotion.log 2>&1 &
REMOTION_PID=$!

# Start GUI Server in background
echo "Starting GUI Server..."
npm run gui > gui.log 2>&1 &
GUI_PID=$!

echo ""
echo "Services starting..."
echo "GUI: http://localhost:3001"
echo "Remotion Studio: http://localhost:3000"
echo ""
echo "Opening GUI in browser..."

sleep 3
if command -v open &> /dev/null; then
    open http://localhost:3001
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3001
fi

echo ""
echo "Both services are running."
echo "Remotion Studio PID: $REMOTION_PID"
echo "GUI Server PID: $GUI_PID"
echo ""
echo "To stop: kill $REMOTION_PID $GUI_PID"
