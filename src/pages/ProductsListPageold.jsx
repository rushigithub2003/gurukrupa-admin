// pages/ProductsListPage.jsx — Browse, search, delete products
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from "../services/api";

export default function ProductsListPage() {
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [deleting,   setDeleting]   = useState(null);
  const [toast,      setToast]      = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  useEffect(() => {
    categoriesAPI.getAll().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = { limit: 20 };
    if (search)    params.search   = search;
    if (filterCat) params.category = filterCat;
    productsAPI.getAll(params)
      .then(r => {
        setProducts(r.data.products || []);
        setPagination({ total: r.data.total, page: r.data.page, pages: r.data.pages });
      })
      .finally(() => setLoading(false));
  }, [search, filterCat]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await productsAPI.delete(id);
      showToast('✅ Product deleted successfully');
      fetchProducts();
    } catch (err) {
      showToast('❌ ' + (err.response?.data?.message || 'Failed to delete'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-lg px-4 py-3 text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-800">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{pagination.total} total products</p>
        </div>
        <Link to="/products/new" className="btn-primary flex items-center gap-2">+ Add Product</Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products…"
          className="flex-1 min-w-[180px] form-input" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="form-input w-auto min-w-[160px]">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        {(search || filterCat) && (
          <button onClick={() => { setSearch(''); setFilterCat(''); }} className="btn-secondary">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p className="font-display font-semibold text-lg">No products found</p>
            <Link to="/products/new" className="inline-block mt-4 btn-primary text-sm">Add your first product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-left">Brand</th>
                  <th className="px-5 py-3 text-left">Category</th>
                  <th className="px-5 py-3 text-left">Featured</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => {
                  const imgSrc = p.image?.startsWith('/uploads/')
                    ? `http://localhost:5000${p.image}` : p.image;
                  return (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={imgSrc} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                            onError={e => { e.target.src='https://via.placeholder.com/40?text=?'; }} />
                          <span className="font-medium text-gray-800 max-w-[220px] truncate" title={p.name}>{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{p.brand}</td>
                      <td className="px-5 py-3">
                        {p.category ? (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {p.category.icon} {p.category.name}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3">
                        {p.isFeatured ? <span className="text-yellow-500">⭐ Yes</span> : <span className="text-gray-300">No</span>}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold
                          ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Link to={`/products/${p._id}`}
                            className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-semibold transition-colors">
                            Edit
                          </Link>
                          <button onClick={() => handleDelete(p._id, p.name)} disabled={deleting === p._id}
                            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50">
                            {deleting === p._id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}