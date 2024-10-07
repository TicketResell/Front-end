import axios from "axios";
const baseUrl = "http://localhost:8084/api/";


const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;


const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  if(token){
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
  
};

api.interceptors.request.use(handleBefore, (error) => {
  return Promise.reject(error);
});


export default api;

