// Configuration file for environment variables
const config = {
  // API Base URL - will be different in production
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  
  // Google OAuth Client ID
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id',
  
  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  
  // Check if we're in production
  isProduction: import.meta.env.NODE_ENV === 'production'
};

export default config;

