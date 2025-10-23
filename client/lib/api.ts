import axios from 'axios'
import { useAuthStore } from './store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; username: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  
  logout: () => api.post('/auth/logout'),
  
  verify: () => api.get('/auth/verify'),
  
  googleAuth: () => window.location.href = `${API_URL}/api/auth/google`,
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  
  updateProfile: (data: { username?: string; avatar?: string }) =>
    api.put('/users/profile', data),
  
  searchUser: (uniqueId: string) => api.get(`/users/search/${uniqueId}`),
  
  getUniqueId: () => api.get('/users/unique-id'),
  
  updateSettings: (data: { 
    notifications?: boolean; 
    audioQuality?: string; 
    videoQuality?: string 
  }) => api.put('/users/settings', data),
}

// Friends API
export const friendsAPI = {
  sendRequest: (toUserId: string) => api.post('/friends/request', { toUserId }),
  
  getRequests: () => api.get('/friends/requests'),
  
  respondToRequest: (fromUserId: string, accepted: boolean) =>
    api.post('/friends/request/respond', { fromUserId, accepted }),
  
  getFriends: () => api.get('/friends/list'),
  
  removeFriend: (friendId: string) => api.delete(`/friends/remove/${friendId}`),
}

export default api
