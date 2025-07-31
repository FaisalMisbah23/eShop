import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../assets/animations/107043-success.json";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <>
      <Header />
      
      {/* Hero Section with Modern Theme */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Order Success!
            </h1>
            <p className="text-lg text-white/90">
              Thank you for your purchase
            </p>
          </div>
        </div>
      </div>

      {/* Success Content */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Success />
        </div>
      </div>

      <Footer />
    </>
  );
};

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
      <div className="flex justify-center mb-8">
        <Lottie options={defaultOptions} width={200} height={200} />
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Order Placed Successfully! 🎉
      </h2>
      
      <p className="text-lg text-gray-600 mb-8">
        Thank you for your purchase. We've received your order and will process it shortly.
      </p>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/"
            className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Continue Shopping
          </Link>
          
          <Link
            to="/profile"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
