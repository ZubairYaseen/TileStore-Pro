import Link from "next/link";
import StoreLayout from "@/components/StoreLayout";

export default function NotFound() {
  return (
    <StoreLayout>
      <div className="container py-5 text-center">
        <h1 className="display-5 fw-bold text-primary-custom">Page not found</h1>
        <p className="text-muted-custom my-3">This prototype page is currently under development.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </StoreLayout>
  );
}
