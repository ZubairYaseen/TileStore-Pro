"use client";

import { useState } from "react";
import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userName, setUserName] = useState("");

  async function handleVerify(e: any) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Email not found.");
      } else {
        setVerified(true);
        setUserName(data.userName || "");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: any) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Password reset failed.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StoreLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="text-primary-custom fw-bold">Reset Password</h2>
                  <p className="text-muted-custom mb-0">
                    {verified
                      ? `Welcome back, ${userName}. Set your new password.`
                      : "Enter your registered email address to recover your account."}
                  </p>
                </div>

                {error && <div className="alert alert-danger py-2 small">{error}</div>}

                {success ? (
                  <div className="text-center py-4">
                    <div className="mb-3 text-success fs-1">✓</div>
                    <h5 className="fw-bold text-success">Password Updated!</h5>
                    <p className="text-muted-custom small mb-4">
                      Your password has been successfully updated. You can now log into your account.
                    </p>
                    <Link href="/login" className="btn btn-primary w-100">
                      Go to Login
                    </Link>
                  </div>
                ) : !verified ? (
                  <form onSubmit={handleVerify} id="forgot-password-form">
                    <div className="mb-3">
                      <label htmlFor="forgot-email" className="form-label">
                        Registered Email address
                      </label>
                      <input
                        id="forgot-email"
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      id="btn-forgot-submit"
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Verifying Account…" : "Verify Email & Continue"}
                    </button>
                    <div className="text-center mt-3">
                      <Link href="/login" className="small text-decoration-none">
                        ← Back to Login
                      </Link>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleReset} id="reset-password-form">
                    <div className="mb-3">
                      <label className="form-label">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Min 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                      {loading ? "Updating Password…" : "Save New Password"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
