import StoreLayout from "@/components/StoreLayout";

export default function TermsPage() {
  return (
    <StoreLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h1 className="fw-bold mb-4 text-center">Terms & Conditions</h1>
            <p className="text-muted-custom text-center mb-5">Last updated: August 19, 2026</p>

            <div className="card border-0 shadow-sm p-4 p-md-5">
              <h4 className="fw-bold mt-4 mb-3">1. Introduction</h4>
              <p className="text-muted-custom mb-4">
                Welcome to TileStore Pro. By accessing our website and purchasing our products, you agree to be bound by these Terms and Conditions. Please read them carefully.
              </p>

              <h4 className="fw-bold mb-3">2. Products and Pricing</h4>
              <p className="text-muted-custom mb-4">
                All products listed on the website are subject to availability. We reserve the right to change prices and product specifications at any time without notice. We make every effort to display the colors and textures of our tiles as accurately as possible.
              </p>

              <h4 className="fw-bold mb-3">3. Orders and Payment</h4>
              <p className="text-muted-custom mb-4">
                Placing an order through our website constitutes an offer to purchase. We accept Cash on Delivery (COD) for eligible orders. For large scale projects, a quotation can be requested.
              </p>

              <h4 className="fw-bold mb-3">4. Delivery and Returns</h4>
              <p className="text-muted-custom mb-4">
                Delivery times are estimates and may vary based on location and stock availability. Returns and exchanges are only accepted within 7 days of delivery for damaged or defective products.
              </p>

              <h4 className="fw-bold mb-3">5. Intellectual Property</h4>
              <p className="text-muted-custom mb-4">
                All content included on this site, such as text, graphics, logos, images, and software, is the property of TileStore Pro or its content suppliers.
              </p>

              <h4 className="fw-bold mb-3">6. Limitation of Liability</h4>
              <p className="text-muted-custom mb-4">
                TileStore Pro shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our website or products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
