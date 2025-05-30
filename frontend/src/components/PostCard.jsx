import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  MapPin,
  Clock
} from 'lucide-react'
import { usePostStore } from '../store/postStore'
import { useAuthStore } from '../store/authStore'
import { formatDistanceToNow } from 'date-fns'

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [isLiked, setIsLiked] = useState(post.isLiked)
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  
  const { likePost, addComment } = usePostStore()
  const { user } = useAuthStore()

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    await likePost(post._id)
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    
    const result = await addComment(post._id, newComment.trim())
    if (result.success) {
      setNewComment('')
    }
  }

  return (
    <motion.div
      layout
      className="vibrant-card rounded-2xl overflow-hidden hover-scale"
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="relative"
            >
              <img
                src={post.author?.avatar || `https://ui-avatars.com/api/?name=${post.author?.username || 'User'}&background=e2e8f0&color=475569`}
                alt={post.author?.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-white/50 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800"></div>
            </motion.div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
                {post.author?.username}
                <span className="w-1 h-1 bg-blue-500 rounded-full mx-2"></span>
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Following</span>
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </motion.button>
        </div>

        {/* Content */}
        {post.content && (
          <div className="mt-4">
            <p className="text-gray-900 dark:text-white leading-relaxed">
              {post.content}
            </p>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium cursor-pointer hover:shadow-md transition-all"
                  >
                    #{tag}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="px-6">
          <div className={`grid gap-2 rounded-xl overflow-hidden ${
            post.media.length === 1 ? 'grid-cols-1' : 
            post.media.length === 2 ? 'grid-cols-2' : 
            'grid-cols-2'
          }`}>
            {post.media.map((media, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className={`relative group ${
                  post.media.length === 3 && index === 0 ? 'col-span-2' : ''
                }`}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt="Post media"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-6 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors relative ${
                isLiked 
                  ? 'text-red-500' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
              <span className="font-medium">{likesCount}</span>
              {isLiked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 text-xs"
                >
                  ❤️
                </motion.div>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{post.comments?.length || 0}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors"
            >
              <Share className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              {/* Comments List */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {post.comments?.map((comment, index) => (
                  <motion.div
                    key={comment._id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-3"
                  >
                    <img
                      src={comment.author?.avatar || `https://ui-avatars.com/api/?name=${comment.author?.username || 'User'}&background=e2e8f0&color=475569`}
                      alt={comment.author?.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1 glass rounded-lg p-3">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {comment.author?.username}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mt-1">
                        {comment.content}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add Comment */}
              <form onSubmit={handleComment} className="flex items-center space-x-3">
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=e2e8f0&color=475569`}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default PostCard
