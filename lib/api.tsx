import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Create an Axios instance
const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true, // Ensures cookies are sent with requests
});



// Add request interceptor to include the access token in headers

// Add response interceptor to handle token refresh
api.interceptors.response.use(

  (response) => response,
  async (error) => {
  
    const originalRequest = error.config;

    // If the error is due to an expired access token (401) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('Attempting to refresh token...');

        // Refresh the access token
        const refreshResponse = await axios.post(
          'http://localhost:8000/api/token/refresh/',
          {},
          { withCredentials: true }
        );

        console.log('Token refresh successful:', refreshResponse.data);

        // Update the access token in cookies
        Cookies.set('access_token', refreshResponse.data.access, { secure: true, sameSite: 'strict' });

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);

        // Redirect to login if token refresh fails
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;