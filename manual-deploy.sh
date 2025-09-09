#!/bin/bash

# Simple Manual Deployment Script for newmicro.live
# Run this script on your server to deploy changes manually

echo "🚀 Manual Deployment for newmicro.live"
echo "======================================"

# Configuration
PROJECT_DIR="/var/www/pdf-flow-reorder-magic"
WEB_DIR="/var/www/html"
REPO_URL="https://github.com/Mealeme/pdf-flow-reorder-magic.git"

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

# Check if we're in the right directory
if [ ! -d "$PROJECT_DIR" ]; then
    print_info "Creating project directory..."
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown $USER:$USER "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# Check if this is a git repository
if [ ! -d ".git" ]; then
    print_info "Cloning repository for the first time..."
    git clone "$REPO_URL" .
else
    print_info "Pulling latest changes from GitHub..."
    git pull origin main
fi

# Install dependencies
print_info "Installing/updating dependencies..."
npm install

# Build the project
print_info "Building the project..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed! No dist directory found."
    exit 1
fi

# Create backup of current site
if [ -d "$WEB_DIR" ]; then
    print_info "Creating backup of current site..."
    sudo cp -r "$WEB_DIR" "${WEB_DIR}.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
fi

# Deploy to web directory
print_info "Deploying to web directory..."
sudo mkdir -p "$WEB_DIR"
sudo cp -r dist/* "$WEB_DIR/"

# Set proper permissions
print_info "Setting proper permissions..."
sudo chown -R www-data:www-data "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"

# Restart web server
print_info "Restarting web server..."
if systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    print_status "Nginx reloaded successfully"
elif systemctl is-active --quiet apache2; then
    sudo systemctl reload apache2
    print_status "Apache reloaded successfully"
else
    print_warning "No web server found running"
fi

# Clean up old backups (keep only last 3)
print_info "Cleaning up old backups..."
sudo find /var/www -name "html.backup.*" -type d | sort | head -n -3 | sudo xargs rm -rf 2>/dev/null || true

echo ""
echo "🎉 Deployment completed successfully!"
echo "======================================"
echo "🌐 Your site is now live at: https://newmicro.live"
echo "📅 Deployed at: $(date)"
echo ""

# Show deployment summary
echo "📊 Deployment Summary:"
echo "  - Source: GitHub repository"
echo "  - Build: npm run build"
echo "  - Web directory: $WEB_DIR"
echo "  - Files deployed: $(find $WEB_DIR -type f | wc -l) files"
echo ""
