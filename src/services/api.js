// src/api.js — Admin panel API with JWT auth
import axios from 'axios';

// const api = axios.create({
//   baseURL: "http://localhost:5000/api"
// });


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login:  (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  // changePassword: (data) => api.put('/auth/change-password', data),
  // updateProfile: (data) => api.put('/auth/update-profile', data), // ✅ add this
};

export const productsAPI = {
  getAll:  (params) => api.get('/products/admin/all', { params }),
  getOne:  (id)     => api.get(`/products/${id}`),
  create:  (data)   => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:  (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:  (id)     => api.delete(`/products/${id}`),
  getStats:()       => api.get('/products/admin/stats'),
};

export const categoriesAPI = {
  getAll:  () => api.get('/categories?all=true'),
  create:  (data) => api.post('/categories', data),
  update:  (id, data) => api.put(`/categories/${id}`, data),
  delete:  (id) => api.delete(`/categories/${id}`),
};

export default api;