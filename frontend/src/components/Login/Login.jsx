import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from '../../styles/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from '../../server';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${server}/user/login-user`, {
      email,
      password
    }, { withCredentials: true }).then(() => {
      toast.success("Login Successful!");
      navigate("/");
      window.location.reload(true);
    }).catch((e) => {
      toast.error(e.response.data.message);
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] py-6 px-4 flex flex-col items-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="eShopZone" className="w-14 h-14 mb-2" />
          <h2 className="text-2xl font-bold text-white tracking-wide">eShopZone Login</h2>
        </div>
        <div className="py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember-me"
                  id="remember-me"
                  className="h-4 w-4 text-[#4F8CFF] focus:ring-[#4F8CFF] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <div className="text-sm">
                <a href=".forgot-password" className="font-medium text-[#4F8CFF] hover:text-[#2563eb]">Forgot your password?</a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-[#4F8CFF] hover:bg-[#2563eb] transition-colors"
              >
                Login
              </button>
            </div>
            <div className="flex justify-center items-center gap-2 text-sm mt-4">
              <span>Don't have an account?</span>
              <Link to="/sign-up" className="text-[#4F8CFF] font-semibold hover:underline">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;