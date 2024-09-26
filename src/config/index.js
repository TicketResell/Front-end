import axios from "axios";
const baseUrl = "http://14.225.220.131:8084/api/";


const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;


const handleBefore = (config) => {
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
  
};

api.interceptors.request.use(handleBefore, null);


export default api;

