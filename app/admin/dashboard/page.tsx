"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: "Total Products", value: stats.totalProducts, icon: "🪨", color: "primary" },
        { label: "Low-Stock Alerts", value: stats.lowStockAlerts, icon: "⚠️", color: "warning" },
        { label: "Pending Orders", value: stats.pendingOrders, icon: "🧾", color: "info" },
        { label: "Total Customers", value: stats.totalCustomers, icon: "👤", color: "success" },
        { label: "Total Revenue", value: `PKR ${stats.totalRevenue?.toLocaleString()}`, icon: "💰", color: "primary" },
      ]
    : [];

  const quickLinks = [
    { label: "Add Category", href: "/admin/categories", icon: "🗂️" },
    { label: "Add Product", href: "/admin/products", icon: "➕" },
    { label: "View Inventory", href: "/admin/inventory", icon: "📦" },
    { label: "Create Transfer", href: "/admin/transfers", icon: "🔄" },
    { label: "View Orders", href: "/admin/orders", icon: "🧾" },
    { label: "Generate Report", href: "/admin/reports", icon: "📈" },
  ];

  return (
    <AdminLayout title="Operations Overview" subtitle="Dashboard">
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted-custom">Loading dashboard…</p>
        </div>
      ) : (
        <>
          <div className="row g-4 mb-4">
            {cards.map((card) => (
              <div className="col-sm-6 col-xl-4" key={card.label}>
                <div className="stat-card h-100">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <span style={{ fontSize: "1.6rem" }}>{card.icon}</span>
                    <p className="text-muted-custom small mb-0">{card.label}</p>
                  </div>
                  <div className="summary-number">{card.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <h5 className="fw-bold text-primary-custom">Quick Actions</h5>
          </div>
          <div className="row g-3">
            {quickLinks.map((link) => (
              <div className="col-sm-6 col-md-4" key={link.href}>
                <Link
                  href={link.href}
                  id={`quick-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="card border-0 shadow-sm p-3 d-flex flex-row align-items-center gap-3 text-decoration-none hover-lift"
                  style={{ color: "inherit" }}
                >
                  <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
                  <span className="fw-semibold">{link.label}</span>
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
