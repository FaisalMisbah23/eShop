import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${server}/user/create-user`, { name, email, password, avatar })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.message);
          setName("");
          setEmail("");
          setPassword("");
          setAvatar("");
        }
      })
      .catch((e) => {
        toast.error(e.response.data.message);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] py-6 px-4 flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="eShopZone" className="w-14 h-14 mb-2" />
          <h2 className="text-2xl font-bold text-white tracking-wide">eShopZone Signup</h2>
        </div>
        <div className="py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] sm:text-sm"
                />
              </div>
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-[#4F8CFF] sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer text-[#4F8CFF]"
                    size={22}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer text-gray-400"
                    size={22}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
              <div className="flex items-center gap-4">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-12 w-12 text-gray-400" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <span>Upload</span>
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
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#4F8CFF] hover:bg-[#2563eb] transition-colors"
              >
                Sign Up
              </button>
            </div>
            <div className="flex justify-center items-center gap-2 text-sm mt-4">
              <span>Already have an account?</span>
              <Link to="/login" className="text-[#4F8CFF] font-semibold hover:underline">Sign In</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
