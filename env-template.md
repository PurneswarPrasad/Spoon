# Environment Variables Template

## Backend Environment Variables (server/.env)

Create a `.env` file in the `server/` directory with the following variables:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Production URLs (set these when deploying)
# BACKEND_URL=https://your-backend-url.railway.app
# FRONTEND_URL=https://your-frontend-url.vercel.app
```

## Frontend Environment Variables (client/.env)

Create a `.env` file in the `client/` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## How to Get These Values

### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set up OAuth consent screen
6. Create OAuth 2.0 Client ID

### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### GitHub Personal Access Token
1. Go to [GitHub Settings](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `user`
4. Generate and copy the token

### JWT and Session Secrets
Generate strong random strings:
```bash
# For JWT_SECRET
openssl rand -base64 32

# For SESSION_SECRET
openssl rand -base64 32
```

## Production Environment Variables

When deploying to production, update these values:

### Railway (Backend)
- Set `NODE_ENV=production`
- Set `BACKEND_URL` to your Railway app URL
- Set `FRONTEND_URL` to your Vercel app URL
- Set `CORS_ORIGIN` to your Vercel app URL

### Vercel (Frontend)
- Set `VITE_API_BASE_URL` to your Railway app URL
- Set `VITE_GOOGLE_CLIENT_ID` to your Google OAuth client ID

