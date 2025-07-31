import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero.jsx";

const ShopDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF]">
      <DashboardHeader />
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block w-[330px] flex-shrink-0">
          <DashboardSideBar active={1} />
        </div>
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <DashboardHero />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
