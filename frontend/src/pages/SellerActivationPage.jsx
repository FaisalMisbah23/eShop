import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import { toast } from 'react-toastify';
import { AiOutlineCheckCircle, AiOutlineCloseCircle, AiOutlineLoading3Quarters } from "react-icons/ai";

const SellerActivationPage = () => {
    const { activation_token } = useParams();
    const [error, setError] = useState(false);
    const [wait, setWait] = useState(true);

    useEffect(() => {
        if (activation_token) {
            const sendRequest = async () => {
                await axios
                    .post(`${server}/shop/activation`, {
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
    }, [activation_token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
                {wait ? (
                    <>
                        <AiOutlineLoading3Quarters className="animate-spin text-[#4F8CFF] mb-4" size={48} />
                        <p className="text-lg font-semibold text-gray-700">Please wait, processing your request...</p>
                    </>
                ) : error ? (
                    <>
                        <AiOutlineCloseCircle className="text-red-500 mb-4" size={48} />
                        <p className="text-lg font-semibold text-red-500">Your activation token is expired!</p>
                    </>
                ) : (
                    <>
                        <AiOutlineCheckCircle className="text-green-500 mb-4" size={48} />
                        <p className="text-lg font-semibold text-green-600">Your account has been created successfully!</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerActivationPage;