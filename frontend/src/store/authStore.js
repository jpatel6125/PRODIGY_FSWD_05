import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = '/api'
axios.defaults.withCredentials = true

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      set({ user: response.data.user, isLoading: false })
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      set({ isLoading: false })
      throw error
    }
  },

  register: async (userData) => {
    set({ isLoading: true })
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData)
      set({ user: response.data.user, isLoading: false })
      toast.success('Registration successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      set({ isLoading: false })
      throw error
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`)
      set({ user: response.data.user })
      return response.data.user
    } catch (error) {
      set({ user: null })
      return null
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`)
      set({ user: null })
      toast.success('Logged out successfully!')
    } catch (error) {
      set({ user: null })
    }
  },

  followUser: async (userId) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/follow`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Follow action failed'
      toast.error(message)
      throw error
    }
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true })
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, profileData)
      
      set({ user: response.data.user, isLoading: false })
      toast.success('Profile updated successfully!')
      return response.data.user
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed'
      toast.error(message)
      set({ isLoading: false })
      throw error
    }
  },

  updateAvatar: async (avatarFile) => {
    set({ isLoading: true })
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)

      const response = await axios.put(`${API_URL}/auth/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      })
      
      set({ user: response.data.user, isLoading: false })
      toast.success('Avatar updated successfully!')
      return response.data.user.avatar
    } catch (error) {
      const message = error.response?.data?.message || 'Avatar update failed'
      toast.error(message)
      set({ isLoading: false })
      throw error
    }
  }
}))
