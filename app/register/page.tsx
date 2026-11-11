"use client";

import { useState } from "react";
import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e: any) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <StoreLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="text-primary-custom fw-bold">Create your account</h2>
                  <p className="text-muted-custom mb-0">
                    Already have an account?{" "}
                    <Link href="/login" className="text-decoration-none">
                      Sign in
                    </Link>
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success py-2 small" role="alert">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} id="register-form">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="reg-name" className="form-label">Full name</label>
                      <input
                        id="reg-name"
                        name="name"
                        type="text"
                        className="form-control"
                        placeholder="Muhammad Ali"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="reg-email" className="form-label">Email</label>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="ali@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="reg-password" className="form-label">Password</label>
                      <input
                        id="reg-password"
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Min 6 characters"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="reg-phone" className="form-label">Phone</label>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        className="form-control"
                        placeholder="0300-1234567"
                        value={form.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="reg-address" className="form-label">Address</label>
                      <textarea
                        id="reg-address"
                        name="address"
                        className="form-control"
                        rows={3}
                        placeholder="Street, City, Province"
                        value={form.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <button
                    id="btn-register-submit"
                    type="submit"
                    className="btn btn-primary w-100 mt-4"
                    disabled={loading}
                  >
                    {loading ? "Creating account…" : "Register"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
