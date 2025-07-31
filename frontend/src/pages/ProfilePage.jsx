import React, { useState } from "react";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";

const ProfilePage = () => {
    const [active, setActive] = useState(1);
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#A0C1FF] to-[#4F8CFF]">
            <Header />
            {/* Hero Section */}
            <div className="w-full py-8 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF]">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 text-center drop-shadow-lg">My Profile Dashboard</h1>
                <p className="text-white text-base sm:text-lg text-center max-w-2xl">Manage your account, orders, and preferences</p>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-80">
                        <ProfileSideBar active={active} setActive={setActive} />
                    </div>
                    <div className="flex-1">
                        <ProfileContent active={active} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
