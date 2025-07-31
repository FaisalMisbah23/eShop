import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { server } from "../server";
import { toast } from 'react-toastify'

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [wait, setWait] = useState(true);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            setWait(false);
            setError(false);
          })
          .catch((err) => {
            setWait(false);
            setError(true);
            toast.error(err.response.data.message);
          });

      };
      sendRequest();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
        {wait ? (
          <>
            {/* Loading State */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-[#4F8CFF] rounded-full flex items-center justify-center animate-spin">
                <div className="w-12 h-12 bg-white rounded-full"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Activating Your Account
            </h2>
            <p className="text-gray-600 mb-8">
              Please wait while we process your activation request...
            </p>
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-[#4F8CFF] rounded-full animate-bounce mx-1"></div>
              <div className="w-2 h-2 bg-[#4F8CFF] rounded-full animate-bounce mx-1" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#4F8CFF] rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </>
        ) : error ? (
          <>
            {/* Error State */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">❌</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Activation Failed
            </h2>
            <p className="text-gray-600 mb-8">
              Your activation token has expired or is invalid. Please try again.
            </p>
            <div className="space-y-4">
              <Link
                to="/signup"
                className="block w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Sign Up Again
              </Link>
              <Link
                to="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Go to Home
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-3xl">✅</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Account Activated!
            </h2>
            <p className="text-gray-600 mb-8">
              Your account has been successfully activated. You can now log in and start shopping!
            </p>
            <div className="space-y-4">
              <Link
                to="/login"
                className="block w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Login Now
              </Link>
              <Link
                to="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;