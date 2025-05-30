import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useThemeStore } from './store/themeStore'
import { usePostStore } from './store/postStore'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Explore from './pages/Explore'
import Notifications from './pages/Notifications'

function App() {
  const { isDark } = useThemeStore()
  const { user, checkAuth } = useAuthStore()
  const { fetchPosts } = usePostStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('App initialization error:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeApp()
  }, [checkAuth])

  useEffect(() => {
    if (user && isInitialized) {
      fetchPosts(1)
    }
  }, [user, isInitialized])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#374151' : '#ffffff',
              color: isDark ? '#ffffff' : '#000000',
            }
          }}
        />
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-all duration-300">
            {user && <Navbar />}
            
            <main className={user ? 'pt-16' : ''}>
              <Routes>
                <Route 
                  path="/" 
                  element={user ? <Home /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/login" 
                  element={!user ? <Login /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/register" 
                  element={!user ? <Register /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/profile/:userId" 
                  element={user ? <Profile /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/explore" 
                  element={user ? <Explore /> : <Navigate to="/login" />} 
                />
                <Route 
                  path="/notifications" 
                  element={user ? <Notifications /> : <Navigate to="/login" />} 
                />
              </Routes>
            </main>
          </div>
        </Router>
      </div>
    </div>
  )
}

export default App
