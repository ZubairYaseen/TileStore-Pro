"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", locationId: "", locationType: "Warehouse", boxCount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    const [invRes, prodRes, whRes, outRes] = await Promise.all([
      fetch("/api/admin/inventory"),
      fetch("/api/admin/products"),
      fetch("/api/admin/locations?type=warehouse"),
      fetch("/api/admin/locations?type=outlet"),
    ]);
    const [inv, prod, wh, out] = await Promise.all([invRes.json(), prodRes.json(), whRes.json(), outRes.json()]);
    setItems(Array.isArray(inv) ? inv : []);
    setProducts(Array.isArray(prod) ? prod : []);
    setWarehouses(Array.isArray(wh) ? wh : []);
    setOutlets(Array.isArray(out) ? out : []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const locations = form.locationType === "Warehouse" ? warehouses : outlets;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, boxCount: Number(form.boxCount) }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Failed."); return; }
    setShowForm(false);
    setForm({ productId: "", locationId: "", locationType: "Warehouse", boxCount: "" });
    loadAll();
  }

  return (
    <AdminLayout title="Inventory Management" subtitle="Admin">
      <div className="d-flex justify-content-end mb-3">
        <button id="btn-add-stock" type="button" className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ Add Stock"}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold text-primary-custom mb-3">Add Stock Entry</h5>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit} id="inv-form">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Product</label>
                  <select className="form-select" value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))} required>
                    <option value="">Select product</option>
                    {products.map((p) => <option key={p._id} value={p._id}>{p.design} ({p.company})</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Location Type</label>
                  <select className="form-select" value={form.locationType} onChange={(e) => setForm((f) => ({ ...f, locationType: e.target.value, locationId: "" }))}>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Outlet">Outlet</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Location</label>
                  <select className="form-select" value={form.locationId} onChange={(e) => setForm((f) => ({ ...f, locationId: e.target.value }))} required>
                    <option value="">Select location</option>
                    {locations.map((l) => <option key={l._id} value={l._id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Box Count</label>
                  <input type="number" min="0" className="form-control" value={form.boxCount} onChange={(e) => setForm((f) => ({ ...f, boxCount: e.target.value }))} required />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button id="btn-inv-save" type="submit" className="btn btn-primary w-100" disabled={saving}>{saving ? "…" : "Add"}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Box Count</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted-custom">No inventory records.</td></tr>
                ) : items.map((item) => (
                  <tr key={item._id}>
                    <td className="fw-semibold">{item.productId?.design || "—"}</td>
                    <td>{item.productId?.company || "—"}</td>
                    <td>{item.locationName}</td>
                    <td><span className={`badge ${item.locationType === "Warehouse" ? "bg-info text-dark" : "bg-success"}`}>{item.locationType}</span></td>
                    <td className="fw-bold">{item.boxCount}</td>
                    <td>
                      {item.boxCount < 10
                        ? <span className="badge bg-danger">Low Stock</span>
                        : <span className="badge bg-success">In Stock</span>}
                    </td>
                    <td className="text-muted-custom small">{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
