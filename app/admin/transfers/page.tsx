"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

const STATUS_COLORS = { Pending: "warning text-dark", "In Transit": "info text-dark", Completed: "success" };

export default function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ productId: "", sourceWarehouseId: "", destinationOutletId: "", boxCount: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadAll() {
    setLoading(true);
    const [tRes, pRes, wRes, oRes] = await Promise.all([
      fetch("/api/admin/transfers"),
      fetch("/api/admin/products"),
      fetch("/api/admin/locations?type=warehouse"),
      fetch("/api/admin/locations?type=outlet"),
    ]);
    const [t, p, w, o] = await Promise.all([tRes.json(), pRes.json(), wRes.json(), oRes.json()]);
    setTransfers(Array.isArray(t) ? t : []);
    setProducts(Array.isArray(p) ? p : []);
    setWarehouses(Array.isArray(w) ? w : []);
    setOutlets(Array.isArray(o) ? o : []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, boxCount: Number(form.boxCount) }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Failed."); return; }
    setShowForm(false);
    setForm({ productId: "", sourceWarehouseId: "", destinationOutletId: "", boxCount: "" });
    loadAll();
  }

  async function updateStatus(id, status) {
    await fetch("/api/admin/transfers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadAll();
  }

  return (
    <AdminLayout title="Stock Transfers" subtitle="Admin">
      <div className="d-flex justify-content-end mb-3">
        <button id="btn-new-transfer" type="button" className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Cancel" : "+ New Transfer"}
        </button>
      </div>

      {showForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <h5 className="fw-bold text-primary-custom mb-3">Create Stock Transfer</h5>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit} id="transfer-form">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Product</label>
                  <select className="form-select" value={form.productId} onChange={(e) => setForm((f) => ({ ...f, productId: e.target.value }))} required>
                    <option value="">Select product</option>
                    {products.map((p) => <option key={p._id} value={p._id}>{p.design}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Source Warehouse</label>
                  <select className="form-select" value={form.sourceWarehouseId} onChange={(e) => setForm((f) => ({ ...f, sourceWarehouseId: e.target.value }))} required>
                    <option value="">Select warehouse</option>
                    {warehouses.map((w) => <option key={w._id} value={w._id}>{w.name}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Destination Outlet</label>
                  <select className="form-select" value={form.destinationOutletId} onChange={(e) => setForm((f) => ({ ...f, destinationOutletId: e.target.value }))} required>
                    <option value="">Select outlet</option>
                    {outlets.map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Box Count</label>
                  <input type="number" min="1" className="form-control" value={form.boxCount} onChange={(e) => setForm((f) => ({ ...f, boxCount: e.target.value }))} required />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <button id="btn-transfer-save" type="submit" className="btn btn-primary w-100" disabled={saving}>{saving ? "…" : "Create"}</button>
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
                <tr><th>Product</th><th>From</th><th>To</th><th>Boxes</th><th>Date</th><th>Status</th><th className="text-end">Update</th></tr>
              </thead>
              <tbody>
                {transfers.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-4 text-muted-custom">No transfers found.</td></tr>
                ) : transfers.map((t) => (
                  <tr key={t._id}>
                    <td className="fw-semibold">{t.productId?.design || "—"}</td>
                    <td className="text-muted-custom">{t.sourceWarehouseId?.name || "—"}</td>
                    <td className="text-muted-custom">{t.destinationOutletId?.name || "—"}</td>
                    <td>{t.boxCount}</td>
                    <td className="text-muted-custom small">{t.transferDate ? new Date(t.transferDate).toLocaleDateString() : "—"}</td>
                    <td><span className={`badge bg-${STATUS_COLORS[t.status] || "secondary"}`}>{t.status}</span></td>
                    <td className="text-end">
                      <select
                        className="form-select form-select-sm"
                        style={{ width: 130 }}
                        value={t.status}
                        onChange={(e) => updateStatus(t._id, e.target.value)}
                        id={`status-transfer-${t._id}`}
                      >
                        <option>Pending</option>
                        <option>In Transit</option>
                        <option>Completed</option>
                      </select>
                    </td>
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
