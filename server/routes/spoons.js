const express = require('express')
const router = express.Router()
const databaseService = require('../services/databaseService')
const jwt = require('jsonwebtoken')

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

// Save new spoon analysis
router.post('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const {
      repo_url,
      repo_name,
      repo_owner,
      summary,
      technologies,
      insights,
      stars,
      forks
    } = req.body

    const spoonData = {
      repo_url,
      repo_name,
      repo_owner,
      summary,
      technologies,
      insights,
      stars,
      forks
    }

    const savedSpoon = await databaseService.saveSpoonHistory(userId, spoonData)
    
    res.json({
      success: true,
      message: 'Spoon analysis saved successfully',
      spoon: savedSpoon
    })
  } catch (error) {
    console.error('Error saving spoon history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to save spoon analysis'
    })
  }
})

// Get paginated spoon history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    console.log('🔍 Fetching spoon history for user ID:', userId)
    console.log('👤 User from token:', req.user)
    
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5

    const result = await databaseService.getSpoonHistory(userId, page, limit)
    
    console.log('📊 Found history items:', result.history.length)
    console.log('📄 Pagination:', result.pagination)
    
    res.json({
      success: true,
      history: result.history,
      pagination: result.pagination
    })
  } catch (error) {
    console.error('Error fetching spoon history:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spoon history'
    })
  }
})

// Get specific spoon by ID
router.get('/history/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const spoonId = parseInt(req.params.id)

    const spoon = await databaseService.getSpoonById(spoonId, userId)
    
    if (!spoon) {
      return res.status(404).json({
        success: false,
        message: 'Spoon not found'
      })
    }

    res.json({
      success: true,
      spoon
    })
  } catch (error) {
    console.error('Error fetching spoon:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spoon'
    })
  }
})

// Delete specific spoon
router.delete('/history/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const spoonId = parseInt(req.params.id)

    const result = await databaseService.deleteSpoon(spoonId, userId)
    
    if (!result.deleted) {
      return res.status(404).json({
        success: false,
        message: 'Spoon not found or already deleted'
      })
    }

    res.json({
      success: true,
      message: 'Spoon deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting spoon:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete spoon'
    })
  }
})

module.exports = router
