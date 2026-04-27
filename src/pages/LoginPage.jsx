// pages/LoginPage.jsx — Clean admin login
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
   try {
  const res = await login(form.email, form.password);
  console.log("LOGIN SUCCESS:", res); // 👈 ADD THIS
  navigate('/dashboard');
} catch (err) {
  console.log("LOGIN ERROR:", err); // 👈 ADD THIS
  setError(err.response?.data?.message || 'Login failed. Check credentials.');
}
    console.log("Submitting:", form);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur">
              <span className="text-white font-display font-bold text-2xl">G</span>
            </div>
            <h1 className="text-white font-display font-bold text-xl">Gurukrupa Enterprises</h1>
            <p className="text-blue-100 text-sm mt-1">Admin Panel</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="font-display font-semibold text-gray-800 text-lg mb-6 text-center">Sign in to continue</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="admin@gurukrupa.com"
                  className="form-input" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="••••••••"
                  className="form-input" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-3 mt-2 flex items-center justify-center gap-2">
                {loading ? <><span className="animate-spin">⚙️</span> Signing in…</> : '→ Sign In'}
              </button>
              
            </form>

            <div className="mt-6 p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 font-semibold mb-1">Default credentials</p>
              <p className="text-xs text-gray-600">admin@gurukrupa.com / Admin@123</p>
              <p className="text-[10px] text-gray-400 mt-1">Run <code className="bg-gray-200 px-1 rounded">npm run seed</code> in backend first</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}