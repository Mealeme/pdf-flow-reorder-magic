#!/bin/bash

# Backend Deployment Script for PDF Flow Reorder Magic
# This script deploys the Node.js backend to the server

set -e  # Exit on any error

echo "🚀 Starting backend deployment process..."

# Configuration
PROJECT_DIR="/var/www/pdf-flow-reorder-magic"
REPO_URL="https://github.com/Mealeme/pdf-flow-reorder-magic.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Pull latest changes
print_status "Pulling latest changes..."
git pull origin "$BRANCH"

# Install backend dependencies
print_status "Installing backend dependencies..."
npm install --production

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Stop existing PM2 process if running
print_status "Stopping existing backend process..."
pm2 stop pdf-flow-backend 2>/dev/null || true
pm2 delete pdf-flow-backend 2>/dev/null || true

# Start backend with PM2
print_status "Starting backend with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Show PM2 status
print_status "Backend deployment status:"
pm2 status

print_status "✅ Backend deployment completed successfully!"
print_status "Backend is running on port 3000 and managed by PM2"

# Show deployment info
echo ""
echo "📊 Backend Deployment Summary:"
echo "  - Repository: $REPO_URL"
echo "  - Branch: $BRANCH"
echo "  - Deploy time: $(date)"
echo "  - Process Manager: PM2"
echo "  - Backend URL: http://localhost:3000"
echo ""