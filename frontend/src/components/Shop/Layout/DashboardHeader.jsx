import React, { useState } from "react";
import { AiOutlineGift, AiOutlineMenu } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 1, name: "Dashboard", icon: RxDashboard, path: "/dashboard" },
    { id: 2, name: "All Orders", icon: FiShoppingBag, path: "/dashboard-orders" },
    { id: 3, name: "All Products", icon: FiPackage, path: "/dashboard-products" },
    { id: 4, name: "Create Product", icon: AiOutlineFolderAdd, path: "/dashboard-create-product" },
    { id: 5, name: "All Events", icon: MdOutlineLocalOffer, path: "/dashboard-events" },
    { id: 6, name: "Create Event", icon: VscNewFile, path: "/dashboard-create-event" },
    { id: 7, name: "Withdraw Money", icon: CiMoneyBill, path: "/dashboard-withdraw-money" },
    { id: 8, name: "Shop Inbox", icon: BiMessageSquareDetail, path: "/dashboard-messages" },
    { id: 9, name: "Discount Codes", icon: AiOutlineGift, path: "/dashboard-coupons" },
    { id: 10, name: "Refunds", icon: HiOutlineReceiptRefund, path: "/dashboard-refunds" },
    { id: 11, name: "Settings", icon: CiSettings, path: "/settings" },
  ];

  return (
    <>
      <div className="w-full h-[80px] bg-white shadow-lg sticky top-0 left-0 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="eShopZone"
              className="w-10 h-10 rounded-full shadow-md bg-white p-1"
            />
            <span className="text-2xl font-bold text-[#4F8CFF] tracking-wide font-sans">eShopZone</span>
          </Link>
          <span className="text-gray-500 text-sm hidden md:block">| Seller Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Desktop Navigation Icons - Hidden on large screens since sidebar is visible */}
          <div className="flex items-center gap-2">
            <Link to="/dashboard-coupons" className="hidden lg:hidden xl:block p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors">
              <AiOutlineGift color="#4F8CFF" size={24} className="cursor-pointer" />
            </Link>
            <Link to="/dashboard-events" className="hidden lg:hidden xl:block p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors">
              <MdOutlineLocalOffer color="#4F8CFF" size={24} className="cursor-pointer" />
            </Link>
            <Link to="/dashboard-products" className="hidden lg:hidden xl:block p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors">
              <FiShoppingBag color="#4F8CFF" size={24} className="cursor-pointer" />
            </Link>
            <Link to="/dashboard-orders" className="hidden lg:hidden xl:block p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors">
              <FiPackage color="#4F8CFF" size={24} className="cursor-pointer" />
            </Link>
            <Link to="/dashboard-messages" className="hidden lg:hidden xl:block p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors">
              <BiMessageSquareDetail color="#4F8CFF" size={24} className="cursor-pointer" />
            </Link>
          </div>
          
          {/* Mobile Menu Button - Only visible on mobile/tablet */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <AiOutlineMenu size={24} className="text-[#4F8CFF]" />
          </button>

          <Link to={`/shop/${seller._id}`} className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors">
            <img
              src={`${seller.avatar?.url}`}
              alt="Seller Avatar"
              className="w-[40px] h-[40px] rounded-full object-cover border-2 border-[#4F8CFF] shadow"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700">{seller.name}</span>
          </Link>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-[#4F8CFF]">Shop Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-[#F5F8FF] transition-colors"
              >
                <span className="text-2xl text-gray-500 hover:text-[#4F8CFF]">&times;</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-xl text-gray-700 hover:bg-[#F5F8FF] hover:text-[#4F8CFF] transition-all duration-200"
                    >
                      <Icon size={20} className="text-gray-500" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
