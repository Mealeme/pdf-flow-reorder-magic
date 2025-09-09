#!/bin/bash

# Quick fix for Nginx configuration
echo "🔧 Fixing Nginx configuration..."

# Remove the problematic site configuration
sudo rm -f /etc/nginx/sites-enabled/pdf-flow-reorder-magic

# Create a corrected Nginx configuration
sudo tee /etc/nginx/sites-available/pdf-flow-reorder-magic << EOF
server {
    listen 80;
    server_name newmicro.live www.newmicro.live;
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
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/pdf-flow-reorder-magic /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid!"
    echo "Starting Nginx..."
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "✅ Nginx is now running!"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

echo "🎉 Nginx setup completed successfully!"
