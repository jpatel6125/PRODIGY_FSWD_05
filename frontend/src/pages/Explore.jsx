import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, User, MapPin, UserPlus, UserCheck, TrendingUp } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const { user, followUser } = useAuthStore()

  // Load suggestions and trending posts on component mount
  useEffect(() => {
    loadSuggestions()
    loadTrendingPosts()
  }, [])

  // Search users with debouncing
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const delayedSearch = setTimeout(() => {
        searchUsers()
      }, 300)
      return () => clearTimeout(delayedSearch)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const searchUsers = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const response = await axios.get(`/api/users/search/${encodeURIComponent(searchQuery)}`)
      setSearchResults(response.data.users || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search users')
    } finally {
      setIsSearching(false)
    }
  }

  const loadSuggestions = async () => {
    setIsLoadingSuggestions(true)
    try {
      const response = await axios.get('/api/users/suggestions/for-you')
      setSuggestions(response.data.suggestions || [])
    } catch (error) {
      console.error('Load suggestions error:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const loadTrendingPosts = async () => {
    try {
      const response = await axios.get('/api/posts/trending')
      setTrendingPosts(response.data.posts || [])
    } catch (error) {
      console.error('Load trending posts error:', error)
    }
  }

  const handleFollow = async (userId) => {
    try {
      await followUser(userId)
      // Update suggestions to remove followed user
      setSuggestions(prev => prev.filter(u => u._id !== userId))
      // Update search results if following from search
      setSearchResults(prev => prev.map(u => 
        u._id === userId ? { ...u, isFollowing: true } : u
      ))
      toast.success('User followed successfully!')
    } catch (error) {
      console.error('Follow error:', error)
    }
  }

  const UserCard = ({ userData, showFollowButton = true }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="vibrant-card rounded-xl p-4 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <img
          src={userData.avatar || `https://ui-avatars.com/api/?name=${userData.username}&background=3b82f6&color=ffffff`}
          alt={userData.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <div className="flex items-center space-x-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {userData.fullName}
            </h3>
            {userData.isVerified && (
              <span className="text-blue-500">✓</span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-400">@{userData.username}</p>
          {userData.bio && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 line-clamp-1">
              {userData.bio}
            </p>
          )}
        </div>
      </div>
      
      {showFollowButton && userData._id !== user?._id && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleFollow(userData._id)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Follow</span>
        </motion.button>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover new people and trending content
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="vibrant-card rounded-2xl p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by username or name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Search Results
              </h3>
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((userData) => (
                    <UserCard key={userData._id} userData={userData} />
                  ))}
                </div>
              ) : !isSearching ? (
                <div className="text-center py-8">
                  <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No users found for "{searchQuery}"
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </motion.div>

        {/* Suggestions Section */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="vibrant-card rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center space-x-2 mb-6">
              <UserPlus className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Suggested for You
              </h2>
            </div>

            {isLoadingSuggestions ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="flex items-center space-x-3 p-4">
                      <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((userData) => (
                  <UserCard key={userData._id} userData={userData} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 dark:text-gray-400">
                  No new suggestions at the moment
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Trending Posts Section */}
        {!searchQuery && trendingPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="vibrant-card rounded-2xl p-6"
          >
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Trending Posts
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingPosts.slice(0, 6).map((post) => (
                <motion.div
                  key={post._id}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center space-x-2 mb-3">
                    <img
                      src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.username}&background=3b82f6&color=ffffff`}
                      alt={post.author.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {post.author.fullName}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        @{post.author.username}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{post.likes?.length || 0} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Explore
