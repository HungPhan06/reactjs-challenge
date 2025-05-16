import axiosClient from './axiosClient';

export const onLogin = async ({ username, password }) => {
  const response = await axiosClient.post('/auth/login', { username, password });
  return response.data;
};

export const onLogout = async () => {
  await axiosClient.post('/auth/logout');
};
