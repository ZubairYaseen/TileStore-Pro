"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCategories() {
    setLoading(true);
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { loadCategories(); }, []);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEdit(cat) {
    setEditId(cat._id);
    setForm({ categoryName: cat.categoryName, description: cat.description });
    setError("");
    document.getElementById("cat-form-section")?.scrollIntoView({ behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setForm({ categoryName: "", description: "" });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Failed to save."); return; }
    resetForm();
    loadCategories();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    loadCategories();
  }

  return (
    <AdminLayout title="Manage Categories" subtitle="Admin">
      <div id="cat-form-section" className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-primary-custom mb-3">
            {editId ? "Edit Category" : "Add New Category"}
          </h5>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit} id="cat-form">
            <div className="row g-3">
              <div className="col-md-5">
                <label htmlFor="cat-name" className="form-label">Category Name</label>
                <input
                  id="cat-name"
                  name="categoryName"
                  className="form-control"
                  placeholder="e.g. Floor"
                  value={form.categoryName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="cat-desc" className="form-label">Description</label>
                <input
                  id="cat-desc"
                  name="description"
                  className="form-control"
                  placeholder="Short description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-2 d-flex align-items-end gap-2">
                <button id="btn-cat-save" type="submit" className="btn btn-primary flex-fill" disabled={saving}>
                  {saving ? "…" : editId ? "Update" : "Add"}
                </button>
                {editId && (
                  <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Category Name</th>
                    <th>Description</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-4 text-muted-custom">No categories found.</td></tr>
                  ) : categories.map((cat, idx) => (
                    <tr key={cat._id}>
                      <td className="text-muted-custom small">{idx + 1}</td>
                      <td className="fw-semibold">{cat.categoryName}</td>
                      <td className="text-muted-custom">{cat.description}</td>
                      <td className="text-end">
                        <button
                          id={`btn-edit-cat-${cat._id}`}
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(cat)}
                        >
                          Edit
                        </button>
                        <button
                          id={`btn-del-cat-${cat._id}`}
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(cat._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
