"use client";

import { useEffect, useState } from "react";
import CustomerLayout from "@/components/CustomerLayout";
import Link from "next/link";

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pending = orders.filter(o => o.status === "Pending").length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <CustomerLayout title="My Dashboard" subtitle="Welcome back">
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 text-center">
                <div className="text-muted-custom small mb-1">Total Orders</div>
                <div className="fs-3 fw-bold text-primary-custom">{orders.length}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 text-center">
                <div className="text-muted-custom small mb-1">Pending Orders</div>
                <div className="fs-3 fw-bold text-warning">{pending}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm p-4 text-center">
                <div className="text-muted-custom small mb-1">Total Spent</div>
                <div className="fs-3 fw-bold text-success">PKR {totalSpent.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold m-0">Recent Orders</h5>
                <Link href="/customer/orders" className="btn btn-sm btn-outline-primary">View All</Link>
              </div>
              
              {orders.length === 0 ? (
                <div className="text-center py-4 text-muted-custom">
                  You haven't placed any orders yet. <Link href="/catalog">Browse catalog</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => (
                        <tr key={o._id}>
                          <td className="font-monospace">{o._id.slice(-8)}</td>
                          <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                          <td>PKR {o.totalAmount?.toLocaleString()}</td>
                          <td><span className={`badge bg-${o.status === 'Pending' ? 'warning text-dark' : o.status === 'Delivered' ? 'success' : 'info'}`}>{o.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </CustomerLayout>
  );
}
