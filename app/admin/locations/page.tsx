"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

const EMPTY_FORM = { name: "", address: "", contactNumber: "", locationType: "Warehouse" };

export default function LocationsPage() {
  const [tab, setTab] = useState("Warehouse");
  const [warehouses, setWarehouses] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadAll() {
    setLoading(true);
    const [wRes, oRes] = await Promise.all([
      fetch("/api/admin/locations?type=warehouse"),
      fetch("/api/admin/locations?type=outlet"),
    ]);
    const [w, o] = await Promise.all([wRes.json(), oRes.json()]);
    setWarehouses(Array.isArray(w) ? w : []);
    setOutlets(Array.isArray(o) ? o : []);
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const rows = tab === "Warehouse" ? warehouses : outlets;

  function startEdit(loc) {
    setEditId(loc._id);
    setForm({ name: loc.name, address: loc.address, contactNumber: loc.contactNumber, locationType: tab });
    setError("");
  }

  function resetForm() {
    setEditId(null);
    setForm({ ...EMPTY_FORM, locationType: tab });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = editId ? `/api/admin/locations/${editId}` : "/api/admin/locations";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, locationType: tab }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Failed."); return; }
    resetForm();
    loadAll();
  }

  async function handleDelete(id) {
    if (!confirm(`Delete this ${tab.toLowerCase()}?`)) return;
    await fetch(`/api/admin/locations/${id}?type=${tab === "Outlet" ? "Outlet" : "Warehouse"}`, { method: "DELETE" });
    loadAll();
  }

  return (
    <AdminLayout title="Warehouses & Outlets" subtitle="Admin">
      <div className="btn-group mb-4" role="group">
        <button id="tab-warehouse" type="button" className={`btn ${tab === "Warehouse" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => { setTab("Warehouse"); resetForm(); }}>Warehouses</button>
        <button id="tab-outlet" type="button" className={`btn ${tab === "Outlet" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => { setTab("Outlet"); resetForm(); }}>Outlets</button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-primary-custom mb-3">{editId ? `Edit ${tab}` : `Add ${tab}`}</h5>
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          <form onSubmit={handleSubmit} id="loc-form">
            <div className="row g-3">
              <div className="col-md-4">
                <label htmlFor="loc-name" className="form-label">Name</label>
                <input id="loc-name" className="form-control" placeholder={`${tab} name`} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="col-md-4">
                <label htmlFor="loc-addr" className="form-label">Address</label>
                <input id="loc-addr" className="form-control" placeholder="Full address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} required />
              </div>
              <div className="col-md-3">
                <label htmlFor="loc-contact" className="form-label">Contact</label>
                <input id="loc-contact" className="form-control" placeholder="+92 300 1234567" value={form.contactNumber} onChange={(e) => setForm((f) => ({ ...f, contactNumber: e.target.value }))} required />
              </div>
              <div className="col-md-1 d-flex align-items-end gap-2">
                <button id="btn-loc-save" type="submit" className="btn btn-primary w-100" disabled={saving}>{saving ? "…" : editId ? "Update" : "Add"}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr><th>Name</th><th>Address</th><th>Contact</th><th className="text-end">Actions</th></tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-4 text-muted-custom">No {tab.toLowerCase()}s found.</td></tr>
                ) : rows.map((loc) => (
                  <tr key={loc._id}>
                    <td className="fw-semibold">{loc.name}</td>
                    <td className="text-muted-custom">{loc.address}</td>
                    <td>{loc.contactNumber}</td>
                    <td className="text-end">
                      <button id={`btn-edit-loc-${loc._id}`} type="button" className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(loc)}>Edit</button>
                      <button id={`btn-del-loc-${loc._id}`} type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(loc._id)}>Delete</button>
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
