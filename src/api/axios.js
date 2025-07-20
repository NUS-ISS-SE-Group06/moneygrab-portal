import axios from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

const api = axios.create({
  //baseURL: "https://r6zsml2v4c.execute-api.ap-southeast-1.amazonaws.com/PRD",
   baseURL: "http://localhost:8688",
  headers: {
    "Content-Type": "application/json"
  }
});

// Updated interceptor to use Amplify's token management
api.interceptors.request.use(
  async (config) => {
    try {
      // Get fresh tokens from Amplify (handles refresh automatically)
      const session = await fetchAuthSession();
      
      const idToken = session.tokens?.idToken?.toString();
      const accessToken = session.tokens?.accessToken?.toString();

      // Add tokens to headers if they exist
      if (idToken) {
        config.headers["X-ID-Token"] = idToken;
      }
      
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }

      console.log("Axios: Added tokens to request headers");
      
    } catch (error) {
      console.error("Axios: Failed to get auth session:", error);
      // Continue with request even if token fetch fails
      // The API will return 401 if authentication is required
    }

    return config;
  },
  (error) => {
    console.error("Axios: Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Axios: Got 401, attempting to refresh tokens...");
        
        // Force refresh the session
        const session = await fetchAuthSession({ forceRefresh: true });
        
        const idToken = session.tokens?.idToken?.toString();
        const accessToken = session.tokens?.accessToken?.toString();

        if (idToken) {
          originalRequest.headers["X-ID-Token"] = idToken;
        }
        
        if (accessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }

        console.log("Axios: Retrying request with refreshed tokens");
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error("Axios: Token refresh failed:", refreshError);
        
        // Redirect to login if refresh fails
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;