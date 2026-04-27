// ProductFormPage.jsx
// Handles BOTH creating a new product (/products/new)
// and editing an existing one (/products/edit/:id)
// Integrates with your existing productsAPI and categoriesAPI

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';

// ─── Tiny reusable components ────────────────────────────────────────────────

function FormSection({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <h2 className="font-semibold text-slate-800 text-sm">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Label({ htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function Input({ id, error, className = '', ...props }) {
  return (
    <>
      <input
        id={id}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 transition-all duration-150
          ${error
            ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400'
            : 'border-slate-200 bg-white focus:ring-blue-100 focus:border-blue-400'
          } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </>
  );
}

function Textarea({ id, error, rows = 4, ...props }) {
  return (
    <>
      <textarea
        id={id}
        rows={rows}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 resize-none
          focus:outline-none focus:ring-2 transition-all duration-150
          ${error
            ? 'border-red-300 bg-red-50/30 focus:ring-red-200 focus:border-red-400'
            : 'border-slate-200 bg-white focus:ring-blue-100 focus:border-blue-400'
          }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{error}</p>}
    </>
  );
}

// ─── Array field (shortSpecs / features) ─────────────────────────────────────

function ArrayField({ label, subtitle, items, onChange, placeholder, maxItems = 20 }) {
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const add = () => {
    const val = draft.trim();
    if (!val || items.includes(val) || items.length >= maxItems) return;
    onChange([...items, val]);
    setDraft('');
    inputRef.current?.focus();
  };

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  // Also allow pasting a comma-separated list
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const parts   = pasted.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length > 1) {
      const merged = [...new Set([...items, ...parts])].slice(0, maxItems);
      onChange(merged);
    } else {
      setDraft(pasted);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      {subtitle && <p className="text-xs text-slate-400 mb-2">{subtitle}</p>}

      {/* Existing items */}
      {items.length > 0 && (
        <ul className="flex flex-wrap gap-2 mb-3">
          {items.map((item, idx) => (
            <li key={idx}
              className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-xs px-3 py-1.5 rounded-lg font-medium">
              <span className="text-blue-400">✔</span>
              <span>{item}</span>
              <button type="button" onClick={() => remove(idx)}
                className="ml-1 text-blue-300 hover:text-red-500 transition-colors font-bold leading-none">
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder || `Type and press Enter to add…`}
          disabled={items.length >= maxItems}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 disabled:opacity-50 transition-all"
        />
        <button type="button" onClick={add} disabled={!draft.trim() || items.length >= maxItems}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400
            text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
          + Add
        </button>
      </div>
      <p className="text-[11px] text-slate-400 mt-1.5">{items.length}/{maxItems} items · Press Enter or click Add</p>
    </div>
  );
}

// ─── Specs table editor ──────────────────────────────────────────────────────

function SpecsEditor({ specs, onChange }) {
  // specs: object { key: value }
  const entries = Object.entries(specs);

  const updateKey = (oldKey, newKey) => {
    const updated = {};
    entries.forEach(([k, v]) => { updated[k === oldKey ? newKey : k] = v; });
    onChange(updated);
  };

  const updateVal = (key, val) => onChange({ ...specs, [key]: val });

  const addRow = () => {
    let n = 1;
    while (specs[`Spec ${n}`] !== undefined) n++;
    onChange({ ...specs, [`Spec ${n}`]: '' });
  };

  const removeRow = (key) => {
    const updated = { ...specs };
    delete updated[key];
    onChange(updated);
  };

  return (
    <div>
      <Label>Technical Specifications</Label>
      <p className="text-xs text-slate-400 mb-3">Key → Value pairs shown in the specs table on the product page</p>

      {entries.length > 0 ? (
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-3">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold w-2/5">Spec Name</th>
                <th className="px-4 py-2.5 text-left font-semibold">Value</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map(([key, val]) => (
                <tr key={key} className="hover:bg-slate-50/50 group">
                  <td className="px-3 py-2">
                    <input type="text" value={key}
                      onChange={e => updateKey(key, e.target.value)}
                      className="w-full border border-transparent group-hover:border-slate-200 rounded-lg px-2 py-1.5
                        text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-400 focus:bg-white transition-all bg-transparent" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" value={val}
                      onChange={e => updateVal(key, e.target.value)}
                      className="w-full border border-transparent group-hover:border-slate-200 rounded-lg px-2 py-1.5
                        text-sm text-slate-600 focus:outline-none focus:border-blue-400 focus:bg-white transition-all bg-transparent" />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <button type="button" onClick={() => removeRow(key)}
                      className="w-6 h-6 flex items-center justify-center rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors text-base font-bold mx-auto">
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm mb-3">
          No specifications yet — click below to add rows
        </div>
      )}

      <button type="button" onClick={addRow}
        className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5 transition-colors">
        <span className="text-lg leading-none">+</span> Add Specification Row
      </button>
    </div>
  );
}

// ─── Image upload / URL picker ───────────────────────────────────────────────

function ImagePicker({ imageFile, imageUrl, existingImage, onFileChange, onUrlChange }) {
  const [mode, setMode] = useState(existingImage ? 'url' : 'upload'); // 'upload' | 'url'
  const fileRef = useRef(null);

  const preview = imageFile
    ? URL.createObjectURL(imageFile)
    : imageUrl || (existingImage?.startsWith('/uploads/') ? `http://localhost:5000${existingImage}` : existingImage);

  return (
    <div>
      <Label>Product Image</Label>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit mb-4">
        {[['upload', '📁 Upload File'], ['url', '🔗 Image URL']].map(([m, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all
              ${mode === m ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer
              hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
            {imageFile ? (
              <p className="text-sm text-blue-700 font-medium">📄 {imageFile.name}</p>
            ) : (
              <>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🖼️</div>
                <p className="text-sm font-medium text-slate-600">Click to choose image</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP · Max 5 MB</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden"
            onChange={e => onFileChange(e.target.files[0] || null)} />
        </div>
      ) : (
        <Input
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={e => onUrlChange(e.target.value)}
        />
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-4 relative w-36 h-28 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
          <img src={preview} alt="Preview"
            className="w-full h-full object-contain"
            onError={e => { e.target.style.display = 'none'; }} />
          <div className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-md font-bold">
            Preview
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toast notification ──────────────────────────────────────────────────────

function Toast({ message, type }) {
  if (!message) return null;
  const styles = {
    success: 'bg-emerald-600 text-white',
    error:   'bg-red-600 text-white',
    info:    'bg-slate-700 text-white',
  };
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold
      flex items-center gap-2 transition-all animate-in ${styles[type] || styles.info}`}
      style={{ animation: 'slideInRight .25s ease' }}>
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} {message}
    </div>
  );
}

// ─── MAIN PAGE COMPONENT ─────────────────────────────────────────────────────

export default function ProductFormPage() {
  const navigate  = useNavigate();
  const { id }    = useParams();           // present on /products/edit/:id
  const location  = useLocation();
  const isEdit    = Boolean(id);           // true → edit mode, false → create mode

  // ── Form state ──────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:        '',
    brand:       '',
    category:    '',
    description: '',
    isActive:    true,
    isFeatured:  false,
  });
  const [shortSpecs,  setShortSpecs]  = useState([]);   // string[]
  const [features,    setFeatures]    = useState([]);   // string[]
  const [specs,       setSpecs]       = useState({});   // { key: value }
  const [imageFile,   setImageFile]   = useState(null); // File | null
  const [imageUrl,    setImageUrl]    = useState('');   // string
  const [existingImg, setExistingImg] = useState('');   // current saved image

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(false);   // submit in progress
  const [fetching,    setFetching]    = useState(isEdit);  // loading existing product
  const [errors,      setErrors]      = useState({});
  const [toast,       setToast]       = useState({ message: '', type: 'info' });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'info' }), 4000);
  };

  const setField = (key) => (e) =>
    setForm(prev => ({ ...prev, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  // ── Load categories ──────────────────────────────────────────────────────────
  useEffect(() => {
    categoriesAPI.getAll()
      .then(r => setCategories(r.data || []))
      .catch(() => showToast('Could not load categories', 'error'));
  }, []);

  // ── Load existing product (edit mode) ────────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;

    setFetching(true);
    productsAPI.getOne(id)
      .then(r => {
        const p = r.data;
        setForm({
          name:        p.name        || '',
          brand:       p.brand       || '',
          category:    p.category?._id || p.category || '',
          description: p.description || '',
          isActive:    p.isActive    ?? true,
          isFeatured:  p.isFeatured  ?? false,
        });
        setShortSpecs(p.shortSpecs || []);
        setFeatures(p.features     || []);

        // specs may come as a plain object or a Map serialised as object
        const rawSpecs = p.specs || {};
        setSpecs(typeof rawSpecs === 'object' && !Array.isArray(rawSpecs) ? rawSpecs : {});

        setExistingImg(p.image || '');
        if (p.image && !p.image.startsWith('/uploads/')) setImageUrl(p.image);
      })
      .catch(() => showToast('Failed to load product', 'error'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.name.trim())        errs.name        = 'Product name is required';
    if (!form.brand.trim())       errs.brand       = 'Brand is required';
    if (!form.category)           errs.category    = 'Please select a category';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix the highlighted errors', 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      // Build multipart/form-data so image upload works
      const fd = new FormData();
      fd.append('name',        form.name.trim());
      fd.append('brand',       form.brand.trim());
      fd.append('category',    form.category);
      fd.append('description', form.description.trim());
      fd.append('isActive',    form.isActive);
      fd.append('isFeatured',  form.isFeatured);

      // Arrays → JSON strings (backend parses them)
      fd.append('shortSpecs', JSON.stringify(shortSpecs));
      fd.append('features',   JSON.stringify(features));
      fd.append('specs',      JSON.stringify(specs));

      // Image: file takes priority over URL
      if (imageFile) {
        fd.append('image', imageFile);
      } else {
        fd.append('imageUrl', imageUrl);
      }

      if (isEdit) {
        await productsAPI.update(id, fd);
        showToast('Product updated successfully ✓');
      } else {
        await productsAPI.create(fd);
        showToast('Product created successfully ✓');
      }

      // Brief delay so user sees the toast, then redirect
      setTimeout(() => navigate('/products'), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Loading skeleton (edit mode fetching) ────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-100 rounded-xl" />
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto">
      <Toast message={toast.message} type={toast.type} />

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-slate-700 font-medium">{isEdit ? 'Edit Product' : 'New Product'}</span>
          </div>
          <h1 className="font-bold text-2xl text-slate-800 tracking-tight">
            {isEdit ? '✏️ Edit Product' : '➕ Add New Product'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isEdit ? `Editing: ${form.name || '…'}` : 'Fill in the details to create a new product listing'}
          </p>
        </div>

        {/* Action buttons (top) */}
        <div className="hidden sm:flex items-center gap-3">
          <Link to="/products"
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </Link>
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-xl transition-colors flex items-center gap-2 shadow-sm">
            {loading ? (
              <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            ) : (
              <>{isEdit ? '💾 Save Changes' : '🚀 Create Product'}</>
            )}
          </button>
        </div>
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>

        {/* SECTION 1 — Basic Info */}
        <FormSection title="Basic Information" subtitle="Core product details shown on cards and search results">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Name */}
            <div className="sm:col-span-2">
              <Label htmlFor="name" required>Product Name</Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={setField('name')}
                placeholder="e.g. HP LaserJet Pro M404dn"
                error={errors.name}
              />
            </div>

            {/* Brand */}
            <div>
              <Label htmlFor="brand" required>Brand</Label>
              <Input
                id="brand"
                type="text"
                value={form.brand}
                onChange={setField('brand')}
                placeholder="e.g. HP, Epson, Canon"
                error={errors.brand}
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" required>Category</Label>
              <select
                id="category"
                value={form.category}
                onChange={setField('category')}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm text-slate-800 bg-white appearance-none
                  focus:outline-none focus:ring-2 transition-all duration-150
                  ${errors.category
                    ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                    : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'
                  }`}
              >
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><span>⚠</span>{errors.category}</p>
              )}
              {categories.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No categories found.{' '}
                  <Link to="/categories" className="underline hover:text-amber-700">Create one first →</Link>
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" required>Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={setField('description')}
              rows={4}
              placeholder="Write a clear, helpful description of the product — what it does, who it's for, and why it's a good choice…"
              error={errors.description}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">{form.description.length} characters</p>
          </div>

          {/* Flags row */}
          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={form.isActive} onChange={setField('isActive')} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-checked:bg-emerald-500 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Active</span>
                <p className="text-[11px] text-slate-400">Visible to website visitors</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" checked={form.isFeatured} onChange={setField('isFeatured')} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-checked:bg-amber-400 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Featured ⭐</span>
                <p className="text-[11px] text-slate-400">Shown on homepage featured section</p>
              </div>
            </label>
          </div>
        </FormSection>

        {/* SECTION 2 — Image */}
        <FormSection title="Product Image" subtitle="Upload a file or paste an image URL">
          <ImagePicker
            imageFile={imageFile}
            imageUrl={imageUrl}
            existingImage={existingImg}
            onFileChange={setImageFile}
            onUrlChange={setImageUrl}
          />
        </FormSection>

        {/* SECTION 3 — Specs & Features */}
        <FormSection title="Product Details" subtitle="Specifications and feature highlights shown on the detail page">

          {/* Short Specs */}
          <ArrayField
            label="Short Specs (Summary chips)"
            subtitle="2–4 bullet points shown on product cards. E.g. '38 ppm · Mono Laser · Wi-Fi'"
            items={shortSpecs}
            onChange={setShortSpecs}
            placeholder="e.g. 38 ppm Mono Laser"
            maxItems={6}
          />

          <hr className="border-slate-100" />

          {/* Features */}
          <ArrayField
            label="Key Features (Bullet list)"
            subtitle="Full feature list shown on the product detail page"
            items={features}
            onChange={setFeatures}
            placeholder="e.g. Auto two-sided printing"
            maxItems={20}
          />

          <hr className="border-slate-100" />

          {/* Technical Specs table */}
          <SpecsEditor specs={specs} onChange={setSpecs} />
        </FormSection>

        {/* ── Bottom action bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3
          bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm sticky bottom-4">
          <p className="text-xs text-slate-400 order-2 sm:order-1">
            {isEdit ? 'Changes will update the live website immediately after saving.' : 'Product will go live after creation if marked Active.'}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            <Link to="/products"
              className="flex-1 sm:flex-none text-center px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
              Cancel
            </Link>
            <button type="submit" disabled={loading}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300
                rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm min-w-[140px]">
              {loading ? (
                <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : (
                isEdit ? '💾 Save Changes' : '🚀 Create Product'
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
