"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/customer/dashboard", icon: "📊" },
  { label: "My Orders", href: "/customer/orders", icon: "🧾" },
  { label: "Browse Catalog", href: "/catalog", icon: "🪨" },
  { label: "Change Password", href: "/customer/change-password", icon: "🔐" },
];

export default function CustomerLayout({ children, title, subtitle }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <>
      <nav className="navbar navbar-dark admin-navbar sticky-top bg-dark">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold text-warning d-flex align-items-center gap-2" href="/">
            <span>🏪</span> TileStore Pro
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-light text-dark px-3 py-2 rounded-pill fw-semibold small">Customer Portal</span>
            <button
              id="btn-customer-logout"
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
          <aside className="col-lg-2 admin-sidebar bg-light">
            <div className="admin-sidebar-inner p-3">
              <nav className="nav flex-column gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link rounded ${pathname === item.href ? "bg-primary text-white" : "text-dark"}`}
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="col-lg-10 p-4">
            {(title || subtitle) && (
              <div className="mb-4">
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
