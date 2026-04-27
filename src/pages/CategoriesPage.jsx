// CategoriesPage.jsx
// Full CRUD for categories: list, create inline, edit in modal, delete with guard
// Uses your existing categoriesAPI from api.js

import React, { useState, useEffect, useRef } from 'react';
import { categoriesAPI } from '../services/api';

// ─── Icon picker (common emoji icons for categories) ──────────────────────────
const ICON_OPTIONS = ['🖨️','📠','📽️','📋','🪑','🔌','💻','🖥️','⌨️','🖱️','📦','🗂️','📁','🛒','🔧','⚡','🏢','📡','🔐','💡'];

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast.message) return null;
  const bg = toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-slate-700';
  return (
    <div className={`fixed top-5 right-5 z-50 ${bg} text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold flex items-center gap-2`}
      style={{ animation: 'slideIn .2s ease' }}>
      {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.message}
    </div>
  );
}

// ─── Icon picker popover ──────────────────────────────────────────────────────
function IconPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-12 h-12 flex items-center justify-center text-2xl bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
        title="Pick icon">
        {value || '📦'}
      </button>
      {open && (
        <div className="absolute left-0 top-14 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-56">
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-2 px-1">Choose Icon</p>
          <div className="grid grid-cols-5 gap-1">
            {ICON_OPTIONS.map(icon => (
              <button key={icon} type="button" onClick={() => { onChange(icon); setOpen(false); }}
                className={`w-9 h-9 flex items-center justify-center text-xl rounded-lg transition-colors
                  ${value === icon ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-slate-100'}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Category form (shared by Add and Edit) ──────────────────────────────────
function CategoryForm({ initial, onSubmit, onCancel, loading, submitLabel }) {
  const [name,        setName]        = useState(initial?.name        || '');
  const [icon,        setIcon]        = useState(initial?.icon        || '📦');
  const [description, setDescription] = useState(initial?.description || '');
  const [isActive,    setIsActive]    = useState(initial?.isActive    ?? true);
  const [nameError,   setNameError]   = useState('');
  const nameRef = useRef(null);

  useEffect(() => { nameRef.current?.focus(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Category name is required'); return; }
    setNameError('');
    onSubmit({ name: name.trim(), icon, description: description.trim(), isActive });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="shrink-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Icon</p>
          <IconPicker value={icon} onChange={setIcon} />
        </div>
        {/* Name */}
        <div className="flex-1">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Printers"
            className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all
              ${nameError ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
          />
          {nameError && <p className="mt-1 text-xs text-red-500">⚠ {nameError}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief description of this category (optional)"
          rows={2}
          className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
        />
      </div>

      {/* Active toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative shrink-0">
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="sr-only peer" />
          <div className="w-10 h-5 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors" />
          <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
        </div>
        <span className="text-sm text-slate-600 font-medium">Active (visible on website)</span>
      </label>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-colors flex items-center gap-2">
          {loading
            ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : submitLabel || 'Save'
          }
        </button>
        <button type="button" onClick={onCancel} disabled={loading}
          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Delete confirmation modal ────────────────────────────────────────────────
function DeleteModal({ category, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onCancel} />
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
            🗑️
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Delete Category?</h3>
          <p className="text-sm text-slate-500 mt-2">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-700">"{category.name}"</span>?
          </p>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3">
            ⚠ This will fail if products are assigned to this category. Reassign them first.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading
              ? <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting…</>
              : 'Yes, Delete'
            }
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [toast,      setToast]      = useState({ message: '', type: 'info' });

  // Panel modes: 'idle' | 'adding' | 'editing'
  const [mode,          setMode]         = useState('idle');
  const [editTarget,    setEditTarget]   = useState(null);   // category being edited
  const [deleteTarget,  setDeleteTarget] = useState(null);   // category pending delete

  const [actionLoading, setActionLoading] = useState(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 4000);
  };

  const fetchCategories = () => {
    setLoading(true);
    categoriesAPI.getAll()
      .then(r => setCategories(r.data || []))
      .catch(() => showToast('Failed to load categories', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  // ── Create ─────────────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    setActionLoading(true);
    try {
      await categoriesAPI.create(data);
      showToast(`"${data.name}" created successfully`);
      setMode('idle');
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Update ─────────────────────────────────────────────────────────────────
  const handleUpdate = async (data) => {
    setActionLoading(true);
    try {
      await categoriesAPI.update(editTarget._id, data);
      showToast(`"${data.name}" updated successfully`);
      setMode('idle');
      setEditTarget(null);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await categoriesAPI.delete(deleteTarget._id);
      showToast(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      showToast(err.response?.data?.message || 'Cannot delete — products may still use this category', 'error');
      setDeleteTarget(null);
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (cat) => {
    setEditTarget(cat);
    setMode('editing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelForm = () => { setMode('idle'); setEditTarget(null); };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <Toast toast={toast} />
      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={actionLoading}
        />
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-slate-800 tracking-tight">🗂️ Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} total
          </p>
        </div>
        {mode === 'idle' && (
          <button onClick={() => setMode('adding')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex items-center gap-2">
            + New Category
          </button>
        )}
      </div>

      {/* ── Add / Edit form panel ── */}
      {mode !== 'idle' && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/60 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">
                {mode === 'adding' ? '➕ New Category' : `✏️ Editing: ${editTarget?.name}`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === 'adding' ? 'Fill in the details below' : 'Modify the fields and save'}
              </p>
            </div>
            <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600 text-xl leading-none transition-colors">×</button>
          </div>
          <div className="p-6">
            <CategoryForm
              key={editTarget?._id || 'new'}   // force re-mount when switching targets
              initial={editTarget}
              onSubmit={mode === 'adding' ? handleCreate : handleUpdate}
              onCancel={cancelForm}
              loading={actionLoading}
              submitLabel={mode === 'adding' ? '🚀 Create Category' : '💾 Save Changes'}
            />
          </div>
        </div>
      )}

      {/* ── Category list ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/40">
          <h2 className="font-semibold text-slate-700 text-sm">All Categories</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-3">🗂️</div>
            <p className="font-semibold text-slate-600 text-lg mb-1">No categories yet</p>
            <p className="text-sm text-slate-400 mb-4">Create your first category to start organising products</p>
            <button onClick={() => setMode('adding')}
              className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
              + Create First Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {categories.map((cat, idx) => (
              <div key={cat._id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors group
                  ${editTarget?._id === cat._id ? 'bg-blue-50' : 'hover:bg-slate-50/70'}`}>

                {/* Row number */}
                <span className="text-xs text-slate-300 font-mono w-5 shrink-0 text-right">{idx + 1}</span>

                {/* Icon */}
                <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-xl shrink-0 transition-colors">
                  {cat.icon || '📦'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">
                      /{cat.slug}
                    </span>
                    {!cat.isActive && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  {cat.description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-sm">{cat.description}</p>
                  )}
                </div>

                {/* Status badge */}
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold shrink-0 hidden sm:inline-flex items-center gap-1
                  ${cat.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {cat.isActive ? 'Active' : 'Inactive'}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => startEdit(cat)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteTarget(cat)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800 font-semibold mb-1">💡 Tips</p>
        <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
          <li>Categories with assigned products cannot be deleted — reassign or delete those products first.</li>
          <li>The slug is auto-generated from the name and used in website URLs.</li>
          <li>Inactive categories are hidden from the public website but stay in the system.</li>
        </ul>
      </div>
    </div>
  );
}
