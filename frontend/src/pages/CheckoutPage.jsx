import React from "react";
import Header from "../components/Layout/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps.jsx";
import Checkout from "../components/Checkout/Checkout.jsx";
import Footer from "../components/Layout/Footer";

const CheckoutPage = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section with Modern Theme */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Checkout
            </h1>
            <p className="text-lg text-white/90">
              Complete your order with secure payment
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Steps */}
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <CheckoutSteps active={1} />
        </div>
      </div>

      {/* Checkout Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Checkout />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutPage;
