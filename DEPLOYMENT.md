# 🚀 Spoon Deployment Guide

This guide will help you deploy your Spoon application to production. We'll use **Railway** for the backend and **Vercel** for the frontend.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Google Cloud Console** - For OAuth credentials
3. **Railway Account** - For backend deployment
4. **Vercel Account** - For frontend deployment
5. **Google Gemini API Key** - For AI insights generation
6. **GitHub Personal Access Token** - For GitHub API access

## 🔧 Environment Variables Setup

### Backend Environment Variables (Railway)

Create these environment variables in your Railway project:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Production URLs
NODE_ENV=production
BACKEND_URL=https://your-backend-url.railway.app
FRONTEND_URL=https://your-frontend-url.vercel.app

# CORS Configuration
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Frontend Environment Variables (Vercel)

Create these environment variables in your Vercel project:

```env
VITE_API_BASE_URL=https://your-backend-url.railway.app
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up OAuth consent screen
6. Create OAuth 2.0 Client ID with:
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (development)
     - `https://your-frontend-url.vercel.app` (production)
   - **Authorized redirect URIs:**
     - `http://localhost:5000/auth/google/callback` (development)
     - `https://your-backend-url.railway.app/auth/google/callback` (production)

### Step 2: Deploy Backend to Railway

1. **Sign up/Login to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Deployment**
   - Set root directory to `server/`
   - Railway will automatically detect it's a Node.js app

4. **Set Environment Variables**
   - Go to your project settings
   - Add all the backend environment variables listed above
   - Make sure to replace placeholder values with real ones

5. **Deploy**
   - Railway will automatically deploy when you push to your main branch
   - Or click "Deploy Now" to trigger deployment

6. **Get Backend URL**
   - After deployment, copy the generated URL (e.g., `https://your-app.railway.app`)

### Step 3: Deploy Frontend to Vercel

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `client/`

3. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   - Add the frontend environment variables listed above
   - Use the backend URL from Railway

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your frontend

6. **Get Frontend URL**
   - Copy the generated URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update OAuth Redirect URLs

1. **Update Google OAuth Settings**
   - Go back to Google Cloud Console
   - Update your OAuth 2.0 Client ID
   - Add the production URLs:
     - Frontend: `https://your-frontend-url.vercel.app`
     - Backend: `https://your-backend-url.railway.app/auth/google/callback`

2. **Update Railway Environment Variables**
   - Add the frontend URL to `FRONTEND_URL` variable

### Step 5: Test Your Deployment

1. **Test Authentication**
   - Visit your frontend URL
   - Try logging in with Google
   - Verify redirect works correctly

2. **Test API Endpoints**
   - Test the health endpoint: `https://your-backend-url.railway.app/health`
   - Test insights generation with a GitHub repo

3. **Check Database**
   - Verify SQLite database is working
   - Check if user data is being saved

## 🔧 Alternative Deployment Options

### Option 1: Heroku (Backend)

If you prefer Heroku:

1. **Install Heroku CLI**
2. **Create Heroku App**
   ```bash
   heroku create your-spoon-backend
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set GOOGLE_CLIENT_ID=your_client_id
   # ... set all other variables
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

### Option 2: Netlify (Frontend)

If you prefer Netlify:

1. **Connect GitHub Repository**
2. **Set Build Settings**
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`
3. **Set Environment Variables**
4. **Deploy**

### Option 3: Railway for Both (Full-Stack)

Railway supports full-stack deployments:

1. **Create Two Services**
   - Backend service (server directory)
   - Frontend service (client directory)

2. **Configure Frontend Service**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Add environment variables

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` is set correctly
   - Check that frontend URL is in the allowed origins

2. **OAuth Redirect Issues**
   - Verify redirect URLs in Google Console
   - Check environment variables are set correctly

3. **Database Issues**
   - SQLite files are ephemeral on Railway
   - Consider migrating to PostgreSQL for production

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

### Debugging Commands

```bash
# Check Railway logs
railway logs

# Check Vercel deployment logs
vercel logs

# Test backend locally with production env
NODE_ENV=production npm start
```

## 🔒 Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong, unique secrets
   - Rotate API keys regularly

2. **HTTPS**
   - Both Railway and Vercel provide HTTPS by default
   - Ensure all API calls use HTTPS

3. **CORS**
   - Only allow your frontend domain
   - Don't use wildcard origins in production

4. **Rate Limiting**
   - Consider implementing rate limiting
   - Monitor API usage

## 📊 Monitoring

1. **Railway Dashboard**
   - Monitor backend performance
   - Check logs for errors

2. **Vercel Analytics**
   - Monitor frontend performance
   - Track user interactions

3. **Custom Monitoring**
   - Add health check endpoints
   - Implement error tracking (Sentry)

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

1. **Connect GitHub Repository**
2. **Enable Auto-Deploy**
3. **Set up Branch Protection**
4. **Configure Preview Deployments**

## 📝 Post-Deployment Checklist

- [ ] All environment variables are set
- [ ] OAuth redirect URLs are configured
- [ ] Frontend can communicate with backend
- [ ] Authentication flow works
- [ ] Database operations work
- [ ] AI insights generation works
- [ ] Error handling is working
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Performance is acceptable

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review Railway/Vercel documentation
3. Check application logs
4. Verify environment variables
5. Test locally with production settings

---

**Happy Deploying! 🚀**

