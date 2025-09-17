#!/bin/bash

# PDF Flow Reorder Magic - Deployment Script
# This script automates the deployment process to your production server

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Configuration
PROJECT_DIR="/var/www/pdf-flow-reorder-magic"
WEB_DIR="/var/www/html"
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

# Create project directory if it doesn't exist
if [ ! -d "$PROJECT_DIR" ]; then
    print_status "Creating project directory: $PROJECT_DIR"
    sudo mkdir -p "$PROJECT_DIR"
    sudo chown $USER:$USER "$PROJECT_DIR"
fi

# Navigate to project directory
cd "$PROJECT_DIR"

# Clone repository if it doesn't exist
if [ ! -d ".git" ]; then
    print_status "Cloning repository..."
    git clone "$REPO_URL" .
else
    print_status "Pulling latest changes..."
    git pull origin "$BRANCH"
fi

# Install/update dependencies
print_status "Installing dependencies (including dev tools)..."
# Ensure devDependencies are installed so Vite is available
npm install

# Build the project
print_status "Building project..."
npm run build

# Backup current web files (optional)
if [ -d "$WEB_DIR" ]; then
    print_status "Creating backup of current web files..."
    sudo cp -r "$WEB_DIR" "${WEB_DIR}.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
fi

# Copy built files to web directory
print_status "Copying built files to web directory..."
sudo mkdir -p "$WEB_DIR"
sudo cp -r dist/* "$WEB_DIR/"

# Set proper permissions
print_status "Setting proper permissions..."
sudo chown -R www-data:www-data "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"

# Restart web server
print_status "Restarting web server..."
if systemctl is-active --quiet nginx; then
    sudo systemctl reload nginx
    print_status "Nginx reloaded successfully"
elif systemctl is-active --quiet apache2; then
    sudo systemctl reload apache2
    print_status "Apache reloaded successfully"
else
    print_warning "No web server found running (nginx/apache2)"
fi

# Clean up old backups (keep only last 5)
print_status "Cleaning up old backups..."
sudo find /var/www -name "html.backup.*" -type d | sort | head -n -5 | sudo xargs rm -rf 2>/dev/null || true

print_status "✅ Deployment completed successfully!"
print_status "Your site should now be live at: https://newmicro.live"

# Show deployment info
echo ""
echo "📊 Deployment Summary:"
echo "  - Repository: $REPO_URL"
echo "  - Branch: $BRANCH"
echo "  - Build time: $(date)"
echo "  - Web directory: $WEB_DIR"
echo ""
