"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { label: "Categories", href: "/admin/categories", icon: "🗂️" },
  { label: "Products", href: "/admin/products", icon: "🪨" },
  { label: "Inventory", href: "/admin/inventory", icon: "📦" },
  { label: "Warehouses & Outlets", href: "/admin/locations", icon: "🏭" },
  { label: "Stock Transfers", href: "/admin/transfers", icon: "🔄" },
  { label: "Orders", href: "/admin/orders", icon: "🧾" },
  { label: "Reports", href: "/admin/reports", icon: "📈" },
  { label: "Staff & Admins", href: "/admin/users", icon: "👥" },
  { label: "Change Password", href: "/admin/change-password", icon: "🔐" },
];

export default function AdminLayout({ children, title, subtitle }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <nav className="navbar navbar-dark admin-navbar sticky-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold text-warning d-flex align-items-center gap-2" href="/admin/dashboard">
            <span>🏪</span> TileStore Pro
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-semibold small">Admin Panel</span>
            <button
              id="btn-admin-logout"
              type="button"
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container-fluid admin-container">
        <div className="row g-0">
          {/* Sidebar */}
          <aside className="col-lg-2 admin-sidebar">
            <div className="admin-sidebar-inner">
              <nav className="admin-sidebar-nav">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`admin-nav-link ${pathname === item.href ? "active" : ""}`}
                    id={`nav-${item.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="col-lg-10 admin-main">
            {(title || subtitle) && (
              <div className="admin-page-header">
                {subtitle && <p className="text-uppercase text-muted-custom small fw-bold mb-1">{subtitle}</p>}
                {title && <h2 className="section-title mb-0">{title}</h2>}
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
