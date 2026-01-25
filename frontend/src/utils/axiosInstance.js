import axios from "axios";

// ✅ Backend URL (MUST be set in Vercel env variables)
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

if (!BASE_URL) {
  console.error(
    "VITE_BACKEND_URL is not defined. Please set it in environment variables."
  );
}

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // set true ONLY if using cookies
});

// ✅ REQUEST INTERCEPTOR (Attach JWT)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (Global Error Handling)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Backend not reachable (network / CORS / server down)
    if (!error.response) {
      console.error("Network error or backend not reachable");
      return Promise.reject({
        message: "Server unreachable. Please try again later.",
      });
    }

    const { status } = error.response;

    // Unauthorized → logout
    if (status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/");
    }

    // Forbidden
    if (status === 403) {
      console.error("Access forbidden");
    }

    // Server error
    if (status >= 500) {
      console.error("Internal server error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
