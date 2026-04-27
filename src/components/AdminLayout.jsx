// components/AdminLayout.jsx — Sidebar + topbar shell
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard',  icon: '📊', label: 'Dashboard' },
  { to: '/products',   icon: '📦', label: 'Products'  },
  { to: '/categories', icon: '🗂️', label: 'Categories' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col transition-transform duration-300
        lg:static lg:z-auto lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold font-display text-lg">G</div>
            <div>
              <div className="text-white font-display font-bold text-sm leading-tight">Gurukrupa</div>
              <div className="text-slate-400 text-[10px]">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest px-4 mb-2 font-semibold">Main Menu</p>
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <span>{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin info + logout */}
        <div className="px-3 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              {admin?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-white text-xs font-semibold">{admin?.name}</div>
              <div className="text-slate-400 text-[10px] truncate max-w-[130px]">{admin?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full text-left sidebar-link text-red-400 hover:bg-red-900/20 hover:text-red-300">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500 p-1.5 rounded hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>☰</button>
            <h1 className="font-display font-semibold text-gray-800 text-base hidden sm:block">Gurukrupa Enterprises Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline hidden sm:block">🌐 View Website</a>
            <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              👤 {admin?.name}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}