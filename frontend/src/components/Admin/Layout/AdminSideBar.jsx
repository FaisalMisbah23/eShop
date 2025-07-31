import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";

const AdminSideBar = ({ active }) => {
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
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
      <div className="flex flex-col gap-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <Link
              to={item.link}
              key={item.id}
              className={`flex items-center p-4 rounded-xl transition-all duration-200 font-medium text-[16px] gap-3
                ${isActive ? "bg-[#F5F8FF] text-[#4F8CFF] shadow-md" : "text-gray-600 hover:bg-[#F5F8FF] hover:text-[#4F8CFF]"}
              `}
            >
              <Icon size={22} className="flex-shrink-0" />
              <span className="hidden 800px:block">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSideBar;
