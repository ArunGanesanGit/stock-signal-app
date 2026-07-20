#!/bin/bash

# Kill all node processes
echo "🛑 Killing all node/npm processes..."
killall -9 node npm 2>/dev/null

# Also try more aggressive approach
pkill -f "node" 2>/dev/null
pkill -f "npm" 2>/dev/null

echo "✅ All processes killed"
echo "💡 Tip: Run './start.sh' to start the app"
