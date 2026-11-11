"use client";

import StoreLayout from "@/components/StoreLayout";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <StoreLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center mb-5">
            <h1 className="fw-bold mb-3">Contact Us</h1>
            <p className="lead text-muted-custom">
              Have a question or need assistance? We are here to help.
            </p>
          </div>
        </div>

        <div className="row g-5">
          <div className="col-md-5">
            <h4 className="fw-bold mb-4">Get in Touch</h4>
            <div className="mb-4">
              <h6 className="fw-bold">📍 Head Office</h6>
              <p className="text-muted-custom mb-0">Industrial Area, Karachi, Pakistan</p>
            </div>
            <div className="mb-4">
              <h6 className="fw-bold">📞 Phone Support</h6>
              <p className="text-muted-custom mb-0">+92 300 1234567<br/>Mon - Sat, 9:00 AM - 7:00 PM</p>
            </div>
            <div className="mb-4">
              <h6 className="fw-bold">✉️ Email</h6>
              <p className="text-muted-custom mb-0">hello@tilestorepro.com<br/>support@tilestorepro.com</p>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card border-0 shadow-sm p-4">
              {submitted ? (
                <div className="text-center py-5">
                  <div className="fs-1 text-success mb-3">✓</div>
                  <h4 className="fw-bold">Message Sent!</h4>
                  <p className="text-muted-custom">Thank you for reaching out. We will get back to you shortly.</p>
                  <button className="btn btn-outline-primary mt-3" onClick={() => setSubmitted(false)}>Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input type="text" className="form-control" placeholder="Your Name" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" placeholder="your@email.com" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input type="text" className="form-control" placeholder="How can we help you?" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea className="form-control" rows={5} placeholder="Write your message here..." required></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary w-100">Send Message</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
