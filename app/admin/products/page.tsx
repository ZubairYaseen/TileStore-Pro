"use client";

import { useEffect, useState, useRef } from "react";
import AdminLayout from "@/components/AdminLayout";

const EMPTY_FORM = {
  categoryId: "",
  design: "",
  imageUrl: "",
  sizeLength: "",
  sizeWidth: "",
  sizeUnit: "mm",
  company: "",
  price: "",
  tilesPerBox: "",
  unitType: "Box",
};

interface Category {
  _id: string;
  categoryName: string;
}

interface Product {
  _id: string;
  categoryId?: { _id: string; categoryName: string } | null;
  design: string;
  imageUrl?: string;
  size?: { length: number; width: number; unit: string };
  company: string;
  price: number;
  tilesPerBox: number;
  unitType?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);
      const [p, c] = await Promise.all([pRes.json(), cRes.json()]);
      setProducts(Array.isArray(p) ? p : []);
      setCategories(Array.isArray(c) ? c : []);
    } catch {
      setError("Failed to load products data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageUrl: localUrl }));
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to upload image.");
      } else {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
      }
    } catch {
      setError("Network error occurred while uploading image.");
    } finally {
      setUploading(false);
    }
  }

  function startEdit(p: Product) {
    setEditId(p._id);
    setForm({
      categoryId: p.categoryId?._id || "",
      design: p.design,
      imageUrl: p.imageUrl || "",
      sizeLength: p.size?.length ? String(p.size.length) : "",
      sizeWidth: p.size?.width ? String(p.size.width) : "",
      sizeUnit: p.size?.unit || "mm",
      company: p.company,
      price: String(p.price),
      tilesPerBox: String(p.tilesPerBox),
      unitType: p.unitType || "Box",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    document
      .getElementById("prod-form-section")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function resetForm() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploading) return;
    setError("");
    setSaving(true);

    const payload = {
      categoryId: form.categoryId,
      design: form.design,
      imageUrl: form.imageUrl,
      size: {
        length: Number(form.sizeLength),
        width: Number(form.sizeWidth),
        unit: form.sizeUnit,
      },
      company: form.company,
      price: Number(form.price),
      tilesPerBox: Number(form.tilesPerBox),
      unitType: form.unitType,
    };

    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) {
        setError(data.error || "Failed to save product.");
        return;
      }
      resetForm();
      loadData();
    } catch {
      setSaving(false);
      setError("An unexpected error occurred while saving.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadData();
  }

  const filtered = products.filter(
    (p) =>
      !search ||
      p.design?.toLowerCase().includes(search.toLowerCase()) ||
      p.company?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Manage Products" subtitle="Admin">
      <div id="prod-form-section" className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-primary-custom mb-3">
            {editId ? "Edit Product" : "Add New Product"}
          </h5>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit} id="prod-form">
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="prod-cat" className="form-label fw-semibold">
                  Category
                </label>
                <select
                  id="prod-cat"
                  name="categoryId"
                  className="form-select"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label htmlFor="prod-design" className="form-label fw-semibold">
                  Design
                </label>
                <input
                  id="prod-design"
                  name="design"
                  className="form-control"
                  placeholder="e.g. Marble Luxe"
                  value={form.design}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="prod-company" className="form-label fw-semibold">
                  Company
                </label>
                <input
                  id="prod-company"
                  name="company"
                  className="form-control"
                  placeholder="e.g. Roca Tiles"
                  value={form.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="prod-price" className="form-label fw-semibold">
                  Price (PKR)
                </label>
                <input
                  id="prod-price"
                  name="price"
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="610"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Direct File Upload & URL Toggle Section */}
              <div className="col-md-6">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label
                    htmlFor={uploadMode === "file" ? "prod-image-file" : "prod-image-url"}
                    className="form-label mb-0 fw-semibold"
                  >
                    {uploadMode === "file" ? "Upload Product Image" : "Product Image URL"}
                  </label>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                    onClick={() => setUploadMode(uploadMode === "file" ? "url" : "file")}
                    style={{ fontSize: "0.82rem" }}
                  >
                    {uploadMode === "file" ? "🔗 Or enter image URL" : "📁 Or upload image from computer"}
                  </button>
                </div>

                {uploadMode === "file" ? (
                  <div>
                    <input
                      id="prod-image-file"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <div className="form-text small text-muted">
                      Select an image file (JPG, PNG, WebP, GIF) from your local machine.
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      id="prod-image-url"
                      name="imageUrl"
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={form.imageUrl}
                      onChange={handleChange}
                    />
                    <div className="form-text small text-muted">
                      Paste a direct image web link.
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Thumbnail Box */}
              <div className="col-md-2 d-flex flex-column justify-content-center">
                <label className="form-label mb-1 fw-semibold small text-muted">
                  Image Preview
                </label>
                {form.imageUrl ? (
                  <div className="d-flex align-items-center gap-2">
                    <div className="position-relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.imageUrl}
                        alt="preview"
                        className="rounded border shadow-sm"
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      {uploading && (
                        <div
                          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded"
                        >
                          <div className="spinner-border spinner-border-sm text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm px-2 py-1"
                      title="Remove image"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, imageUrl: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="rounded border border-dashed bg-light text-muted d-flex align-items-center justify-content-center small"
                    style={{ width: 48, height: 48, fontSize: "0.75rem" }}
                  >
                    None
                  </div>
                )}
              </div>

              <div className="col-md-4 row g-2 m-0 p-0">
                <div className="col-4">
                  <label htmlFor="prod-len" className="form-label fw-semibold">
                    Length
                  </label>
                  <input
                    id="prod-len"
                    name="sizeLength"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="600"
                    value={form.sizeLength}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="prod-wid" className="form-label fw-semibold">
                    Width
                  </label>
                  <input
                    id="prod-wid"
                    name="sizeWidth"
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="600"
                    value={form.sizeWidth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-4">
                  <label htmlFor="prod-unit" className="form-label fw-semibold">
                    Unit
                  </label>
                  <select
                    id="prod-unit"
                    name="sizeUnit"
                    className="form-select"
                    value={form.sizeUnit}
                    onChange={handleChange}
                  >
                    <option>mm</option>
                    <option>cm</option>
                    <option>in</option>
                  </select>
                </div>
              </div>

              <div className="col-md-3">
                <label htmlFor="prod-tpb" className="form-label fw-semibold">
                  Tiles/Box
                </label>
                <input
                  id="prod-tpb"
                  name="tilesPerBox"
                  type="number"
                  min="1"
                  className="form-control"
                  placeholder="4"
                  value={form.tilesPerBox}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="prod-utype" className="form-label fw-semibold">
                  Unit Type
                </label>
                <select
                  id="prod-utype"
                  name="unitType"
                  className="form-select"
                  value={form.unitType}
                  onChange={handleChange}
                >
                  <option>Box</option>
                  <option>Piece</option>
                  <option>Sqm</option>
                </select>
              </div>

              <div className="col-md-4 d-flex align-items-end gap-2 ms-auto">
                <button
                  id="btn-prod-save"
                  type="submit"
                  className="btn btn-primary flex-fill"
                  disabled={saving || uploading}
                >
                  {uploading
                    ? "Uploading image..."
                    : saving
                    ? "Saving..."
                    : editId
                    ? "Update Product"
                    : "Add Product"}
                </button>
                {editId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4 pb-0">
          <div className="d-flex align-items-center gap-3 mb-3">
            <input
              id="prod-search"
              type="text"
              className="form-control"
              placeholder="Search by design or company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <span className="badge bg-light text-dark border">
              {filtered.length} products
            </span>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tile</th>
                  <th>Design</th>
                  <th>Category</th>
                  <th>Size</th>
                  <th>Company</th>
                  <th>Price</th>
                  <th>Tiles/Box</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted-custom">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p._id}>
                      <td>
                        {p.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={p.imageUrl}
                            alt={p.design}
                            className="rounded"
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="rounded bg-light text-primary-custom d-flex align-items-center justify-content-center fw-bold small"
                            style={{ width: 48, height: 48 }}
                          >
                            {p.design?.slice(0, 3).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="fw-semibold">{p.design}</td>
                      <td>
                        <span className="badge bg-primary-soft text-primary-custom">
                          {p.categoryId?.categoryName || "—"}
                        </span>
                      </td>
                      <td className="text-muted-custom">
                        {p.size?.length}×{p.size?.width} {p.size?.unit}
                      </td>
                      <td>{p.company}</td>
                      <td className="fw-bold">PKR {p.price}</td>
                      <td>{p.tilesPerBox}</td>
                      <td className="text-end">
                        <button
                          id={`btn-edit-prod-${p._id}`}
                          type="button"
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          id={`btn-del-prod-${p._id}`}
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
