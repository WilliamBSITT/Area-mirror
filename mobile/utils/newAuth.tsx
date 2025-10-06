import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Save tokens securely
await SecureStore.setItemAsync('accessToken', tokenResult.accessToken);
await SecureStore.setItemAsync('refreshToken', tokenResult.refreshToken);


// Create an axios instance with automatic token refresh
const api = axios.create({ baseURL: `http://${process.env.EXPO_PUBLIC_IP}:8080/auth/token` });

// Add interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    // If error is 401 and we haven't tried refreshing yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      
      try {
        // Get refresh token
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        
        // Exchange for new tokens
        const response = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:8080/auth/token`, {
          refreshToken,
        });

        
        // Save new tokens
        await SecureStore.setItemAsync('accessToken', response.data.accessToken);
        await SecureStore.setItemAsync('refreshToken', response.data.refreshToken);

        
        // Update authorization header
        originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
        

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log user out
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);