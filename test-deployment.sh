#!/bin/bash

# Test Deployment Script
# This script tests if the deployment is working correctly

echo "🧪 Testing deployment..."

# Configuration
WEB_DIR="/var/www/html"
SITE_URL="https://newmicro.live"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test 1: Check if web directory exists
if [ -d "$WEB_DIR" ]; then
    print_status "Web directory exists: $WEB_DIR"
else
    print_error "Web directory not found: $WEB_DIR"
    exit 1
fi

# Test 2: Check if index.html exists
if [ -f "$WEB_DIR/index.html" ]; then
    print_status "index.html found"
else
    print_error "index.html not found in web directory"
    exit 1
fi

# Test 3: Check if assets directory exists
if [ -d "$WEB_DIR/assets" ]; then
    print_status "Assets directory found"
else
    print_warning "Assets directory not found"
fi

# Test 4: Check Nginx status
if systemctl is-active --quiet nginx; then
    print_status "Nginx is running"
else
    print_error "Nginx is not running"
    echo "Try: sudo systemctl start nginx"
fi

# Test 5: Check if site is accessible
echo "Testing site accessibility..."
if curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
    print_status "Site is accessible at $SITE_URL"
else
    print_error "Site is not accessible at $SITE_URL"
    echo "Check Nginx configuration and firewall settings"
fi

# Test 6: Check file permissions
if [ -r "$WEB_DIR/index.html" ]; then
    print_status "Web files are readable"
else
    print_error "Web files are not readable"
    echo "Try: sudo chown -R www-data:www-data $WEB_DIR"
fi

echo ""
echo "📊 Deployment Test Summary:"
echo "  - Web directory: $WEB_DIR"
echo "  - Site URL: $SITE_URL"
echo "  - Test time: $(date)"
echo ""

# Show recent files
echo "📁 Recent files in web directory:"
ls -la "$WEB_DIR" | head -10
