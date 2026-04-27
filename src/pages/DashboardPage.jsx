// pages/DashboardPage.jsx — Overview with stats and recent products
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white rounded-xl p-5 border-l-4 ${color} shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-3xl font-display font-bold text-gray-800">{value ?? '—'}</p>
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats,    setStats]    = useState(null);
  const [recent,   setRecent]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      productsAPI.getStats(),
      productsAPI.getAll({ limit: 6 }),
    ]).then(([sr, pr]) => {
      setStats(sr.data);
      setRecent(pr.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/products/new" className="btn-primary flex items-center gap-2">
          + Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="📦" label="Total Products"    value={stats?.totalProducts}    color="border-blue-500" />
        <StatCard icon="✅" label="Active Products"   value={stats?.activeProducts}   color="border-green-500" />
        <StatCard icon="⭐" label="Featured Products" value={stats?.featuredProducts} color="border-yellow-500" />
        <StatCard icon="🗂️" label="Categories"        value={stats?.totalCategories}  color="border-purple-500" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { to:'/products/new', icon:'➕', label:'Add New Product',  desc:'Create a product listing',    color:'bg-blue-600' },
          { to:'/categories',   icon:'🗂️', label:'Manage Categories',desc:'Add or edit categories',      color:'bg-purple-600' },
          { to:'/products',     icon:'📋', label:'View All Products',desc:'Browse and manage products', color:'bg-green-600' },
        ].map(({ to, icon, label, desc, color }) => (
          <Link key={to} to={to} className={`${color} text-white rounded-xl p-5 hover:opacity-90 transition-opacity`}>
            <span className="text-2xl mb-2 block">{icon}</span>
            <h3 className="font-display font-semibold text-sm">{label}</h3>
            <p className="text-xs opacity-80 mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-semibold text-gray-800">Recent Products</h2>
          <Link to="/products" className="text-xs text-blue-600 hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Brand</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image?.startsWith('/uploads/') ? `http://localhost:5000${p.image}` : p.image}
                          alt="" className="w-9 h-9 rounded object-cover bg-gray-100"
                          onError={e => { e.target.src='https://via.placeholder.com/36?text=?'; }} />
                        <span className="font-medium text-gray-800 truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.brand}</td>
                    <td className="px-5 py-3 text-gray-500">{p.category?.name || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold
                        ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Link to={`/products/${p._id}`} className="text-blue-600 hover:underline text-xs">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}