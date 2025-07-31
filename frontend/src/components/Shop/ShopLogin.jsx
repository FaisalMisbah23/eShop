import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from '../../styles/styles';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from '../../server';

const ShopLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${server}/shop/login-shop`, {
            email,
            password
        }, { withCredentials: true }).then(() => {
            toast.success("Login Successful!");
            navigate("/dashboard");
            window.location.reload(true);
        }).catch((e) => {
            toast.error(e.response.data.message);
        })
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] py-12 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex flex-col items-center mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="eShopZone" className="w-16 h-16 mb-2" />
                    <h2 className="text-3xl font-extrabold text-[#4F8CFF] mb-1">Seller Login</h2>
                    <p className="text-gray-500 text-sm">Login to your shop account</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
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
                            <a href="#" className="font-medium text-[#4F8CFF] hover:underline">Forgot password?</a>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow transition-colors duration-200"
                    >
                        Login
                    </button>
                    <div className="flex justify-center items-center gap-2 text-sm mt-2">
                        <span>Don't have an account?</span>
                        <Link to="/shop-create" className="text-[#4F8CFF] font-semibold hover:underline">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ShopLogin;