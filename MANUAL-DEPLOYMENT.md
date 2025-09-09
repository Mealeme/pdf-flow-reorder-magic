# 📋 Manual Deployment Guide

This guide shows you how to manually deploy changes to your site at **https://newmicro.live**

## 🎯 **Method 1: Deploy from Your Server (Recommended)**

### Step 1: Connect to Your Server
```bash
ssh your_username@your_server_ip
```

### Step 2: Run the Deployment Script
```bash
# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/Mealeme/pdf-flow-reorder-magic/main/manual-deploy.sh | bash
```

### Step 3: Verify Deployment
- Visit: https://newmicro.live
- Check if your changes are live

---

## 🖥️ **Method 2: Deploy from Your Local Computer**

### Step 1: Update the Script
Edit `deploy-from-local.sh` and change these lines:
```bash
SERVER_IP="your_server_ip"     # Change to your server IP
SERVER_USER="your_username"    # Change to your server username
```

### Step 2: Run the Script
```bash
# Make the script executable
chmod +x deploy-from-local.sh

# Run the deployment
./deploy-from-local.sh
```

---

## 🔧 **Method 3: Step-by-Step Manual Process**

### On Your Server:

1. **Connect to your server:**
   ```bash
   ssh your_username@your_server_ip
   ```

2. **Navigate to project directory:**
   ```bash
   cd /var/www/pdf-flow-reorder-magic
   ```

3. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Build the project:**
   ```bash
   npm run build
   ```

6. **Deploy to web directory:**
   ```bash
   sudo cp -r dist/* /var/www/html/
   sudo chown -R www-data:www-data /var/www/html
   sudo chmod -R 755 /var/www/html
   ```

7. **Restart web server:**
   ```bash
   sudo systemctl reload nginx
   ```

---

## 🚀 **Quick Commands**

### Deploy Everything at Once:
```bash
# On your server
curl -fsSL https://raw.githubusercontent.com/Mealeme/pdf-flow-reorder-magic/main/manual-deploy.sh | bash
```

### Check if Your Site is Working:
```bash
# Test your site
curl -I https://newmicro.live
```

### View Deployment Logs:
```bash
# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔍 **Troubleshooting**

### If Deployment Fails:

1. **Check if you're in the right directory:**
   ```bash
   pwd
   ls -la
   ```

2. **Check if Git is working:**
   ```bash
   git status
   git pull origin main
   ```

3. **Check if Node.js is installed:**
   ```bash
   node --version
   npm --version
   ```

4. **Check if build works:**
   ```bash
   npm run build
   ls -la dist/
   ```

5. **Check web server status:**
   ```bash
   sudo systemctl status nginx
   ```

### Common Issues:

- **Permission denied**: Use `sudo` for file operations
- **Build fails**: Check if all dependencies are installed with `npm install`
- **Site not loading**: Check Nginx status and logs
- **Files not updating**: Clear browser cache or try incognito mode

---

## 📊 **Deployment Checklist**

Before deploying:
- [ ] Test changes locally
- [ ] Commit changes to GitHub
- [ ] Push changes to main branch

After deploying:
- [ ] Visit https://newmicro.live
- [ ] Check if changes are visible
- [ ] Test all functionality
- [ ] Check mobile version

---

## 🎉 **That's It!**

Your manual deployment process is now set up. Every time you want to update your site:

1. **Make changes** to your code
2. **Push to GitHub**: `git push origin main`
3. **Deploy to server**: Run the deployment script
4. **Your site updates** at https://newmicro.live

**No automatic deployment** - you control when updates happen! 🚀
