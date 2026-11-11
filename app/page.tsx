import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";

const categories = [
  {
    title: "Floor Tiles",
    description: "High-durability marble and vitrified tiles engineered for luxury living spaces and high traffic.",
    imageUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    tag: "High Traffic",
  },
  {
    title: "Washroom & Bath",
    description: "Slip-resistant, waterproof glazed tiles designed for elegant wet zones and master baths.",
    imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    tag: "Slip Resistant",
  },
  {
    title: "Front Elevation",
    description: "Weatherproof architectural facade styles that elevate building curb appeal and value.",
    imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    tag: "Exterior Grade",
  },
  {
    title: "Kitchen Backsplashes",
    description: "Stain-resistant, easy-to-clean ceramic subway and mosaic tiles for modern kitchen surfaces.",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    tag: "Easy Clean",
  },
];

export default function HomePage() {
  return (
    <StoreLayout>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="badge bg-warning text-dark px-3 py-2 rounded-pill mb-3 fw-semibold">
                Smart Tile Store & Inventory System
              </div>
              <h1 className="display-4 fw-bold mb-3 text-white">
                Premium tiles for homes, commercial projects, and modern architecture.
              </h1>
              <p className="lead text-white-50 mb-4">
                Explore luxury ceramic, vitrified, and porcelain tiles with live multi-location inventory, built-in room box calculator, and instant checkout.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link href="/catalog" className="btn btn-warning btn-lg fw-bold px-4">
                  Browse Tile Catalog
                </Link>
                <Link href="/login" className="btn btn-outline-light btn-lg px-4">
                  Portal Login
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card hero-card p-4 shadow-lg border-0 text-warning">
                <h5 className="mb-3 text-warning fw-bold">Why Choose TileStore Pro</h5>
                <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-warning fw-bold fs-5">✓</span>
                    <div className="text-warning">
                      <strong className="text-warning">Curated Collections:</strong> Imported Spanish, Italian, and premium local tiles.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-warning fw-bold fs-5">✓</span>
                    <div className="text-warning">
                      <strong className="text-warning">Integrated Tile Calculator:</strong> Calculate exact boxes and wastage for any room.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-warning fw-bold fs-5">✓</span>
                    <div className="text-warning">
                      <strong className="text-warning">Multi-Location Inventory:</strong> Real-time warehouse and retail showroom stock tracking.
                    </div>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span className="text-warning fw-bold fs-5">✓</span>
                    <div className="text-warning">
                      <strong className="text-warning">Flexible Orders:</strong> Cash on delivery and commercial quotations with printable receipts.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-uppercase text-muted-custom small fw-bold">Curated Selections</span>
            <h2 className="section-title mt-2">Popular Tile Collections</h2>
            <p className="text-muted-custom">Find the ideal finish, texture, and size for every space in your project.</p>
          </div>
          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-md-6 col-lg-3" key={category.title}>
                <div className="card h-100 border-0 shadow-sm hover-lift overflow-hidden">
                  <div className="position-relative" style={{ height: 200 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={category.imageUrl}
                      alt={category.title}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white">
                      {category.tag}
                    </span>
                  </div>
                  <div className="card-body p-4 d-flex flex-column">
                    <h5 className="text-primary-custom fw-bold mb-2">{category.title}</h5>
                    <p className="text-muted-custom small mb-4 flex-grow-1">{category.description}</p>
                    <Link href="/catalog" className="btn btn-outline-primary btn-sm w-100">
                      Explore Collection →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-5 bg-white border-top border-bottom">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="fs-1 mb-2">📐</div>
              <h5 className="fw-bold text-primary-custom">Room Area Calculator</h5>
              <p className="text-muted-custom small mb-0">
                Never overbuy or run short. Enter room dimensions and compute precise box requirements including cutting wastage.
              </p>
            </div>
            <div className="col-md-4">
              <div className="fs-1 mb-2">🏭</div>
              <h5 className="fw-bold text-primary-custom">Warehouse to Outlet Transfers</h5>
              <p className="text-muted-custom small mb-0">
                Automated stock transfers between distribution hubs and showrooms with instant inventory sync.
              </p>
            </div>
            <div className="col-md-4">
              <div className="fs-1 mb-2">📄</div>
              <h5 className="fw-bold text-primary-custom">Instant Invoices & Quotations</h5>
              <p className="text-muted-custom small mb-0">
                Generate clean, branded receipts and tax invoices for clients, contractors, and retail buyers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
