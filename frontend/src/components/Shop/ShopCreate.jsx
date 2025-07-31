import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { RxAvatar } from "react-icons/rx";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState();
  const [avatar, setAvatar] = useState();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      })
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
        setZipCode("");
        setAddress("");
        setPhoneNumber("");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleFileInputChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] py-12 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="eShopZone" className="w-16 h-16 mb-2" />
          <h2 className="text-3xl font-extrabold text-[#4F8CFF] mb-1">Seller Sign Up</h2>
          <p className="text-gray-500 text-sm">Create your shop account</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2">
            <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
              {avatar ? (
                <img src={avatar} alt="avatar" className="h-full w-full object-cover rounded-full" />
              ) : (
                <RxAvatar className="h-16 w-16 text-gray-400" />
              )}
            </span>
            <label htmlFor="file-input" className="mt-2 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
              <span>Upload Avatar</span>
              <input
                type="file"
                name="avatar"
                id="file-input"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="sr-only"
              />
            </label>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Shop Name</label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#A0C1FF] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="number"
              name="phone-number"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#A0C1FF] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#A0C1FF] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#A0C1FF] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="number"
              name="zipcode"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-[#A0C1FF] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-3 py-2 border border-[#A0C1FF] rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] sm:text-sm"
              />
              {visible ? (
                <AiOutlineEye
                  className="absolute right-3 top-2.5 text-[#4F8CFF] cursor-pointer"
                  size={22}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className="absolute right-3 top-2.5 text-[#4F8CFF] cursor-pointer"
                  size={22}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
          >
            Sign Up
          </button>
          <div className="flex justify-center items-center gap-2 text-sm mt-2">
            <span>Already have an account?</span>
            <Link to="/shop-login" className="text-[#4F8CFF] font-semibold hover:underline">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopCreate;
