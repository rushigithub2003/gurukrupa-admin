// ProductsListPage.jsx
// Updated version — Edit links now correctly point to /products/edit/:id
// Add Product button correctly points to /products/new
// All other existing functionality is preserved

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-slate-700';
  return (
    <div className={`fixed top-5 right-5 z-50 ${bg} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2`}>
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} {message}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function ProductsListPage() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [deleting,   setDeleting]   = useState(null);   // id currently being deleted
  const [toast,      setToast]      = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3500);
  };

  // ── Load categories once ──────────────────────────────────────────────────
  useEffect(() => {
    categoriesAPI.getAll()
      .then(r => setCategories(r.data || []))
      .catch(() => {});
  }, []);

  // ── Load products (re-runs when search/filter changes) ───────────────────
  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { limit: 20 };
    if (search)    params.search   = search;
    if (filterCat) params.category = filterCat;

    productsAPI.getAll(params)
      .then(r => {
        setProducts(r.data.products || []);
        setPagination({ total: r.data.total || 0, page: r.data.page || 1, pages: r.data.pages || 1 });
      })
      .catch(() => showToast('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  }, [search, filterCat]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?\n\nThis action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      showToast(`"${name}" deleted successfully`);
      fetchProducts();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setDeleting(null);
    }
  };

  // ── Image helper ──────────────────────────────────────────────────────────
  const getImgSrc = (img) =>
    img?.startsWith('/uploads/') ? `http://localhost:5000${img}` : img || '';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      <Toast message={toast.message} type={toast.type} />

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-bold text-2xl text-slate-800 tracking-tight">📦 Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{pagination.total} product{pagination.total !== 1 ? 's' : ''} total</p>
        </div>
        {/* ✅ Correct link to /products/new */}
        <Link to="/products/new"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2">
          + Add Product
        </Link>
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or brand…"
          className="flex-1 min-w-[180px] border border-slate-200 rounded-xl px-4 py-2.5 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white min-w-[170px]
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
          ))}
        </select>
        {(search || filterCat) && (
          <button
            onClick={() => { setSearch(''); setFilterCat(''); }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors">
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>

        ) : products.length === 0 ? (
          <div className="p-14 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-semibold text-slate-600 text-lg mb-1">No products found</p>
            <p className="text-sm text-slate-400 mb-5">
              {search || filterCat ? 'Try different search terms or clear the filters' : 'Add your first product to get started'}
            </p>
            {!search && !filterCat && (
              <Link to="/products/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
                + Add First Product
              </Link>
            )}
          </div>

        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3 text-left">#</th>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Brand</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-center">Featured</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.map((p, idx) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors group">

                    {/* Row # */}
                    <td className="px-5 py-3 text-xs text-slate-300 font-mono">{idx + 1}</td>

                    {/* Product name + thumbnail */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {getImgSrc(p.image) ? (
                          <img
                            src={getImgSrc(p.image)}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0">
                            IMG
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-[220px]" title={p.name}>
                            {p.name}
                          </p>
                          {p.shortSpecs?.[0] && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{p.shortSpecs[0]}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="px-5 py-3">
                      <span className="text-slate-600 font-medium">{p.brand}</span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3">
                      {p.category ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                          {p.category.icon} {p.category.name}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Featured */}
                    <td className="px-5 py-3 text-center">
                      {p.isFeatured
                        ? <span title="Featured" className="text-amber-400 text-base">⭐</span>
                        : <span className="text-slate-200 text-base">—</span>
                      }
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold
                        ${p.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {/* ✅ Correct edit link → /products/edit/:id */}
                        <Link
                          to={`/products/edit/${p._id}`}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap">
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id, p.name)}
                          disabled={deleting === p._id}
                          className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap">
                          {deleting === p._id
                            ? <span className="inline-block w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            : '🗑️ Delete'
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination info */}
            {pagination.total > products.length && (
              <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500">
                Showing {products.length} of {pagination.total} products
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
