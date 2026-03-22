import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#F6F6F5]">
      <Header activeHeading={0} />
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="space-y-4 text-gray-700">
          <p>
            By using eShopZone, you agree to follow these terms and any policies linked
            from the site (including our privacy policy).
          </p>
          <p>
            Sellers are responsible for the accuracy of listings, fulfillment, and
            compliance with applicable laws. Buyers are responsible for providing
            accurate shipping and payment information.
          </p>
          <p>
            We may update these terms from time to time. Continued use of the service
            after changes constitutes acceptance of the revised terms.
          </p>
          <p className="text-sm text-gray-500">
            Replace this stub with jurisdiction-specific terms after legal review.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
