import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, GitCommit, TrendingUp, Code, Database, Cloud, Zap, Shield, Globe, Download, Printer } from 'lucide-react'
import { motion } from 'framer-motion'
import { downloadPDF, printPDF } from '../utils/pdfGenerator'

const InsightsPage = ({ insights }) => {
  if (!insights) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    )
  }

  // Icon mapping for features
  const featureIcons = {
    'Machine Learning Integration': <Zap size={20} />,
    'Real-time Analytics': <Database size={20} />,
    'Scalable Architecture': <Cloud size={20} />,
    'Security Features': <Shield size={20} />,
    'API Integration': <Code size={20} />,
    'Global Deployment': <Globe size={20} />
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
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
        <div className="insights-container">
          {/* Header */}
          <motion.div 
            className="insights-header"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInLeft}>
              <Link to="/" className="btn btn-secondary" style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} />
                Back to Home
              </Link>
            </motion.div>
            <motion.h1 
              className="insights-title"
              variants={fadeInUp}
            >
              About {insights.name}
            </motion.h1>
            <motion.p 
              className="insights-summary"
              variants={fadeInUp}
            >
              {insights.summary}
            </motion.p>
            
            {/* Download Options */}
            <motion.div 
              className="download-options"
              variants={fadeInUp}
              style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'center', 
                marginTop: '24px',
                flexWrap: 'wrap'
              }}
            >
              <button 
                className="btn btn-primary"
                onClick={() => downloadPDF(insights)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={16} />
                Download Report
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => printPDF(insights)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Printer size={16} />
                Print PDF
              </button>
            </motion.div>
          </motion.div>

          <div className="insights-layout">
            {/* Key Features */}
            <motion.div 
              className="card key-features-card"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.h3 
                style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}
                variants={fadeInUp}
              >
                <Code size={24} style={{ color: '#3b82f6' }} />
                Key Features
              </motion.h3>
              <div className="features-grid-insights">
                {insights.keyFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="feature-card-insights"
                    variants={fadeInUp}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className="feature-icon-insights">
                      {featureIcons[feature.title] || <Code size={20} />}
                    </div>
                    <h4 className="feature-title-insights">{feature.title}</h4>
                    <p className="feature-description-insights">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Technologies Used */}
            <motion.div 
              className="card technologies-card"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.h3 
                style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'center', justifyContent: 'center' }}
                variants={fadeInUp}
              >
                <Database size={24} style={{ color: '#3b82f6' }} />
                Technologies Used
              </motion.h3>
              <div className="tech-tags-container">
                {insights.technologies.map((tech, index) => (
                  <motion.span 
                    key={index} 
                    className="tech-tag-enhanced"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Use Cases */}
            <motion.div 
              className="card use-cases-card"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.h3 
                style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}
                variants={fadeInUp}
              >
                <Globe size={24} style={{ color: '#3b82f6' }} />
                Use Cases
              </motion.h3>
              <div className="use-cases-grid">
                {insights.useCases.map((useCase, index) => (
                  <motion.div 
                    key={index} 
                    className="use-case-card"
                    variants={fadeInUp}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    <div className="use-case-icon">
                      <Cloud size={20} />
                    </div>
                    <h4 className="use-case-title">{useCase.title}</h4>
                    <p className="use-case-description">{useCase.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div 
              className="insights-sidebar"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              {/* Analytics Dashboard */}
              <motion.div 
                className="card analytics-dashboard"
                variants={fadeInRight}
              >
                <motion.h3 
                  style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}
                  variants={fadeInUp}
                >
                  <TrendingUp size={24} style={{ color: '#3b82f6' }} />
                  Analytics Dashboard
                </motion.h3>
                
                {/* Project Stats */}
                <div className="analytics-grid-enhanced">
                  <motion.div 
                    className="analytics-card-enhanced"
                    variants={fadeInUp}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="analytics-icon">
                      <Calendar size={24} />
                    </div>
                    <div className="analytics-content">
                      <div className="analytics-value">{insights.analytics.projectAge}</div>
                      <div className="analytics-label">Project Age</div>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="analytics-card-enhanced"
                    variants={fadeInUp}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  >
                    <div className="analytics-icon">
                      <GitCommit size={24} />
                    </div>
                    <div className="analytics-content">
                      <div className="analytics-value">{insights.analytics.totalCommits}</div>
                      <div className="analytics-label">Total Commits</div>
                    </div>
                  </motion.div>
                </div>

                {/* Top Contributors */}
                <div className="contributors-section">
                  <motion.h4 
                    className="section-subtitle"
                    variants={fadeInUp}
                  >
                    <Users size={20} />
                    Top Contributors
                  </motion.h4>
                  <div className="contributors-list">
                    {insights.analytics.contributors.map((contributor, index) => (
                      <motion.div 
                        key={index} 
                        className="contributor-item-enhanced"
                        variants={fadeInUp}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      >
                        <div className="contributor-avatar-enhanced">
                          {contributor.avatar}
                        </div>
                        <div className="contributor-info">
                          <div className="contributor-name">{contributor.name}</div>
                          <div className="contributor-contributions">
                            {contributor.contributions.toLocaleString()} contributions
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="timeline-section">
                  <motion.h4 
                    className="section-subtitle"
                    variants={fadeInUp}
                  >
                    <TrendingUp size={20} />
                    Project Timeline
                  </motion.h4>
                  <div className="timeline-enhanced">
                    {insights.analytics.timeline.map((item, index) => (
                      <motion.div 
                        key={index} 
                        className="timeline-item-enhanced"
                        variants={fadeInUp}
                        whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      >
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <span className="timeline-date">{item.date}</span>
                          <span className="timeline-event">{item.event}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InsightsPage
