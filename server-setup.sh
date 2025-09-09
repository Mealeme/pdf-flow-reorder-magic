#!/bin/bash

# Server Setup Script for PDF Flow Reorder Magic
# Run this script on your server (13.200.77.118) to set up the environment

set -e

echo "🔧 Setting up server for PDF Flow Reorder Magic..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
print_status "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
print_status "Installing Git..."
sudo apt install -y git

# Install Nginx
print_status "Installing Nginx..."
sudo apt install -y nginx

# Install PM2 for process management (optional)
print_status "Installing PM2..."
sudo npm install -g pm2

# Create project directory
print_status "Creating project directories..."
sudo mkdir -p /var/www/pdf-flow-reorder-magic
sudo mkdir -p /var/www/html
sudo chown -R $USER:$USER /var/www

# Configure Nginx
print_status "Configuring Nginx..."
sudo tee /etc/nginx/sites-available/pdf-flow-reorder-magic << EOF
server {
    listen 80;
    server_name 13.200.77.118;
    root /var/www/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/pdf-flow-reorder-magic /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

# Start and enable Nginx
print_status "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 'Nginx Full'
sudo ufw allow ssh
sudo ufw --force enable

# Make deploy script executable
chmod +x deploy.sh

print_status "✅ Server setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Run the deploy script: ./deploy.sh"
echo "2. Set up GitHub Actions secrets (see README)"
echo "3. Test your deployment"
echo ""
echo "🌐 Your site will be available at: http://13.200.77.118"
