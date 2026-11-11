"use client";

import { useEffect, useState } from "react";
import CustomerLayout from "@/components/CustomerLayout";
import InvoiceModal from "@/components/InvoiceModal";

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/customer/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function handleCancelOrder(orderId: string) {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      const res = await fetch("/api/customer/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action: "cancel" }),
      });
      if (res.ok) {
        loadOrders();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel order.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <CustomerLayout title="My Orders" subtitle="Customer Portal">
      <div className="card border-0 shadow-sm">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
            <p className="mt-3 text-muted-custom">Loading your orders…</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items Purchased</th>
                  <th>Payment Type</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-5 text-muted-custom">
                      No orders found. Explore our <a href="/catalog">tile catalog</a> to make a purchase!
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id}>
                      <td className="font-monospace fw-bold text-primary">#{o._id.slice(-8).toUpperCase()}</td>
                      <td className="text-muted-custom small">{new Date(o.orderDate).toLocaleDateString()}</td>
                      <td>
                        <ul className="list-unstyled mb-0 small">
                          {o.items?.map((item) => (
                            <li key={item._id} className="d-flex align-items-center gap-1">
                              <span>•</span>
                              <strong className="text-dark">{item.productId?.design || "Tile Product"}</strong>
                              <span className="text-muted">({item.boxQuantity} boxes)</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>
                        <span className={`badge bg-${o.orderType === "Quotation" ? "secondary" : "primary"}`}>
                          {o.orderType}
                        </span>
                      </td>
                      <td className="fw-bold text-primary-custom">PKR {o.totalAmount?.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            o.status === "Delivered"
                              ? "success"
                              : o.status === "Confirmed"
                              ? "info text-dark"
                              : o.status === "Cancelled"
                              ? "danger"
                              : "warning text-dark"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => setSelectedInvoice(o)}
                          >
                            📄 Invoice
                          </button>
                          {o.status === "Pending" && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              disabled={cancellingId === o._id}
                              onClick={() => handleCancelOrder(o._id)}
                            >
                              {cancellingId === o._id ? "…" : "Cancel"}
                            </button>
                          )}
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
    </CustomerLayout>
  );
}
