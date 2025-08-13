const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import routes
const insightsRouter = require('./routes/insights');
const authRouter = require('./routes/auth');
const spoonsRouter = require('./routes/spoons');
const databaseService = require('./services/databaseService');

// Routes
app.use('/api/insights', insightsRouter);
app.use('/auth', authRouter);
app.use('/api/spoons', spoonsRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('🏥 Health check requested');
  console.log('🏥 Environment:', process.env.NODE_ENV);
  console.log('🏥 Port:', process.env.PORT);
  console.log('🏥 Database connected:', !!databaseService);
  
  res.json({ 
    status: 'OK', 
    message: 'Spoon Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}` 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Spoon Server running on port ${PORT}`);
  console.log(`�� Health check: http://localhost:${PORT}/health`);
  console.log(`�� API endpoint: http://localhost:${PORT}/api/insights`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/auth`);
  console.log(`🥄 Spoons endpoint: http://localhost:${PORT}/api/spoons`);
});