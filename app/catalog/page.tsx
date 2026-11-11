"use client";

import { useEffect, useState } from "react";
import StoreLayout from "@/components/StoreLayout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function addToCart(product: any) {
    const saved = localStorage.getItem("tilestore_cart");
    let cart = saved ? JSON.parse(saved) : [];
    const existing = cart.find((i: any) => i.productId === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        productId: product._id,
        design: product.design,
        company: product.company,
        imageUrl: product.imageUrl || "",
        price: product.price,
        quantity: 1
      });
    }
    localStorage.setItem("tilestore_cart", JSON.stringify(cart));
    setAdded(product._id);
    setTimeout(() => setAdded(null), 1500);
  }

  const filtered = products.filter(p => {
    const matchesSearch = !search || p.design?.toLowerCase().includes(search.toLowerCase()) || p.company?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !catFilter || p.categoryName === catFilter || (p.categoryId && p.categoryId.categoryName === catFilter);
    return matchesSearch && matchesCat;
  });

  const categories = [...new Set(products.map(p => p.categoryName || (p.categoryId && p.categoryId.categoryName)).filter(Boolean))];

  return (
    <StoreLayout>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <p className="text-uppercase text-muted-custom small fw-bold mb-1">Catalog</p>
            <h2 className="section-title mb-0">Tile collection</h2>
          </div>
          <span className="badge bg-light text-dark border px-3 py-2">{filtered.length} products</span>
        </div>

        <div className="row g-4">
          <aside className="col-lg-3">
            <div className="filter-card">
              <h5 className="text-primary-custom fw-bold mb-3">Filters</h5>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Search</label>
                <input type="text" className="form-control" placeholder="Search design or brand..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select className="form-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </aside>

          <div className="col-lg-9">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
            ) : (
              <div className="row g-4">
                {filtered.length === 0 ? (
                  <div className="col-12 text-center py-5 text-muted-custom">No products match your filters.</div>
                ) : filtered.map((product) => (
                  <div className="col-md-6 col-xl-4" key={product._id}>
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="position-relative overflow-hidden bg-light" style={{ height: 220 }}>
                        {product.imageUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={product.imageUrl}
                            alt={product.design}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="product-image">{product.design?.slice(0, 4).toUpperCase()}</div>
                        )}
                        <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75 text-white">
                          {product.size?.length}×{product.size?.width} {product.size?.unit}
                        </span>
                      </div>
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
                          <h5 className="fw-bold mb-0">{product.design}</h5>
                          <span className="badge bg-light text-dark border small">{product.company}</span>
                        </div>
                        <p className="text-muted-custom small mb-3">{product.tilesPerBox || 4} tiles / {product.unitType || "Box"}</p>
                        <div className="mt-auto">
                          <div className="d-flex justify-content-between align-items-baseline mb-3">
                            <span className="fs-5 fw-bold text-primary-custom">PKR {product.price}</span>
                            <small className="text-muted-custom">per {product.unitType || "Box"}</small>
                          </div>
                          <div className="d-flex gap-2">
                            <Link href={`/catalog/${product._id}`} className="btn btn-outline-primary btn-sm flex-fill">
                              Details & Calc
                            </Link>
                            <button type="button" className={`btn btn-sm flex-fill ${added === product._id ? 'btn-success' : 'btn-primary'}`} onClick={() => addToCart(product)}>
                              {added === product._id ? '✓ Added' : 'Add to Cart'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
