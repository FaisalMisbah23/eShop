import React from "react";
import Header from "../components/Layout/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx";
import Checkout from "../components/Checkout/Checkout.jsx";
import Footer from "../components/Layout/Footer";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <header className="border-b border-gray-200 bg-white pt-20 pb-6 sm:pt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-2 text-gray-600">
            Step 1 of 2: enter where we should deliver your order. Fields marked
            with an asterisk are required.
          </p>
        </div>
      </header>

      <CheckoutSteps active={1} />

      <div className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Checkout />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
