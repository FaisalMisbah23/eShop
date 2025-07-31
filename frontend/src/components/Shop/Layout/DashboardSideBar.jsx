import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
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
    <div className="w-full h-[90vh] bg-white shadow-lg rounded-r-2xl overflow-y-scroll sticky top-0 left-0 z-10">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        
        return (
          <div key={item.id} className="w-full p-2">
            <Link 
              to={item.path} 
              className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white shadow-lg" 
                  : "text-gray-600 hover:bg-[#F5F8FF] hover:text-[#4F8CFF]"
              }`}
            >
              <Icon
                size={24}
                className={`${isActive ? "text-white" : "text-gray-500"}`}
              />
              <span className={`hidden 800px:block pl-3 text-[16px] font-medium ${
                isActive ? "text-white" : "text-gray-700"
              }`}>
                {item.name}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardSideBar;
