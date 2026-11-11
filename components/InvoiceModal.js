"use client";

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  function handlePrint() {
    window.print();
  }

  const customerName = order.customer?.name || order.customerId?.name || "Valued Customer";
  const customerEmail = order.customer?.email || order.customerId?.email || "";
  const customerPhone = order.customer?.phone || order.customerId?.phone || "";
  const customerAddress = order.customer?.address || order.customerId?.address || "On file";

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1060 }}
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-dark text-white d-print-none">
            <h5 className="modal-title fw-bold">📄 Order Invoice & Receipt</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close" />
          </div>

          <div className="modal-body p-4 p-md-5 invoice-printable" id="invoice-content">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
              <div>
                <h3 className="fw-bold text-primary mb-1">TileStore Pro</h3>
                <p className="text-secondary small mb-0">Premium Architectural & Flooring Solutions</p>
                <p className="text-secondary small mb-0">Contact: +92 300 1234567 | support@tilestorepro.com</p>
              </div>
              <div className="text-end">
                <span className="badge bg-primary text-uppercase px-3 py-2 mb-2">
                  {order.orderType === "Quotation" ? "Official Quotation" : "Tax Invoice"}
                </span>
                <div className="text-muted small">Invoice ID:</div>
                <div className="fw-bold font-monospace fs-6">INV-{order._id.slice(-8).toUpperCase()}</div>
                <div className="text-muted small mt-1">Date: {new Date(order.orderDate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Customer & Order Metadata */}
            <div className="row g-4 mb-4">
              <div className="col-sm-6">
                <h6 className="text-uppercase text-muted small fw-bold mb-2">Billed To:</h6>
                <div className="fw-bold fs-6">{customerName}</div>
                {customerEmail && <div className="text-secondary small">{customerEmail}</div>}
                {customerPhone && <div className="text-secondary small">Tel: {customerPhone}</div>}
                <div className="text-secondary small mt-1">{customerAddress}</div>
              </div>
              <div className="col-sm-6 text-sm-end">
                <h6 className="text-uppercase text-muted small fw-bold mb-2">Order Information:</h6>
                <div className="small">
                  <span className="text-muted">Payment Method: </span>
                  <strong>{order.orderType}</strong>
                </div>
                <div className="small mt-1">
                  <span className="text-muted">Fulfillment Status: </span>
                  <span
                    className={`badge bg-${
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Confirmed"
                        ? "info text-dark"
                        : order.status === "Cancelled"
                        ? "danger"
                        : "warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="table-responsive mb-4">
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "5%" }}>#</th>
                    <th>Product & Description</th>
                    <th>Brand</th>
                    <th className="text-center" style={{ width: "15%" }}>Quantity (Boxes)</th>
                    <th className="text-end" style={{ width: "15%" }}>Unit Price</th>
                    <th className="text-end" style={{ width: "15%" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td className="text-center text-muted small">{idx + 1}</td>
                      <td>
                        <div className="fw-semibold">{item.productId?.design || "Tile Product"}</div>
                        {item.productId?.size && (
                          <div className="text-muted small">
                            {item.productId.size.length}×{item.productId.size.width} {item.productId.size.unit}
                          </div>
                        )}
                      </td>
                      <td className="text-secondary small">{item.productId?.company || "Standard"}</td>
                      <td className="text-center fw-bold">{item.boxQuantity}</td>
                      <td className="text-end">PKR {Number(item.unitPrice).toLocaleString()}</td>
                      <td className="text-end fw-bold">
                        PKR {(Number(item.unitPrice) * Number(item.boxQuantity)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="row justify-content-end mb-4">
              <div className="col-sm-6 col-md-5">
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-semibold">PKR {Number(order.totalAmount).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between py-1 border-bottom">
                  <span className="text-muted">Estimated Delivery:</span>
                  <span className="text-success fw-semibold">FREE</span>
                </div>
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="fw-bold fs-5 text-primary">Grand Total:</span>
                  <span className="fw-bold fs-5 text-primary">PKR {Number(order.totalAmount).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Footer notes */}
            <div className="border-top pt-3 text-center text-muted small">
              <p className="mb-1">Thank you for choosing TileStore Pro for your flooring and tile requirements.</p>
              <p className="mb-0">All products are covered by standard manufacturer warranties against glazing defects.</p>
            </div>
          </div>

          <div className="modal-footer bg-light d-print-none">
            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={handlePrint}>
              <span>🖨️</span> Print / Save to PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
