import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Sun, 
  Moon,
  Plus,
  MessageCircle
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'
import CreatePostModal from './CreatePostModal'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const { isDark, toggleTheme } = useThemeStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Search },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: `/profile/${user?._id}`, icon: User },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-100 dark:border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-slate-400 to-slate-600 dark:from-blue-500 dark:to-purple-600 rounded-lg flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-blue-600 dark:to-purple-600 bg-clip-text text-transparent">
                SocialHub
              </span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'text-slate-700 dark:text-blue-400' 
                        : 'text-slate-500 dark:text-gray-300 hover:text-slate-700 dark:hover:text-blue-400'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-slate-100 dark:bg-blue-900/30 rounded-lg -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Create Post */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="p-2 rounded-lg bg-slate-600 dark:bg-blue-600 text-white hover:bg-slate-700 dark:hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <Link to={`/profile/${user?._id}`}>
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=e2e8f0&color=475569`}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-slate-200 dark:border-white/20"
                  />
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 dark:border-white/20">
          <div className="flex justify-around items-center h-16 px-4">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'text-primary-900 dark:text-white bg-gradient-to-r from-accent-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 shadow-md' 
                      : 'text-primary-700 dark:text-gray-300'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </Link>
              )
            })}
          </div>
        </div>
      </motion.nav>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </>
  )
}

export default Navbar
