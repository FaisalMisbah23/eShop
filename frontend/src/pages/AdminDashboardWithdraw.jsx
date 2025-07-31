import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllWithdraw from "../components/Admin/AllWithdraw.jsx";

const AdminDashboardWithdraw = () => {
  return (
    <>
      <AdminHeader />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-16 pb-8">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Withdraw Requests</h1>
          <p className="text-lg text-white/90">Manage and review all withdraw requests on eShopZone</p>
        </div>
      </div>
      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-[80px] md:w-[260px]">
            <AdminSideBar active={7} />
          </div>
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <AllWithdraw />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardWithdraw;
