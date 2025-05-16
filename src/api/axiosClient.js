import axios from 'axios';
import { useAuthStore } from '../store/auth';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL + "/api/v1",
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
