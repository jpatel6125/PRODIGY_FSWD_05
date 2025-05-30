import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = '/api'
axios.defaults.withCredentials = true

export const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  hasMore: true,
  page: 1,
  error: null,

  fetchPosts: async (page = 1) => {
    set({ isLoading: true, error: null })
    try {
      console.log('Fetching posts from:', `${API_URL}/posts?page=${page}&limit=10`)
      const response = await axios.get(`${API_URL}/posts?page=${page}&limit=10`)
      const newPosts = response.data.posts || []

      if (page === 1) {
        set({ 
          posts: newPosts, 
          page: 2, 
          hasMore: newPosts.length === 10,
          isLoading: false 
        })
      } else {
        set(state => ({
          posts: [...state.posts, ...newPosts],
          hasMore: newPosts.length === 10,
          page: state.page + 1,
          isLoading: false
        }))
      }
    } catch (error) {
      console.error('Fetch posts error:', error.response?.data || error.message)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to load posts'
      })
      toast.error('Failed to load posts')
    }
  },

  createPost: async (postData) => {
    try {
      const response = await axios.post(`${API_URL}/posts`, postData)
      const newPost = response.data.post

      set(state => ({
        posts: [newPost, ...state.posts]
      }))

      toast.success('Post created successfully!')
      return { success: true, post: newPost }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post'
      toast.error(message)
      return { success: false, error: message }
    }
  },

  likePost: async (postId) => {
    try {
      // Optimistic update
      set(state => ({
        posts: state.posts.map(post =>
          post._id === postId 
            ? { 
                ...post, 
                likes: post.isLiked 
                  ? post.likes.filter(id => id !== 'current-user')
                  : [...post.likes, 'current-user'],
                isLiked: !post.isLiked
              } 
            : post
        )
      }))

      const response = await axios.post(`${API_URL}/posts/${postId}/like`)
      return response.data
    } catch (error) {
      console.error('Like post error:', error)
      // Revert optimistic update on error
      set(state => ({
        posts: state.posts.map(post =>
          post._id === postId 
            ? { 
                ...post, 
                likes: post.isLiked 
                  ? [...post.likes, 'current-user']
                  : post.likes.filter(id => id !== 'current-user'),
                isLiked: !post.isLiked
              } 
            : post
        )
      }))
      toast.error('Failed to like post')
    }
  },

  addComment: async (postId, content) => {
    try {
      const response = await axios.post(`${API_URL}/posts/${postId}/comments`, {
        content
      })

      set(state => ({
        posts: state.posts.map(post =>
          post._id === postId 
            ? { ...post, comments: [...post.comments, response.data.comment] }
            : post
        )
      }))

      return { success: true, comment: response.data.comment }
    } catch (error) {
      console.error('Add comment error:', error)
      toast.error('Failed to add comment')
      return { success: false, error: error.response?.data?.message || 'Failed to add comment' }
    }
  },

  deletePost: async (postId) => {
    try {
      await axios.delete(`${API_URL}/posts/${postId}`)
      
      set(state => ({
        posts: state.posts.filter(post => post._id !== postId)
      }))

      toast.success('Post deleted successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete post'
      toast.error(message)
      throw error
    }
  }
}))
