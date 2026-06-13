#!/bin/bash
# Desktop Launcher for My Slides (Mac/Linux)
# This script starts the Docker containers and opens the app in your browser

echo "Starting My Slides Desktop Application..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not in PATH"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "ERROR: Docker Desktop is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo "Docker is running. Starting containers..."

# Remove old network if it exists and has issues
docker network rm my-slides_slides-network 2>/dev/null || true

# Start containers
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

echo ""
echo "Waiting for application to be ready..."

# Wait for the app to be ready (check if port 3000 is responding)
max_attempts=30
attempt=0
ready=false

while [ $attempt -lt $max_attempts ] && [ "$ready" = false ]; do
    sleep 2
    attempt=$((attempt + 1))
    
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        ready=true
    else
        echo -n "."
    fi
done

echo ""

if [ "$ready" = true ]; then
    echo "Application is ready!"
    echo ""
    echo "Opening in your default browser..."
    echo "GUI: http://localhost:3001 (Video Creator)"
    echo "Remotion Studio: http://localhost:3000 (Preview)"
    echo ""
    echo "To stop the application, press Ctrl+C or run: docker-compose down"
    echo ""
    
    # Open browser to GUI (works on Mac and most Linux distros)
    sleep 2
    if command -v open &> /dev/null; then
        # macOS
        open http://localhost:3001
    elif command -v xdg-open &> /dev/null; then
        # Linux
        xdg-open http://localhost:3001
    else
        echo "Please open http://localhost:3001 in your browser"
    fi
    
    # Keep script running and show logs
    echo "Application is running. Press Ctrl+C to stop..."
    docker-compose logs -f app
else
    echo ""
    echo "WARNING: Application did not become ready in time"
    echo "You can check the status with: docker-compose ps"
    echo "Or view logs with: docker-compose logs app"
    echo ""
    echo "Trying to open browser anyway..."
    if command -v open &> /dev/null; then
        open http://localhost:3000
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3000
    fi
fi
