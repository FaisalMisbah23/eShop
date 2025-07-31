import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";
import { AiOutlineSetting, AiOutlineMenu } from "react-icons/ai";

const menu = [
  { id: 1, label: "Dashboard", icon: RxDashboard, link: "/admin/dashboard" },
  { id: 2, label: "All Orders", icon: FiShoppingBag, link: "/admin-orders" },
  { id: 3, label: "All Sellers", icon: GrWorkshop, link: "/admin-sellers" },
  { id: 4, label: "All Users", icon: HiOutlineUserGroup, link: "/admin-users" },
  { id: 5, label: "All Products", icon: BsHandbag, link: "/admin-products" },
  { id: 6, label: "All Events", icon: MdOutlineLocalOffer, link: "/admin-events" },
  { id: 7, label: "Withdraw Request", icon: CiMoneyBill, link: "/admin-withdraw-request" },
  { id: 8, label: "Settings", icon: AiOutlineSetting, link: "/profile" },
];

const AdminHeader = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          {/* eShopZone Logo - Same as main header and shop header */}
          <div className="flex items-center gap-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png"
              alt="eShopZone"
              className="w-10 h-10 rounded-full shadow-md bg-white p-1"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-[#4F8CFF] tracking-wide font-sans">eShopZone</span>
              <span className="text-sm font-medium text-gray-500">Admin Panel</span>
            </div>
          </div>
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#F5F8FF]"
          onClick={() => setOpen(true)}
        >
          <AiOutlineMenu size={28} className="text-[#4F8CFF]" />
        </button>
      </div>
      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex">
          <div className="w-72 bg-white h-full shadow-lg p-6 flex flex-col gap-2 animate-slideInLeft">
            <button
              className="self-end mb-4 text-gray-400 hover:text-[#4F8CFF] text-2xl"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  to={item.link}
                  key={item.id}
                  className="flex items-center p-4 rounded-xl transition-all duration-200 font-medium text-[16px] gap-3 text-gray-600 hover:bg-[#F5F8FF] hover:text-[#4F8CFF]"
                  onClick={() => setOpen(false)}
                >
                  <Icon size={22} className="flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex-1" onClick={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
