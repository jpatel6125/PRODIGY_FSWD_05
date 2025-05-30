import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Link as LinkIcon, 
  Grid3X3, 
  Heart, 
  MessageCircle,
  Settings
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { formatDistanceToNow } from 'date-fns'
import EditProfileModal from '../components/EditProfileModal'
import axios from 'axios'
import toast from 'react-hot-toast'

const Profile = () => {
  const { userId } = useParams()
  const { user: currentUser } = useAuthStore()
  const [profileUser, setProfileUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEditModal, setShowEditModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const isOwnProfile = !userId || userId === currentUser?._id

  useEffect(() => {
    if (isOwnProfile) {
      setProfileUser(currentUser)
      setIsLoading(false)
    } else {
      loadUserProfile()
    }
  }, [userId, currentUser, isOwnProfile])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`/api/users/${userId}`)
      setProfileUser(response.data.user)
      setUserPosts(response.data.posts || [])
    } catch (error) {
      console.error('Load profile error:', error)
      toast.error('Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            User not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The user you're looking for doesn't exist.
          </p>
        </div>
      </div>
    )
  }

  const stats = {
    posts: userPosts.length,
    followers: profileUser.followers?.length || 0,
    following: profileUser.following?.length || 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="vibrant-card rounded-2xl p-8 mb-8 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400"></div>
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <div className="relative z-10">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative group">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={profileUser.avatar || `https://ui-avatars.com/api/?name=${profileUser.username}&background=3b82f6&color=ffffff`}
                  alt={profileUser.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                />
                {isOwnProfile && (
                  <motion.div
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 rounded-full opacity-0 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white" />
                  </motion.div>
                )}
                {profileUser.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-600 dark:bg-blue-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-white text-lg">✓</span>
                  </div>
                )}
              </div>

              {/* User Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {profileUser.fullName}
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-gray-400 mb-2">
                      @{profileUser.username}
                    </p>
                  </div>
                  {isOwnProfile && (
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowEditModal(true)}
                        className="px-6 py-2 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-blue-600 dark:to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                      >
                        <Settings className="w-4 h-4 mr-2 inline" />
                        Edit Profile
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Bio */}
                {profileUser.bio && (
                  <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {profileUser.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-center md:justify-start space-x-8 mb-4">
                  {Object.entries(stats).map(([key, value]) => (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      className="text-center cursor-pointer"
                    >
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {value}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-gray-400 capitalize">
                        {key}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Joined {formatDistanceToNow(new Date(profileUser.createdAt))} ago
                  </div>
                  {profileUser.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profileUser.location}
                    </div>
                  )}
                  {profileUser.website && (
                    <div className="flex items-center">
                      <LinkIcon className="w-4 h-4 mr-1" />
                      <a 
                        href={profileUser.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {profileUser.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {userPosts.map((post, index) => (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="vibrant-card rounded-xl overflow-hidden hover-scale cursor-pointer group"
            >
              {post.media && post.media.length > 0 ? (
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={post.media[0].url}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center space-x-4 text-white">
                      <div className="flex items-center">
                        <Heart className="w-5 h-5 mr-1" />
                        {post.likes?.length || 0}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-5 h-5 mr-1" />
                        {post.comments?.length || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 p-6 flex items-center justify-center">
                  <p className="text-gray-800 dark:text-gray-200 text-center font-medium">
                    {post.content.substring(0, 100)}...
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {userPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900/20 dark:to-gray-800/20 rounded-full flex items-center justify-center">
              <Grid3X3 className="w-16 h-16 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              No posts yet
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              {isOwnProfile 
                ? 'Share your first post to get started!' 
                : `${profileUser.fullName} hasn't posted anything yet.`}
            </p>
          </motion.div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  )
}

export default Profile
