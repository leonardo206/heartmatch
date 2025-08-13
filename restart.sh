#!/bin/bash

echo "🔄 Restarting HeartMatch application..."

# Kill existing processes
echo "🛑 Stopping existing processes..."
pkill -f "node server.js" 2>/dev/null
pkill -f "expo start" 2>/dev/null
pkill -f "npm start" 2>/dev/null

# Wait a moment for processes to stop
sleep 2

# Start backend
echo "🚀 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "📱 Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Application restarted!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both applications"

# Wait for user to stop
wait
