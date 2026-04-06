import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Payment from "../components/Payment/Payment.jsx";

const PaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <header className="border-b border-gray-200 bg-white pt-20 pb-6 sm:pt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            Payment
          </h1>
          <p className="mt-2 text-gray-600">
            Step 2 of 2: choose how you want to pay. You will see a final total
            on the right before you confirm.
          </p>
        </div>
      </header>

      <CheckoutSteps active={2} />

      <div className="flex-1 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Payment />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentPage;
