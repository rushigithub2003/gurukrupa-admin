import React, { useState, useEffect } from "react";
import Settings from "./pages/Settings";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsListPage from "./pages/ProductsListPage";
import ProductFormPage from "./pages/ProductFormPage";
import CategoriesPage from "./pages/CategoriesPage";
import LoadingScreen from "./components/LoadingScreen";

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) {
    // return <LoadingScreen />;
    
    return null;
  }
  if (!admin) return <Navigate to="/login" replace />;
return children;
}

export default function App() {

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="products/edit/:id" element={<ProductFormPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
