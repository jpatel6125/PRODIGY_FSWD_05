import React from 'react'

const PostSkeleton = () => {
  return (
    <div className="vibrant-card rounded-2xl p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>

      {/* Media placeholder */}
      <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>

      {/* Actions */}
      <div className="flex items-center space-x-6">
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
    </div>
  )
}

export default PostSkeleton
