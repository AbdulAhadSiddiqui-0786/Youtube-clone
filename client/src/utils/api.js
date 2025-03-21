import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Export the axios instance directly
export default api;

// Create separate object for organized endpoints
export const API_ENDPOINTS = {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getMe: () => api.get('/auth/me'),
  },
  videos: {
    getAll: (params) => api.get('/videos', { params }),
    getById: (id) => api.get(`/videos/${id}`),
    create: (videoData) => api.post('/videos', videoData),
    update: (id, videoData) => api.put(`/videos/${id}`, videoData),
    delete: (id) => api.delete(`/videos/${id}`),
  },
  comments: {
    create: (videoId, commentData) => api.post(`/videos/${videoId}/comments`, commentData),
    delete: (videoId, commentId) => api.delete(`/videos/${videoId}/comments/${commentId}`),
  },
  channels: {
    getById: (id) => api.get(`/channels/${id}`),
    create: (channelData) => api.post('/channels', channelData),
  }
};