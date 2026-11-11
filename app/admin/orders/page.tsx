"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import InvoiceModal from "@/components/InvoiceModal";

const STATUS_COLORS = {
  Pending: "warning text-dark",
  Confirmed: "info text-dark",
  Delivered: "success",
  Cancelled: "danger",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  async function loadOrders() {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, status) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    loadOrders();
  }

  const filtered = orders.filter(
    (o) =>
      !search ||
      o.customerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o._id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Sales & Orders" subtitle="Admin">
      <div className="d-flex align-items-center gap-3 mb-4">
        <input
          id="order-search"
          type="text"
          className="form-control"
          placeholder="Search by customer name, email or order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
        <span className="badge bg-light text-dark border">{filtered.length} orders</span>
      </div>

      <div className="card border-0 shadow-sm">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Type</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-muted-custom">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr key={o._id}>
                      <td className="font-monospace text-muted-custom small">
                        #{o._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        <div className="fw-semibold">{o.customerId?.name || "—"}</div>
                        <div className="text-muted-custom small">{o.customerId?.email}</div>
                      </td>
                      <td>
                        <div className="small">
                          {(o.items || []).map((item, i) => (
                            <div key={i}>
                              {item.productId?.design} × {item.boxQuantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge bg-${o.orderType === "Quotation" ? "secondary" : "primary"}`}>
                          {o.orderType}
                        </span>
                      </td>
                      <td className="fw-bold">PKR {o.totalAmount?.toLocaleString()}</td>
                      <td className="text-muted-custom small">
                        {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <span className={`badge bg-${STATUS_COLORS[o.status] || "secondary"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelectedInvoice(o)}
                          >
                            📄 Invoice
                          </button>
                          <select
                            id={`status-order-${o._id}`}
                            className="form-select form-select-sm"
                            style={{ width: 125 }}
                            value={o.status}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                          >
                            <option>Pending</option>
                            <option>Confirmed</option>
                            <option>Delivered</option>
                            <option>Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </AdminLayout>
  );
}
