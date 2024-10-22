import axios from "axios";

// Instance cho API
const api = axios.create({
  baseURL: "http://localhost:8084/api",
  timeout: 5000,
});

// Instance cho các yêu cầu không sử dụng /api
const apiWithoutPrefix = axios.create({
  baseURL: "http://localhost:8084",
  timeout: 5000,
});

// Thêm interceptor cho instance API nếu cần
const handleBefore = (config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(handleBefore, (error) => {
  return Promise.reject(error);
});

// Export cả hai instance
export default api;
export {apiWithoutPrefix };
