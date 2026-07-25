# 🚀 One-to-All Installation & Deployment Guide

## Quick Start (5 Minutes)

### Option 1: Local Development

```bash
# Clone the repository
git clone https://github.com/abidjan527can-lab/One--to--all.git
cd One--to--all

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

---

## 🌐 Deploy on Hostinger (Recommended for You)

### Step 1: Create Hostinger Account
1. Go to https://www.hostinger.com
2. Sign up for a hosting plan (Premium or higher recommended)
3. Choose your domain name
4. Complete payment

### Step 2: Access File Manager
1. Go to Hostinger Dashboard → Hosting → File Manager
2. Navigate to `public_html` folder
3. Delete default files (index.html, etc.)

### Step 3: Upload Files

**Option A: Using Git (Recommended)**
```bash
# SSH into your Hostinger server
ssh username@yourserver.com

# Clone repository
git clone https://github.com/abidjan527can-lab/One--to--all.git .

# Install dependencies
npm install

# Build production files
npm run build

# Copy public files to public_html
cp -r public/* ~/public_html/
cp dist/* ~/public_html/api/
```

**Option B: Using File Manager (Easiest)**
1. Download all files from GitHub as ZIP
2. Upload to Hostinger File Manager
3. Extract in `public_html`

### Step 4: Configure Node.js Application (If Using API)

1. Go to Hostinger Dashboard → Node.js Apps
2. Click "Create Node.js Application"
3. Set:
   - **Application Root**: `/home/username/nodeapps/one-to-all`
   - **Application URL**: `yourpomain.com/api`
   - **Node.js Version**: 18.x or higher
4. Click Create

### Step 5: Set Environment Variables

Create `.env` file in your app root:

```env
# Server
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# API Keys (Optional - for AI features)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GCP_PROJECT_ID=your_project_id

# JWT
JWT_SECRET=your_secret_key_here
```

### Step 6: Verify Installation

1. Go to `https://yourdomain.com`
2. You should see the One-to-All homepage
3. Try uploading content
4. Test on mobile (Install as PWA)

---

## 📱 Install as PWA (Progressive Web App)

### On Desktop (Windows/Mac)
1. Open `https://yourdomain.com` in Chrome, Edge, or Brave
2. Click the **Install** button in the top-right
3. Choose "Install" in the popup
4. App opens in standalone window

### On Mobile (Android)
1. Open `https://yourdomain.com` in Chrome
2. Tap the 3-dot menu
3. Select **"Install app"** or **"Add to Home Screen"**
4. Confirm
5. App icon appears on home screen

### On iOS
1. Open `https://yourdomain.com` in Safari
2. Tap the **Share** button (box with arrow)
3. Select **"Add to Home Screen"**
4. Name it and tap **Add**
5. App opens in fullscreen mode

---

## 🔧 Advanced Configuration

### Add Custom Domain

1. In Hostinger → Domains
2. Point DNS to Hostinger nameservers:
   ```
   NS1: ns1.hostinger.com
   NS2: ns2.hostinger.com
   ```
3. Wait 24 hours for propagation

### Enable SSL Certificate (HTTPS)

1. Hostinger automatically provides free Let's Encrypt SSL
2. Go to Dashboard → SSL Certificates
3. Click "Manage" for your domain
4. Enable "Auto-renewal"

### Set Up Custom Email

1. Dashboard → Email → Create Email Account
2. Use: `support@yourdomain.com`
3. Configure email client with IMAP/POP3 settings

---

## 🎯 Production Checklist

- [ ] Domain registered and pointing to Hostinger
- [ ] SSL certificate enabled (HTTPS working)
- [ ] Environment variables configured
- [ ] API keys added (if using AI features)
- [ ] Manifest.json updated with your domain
- [ ] Icons/screenshots added to `/public/icons`
- [ ] Tested on mobile (Android & iOS)
- [ ] PWA install button working
- [ ] Offline mode tested (using Service Worker)
- [ ] Upload/sharing features working
- [ ] Database configured (if needed)

---

## 📊 Project Structure

```
One--to--all/
├── public/                 # Frontend (Web files)
│   ├── index.html         # Main page
│   ├── app.js             # Frontend logic
│   ├── service-worker.js  # Offline support
│   ├── manifest.json      # PWA metadata
│   ├── sw-register.js     # Service Worker registration
│   └── icons/             # App icons
├── src/                   # Backend (Node.js)
│   ├── server.ts          # Express app
│   ├── config/            # Configuration
│   ├── middleware/        # Request processing
│   ├── routes/            # API endpoints
│   └── services/          # Business logic
├── dist/                  # Compiled backend
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── .env.example           # Environment template
```

---

## 🚨 Troubleshooting

### PWA Not Installing
- Ensure HTTPS is enabled
- Check manifest.json is valid
- Clear browser cache
- Try different browser (Chrome/Edge recommended)

### Upload Not Working
- Check browser console for errors (F12)
- Verify file size is under 100MB
- Ensure localStorage is enabled
- Check CORS settings if using API

### Offline Mode Not Working
- Verify Service Worker is registered
- Check browser DevTools → Application → Service Workers
- Clear cache and reinstall PWA

### API Errors
- Check environment variables are set
- Verify API keys are valid
- Check server logs in Hostinger
- Ensure Node.js app is running

---

## 💡 Tips & Tricks

### Backup Your Data
```bash
# Backup database/files
tar -czf backup.tar.gz ~/nodeapps/one-to-all
```

### Monitor Performance
- Use Hostinger → Analytics
- Check application logs
- Monitor storage usage

### Auto-Deploy from GitHub
1. Connect GitHub in Hostinger
2. Enable auto-deploy on push
3. Every push to main branch updates live site

### Enable GZIP Compression
1. Dashboard → Advanced → Compression
2. Enable GZIP
3. Saves 70% bandwidth

---

## 🎓 Next Steps

1. **Customize Branding**
   - Update manifest.json colors
   - Add your logo to `/public/icons`
   - Change app name in HTML

2. **Add Database** (Optional)
   - Install MySQL via Hostinger
   - Create database
   - Update Node.js code to connect

3. **Enable Payments** (Optional)
   - Integrate Stripe or PayPal
   - Add subscription tiers
   - Setup billing

4. **Add Authentication**
   - Implement user login
   - Setup JWT tokens
   - Create user database

---

## 📞 Support

- **Hostinger Help**: https://support.hostinger.com
- **GitHub Issues**: https://github.com/abidjan527can-lab/One--to--all/issues
- **Email**: support@yourdomain.com

---

## ✨ You're All Set!

Your One-to-All platform is ready to:
✅ Share apps, links, videos, images, files  
✅ Work on all devices (Windows, Mac, Android, iOS)  
✅ Function offline with Service Worker  
✅ Install as a native-like app  
✅ Integrated with AI models  

**Happy sharing!** 🎉
