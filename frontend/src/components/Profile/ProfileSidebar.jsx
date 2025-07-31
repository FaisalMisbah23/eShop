import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  const menuItems = [
    { id: 1, icon: RxPerson, label: "Profile" },
    { id: 2, icon: HiOutlineShoppingBag, label: "Orders" },
    { id: 3, icon: HiOutlineReceiptRefund, label: "Refunds" },
    { id: 4, icon: AiOutlineMessage, label: "Inbox" },
    { id: 5, icon: MdOutlineTrackChanges, label: "Track Order" },
    { id: 6, icon: RiLockPasswordLine, label: "Change Password" },
    { id: 7, icon: TbAddressBook, label: "Address" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          const isInbox = item.id === 4;
          
          return (
            <div
              key={item.id}
              className={`flex items-center cursor-pointer p-4 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#4F8CFF]"
              }`}
              onClick={() => isInbox ? navigate("/inbox") : setActive(item.id)}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="pl-3 font-medium">{item.label}</span>
      </div>
          );
        })}
        
        {/* Logout Button */}
        <div
          className="flex items-center cursor-pointer p-4 rounded-xl transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 mt-4 border-t border-gray-100 pt-4"
          onClick={logoutHandler}
        >
          <AiOutlineLogin size={20} className="flex-shrink-0" />
          <span className="pl-3 font-medium">Log out</span>
      </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
