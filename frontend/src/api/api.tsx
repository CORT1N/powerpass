import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.includes("/auth/login");

    if (error.response && error.response.status === 401 && !isAuthRoute) {
      localStorage.removeItem("access_token");
      sessionStorage.removeItem("aesKey");
    }
    return Promise.reject(error);
  }
);

export default api;