import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, GitBranch, Star, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const YourSpoonsPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [spoonHistory, setSpoonHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
    hasNext: false,
    hasPrev: false
  })

  useEffect(() => {
    loadSpoonHistory()
  }, [])

  const loadSpoonHistory = async (page = 1) => {
    try {
      const token = localStorage.getItem('spoon_token')
      const response = await fetch(`http://localhost:5000/api/spoons/history?page=${page}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSpoonHistory(data.history || [])
        setPagination(data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 5,
          hasNext: false,
          hasPrev: false
        })
      } else {
        console.error('Failed to load spoon history')
      }
    } catch (error) {
      console.error('Error loading spoon history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setLoading(true)
    loadSpoonHistory(newPage)
  }

  const handleDeleteSpoon = async (spoonId) => {
    try {
      const token = localStorage.getItem('spoon_token')
      const response = await fetch(`http://localhost:5000/api/spoons/history/${spoonId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSpoonHistory(prev => prev.filter(spoon => spoon.id !== spoonId))
      }
    } catch (error) {
      console.error('Error deleting spoon:', error)
    }
  }

  const handleViewInsights = (spoon) => {
    // Store insights in session storage and navigate
    sessionStorage.setItem('spoon-insights', JSON.stringify(spoon.insights))
    navigate('/insights')
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <motion.div 
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <GitBranch size={32} />
        </motion.div>
        <p>Loading your spoons...</p>
      </div>
    )
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="your-spoons-container">
          {/* Header */}
          <motion.div 
            className="your-spoons-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="btn btn-secondary back-button">
              <ArrowLeft size={16} />
              Back to Home
            </Link>
            <div className="header-content">
              <h1 className="your-spoons-title">Your Spoons</h1>
              <p className="your-spoons-subtitle">
                History of your GitHub repository insights
              </p>
            </div>
          </motion.div>

          {/* Spoon History */}
          <div className="spoon-history">
            {spoonHistory.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GitBranch size={48} style={{ color: '#94a3b8', marginBottom: '16px' }} />
                <h3>No Spoons Yet</h3>
                <p>Start by analyzing a GitHub repository to see your history here.</p>
                <Link to="/" className="btn btn-primary">
                  Analyze Repository
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  className="spoon-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {spoonHistory.map((spoon, index) => (
                    <motion.div 
                      key={spoon.id || index} 
                      className="spoon-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      whileHover={{ y: -4 }}
                    >
                      <div className="spoon-card-header">
                        <h3 className="spoon-repo-name">{spoon.repo_name}</h3>
                        <div className="spoon-actions">
                          <button 
                            onClick={() => handleViewInsights(spoon)}
                            className="btn btn-secondary btn-sm"
                          >
                            View Insights
                          </button>
                          <button 
                            onClick={() => handleDeleteSpoon(spoon.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="spoon-card-content">
                        <p className="spoon-description">{spoon.summary}</p>
                        
                        <div className="spoon-technologies">
                          {spoon.technologies?.slice(0, 4).map((tech, techIndex) => (
                            <span key={techIndex} className="tech-tag">{tech}</span>
                          ))}
                          {spoon.technologies?.length > 4 && (
                            <span className="tech-tag">+{spoon.technologies.length - 4} more</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <motion.div 
                    className="pagination-controls"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="pagination-info">
                      <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                      <span>({pagination.totalItems} total items)</span>
                    </div>
                    
                    <div className="pagination-buttons">
                      <button 
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="btn btn-secondary btn-sm"
                      >
                        <ChevronLeft size={16} />
                        Previous
                      </button>
                      
                      <button 
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="btn btn-secondary btn-sm"
                      >
                        Next
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourSpoonsPage