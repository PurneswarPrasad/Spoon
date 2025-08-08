const express = require('express');
const router = express.Router();
const { generateInsights } = require('../services/insightsService');
const databaseService = require('../services/databaseService');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Track recent requests to prevent rapid successive requests
const recentRequests = new Map();

// POST /api/insights
// Generate insights for a GitHub repository
router.post('/', async (req, res) => {
  try {
    const { repoUrl } = req.body;

    // Validate input
    if (!repoUrl) {
      return res.status(400).json({
        error: 'Missing repository URL',
        message: 'Please provide a valid GitHub repository URL'
      });
    }

    // Validate GitHub URL format
    const githubUrlRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/;
    if (!githubUrlRegex.test(repoUrl)) {
      return res.status(400).json({
        error: 'Invalid GitHub URL',
        message: 'Please provide a valid GitHub repository URL (e.g., https://github.com/username/repo)'
      });
    }

    // Check for rapid successive requests
    const now = Date.now();
    const lastRequest = recentRequests.get(repoUrl);
    if (lastRequest && (now - lastRequest) < 5000) { // 5 second cooldown
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please wait a moment before requesting the same repository again'
      });
    }
    recentRequests.set(repoUrl, now);

    console.log(`🔍 Processing repository: ${repoUrl}`);
    console.log(`👤 User: ${req.user.name} (${req.user.email})`);

    // Generate insights
    const insights = await generateInsights(repoUrl);

    console.log(`✅ Insights generated successfully for: ${repoUrl}`);

    // Extract repository info from URL
    const urlParts = repoUrl.split('/');
    const repoOwner = urlParts[urlParts.length - 2];
    const repoName = urlParts[urlParts.length - 1];

    // Save to database
    try {
      const spoonData = {
        repo_url: repoUrl,
        repo_name: repoName,
        repo_owner: repoOwner,
        summary: insights.summary,
        technologies: insights.technologies,
        insights: insights,
        stars: insights.analytics?.stars || 0,
        forks: insights.analytics?.forks || 0
      };

      console.log('💾 Saving spoon analysis for user ID:', req.user.id);
      console.log('👤 User from token:', req.user);
      
      await databaseService.saveSpoonHistory(req.user.id, spoonData);
      console.log(`💾 Saved spoon analysis to database for user: ${req.user.name}`);
    } catch (dbError) {
      console.error('❌ Error saving to database:', dbError);
      // Don't fail the request if database save fails
    }

    res.json({
      success: true,
      data: insights,
      timestamp: new Date().toISOString(),
      user: {
        name: req.user.name,
        email: req.user.email
      }
    });

  } catch (error) {
    console.error('❌ Error generating insights:', error);
    
    // Handle specific errors
    if (error.message.includes('Repository not found') || error.message.includes('private')) {
      return res.status(404).json({
        error: 'Repository not found',
        message: 'The specified repository could not be found or is private'
      });
    }

    if (error.message.includes('Rate limit exceeded')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.'
      });
    }

    if (error.message.includes('already exists')) {
      return res.status(409).json({
        error: 'Repository already being processed',
        message: 'Please wait a moment before trying again'
      });
    }

    if (error.message.includes('Invalid API key')) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid API credentials'
      });
    }

    res.status(500).json({
      error: 'Failed to generate insights',
      message: error.message || 'An unexpected error occurred'
    });
  }
});

// GET /api/insights/health
// Health check for insights service
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Insights API',
    timestamp: new Date().toISOString(),
    authenticated: true,
    user: req.user ? {
      name: req.user.name,
      email: req.user.email
    } : null
  });
});

// GET /api/insights/user
// Get current user information
router.get('/user', (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      picture: req.user.picture
    }
  });
});

module.exports = router;