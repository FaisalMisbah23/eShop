import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#F6F6F5]">
      <Header activeHeading={0} />
      <main id="main-content" className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-gray space-y-4 text-gray-700">
          <p>
            This page describes how eShopZone collects and uses information when you use
            the marketplace, create an account, place orders, or subscribe to updates.
          </p>
          <p>
            Account data (such as name, email, and shipping addresses) is used to
            process orders, communicate about your purchases, and improve the service.
            Payment details for cards are handled by our payment providers (for example,
            Stripe); we do not store full card numbers on our servers.
          </p>
          <p>
            You may request correction or deletion of your account data where applicable
            by contacting support using the channels listed in our FAQ.
          </p>
          <p className="text-sm text-gray-500">
            This is a summary for transparency. Adapt this text with legal review before
            production use in your jurisdiction.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
