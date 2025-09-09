#!/bin/bash

# Deploy from Local Computer to Server
# This script builds locally and uploads to your server

echo "🚀 Deploy from Local Computer to newmicro.live"
echo "=============================================="

# Configuration - UPDATE THESE VALUES
SERVER_IP="your_server_ip"  # Replace with your server IP
SERVER_USER="your_username"  # Replace with your server username
SERVER_PATH="/var/www/html"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Check if configuration is set
if [ "$SERVER_IP" = "your_server_ip" ] || [ "$SERVER_USER" = "your_username" ]; then
    print_error "Please update the SERVER_IP and SERVER_USER variables in this script first!"
    echo ""
    echo "Edit this file and change:"
    echo "  SERVER_IP=\"your_server_ip\"     → SERVER_IP=\"13.200.77.118\""
    echo "  SERVER_USER=\"your_username\"    → SERVER_USER=\"ubuntu\""
    exit 1
fi

# Build the project locally
print_info "Building project locally..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed! No dist directory found."
    exit 1
fi

print_status "Build completed successfully"

# Create backup on server
print_info "Creating backup on server..."
ssh $SERVER_USER@$SERVER_IP "sudo cp -r $SERVER_PATH ${SERVER_PATH}.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"

# Upload files to server
print_info "Uploading files to server..."
rsync -avz --delete dist/ $SERVER_USER@$SERVER_IP:$SERVER_PATH/

# Set permissions on server
print_info "Setting permissions on server..."
ssh $SERVER_USER@$SERVER_IP "sudo chown -R www-data:www-data $SERVER_PATH && sudo chmod -R 755 $SERVER_PATH"

# Restart web server
print_info "Restarting web server..."
ssh $SERVER_USER@$SERVER_IP "sudo systemctl reload nginx"

print_status "Deployment completed successfully!"
echo ""
echo "🎉 Your site is now live at: https://newmicro.live"
echo "📅 Deployed at: $(date)"
echo ""
