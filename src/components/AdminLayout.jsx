// components/AdminLayout.jsx — Sidebar + topbar shell

import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { maintenanceAPI } from "../services/api";

const navItems = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/products", icon: "📦", label: "Products" },
  { to: "/categories", icon: "🗂️", label: "Categories" },
  { to: "/settings", icon: "⚙️", label: "Website Settings" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ============================================================
  // WEBSITE PREVIEW STATE
  // ============================================================

  const [previewLoading, setPreviewLoading] = useState(false);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ============================================================
  // OPEN SECURE WEBSITE PREVIEW
  // ============================================================

  const handlePreviewWebsite = async () => {
    // Prevent duplicate requests
    if (previewLoading) {
      return;
    }

    try {
      setPreviewLoading(true);

      // Request temporary preview token from backend
      const response = await maintenanceAPI.createPreview();

      const token = response.data?.token;

      if (!token) {
        throw new Error("Preview token was not returned by the server.");
      }

      // Public frontend URL
      const websiteUrl =
        "https://gurukrupa-frontend.vercel.app/";
       // "http://localhost:5174/";

      // Create temporary preview URL
      const previewUrl = `${websiteUrl}?preview=${encodeURIComponent(token)}`;

      // Open preview in a new tab
      window.open(previewUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Website preview failed:", error);

      if (error.response?.status === 401) {
        alert("Your admin session has expired. Please login again.");
      } else if (error.response?.status === 403) {
        alert("You are not authorized to preview the website.");
      } else {
        alert("Unable to open website preview. Please try again.");
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ======================================================
          MOBILE OVERLAY
      ====================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64
          bg-slate-900 flex flex-col
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-md">
              <img
                src="/log-guru.png"
                alt="Gurukrupa Enterprises"
                className="w-25 h-25 object-contain"
              />
            </div>

            <div>
              <h2 className="text-white font-bold text-base leading-tight">
                Gurukrupa
              </h2>

              <p className="text-slate-400 text-xs">Enterprises</p>

              <p className="text-blue-400 text-[11px] font-medium">
                Admin Panel
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest px-4 mb-2 font-semibold">
            Main Menu
          </p>

          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ==================================================
            ADMIN INFO + LOGOUT
        ================================================== */}

        <div className="px-3 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {admin?.name?.[0]?.toUpperCase()}
            </div>

            <div>
              <div className="text-white text-xs font-semibold">
                {admin?.name}
              </div>

              <div className="text-slate-400 text-[10px] truncate max-w-[130px]">
                {admin?.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left sidebar-link text-red-400 hover:bg-red-900/20 hover:text-red-300"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ==================================================
            TOPBAR
        ================================================== */}

        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <button
              className="lg:hidden text-gray-500 p-1.5 rounded hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>

            {/* Company */}
            <div className="flex items-center gap-3">
              <img
                src="/log-guru.png"
                alt="Logo"
                className="w-16 h-16 object-contain"
              />

              <div>
                <h1 className="font-bold text-gray-800 text-base">
                  Gurukrupa Enterprises
                </h1>

                <p className="text-xs text-gray-500">Administration Panel</p>
              </div>
            </div>
          </div>

          {/* ==================================================
              TOPBAR RIGHT
          ================================================== */}

          <div className="flex items-center gap-3">
            {/* =================================================
                PREVIEW WEBSITE
            ================================================= */}

            <button
              type="button"
              onClick={handlePreviewWebsite}
              disabled={previewLoading}
              title={
                previewLoading
                  ? "Opening website preview..."
                  : "Preview the public website"
              }
              className={`
                hidden sm:inline-flex
                items-center gap-2
                rounded-lg
                px-3 py-2
                text-xs font-semibold
                transition-all duration-200
                ${
                  previewLoading
                    ? "bg-blue-50 text-blue-400 cursor-not-allowed"
                    : "text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm"
                }
              `}
            >
              <span className="text-sm">{previewLoading ? "⏳" : "🌐"}</span>

              <span>{previewLoading ? "Opening..." : "Preview Website"}</span>
            </button>

            {/* Admin name */}
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              👤 {admin?.name}
            </div>
          </div>
        </header>

        {/* ======================================================
            PAGE CONTENT
        ====================================================== */}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
