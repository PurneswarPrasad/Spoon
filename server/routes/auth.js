const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const databaseService = require('../services/databaseService');
const router = express.Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production' 
  ? `${process.env.BACKEND_URL}/auth/google/callback`
  : "http://localhost:5000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Create user object
      const userData = {
        google_id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        picture: profile.photos[0].value
      };
      
      // Save or update user in database
      const user = await databaseService.createUser(userData);
      
      return cb(null, user);
    } catch (error) {
      console.error('Error saving user to database:', error);
      return cb(error);
    }
  }
));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Generate JWT token
function generateToken(user) {
  // Use the database user ID instead of Google ID
  const tokenPayload = {
    id: user.id, // Database user ID
    google_id: user.google_id,
    name: user.name,
    email: user.email,
    picture: user.picture
  };
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('🔐 OAuth route accessed:', req.url);
  console.log('🔐 Environment:', process.env.NODE_ENV);
  console.log('🔐 Google Client ID exists:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('🔐 Google Client Secret exists:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('🔐 BACKEND_URL:', process.env.BACKEND_URL);
  console.log('🔐 FRONTEND_URL:', process.env.FRONTEND_URL);
  console.log('🔐 CORS_ORIGIN:', process.env.CORS_ORIGIN);
  console.log('🔐 JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('🔐 SESSION_SECRET exists:', !!process.env.SESSION_SECRET);
  
  // Check if all required environment variables are set
  const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'JWT_SECRET', 'SESSION_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:', missingVars);
    return res.status(500).json({ 
      error: 'Server configuration error',
      missing: missingVars 
    });
  }
  
  console.log('✅ All required environment variables are set');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL 
      : 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// Verify JWT token
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json(decoded);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.json({ success: true });
});

module.exports = router;