import React from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData.jsx";

const ShopHomePage = () => {
  return (
    <>
      <Header activeHeading={3} />
      
      {/* Hero Section with Modern Theme */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-12">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Shop Info Card */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 lg:mb-0">
                <ShopInfo isOwner={true} />
              </div>
            </div>
            
            {/* Shop Profile Data */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <ShopProfileData isOwner={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ShopHomePage;
