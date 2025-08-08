import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Code, FileText, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'

const LandingPage = ({ onGenerateInsights, loading, error }) => {
  const [repoUrl, setRepoUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!repoUrl.trim()) return

    const success = await onGenerateInsights(repoUrl)
    if (success) {
      navigate('/insights')
    }
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Hero Section */}
        <motion.div 
          className="hero-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h1 
            className="hero-title"
            variants={fadeInUp}
          >
            Unlock the Power of AI Insights
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            variants={fadeInUp}
          >
            Generate AI-powered insights from GitHub repositories or document uploads. 
            Understand project purpose, key features, and potential use cases with ease.
          </motion.p>
          
          {/* Input Section */}
          <motion.div 
            className="input-section"
            variants={fadeInUp}
          >
            <form onSubmit={handleSubmit}>
              <div className="input-container">
                <div className="input-wrapper">
                  <Search className="input-icon" size={20} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Paste GitHub repo link"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || !repoUrl.trim()}
                >
                  {loading ? 'Generating...' : 'Generate Insights'}
                </button>
              </div>
              
              {/* Error Display */}
              {error && (
                <motion.div 
                  className="error-message"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="error-icon">⚠️</div>
                  <div className="error-text">{error}</div>
                </motion.div>
              )}
              
              {/* Loading Indicator */}
              {loading && (
                <motion.div 
                  className="loading-indicator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="spinner"></div>
                  <p>Analyzing repository with AI...</p>
                </motion.div>
              )}
              
              {/* Example Repositories */}
              <motion.div 
                className="example-repos"
                variants={fadeInUp}
              >
                <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '20px', textAlign: 'center' }}>
                  Try these popular repositories:
                </p>
                <div className="example-buttons">
                  <motion.button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setRepoUrl('https://github.com/facebook/react')}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    React
                  </motion.button>
                  <motion.button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setRepoUrl('https://github.com/vuejs/vue')}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Vue.js
                  </motion.button>
                  <motion.button 
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setRepoUrl('https://github.com/nodejs/node')}
                    disabled={loading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Node.js
                  </motion.button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          className="features-section"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="section-title"
            variants={fadeInUp}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="section-subtitle" 
            style={{ fontSize: '1rem', marginTop: '20px', textAlign: 'center' }}
            variants={fadeInUp}
          >
            Our intuitive platform makes it easier for you to understand the project <br></br>AT A GLANCE!<br></br> saving your precious time and effort.
          </motion.p>
          
          <motion.div 
            className="features-grid"
            variants={staggerContainer}
          >
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon">
                <Code size={24} />
              </div>
              <h3 className="feature-title">GitHub Repo Analysis</h3>
              <p className="feature-description">
                Paste a link to a public GitHub repository, and our AI will analyze the code, 
                documentation, and activity to generate insights.
              </p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon">
                <FileText size={24} />
              </div>
              <h3 className="feature-title">Document Upload</h3>
              <p className="feature-description">
                Upload a PDF or Markdown file, and our AI will extract key information 
                and provide a concise summary.
              </p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <div className="feature-icon">
                <BarChart3 size={24} />
              </div>
              <h3 className="feature-title">AI-Powered Insights</h3>
              <p className="feature-description">
                Receive a comprehensive dashboard with a project summary, key features, 
                potential use cases, and relevant visuals/analytics.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default LandingPage
