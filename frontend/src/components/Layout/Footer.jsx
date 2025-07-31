import React, { useState } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import { useSelector } from "react-redux";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const Footer = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Log in to subscribe to get news, events, and offers");
      return;
    }
    try {
      const { data } = await axios.put(
        `${server}/user/update-subscribe-status`,
        { email },
        { withCredentials: true }
      );
      setEmail("");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <footer className="bg-gradient-to-t from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] text-[#222] pt-12 pb-6 mt-12 rounded-t-3xl shadow-inner">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Newsletter */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="logo" className="w-10 h-10 rounded-full bg-white p-1 shadow" />
            <span className="text-2xl font-bold font-sans">eShopZone</span>
          </div>
          <p className="text-sm mb-2">Your one-stop shop for the best products and deals online. Join our newsletter for exclusive offers!</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="py-2 px-3 rounded-lg border border-[#A0C1FF] focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] shadow"
            />
            <button
              type="submit"
              className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-2 rounded-lg shadow transition-colors"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-3 mt-2">
            <AiFillFacebook size={24} className="hover:text-[#1877f3] cursor-pointer" />
            <AiOutlineTwitter size={24} className="hover:text-[#1da1f2] cursor-pointer" />
            <AiFillInstagram size={24} className="hover:text-[#e1306c] cursor-pointer" />
            <AiFillYoutube size={24} className="hover:text-[#ff0000] cursor-pointer" />
          </div>
        </div>
        {/* Company */}
        <div className="col-span-1">
          <h3 className="font-bold text-lg mb-3">Company</h3>
          <ul className="space-y-2">
            {footerProductLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.link} className="text-[#222] hover:text-[#4F8CFF] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Shop */}
        <div className="col-span-1">
          <h3 className="font-bold text-lg mb-3">Shop</h3>
          <ul className="space-y-2">
            {footercompanyLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.link} className="text-[#222] hover:text-[#4F8CFF] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Support */}
        <div className="col-span-1">
          <h3 className="font-bold text-lg mb-3">Support</h3>
          <ul className="space-y-2">
            {footerSupportLinks.map((link, idx) => (
              <li key={idx}>
                <Link to={link.link} className="text-[#222] hover:text-[#4F8CFF] transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#A0C1FF] pt-6">
        <span className="text-sm">© 2025 eShopZone. All rights reserved.</span>
        <span className="text-sm">Terms · Privacy Policy</span>
        <img
          src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
          alt="payment methods"
          className="h-8"
        />
      </div>
    </footer>
  );
};

export default Footer;
