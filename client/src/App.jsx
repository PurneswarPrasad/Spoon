import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import LoginPage from './components/LoginPage'
import LandingPage from './components/LandingPage'
import InsightsPage from './components/InsightsPage'
import YourSpoonsPage from './components/YourSpoonsPage'
import ProtectedRoute from './components/ProtectedRoute'
import AuthCallback from './components/AuthCallback'
import { Diamond } from 'lucide-react'
import { motion } from 'framer-motion'
import './App.css'

// API configuration
const API_BASE_URL = 'http://localhost:5000'

function AppContent() {
  const { user, login, loading } = useAuth()
  const [insights, setInsights] = useState(() => {
    const savedInsights = sessionStorage.getItem('spoon-insights')
    return savedInsights ? JSON.parse(savedInsights) : null
  })
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [error, setError] = useState(null)

  const generateInsights = async (repoUrl) => {
    setLoadingInsights(true)
    setError(null)
    
    try {
      const token = localStorage.getItem('spoon_token')
      
      const response = await axios.post(`${API_BASE_URL}/api/insights`, {
        repoUrl: repoUrl
      }, {
        timeout: 60000,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        const insightsData = response.data.data
        setInsights(insightsData)
        sessionStorage.setItem('spoon-insights', JSON.stringify(insightsData))
        return true
      } else {
        throw new Error('Failed to generate insights')
      }
      
    } catch (error) {
      console.error('❌ Error generating insights:', error)
      
      let errorMessage = 'Failed to generate insights'
      
      if (error.response) {
        const status = error.response.status
        const data = error.response.data
        
        switch (status) {
          case 400:
            errorMessage = data.message || 'Invalid repository URL'
            break
          case 401:
            errorMessage = 'Please log in to continue'
            break
          case 404:
            errorMessage = 'Repository not found or is private'
            break
          case 429:
            errorMessage = 'Rate limit exceeded. Please try again later.'
            break
          case 500:
            errorMessage = 'Server error. Please try again.'
            break
          default:
            errorMessage = data.message || 'An error occurred'
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.'
      } else {
        errorMessage = error.message || 'An unexpected error occurred'
      }
      
      setError(errorMessage)
      return false
    } finally {
      setLoadingInsights(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Diamond size={32} />
        </motion.div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/" replace /> : <LoginPage />
          } 
        />
        <Route 
          path="/auth/callback" 
          element={<AuthCallback />} 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Header />
              <LandingPage 
                onGenerateInsights={generateInsights}
                loading={loadingInsights}
                error={error}
              />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/insights" 
          element={
            <ProtectedRoute>
              <Header />
              {insights ? (
                <InsightsPage insights={insights} />
              ) : (
                <Navigate to="/" replace />
              )}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />} 
        />
        <Route 
          path="/your-spoons" 
          element={
            <ProtectedRoute>
              <Header />
              <YourSpoonsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App