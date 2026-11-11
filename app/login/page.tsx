"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  const [activeRole, setActiveRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: activeRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }

      const role = data.role;
      if (redirectUrl) {
        router.push(redirectUrl);
      } else if (role === "Admin" || role === "Super Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/customer/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="text-primary-custom fw-bold">Welcome back</h2>
                <p className="text-muted-custom mb-0">Sign in to your account</p>
              </div>

              <div
                className="btn-group w-100 mb-4"
                role="group"
                aria-label="Select login role"
              >
                <button
                  type="button"
                  id="btn-role-customer"
                  className={`btn ${
                    activeRole === "customer"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setActiveRole("customer");
                    setError("");
                  }}
                >
                  Customer
                </button>
                <button
                  type="button"
                  id="btn-role-admin"
                  className={`btn ${
                    activeRole === "admin"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setActiveRole("admin");
                    setError("");
                  }}
                >
                  Admin
                </button>
              </div>

              {error && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} id="login-form">
                <div className="mb-3">
                  <label htmlFor="login-email" className="form-label">
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="login-password" className="form-label">
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Link
                    href="/forgot-password"
                    className="small text-decoration-none"
                  >
                    Forgot password?
                  </Link>
                  <Link href="/register" className="small text-decoration-none">
                    Register
                  </Link>
                </div>
                <button
                  id="btn-login-submit"
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Login"}
                </button>
              </form>

              {activeRole === "admin" && (
                <div className="mt-3 p-3 rounded-3 bg-light small text-muted-custom">
                  <strong>Demo Admin:</strong> admin@tilestore.com / admin123
                </div>
              )}
              {activeRole === "customer" && (
                <div className="mt-3 p-3 rounded-3 bg-light small text-muted-custom">
                  <strong>Demo Customer:</strong> ali@example.com / customer123
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <StoreLayout>
      <Suspense
        fallback={
          <div className="text-center py-5">
            <div className="spinner-border text-primary" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </StoreLayout>
  );
}
