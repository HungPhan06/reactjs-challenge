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

axiosClient.interceptors.response.use(
  async function (response) {
    return response
  },
  async function (error) {
    if (error.response && [403, 401].includes(error.response?.data?.code)) {
      forceLogout()
    }
    return error.response ?? error
  },
)

const forceLogout = async () => {
  try {
    useAuthStore.setState({ user: null, token: null });
    useAuthStore.getState().setOpenLogin(true);
  } catch (error) { console.log(error) }
}

export default axiosClient;
