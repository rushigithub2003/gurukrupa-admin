// src/api.js — Admin panel API with JWT auth

import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

//this is for after deployment

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
// ============================================================
// Attach JWT token to every request
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// Handle authentication errors
// ============================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ============================================================
// AUTH
// ============================================================

export const authAPI = {
  login: (data) =>
    api.post("/auth/login", data),

  getMe: () =>
    api.get("/auth/me"),

  changePassword: (data) =>
    api.put("/auth/change-password", data),

  updateProfile: (data) =>
    api.put("/auth/update-profile", data),
};

// ============================================================
// PRODUCTS
// ============================================================

export const productsAPI = {
  // Admin product list
  // Includes active + inactive products
  getAll: (params) =>
    api.get("/products/admin/all", { params }),

  // Admin single product
  // Allows editing inactive products
  getOne: (id) =>
    api.get(`/products/admin/${id}`),

  // Create product
  create: (data) =>
    api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Update product
  update: (id, data) =>
    api.put(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // Delete product
  delete: (id) =>
    api.delete(`/products/${id}`),

  // Dashboard statistics
  getStats: () =>
    api.get("/products/admin/stats"),
};

// ============================================================
// CATEGORIES
// ============================================================

export const categoriesAPI = {
  // Admin gets both active and inactive categories
  getAll: () =>
    api.get("/categories/admin/all"),

  create: (data) =>
    api.post("/categories", data),

  update: (id, data) =>
    api.put(`/categories/${id}`, data),

  delete: (id) =>
    api.delete(`/categories/${id}`),
};

export default api;