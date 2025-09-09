# 🚀 Automatic Deployment Setup

This guide will help you set up automatic deployment from your GitHub repository to your production server.

## 📋 Prerequisites

- Ubuntu/Debian server (13.200.77.118)
- SSH access to your server
- GitHub repository: https://github.com/Mealeme/pdf-flow-reorder-magic.git

## 🔧 Server Setup

### Step 1: Initial Server Configuration

1. **Connect to your server:**
   ```bash
   ssh your_username@13.200.77.118
   ```

2. **Run the setup script:**
   ```bash
   # Download and run the setup script
   curl -fsSL https://raw.githubusercontent.com/Mealeme/pdf-flow-reorder-magic/main/server-setup.sh | bash
   ```

   Or manually run:
   ```bash
   chmod +x server-setup.sh
   ./server-setup.sh
   ```

### Step 2: Manual Deployment (First Time)

1. **Run the deployment script:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

2. **Verify deployment:**
   - Visit: http://13.200.77.118
   - Check if your site loads correctly

## 🔐 GitHub Actions Setup

### Step 1: Generate SSH Key Pair

On your local machine:

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions@pdf-flow-reorder-magic" -f ~/.ssh/github_actions_key

# Display public key (copy this)
cat ~/.ssh/github_actions_key.pub
```

### Step 2: Add Public Key to Server

1. **Copy the public key to your server:**
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions_key.pub your_username@13.200.77.118
   ```

2. **Or manually add to authorized_keys:**
   ```bash
   # On your server
   mkdir -p ~/.ssh
   echo "your_public_key_here" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

### Step 3: Configure GitHub Secrets

1. **Go to your GitHub repository:**
   - Navigate to: https://github.com/Mealeme/pdf-flow-reorder-magic
   - Click on "Settings" tab
   - Click on "Secrets and variables" → "Actions"

2. **Add the following secrets:**

   | Secret Name | Value | Description |
   |-------------|-------|-------------|
   | `HOST` | `13.200.77.118` | Your server IP address |
   | `USERNAME` | `your_server_username` | SSH username for your server |
   | `SSH_PRIVATE_KEY` | `contents of ~/.ssh/github_actions_key` | Private SSH key content |
   | `PORT` | `22` | SSH port (default is 22) |

3. **To get your private key content:**
   ```bash
   cat ~/.ssh/github_actions_key
   ```
   Copy the entire output including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`

## 🎯 How It Works

### Automatic Deployment Flow

1. **You push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Update site"
   git push origin main
   ```

2. **GitHub Actions automatically:**
   - Checks out your code
   - Installs dependencies
   - Builds the project
   - Connects to your server via SSH
   - Pulls latest changes
   - Builds and deploys to production

3. **Your site updates automatically!**

### Manual Deployment

If you need to deploy manually:

```bash
# On your server
cd /var/www/pdf-flow-reorder-magic
./deploy.sh
```

## 🔍 Troubleshooting

### Common Issues

1. **SSH Connection Failed:**
   - Check if SSH key is correctly added to GitHub secrets
   - Verify server IP and username
   - Test SSH connection manually: `ssh your_username@13.200.77.118`

2. **Build Failed:**
   - Check if all dependencies are installed
   - Verify Node.js version (should be 18+)
   - Check build logs in GitHub Actions

3. **Site Not Loading:**
   - Check Nginx status: `sudo systemctl status nginx`
   - Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
   - Verify files are in `/var/www/html/`

### Useful Commands

```bash
# Check deployment status
sudo systemctl status nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check running processes
ps aux | grep nginx

# Restart Nginx
sudo systemctl restart nginx
```

## 📁 File Structure

```
/var/www/
├── pdf-flow-reorder-magic/     # Your project repository
│   ├── deploy.sh              # Deployment script
│   ├── server-setup.sh        # Server setup script
│   └── ...                    # Your project files
└── html/                      # Web server directory
    ├── index.html
    ├── assets/
    └── ...                    # Built files
```

## 🔒 Security Notes

- The SSH key is stored securely in GitHub secrets
- Only the main branch triggers automatic deployment
- Web server runs with limited permissions
- Firewall is configured to allow only necessary ports

## 📞 Support

If you encounter any issues:

1. Check the GitHub Actions logs
2. Review server logs
3. Verify all secrets are correctly configured
4. Test SSH connection manually

---

**🎉 Once set up, every push to your main branch will automatically deploy to your live site!**
