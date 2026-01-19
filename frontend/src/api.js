import axios from "axios";

// Creating a central instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Update this if your backend port changes
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Get token from localStorage
    const token = localStorage.getItem("token");
    
    // 2. If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;