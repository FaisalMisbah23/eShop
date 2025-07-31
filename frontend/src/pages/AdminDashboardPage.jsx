import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain";

const AdminDashboardPage = () => {
  return (
    <>
      <AdminHeader />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-16 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 text-center sm:text-left">Admin Dashboard</h1>
          <p className="text-base sm:text-lg text-white/90 text-center sm:text-left">Overview & quick stats for eShopZone</p>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:block w-[260px] flex-shrink-0">
              <AdminSideBar active={1} />
            </div>
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <AdminDashboardMain />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
