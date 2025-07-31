import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';
import CreateProduct from '../../components/Shop/CreateProduct';

const ShopCreateProduct = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF]">
            <DashboardHeader />
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block w-[330px] flex-shrink-0">
                    <DashboardSideBar active={4} />
                </div>
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <CreateProduct />
                </div>
            </div>
        </div>
    )
}

export default ShopCreateProduct