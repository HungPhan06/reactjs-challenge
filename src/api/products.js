import axiosClient from './axiosClient';
import { useAuthStore } from '../store/auth';

export const getProducts = async (search = '', page = 1, limit = 5) => {
  const user = useAuthStore.getState().user;
  const params = { page: page, limit: limit, user_id: user?.id };
  if (search && search.trim() !== '') {
    params.q = search.trim();
    const res = await axiosClient.get(`/products/search`, { params });
    return res.data;
  } else {
    const res = await axiosClient.get(`/products`, { params });
    return res.data;
  }
};

export const addProduct = async (data) => {
  const res = await axiosClient.post('/products', data);
  return res.data;
};

export const likeProduct = async (id) => {
  const res = await axiosClient.post(`/products/${id}/like`);
  return res.data;
};

export const getCategories = async () => {
  const res = await axiosClient.get(`/categories`);
  return res.data;
};

export const getSubcategories = async (category_id = '') => {
  const res = await axiosClient.get(`/subcategories`, { params: { category_id } });
  return res.data;
};