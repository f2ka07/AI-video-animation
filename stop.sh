#!/bin/bash
# Stop script for My Slides Desktop Application (Mac/Linux)

echo "Stopping My Slides Desktop Application..."
echo ""

docker-compose down

if [ $? -eq 0 ]; then
    echo "Application stopped successfully"
else
    echo "Error stopping application"
    exit 1
fi
