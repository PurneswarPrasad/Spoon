#!/bin/bash

# Spoon Deployment Script
# This script helps prepare your project for deployment

echo "🚀 Spoon Deployment Preparation Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin <your-github-repo-url>"
    echo "   git push -u origin main"
    exit 1
fi

# Check if .env files exist
echo "📋 Checking environment files..."

if [ ! -f "server/.env" ]; then
    echo "⚠️  server/.env not found. Creating template..."
    cat > server/.env << EOF
# Google OAuth
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

# Development Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ Created server/.env template"
    echo "   Please update with your actual values before deployment"
fi

# Check if .gitignore includes .env files
if ! grep -q ".env" .gitignore 2>/dev/null; then
    echo "📝 Adding .env files to .gitignore..."
    echo "" >> .gitignore
    echo "# Environment files" >> .gitignore
    echo ".env" >> .gitignore
    echo ".env.local" >> .gitignore
    echo ".env.production" >> .gitignore
    echo "server/.env" >> .gitignore
    echo "client/.env" >> .gitignore
    echo "✅ Added .env files to .gitignore"
fi

# Check if node_modules are in .gitignore
if ! grep -q "node_modules" .gitignore 2>/dev/null; then
    echo "📝 Adding node_modules to .gitignore..."
    echo "" >> .gitignore
    echo "# Dependencies" >> .gitignore
    echo "node_modules/" >> .gitignore
    echo "client/node_modules/" >> .gitignore
    echo "server/node_modules/" >> .gitignore
    echo "✅ Added node_modules to .gitignore"
fi

# Check if build directories are in .gitignore
if ! grep -q "dist" .gitignore 2>/dev/null; then
    echo "📝 Adding build directories to .gitignore..."
    echo "" >> .gitignore
    echo "# Build outputs" >> .gitignore
    echo "dist/" >> .gitignore
    echo "build/" >> .gitignore
    echo "client/dist/" >> .gitignore
    echo "✅ Added build directories to .gitignore"
fi

# Check package.json files
echo "📦 Checking package.json files..."

if [ -f "client/package.json" ]; then
    echo "✅ client/package.json found"
else
    echo "❌ client/package.json not found"
fi

if [ -f "server/package.json" ]; then
    echo "✅ server/package.json found"
else
    echo "❌ server/package.json not found"
fi

# Check if dependencies are installed
echo "🔍 Checking dependencies..."

if [ ! -d "client/node_modules" ]; then
    echo "⚠️  Client dependencies not installed. Run: cd client && npm install"
fi

if [ ! -d "server/node_modules" ]; then
    echo "⚠️  Server dependencies not installed. Run: cd server && npm install"
fi

# Check if database file exists
if [ ! -f "server/spoon.db" ]; then
    echo "📊 Database file not found. It will be created automatically on first run."
fi

echo ""
echo "🎯 Next Steps:"
echo "=============="
echo ""
echo "1. 📝 Update server/.env with your actual API keys and secrets"
echo "2. 🔧 Set up Google OAuth credentials in Google Cloud Console"
echo "3. 🚀 Deploy backend to Railway:"
echo "   - Go to railway.app"
echo "   - Create new project from GitHub"
echo "   - Set root directory to 'server/'"
echo "   - Add environment variables"
echo "4. 🌐 Deploy frontend to Vercel:"
echo "   - Go to vercel.com"
echo "   - Import GitHub repository"
echo "   - Set root directory to 'client/'"
echo "   - Add environment variables"
echo "5. 🔗 Update OAuth redirect URLs with production URLs"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "✅ Deployment preparation complete!"

