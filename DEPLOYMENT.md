# SmartSpender Deployment Guide

This guide covers deploying SmartSpender to GitHub and production hosting platforms.

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository

```bash
# In the project root directory
git init
git add .
git commit -m "Initial commit: SmartSpender MERN app with AI service"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it `smartSpender` (or your preferred name)
4. **Don't** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 3: Connect and Push

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/smartSpender.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Part 2: Deployment Options

### Recommended Deployment Architecture

```
Frontend:     Vercel / Netlify (Free tier available)
Backend:      Railway / Render / Heroku (Free/Paid)
AI Service:   Railway / Render / Heroku (Free/Paid)
Database:     MongoDB Atlas (Free tier available)
```

---

## Option A: Full Deployment (Recommended)

### 1. MongoDB Atlas Setup (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier: M0)
4. Create a database user (username/password)
5. Whitelist IP: `0.0.0.0/0` (allow all IPs for deployment)
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/smartspender?retryWrites=true&w=majority`

### 2. Backend Deployment (Railway - Recommended)

**Railway** offers free tier with $5 credit monthly.

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `smartSpender` repository
5. Select the `backend` folder as the root
6. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartspender
   JWT_SECRET=your-super-secret-jwt-key-production
   PORT=5000
   AI_SERVICE_URL=https://your-ai-service-url.railway.app
   ```
7. Railway will auto-detect Node.js and deploy
8. Note the deployed URL (e.g., `https://smartspender-backend.railway.app`)

**Alternative: Render**
- Go to [Render](https://render.com)
- New → Web Service
- Connect GitHub repo
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Add environment variables

### 3. AI Service Deployment (Railway)

1. In Railway, create another service
2. Select same GitHub repo
3. Root Directory: `ai-service`
4. Add environment variables:
   ```
   PORT=5001
   FLASK_APP=app.py
   ```
5. Railway will detect Python and install dependencies
6. Note the deployed URL

**Important**: Update backend's `AI_SERVICE_URL` with the AI service URL

### 4. Frontend Deployment (Vercel - Recommended)

**Vercel** offers free tier with excellent performance.

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
7. Deploy

**Alternative: Netlify**
- Go to [Netlify](https://netlify.com)
- New site from Git
- Select repository
- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `build`
- Add environment variable: `REACT_APP_API_URL`

---

## Option B: Quick Deploy Scripts

### Railway Deployment (All-in-One)

Railway supports monorepos. You can deploy all services from one repo:

1. Create `railway.json` in root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd backend && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Deploy backend and AI service as separate services in Railway

---

## Environment Variables Summary

### Backend (.env in Railway/Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartspender
JWT_SECRET=generate-a-strong-random-secret-here
PORT=5000
AI_SERVICE_URL=https://your-ai-service.railway.app
NODE_ENV=production
```

### AI Service (.env in Railway/Render)
```
PORT=5001
FLASK_APP=app.py
FLASK_ENV=production
```

### Frontend (Vercel/Netlify)
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Backend is deployed and accessible
- [ ] AI Service is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] All environment variables are set
- [ ] CORS is configured correctly
- [ ] Test registration/login
- [ ] Test expense creation
- [ ] Test AI insights

---

## Troubleshooting Deployment

### Backend Issues

**CORS Errors**
- Ensure frontend URL is whitelisted in backend CORS config
- Update `backend/server.js` if needed:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true
}));
```

**MongoDB Connection**
- Verify connection string in MongoDB Atlas
- Check IP whitelist (should include `0.0.0.0/0` for cloud)
- Verify database user credentials

### AI Service Issues

**Python Dependencies**
- Ensure `requirements.txt` includes all dependencies
- Railway/Render should auto-detect and install

**Port Configuration**
- Railway/Render provide `PORT` via environment variable
- Flask app should use: `port = int(os.getenv('PORT', 5001))`

### Frontend Issues

**API Connection**
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for CORS/network errors
- Ensure backend URL doesn't have trailing slash

**Build Errors**
- Check build logs in Vercel/Netlify
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

---

## Security Considerations for Production

1. **JWT Secret**: Use a strong, random secret (32+ characters)
2. **MongoDB**: Enable authentication and use strong passwords
3. **HTTPS**: All services should use HTTPS (automatic with Vercel/Railway)
4. **Environment Variables**: Never commit `.env` files
5. **Rate Limiting**: Consider adding rate limiting to backend
6. **Input Validation**: Already implemented, but review for production

---

## Cost Estimate (Free Tier)

- **MongoDB Atlas**: Free (512MB storage)
- **Vercel**: Free (unlimited personal projects)
- **Railway**: Free ($5 credit/month, ~500 hours)
- **Render**: Free (limited hours, sleeps after inactivity)

**Total**: $0/month for development/small projects

---

## Alternative Deployment Platforms

### Backend & AI Service
- **Heroku**: Paid (no free tier anymore)
- **Fly.io**: Free tier available
- **DigitalOcean App Platform**: Paid
- **AWS Elastic Beanstalk**: Pay-as-you-go

### Frontend
- **GitHub Pages**: Free (static sites)
- **Cloudflare Pages**: Free
- **AWS Amplify**: Free tier available

---

## Quick Start Commands

```bash
# 1. Initialize Git
git init
git add .
git commit -m "Initial commit"

# 2. Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/smartSpender.git
git branch -M main
git push -u origin main

# 3. Deploy to Railway (backend)
# - Go to railway.app
# - Connect GitHub repo
# - Select backend folder
# - Add environment variables
# - Deploy

# 4. Deploy to Railway (AI service)
# - Create new service
# - Select ai-service folder
# - Add environment variables
# - Deploy

# 5. Deploy to Vercel (frontend)
# - Go to vercel.com
# - Connect GitHub repo
# - Select frontend folder
# - Add REACT_APP_API_URL
# - Deploy
```

---

## Need Help?

- Check deployment logs in your hosting platform
- Verify all environment variables are set
- Test API endpoints directly (use Postman/curl)
- Check browser console for frontend errors
- Review MongoDB Atlas connection logs
