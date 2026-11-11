"use client";

import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateReport(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setReportData(null);

    try {
      const params = new URLSearchParams({ type: reportType });
      if (dateRange.from) params.append("from", dateRange.from);
      if (dateRange.to) params.append("to", dateRange.to);

      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Failed to generate report.");
      } else {
        setReportData(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="Generate Reports" subtitle="Admin">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <form onSubmit={generateReport} id="report-form">
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label fw-semibold">Report Type</label>
                <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="sales">Sales & Revenue</option>
                  <option value="stock">Stock Levels</option>
                  <option value="outlet">Outlet Inventory</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">From Date</label>
                <input type="date" className="form-control" value={dateRange.from} onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))} disabled={reportType !== "sales"} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">To Date</label>
                <input type="date" className="form-control" value={dateRange.to} onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))} disabled={reportType !== "sales"} />
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? "Generating..." : "Generate Report"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {reportData && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 fw-bold">{reportData.type}</h5>
              <small className="text-muted-custom">Generated on {new Date().toLocaleString()}</small>
            </div>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => window.print()}>🖨️ Print</button>
          </div>
          <div className="card-body p-4">
            
            {reportData.type === "Sales Report" && (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="text-muted-custom small">Total Revenue</div>
                      <div className="fs-4 fw-bold text-primary-custom">PKR {reportData.totalRevenue?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="text-muted-custom small">Total Orders</div>
                      <div className="fs-4 fw-bold">{reportData.totalOrders || 0}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="text-muted-custom small">Confirmed</div>
                      <div className="fs-4 fw-bold text-info">{reportData.confirmed || 0}</div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="text-muted-custom small">Delivered</div>
                      <div className="fs-4 fw-bold text-success">{reportData.delivered || 0}</div>
                    </div>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead><tr><th>Date</th><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                      {reportData.orders?.map(o => (
                        <tr key={o._id}>
                          <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                          <td className="font-monospace">{o._id.slice(-8)}</td>
                          <td>{o.customerId?.name}</td>
                          <td>PKR {o.totalAmount}</td>
                          <td>{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {(reportData.type === "Stock Report" || reportData.type === "Outlet Summary") && (
              <>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="text-muted-custom small">Total Items Tracked</div>
                      <div className="fs-4 fw-bold">{reportData.totalItems || 0}</div>
                    </div>
                  </div>
                  {reportData.type === "Stock Report" && (
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded text-center">
                        <div className="text-muted-custom small">Low Stock Warnings</div>
                        <div className="fs-4 fw-bold text-danger">{reportData.lowStock || 0}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="table-responsive">
                  <table className="table table-sm table-striped">
                    <thead><tr><th>Product</th><th>Company</th><th>Boxes</th><th>Price/Box</th></tr></thead>
                    <tbody>
                      {reportData.items?.map(i => (
                        <tr key={i._id}>
                          <td>{i.productId?.design}</td>
                          <td>{i.productId?.company}</td>
                          <td className={i.boxCount < 10 ? "text-danger fw-bold" : ""}>{i.boxCount}</td>
                          <td>PKR {i.productId?.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </AdminLayout>
  );
}
