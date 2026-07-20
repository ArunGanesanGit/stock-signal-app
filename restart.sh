#!/bin/bash

# Stock Signal App Restart Script
# Kills all running processes and starts the app fresh

echo "🛑 Stopping all running processes..."
killall node npm 2>/dev/null
sleep 2

echo "🔄 Clearing any stale locks..."
rm -f /tmp/backend.log /tmp/frontend.log

echo "🚀 Starting the app..."
npm start &

echo "⏳ Waiting for servers to start..."
sleep 6

echo "✅ App restarted!"
echo "📊 Backend: http://localhost:5001"
echo "🎨 Frontend: http://localhost:3003 (or next available port)"
echo ""
echo "Press Ctrl+C to stop the app"
wait
