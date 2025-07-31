import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Payment from "../components/Payment/Payment.jsx";

const PaymentPage = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section with Modern Theme */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Payment
            </h1>
            <p className="text-lg text-white/90">
              Choose your preferred payment method
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CheckoutSteps active={2} />
        </div>
      </div>

      {/* Payment Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Payment />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PaymentPage;
