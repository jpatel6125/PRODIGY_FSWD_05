import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import InfiniteScroll from 'react-infinite-scroll-component'
import { usePostStore } from '../store/postStore'
import PostCard from '../components/PostCard'
import PostSkeleton from '../components/PostSkeleton'
import Stories from '../components/Stories'

const Home = () => {
  const { posts, isLoading, hasMore, error, fetchPosts } = usePostStore()

  useEffect(() => {
    fetchPosts(1)
  }, []) // Remove dependencies to prevent loop

  const loadMore = () => {
    if (!isLoading && hasMore) {
      fetchPosts()
    }
  }

  return (
    <div className="min-h-screen light-bg transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {/* Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Stories />
        </motion.div>

        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {posts.length > 0 ? (
            <InfiniteScroll
              dataLength={posts.length}
              next={loadMore}
              hasMore={hasMore}
              loader={<PostSkeleton />}
              endMessage={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    You've caught up with all posts!
                  </p>
                </motion.div>
              }
              className="space-y-6"
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </InfiniteScroll>
          ) : isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start following people or create your first post!
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Home
