"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StoreLayout({ children }) {
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);
  const [auth, setAuth] = useState({
    loading: true,
    authenticated: false,
    name: "",
    role: "",
  });

  // Check auth session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data.authenticated) {
          setAuth({
            loading: false,
            authenticated: true,
            name: data.name,
            role: data.role,
          });
        } else {
          setAuth({
            loading: false,
            authenticated: false,
            name: "",
            role: "",
          });
        }
      } catch {
        setAuth({
          loading: false,
          authenticated: false,
          name: "",
          role: "",
        });
      }
    }

    checkSession();
  }, []);

  // Update cart count
  useEffect(() => {
    function updateCount() {
      const saved = localStorage.getItem("tilestore_cart");
      if (saved) {
        try {
          const cart = JSON.parse(saved);
          const count = cart.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        } catch {}
      } else {
        setCartCount(0);
      }
    }

    updateCount();
    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setAuth({
      loading: false,
      authenticated: false,
      name: "",
      role: "",
    });
    router.push("/login");
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-warning" href="/">
            TileStore Pro
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#storeNav"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="storeNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <li className="nav-item">
                <Link className="nav-link" href="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="/catalog">
                  Catalog
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link position-relative" href="/cart">
                  Cart 🛒
                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.65rem" }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>

              {/* Dynamic Authentication Links */}
              {auth.authenticated ? (
                <>
                  <li className="nav-item">
                    {auth.role === "Customer" ? (
                      <Link
                        id="nav-customer-portal"
                        className="nav-link text-warning fw-semibold d-flex align-items-center gap-1"
                        href="/customer/dashboard"
                      >
                        <span>👤</span> Customer Portal
                      </Link>
                    ) : (
                      <Link
                        id="nav-admin-panel"
                        className="nav-link text-warning fw-semibold d-flex align-items-center gap-1"
                        href="/admin/dashboard"
                      >
                        <span>⚙️</span> Admin Panel
                      </Link>
                    )}
                  </li>
                  <li className="nav-item">
                    <button
                      id="btn-nav-logout"
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-outline-light btn-sm ms-lg-2"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link id="nav-login" className="nav-link" href="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      id="nav-register"
                      className="btn btn-warning btn-sm ms-lg-2"
                      href="/register"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="text-warning">TileStore Pro</h5>
              <p className="text-secondary small mb-0">
                Premium flooring and wall tile solutions for homes, projects,
                and retail spaces.
              </p>
            </div>
            <div className="col-md-4">
              <h6>Company</h6>
              <ul className="list-unstyled small text-secondary mb-0">
                <li>
                  <Link
                    href="/about"
                    className="text-secondary text-decoration-none"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-secondary text-decoration-none"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-secondary text-decoration-none"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6>Support</h6>
              <ul className="list-unstyled small text-secondary mb-0">
                <li>+92 300 1234567</li>
                <li>hello@tilestorepro.com</li>
                <li>Mon - Sat, 9:00 AM - 7:00 PM</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
