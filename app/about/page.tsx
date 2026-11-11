import StoreLayout from "@/components/StoreLayout";
import Link from "next/link";

export default function AboutPage() {
  return (
    <StoreLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-5">
            <h1 className="fw-bold mb-3">About TileStore Pro</h1>
            <p className="lead text-muted-custom">
              We provide premium flooring and wall tile solutions for homes, projects, and retail spaces.
            </p>
          </div>
        </div>

        <div className="row g-5 align-items-center mb-5">
          <div className="col-md-6">
            <div className="rounded bg-light" style={{ height: "400px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "5rem" }}>🏢</span>
            </div>
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold mb-3">Our Story</h3>
            <p className="text-muted-custom">
              Founded with the vision to bring world-class tiles to your doorstep, TileStore Pro has grown from a single showroom to a network of warehouses and outlets. We pride ourselves on offering a diverse catalog, exceptional customer service, and an innovative approach to inventory management.
            </p>
            <p className="text-muted-custom">
              Whether you are an architect, a homeowner renovating your space, or a contractor managing a large project, we have the right tiles for you.
            </p>
            <Link href="/catalog" className="btn btn-outline-primary mt-3">Explore Our Catalog</Link>
          </div>
        </div>

        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm bg-white h-100">
              <div className="fs-1 mb-3">🌟</div>
              <h5 className="fw-bold">Premium Quality</h5>
              <p className="text-muted-custom small">We source our tiles from top manufacturers to ensure durability and style.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm bg-white h-100">
              <div className="fs-1 mb-3">🚚</div>
              <h5 className="fw-bold">Fast Delivery</h5>
              <p className="text-muted-custom small">Our efficient logistics and multiple warehouses guarantee prompt delivery.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 border rounded shadow-sm bg-white h-100">
              <div className="fs-1 mb-3">🤝</div>
              <h5 className="fw-bold">Expert Support</h5>
              <p className="text-muted-custom small">Our team is always ready to help you choose the perfect tiles for your project.</p>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
