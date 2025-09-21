# AWS EC2 Deployment Guide for PDF Flow Reorder Magic

This guide explains how to deploy the PDF Flow Reorder Magic application to AWS EC2 with both frontend and backend.

## Architecture Overview

- **Frontend**: React/Vite application served by Nginx
- **Backend**: Node.js/Express API server running on port 3000, managed by PM2
- **Proxy**: Nginx proxies `/api/*` requests to the backend
- **Database**: AWS DynamoDB
- **Storage**: AWS S3

## Prerequisites

1. AWS EC2 instance (Ubuntu 20.04+ recommended)
2. Domain name pointing to your EC2 instance
3. AWS credentials with DynamoDB and S3 access
4. SSH access to your EC2 instance

## Deployment Steps

### 1. Initial Server Setup

Run the server setup script on your EC2 instance:

```bash
# On your EC2 instance
git clone https://github.com/Mealeme/pdf-flow-reorder-magic.git
cd pdf-flow-reorder-magic
chmod +x server-setup.sh
./server-setup.sh
```

This will:
- Install Node.js, Nginx, and PM2
- Configure Nginx with API proxy
- Create necessary directories
- Set up firewall rules

### 2. Configure Environment Variables

Edit the `.env` file in `/var/www/pdf-flow-reorder-magic/`:

```bash
sudo nano /var/www/pdf-flow-reorder-magic/.env
```

Update with your actual AWS credentials:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
PORT=3000
NODE_ENV=production
DOMAIN=your_domain.com
```

### 3. Deploy Application

Run the deployment script:

```bash
# On your EC2 instance
cd /var/www/pdf-flow-reorder-magic
./deploy.sh
```

This will:
- Pull latest code from GitHub
- Build the frontend
- Deploy frontend to Nginx
- Deploy and start backend with PM2

### 4. Verify Deployment

Check that everything is running:

```bash
# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check backend logs
pm2 logs pdf-flow-backend

# Test API endpoint
curl http://localhost:3000/api/subscription/status/test-user
```

## File Structure After Deployment

```
/var/www/
├── html/                    # Frontend static files
├── pdf-flow-reorder-magic/  # Backend application
│   ├── server.js
│   ├── ecosystem.config.js
│   ├── .env
│   └── logs/
└── nginx/sites-enabled/
    └── pdf-flow-reorder-magic
```

## Available Scripts

- `server-setup.sh`: Initial server configuration
- `deploy.sh`: Full deployment (frontend + backend)
- `deploy-backend.sh`: Backend-only deployment
- `ecosystem.config.js`: PM2 configuration

## Monitoring and Maintenance

### Check Application Status

```bash
# PM2 process status
pm2 status

# View backend logs
pm2 logs pdf-flow-backend

# Restart backend
pm2 restart pdf-flow-backend

# Nginx status
sudo systemctl status nginx
```

### Update Application

```bash
cd /var/www/pdf-flow-reorder-magic
./deploy.sh
```

### SSL Certificate (Optional)

To add SSL with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting

### Backend Not Starting

1. Check PM2 logs: `pm2 logs pdf-flow-backend`
2. Verify environment variables in `.env`
3. Check AWS credentials and permissions
4. Ensure port 3000 is not in use: `netstat -tlnp | grep :3000`

### Frontend Not Loading

1. Check Nginx status: `sudo systemctl status nginx`
2. Verify files exist: `ls -la /var/www/html/`
3. Check Nginx config: `sudo nginx -t`

### API Calls Failing

1. Verify backend is running: `pm2 status`
2. Check Nginx proxy config
3. Test backend directly: `curl http://localhost:3000/api/test`

## Security Considerations

- Use IAM roles instead of access keys when possible
- Restrict security groups to necessary ports only (22, 80, 443)
- Regularly update server packages
- Monitor logs for suspicious activity
- Use HTTPS in production

## Cost Optimization

- Use appropriate EC2 instance size based on traffic
- Set up auto-scaling if needed
- Monitor AWS costs regularly
- Consider using CloudFront for static assets

## Support

For issues with deployment, check the logs and ensure all prerequisites are met. The application uses AWS services, so verify your AWS configuration and permissions.