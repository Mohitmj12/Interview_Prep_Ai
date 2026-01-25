import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
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

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔴 BACKEND DOWN / NETWORK ERROR
    if (!error.response) {
      console.error("Backend not reachable");
      return Promise.reject({
        message: "Backend not reachable",
      });
    }

    const status = error.response.status;

    if (status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else if (status === 500) {
      console.error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
