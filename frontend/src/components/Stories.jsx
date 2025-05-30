import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const Stories = () => {
  const { user } = useAuthStore()
  
  // Empty stories array since we removed mock data
  const stories = []

  return (
    <div className="vibrant-card rounded-2xl p-6 hover-scale">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mr-3 animate-pulse"></span>
        Stories
      </h2>
      
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {/* Add Story */}
        <div className="flex-shrink-0 text-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5 cursor-pointer float"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
              <Plus className="w-6 h-6 text-blue-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
            </div>
          </motion.div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">Add Story</p>
        </div>

        {/* Stories - currently empty but ready for real data */}
        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0 text-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 p-0.5 cursor-pointer"
            >
              <img
                src={story.avatar || `https://ui-avatars.com/api/?name=${story.username}&background=e2e8f0&color=475569`}
                alt={story.username}
                className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 pulse-ring"></div>
            </motion.div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium truncate w-16">
              {story.username}
            </p>
          </div>
        ))}
        
        {/* Empty state message when no stories */}
        {stories.length === 0 && (
          <div className="flex items-center justify-center w-full py-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No stories to show
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Stories
