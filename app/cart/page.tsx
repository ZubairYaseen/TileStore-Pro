"use client";

import { useState, useEffect } from "react";
import StoreLayout from "@/components/StoreLayout";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderType, setOrderType] = useState("COD");

  useEffect(() => {
    const saved = localStorage.getItem("tilestore_cart");
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch {}
    }
  }, []);

  function updateQuantity(idx, val) {
    const newCart = [...cart];
    newCart[idx].quantity = Math.max(1, parseInt(val) || 1);
    setCart(newCart);
    localStorage.setItem("tilestore_cart", JSON.stringify(newCart));
  }

  function removeItem(idx) {
    const newCart = cart.filter((_, i) => i !== idx);
    setCart(newCart);
    localStorage.setItem("tilestore_cart", JSON.stringify(newCart));
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  async function handleCheckout() {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/customer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, orderType })
      });
      
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login?redirect=/cart";
        } else {
          setError(data.error || "Checkout failed");
        }
        return;
      }
      
      setSuccess(true);
      setCart([]);
      localStorage.removeItem("tilestore_cart");
      
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <StoreLayout>
        <div className="container py-5 text-center">
          <div className="display-1 text-success mb-3">✓</div>
          <h2 className="fw-bold">Order Placed Successfully!</h2>
          <p className="text-muted-custom mb-4">We will process your {orderType} order shortly.</p>
          <Link href="/customer/orders" className="btn btn-primary">View My Orders</Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container py-5">
        <h2 className="section-title mb-4">Your Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted-custom">Your cart is empty.</p>
            <Link href="/catalog" className="btn btn-primary mt-2">Browse Catalog</Link>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4">
                {cart.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 py-3 border-bottom">
                    <div className="rounded overflow-hidden bg-light" style={{ width: 80, height: 80, flexShrink: 0 }}>
                      {item.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={item.imageUrl} alt={item.design} className="w-100 h-100" style={{ objectFit: "cover" }} />
                      ) : (
                        <div className="d-flex align-items-center justify-content-center h-100 fw-bold text-primary-custom small">
                          {item.design.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.design}</h6>
                      <div className="text-muted-custom small">{item.company} | PKR {item.price}</div>
                    </div>
                    <div>
                      <input type="number" className="form-control form-control-sm" style={{ width: 70 }} min="1" value={item.quantity} onChange={e => updateQuantity(i, e.target.value)} />
                    </div>
                    <div className="fw-bold text-end" style={{ width: 100 }}>
                      PKR {item.price * item.quantity}
                    </div>
                    <button className="btn btn-sm text-danger" onClick={() => removeItem(i)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: 100 }}>
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className="fw-semibold">PKR {total}</span>
                </div>
                <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                  <span>Delivery</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="fw-bold fs-5 text-primary-custom">PKR {total}</span>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Order Type</label>
                  <select className="form-select" value={orderType} onChange={e => setOrderType(e.target.value)}>
                    <option value="COD">Cash on Delivery</option>
                    <option value="Quotation">Request Quotation</option>
                  </select>
                </div>
                
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                
                <button className="btn btn-primary w-100 btn-lg" onClick={handleCheckout} disabled={loading}>
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
