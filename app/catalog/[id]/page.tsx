"use client";

import { useEffect, useState, useMemo } from "react";
import StoreLayout from "@/components/StoreLayout";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function CatalogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Calculator State
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [calcUnit, setCalcUnit] = useState("ft"); // "ft" or "m"
  const [wastagePercent, setWastagePercent] = useState(10); // default 10%

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Tile Area & Box Calculation
  const calculation = useMemo(() => {
    if (!product || !roomLength || !roomWidth) return null;
    const len = parseFloat(roomLength);
    const wid = parseFloat(roomWidth);
    if (isNaN(len) || isNaN(wid) || len <= 0 || wid <= 0) return null;

    // Room area in selected unit
    const roomArea = len * wid;

    // Tile size: convert tile dimensions to meters
    // Product size unit defaults to mm if not specified
    const tileUnit = product.size?.unit || "mm";
    let tileLenM = (product.size?.length || 600);
    let tileWidM = (product.size?.width || 600);

    if (tileUnit === "mm") {
      tileLenM /= 1000;
      tileWidM /= 1000;
    } else if (tileUnit === "cm") {
      tileLenM /= 100;
      tileWidM /= 100;
    } else if (tileUnit === "in") {
      tileLenM *= 0.0254;
      tileWidM *= 0.0254;
    }

    // 1 tile area in square meters
    const tileAreaSqM = tileLenM * tileWidM;
    // 1 tile area in square feet (1 sq m = 10.7639 sq ft)
    const tileAreaSqFt = tileAreaSqM * 10.7639;

    const singleTileArea = calcUnit === "ft" ? tileAreaSqFt : tileAreaSqM;
    const tilesPerBox = product.tilesPerBox || 4;
    const boxArea = singleTileArea * tilesPerBox;

    // Area including wastage
    const totalAreaNeeded = roomArea * (1 + wastagePercent / 100);
    const boxesNeeded = Math.ceil(totalAreaNeeded / boxArea);
    const estimatedCost = boxesNeeded * product.price;

    return {
      roomArea: roomArea.toFixed(1),
      totalAreaNeeded: totalAreaNeeded.toFixed(1),
      boxArea: boxArea.toFixed(2),
      boxesNeeded,
      estimatedCost,
      unitLabel: calcUnit === "ft" ? "sq ft" : "sq meters",
    };
  }, [product, roomLength, roomWidth, calcUnit, wastagePercent]);

  function applyCalculatedBoxes() {
    if (calculation && calculation.boxesNeeded > 0) {
      setQty(calculation.boxesNeeded);
      document.getElementById("order-controls")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function addToCart() {
    if (!product) return;

    const saved = localStorage.getItem("tilestore_cart");
    let cart = saved ? JSON.parse(saved) : [];

    const existing = cart.find((i) => i.productId === product._id);
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        productId: product._id,
        design: product.design,
        company: product.company,
        imageUrl: product.imageUrl || "",
        price: product.price,
        quantity: qty,
      });
    }

    localStorage.setItem("tilestore_cart", JSON.stringify(cart));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <StoreLayout>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" />
          <p className="mt-3 text-muted-custom">Loading tile details…</p>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="container py-5 text-center">
          <h4 className="fw-bold">Product not found</h4>
          <p className="text-muted-custom">The tile you are looking for does not exist or has been removed.</p>
          <Link href="/catalog" className="btn btn-primary mt-3">
            Back to Catalog
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="container py-5">
        <Link href="/catalog" className="text-decoration-none mb-4 d-inline-block text-muted-custom fw-semibold">
          ← Back to Catalog
        </Link>
        <div className="row g-5">
          {/* Tile Image & Visual Gallery */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm overflow-hidden mb-4">
              <div
                className="position-relative bg-light d-flex align-items-center justify-content-center"
                style={{ height: 440 }}
              >
                {product.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.imageUrl}
                    alt={product.design}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="product-image w-100 h-100 fs-1">
                    {product.design.slice(0, 4).toUpperCase()}
                  </div>
                )}
                <span className="position-absolute top-0 start-0 m-3 badge bg-primary px-3 py-2 rounded-pill shadow-sm">
                  {product.categoryId?.categoryName || "Premium Collection"}
                </span>
              </div>
            </div>

            {/* Quick Specs Highlight */}
            <div className="row g-3">
              <div className="col-6 col-sm-3">
                <div className="p-3 bg-white rounded border text-center">
                  <div className="text-muted-custom small">Length</div>
                  <div className="fw-bold">{product.size?.length} {product.size?.unit}</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-3 bg-white rounded border text-center">
                  <div className="text-muted-custom small">Width</div>
                  <div className="fw-bold">{product.size?.width} {product.size?.unit}</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-3 bg-white rounded border text-center">
                  <div className="text-muted-custom small">Box Count</div>
                  <div className="fw-bold">{product.tilesPerBox} pcs</div>
                </div>
              </div>
              <div className="col-6 col-sm-3">
                <div className="p-3 bg-white rounded border text-center">
                  <div className="text-muted-custom small">Unit</div>
                  <div className="fw-bold">{product.unitType}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info & Tile Calculator */}
          <div className="col-lg-6">
            <h1 className="fw-bold mb-2">{product.design}</h1>
            <h5 className="text-muted-custom mb-3">{product.company}</h5>

            <div className="d-flex align-items-baseline gap-2 mb-4">
              <span className="display-6 fw-bold text-primary-custom">PKR {product.price}</span>
              <span className="text-muted-custom">/ {product.unitType || "Box"}</span>
            </div>

            <p className="text-muted-custom mb-4">
              {product.categoryId?.description ||
                "Engineered for high durability and effortless upkeep, ideal for modern architectural flooring and surfaces."}
            </p>

            {/* INTERACTIVE TILE CALCULATOR */}
            <div className="card border-0 bg-primary-soft p-4 rounded-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold text-primary-custom mb-0 d-flex align-items-center gap-2">
                  <span>📐</span> Room Tile & Box Calculator
                </h6>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${calcUnit === "ft" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setCalcUnit("ft")}
                  >
                    Feet
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${calcUnit === "m" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => setCalcUnit("m")}
                  >
                    Meters
                  </button>
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted-custom mb-1">
                    Room Length ({calcUnit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    className="form-control form-control-sm"
                    placeholder="e.g. 14"
                    value={roomLength}
                    onChange={(e) => setRoomLength(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold text-muted-custom mb-1">
                    Room Width ({calcUnit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    className="form-control form-control-sm"
                    placeholder="e.g. 12"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="small text-muted-custom">Wastage / Cutting Allowance:</span>
                <div className="btn-group btn-group-sm" role="group">
                  {[5, 10, 15].map((w) => (
                    <button
                      key={w}
                      type="button"
                      className={`btn btn-sm ${wastagePercent === w ? "btn-dark" : "btn-outline-secondary"}`}
                      onClick={() => setWastagePercent(w)}
                    >
                      +{w}%
                    </button>
                  ))}
                </div>
              </div>

              {calculation ? (
                <div className="bg-white p-3 rounded-3 shadow-sm border">
                  <div className="d-flex justify-content-between small text-muted-custom mb-1">
                    <span>Room Area:</span>
                    <span className="fw-semibold text-dark">{calculation.roomArea} {calculation.unitLabel}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted-custom mb-1">
                    <span>With +{wastagePercent}% Wastage:</span>
                    <span className="fw-semibold text-dark">{calculation.totalAreaNeeded} {calculation.unitLabel}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted-custom mb-2">
                    <span>Coverage per Box:</span>
                    <span className="fw-semibold text-dark">~{calculation.boxArea} {calculation.unitLabel}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between align-items-baseline mb-3">
                    <span className="fw-bold text-primary-custom fs-5">Boxes Needed:</span>
                    <span className="fw-bold text-primary-custom fs-4">{calculation.boxesNeeded} Boxes</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-warning btn-sm w-100 fw-bold"
                    onClick={applyCalculatedBoxes}
                  >
                    Apply {calculation.boxesNeeded} Boxes to Order (Est. PKR {calculation.estimatedCost.toLocaleString()})
                  </button>
                </div>
              ) : (
                <p className="small text-muted-custom mb-0 text-center">
                  Enter your room length and width above to calculate the required boxes automatically.
                </p>
              )}
            </div>

            {/* ORDER CONTROLS */}
            <div id="order-controls" className="card border-0 shadow-sm p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div style={{ width: 140 }}>
                  <label className="form-label small fw-semibold text-muted-custom">Quantity (Boxes)</label>
                  <div className="input-group">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center fw-bold"
                      value={qty}
                      min="1"
                      onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-grow-1 align-self-end">
                  <div className="text-end small text-muted-custom mb-1">
                    Total: <strong className="text-primary-custom">PKR {(qty * product.price).toLocaleString()}</strong>
                  </div>
                  <button
                    className={`btn w-100 ${added ? "btn-success" : "btn-primary"} btn-lg fw-bold`}
                    onClick={addToCart}
                  >
                    {added ? "✓ Added to Cart!" : "Add to Cart"}
                  </button>
                </div>
              </div>

              <div className="d-flex gap-2">
                <Link href="/cart" className="btn btn-outline-primary btn-sm flex-fill">
                  Go to Checkout 🛒
                </Link>
                <Link href="/catalog" className="btn btn-light btn-sm flex-fill border">
                  Keep Browsing
                </Link>
              </div>
            </div>

            <div className="alert alert-info small mt-3 mb-0">
              <strong>Need a custom quote?</strong> For commercial buildings or bulk renovation projects, select <em>Request Quotation</em> at checkout for volume pricing.
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
