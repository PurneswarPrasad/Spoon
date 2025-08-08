import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Diamond } from 'lucide-react'
import { motion } from 'framer-motion'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')
      const userData = urlParams.get('user')
      
      if (token && userData) {
        try {
          const user = JSON.parse(decodeURIComponent(userData))
          login(user, token)
          
          // Clean up URL and redirect
          window.history.replaceState({}, document.title, '/')
          navigate('/', { replace: true })
        } catch (error) {
          console.error('Error processing login:', error)
          navigate('/login', { replace: true })
        }
      } else {
        console.error('Missing token or user data')
        navigate('/login', { replace: true })
      }
    }

    // Small delay to ensure the component is mounted
    const timer = setTimeout(handleCallback, 100)
    return () => clearTimeout(timer)
  }, [login, navigate])

  return (
    <div className="loading-screen">
      <motion.div 
        className="loading-spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Diamond size={32} />
      </motion.div>
      <p>Processing login...</p>
    </div>
  )
}

export default AuthCallback