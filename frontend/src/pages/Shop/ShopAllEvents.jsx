import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllEvents from '../../components/Shop/AllEvents'

const ShopAllProducts = () => {
    return (
        <div>
            <DashboardHeader />
            <div className="flex justify-between w-full">
                <div className="w-[80px] 800px:w-[330px]">
                    <DashboardSideBar active={5} />
                </div>
                <div className="w-full flex justify-center">
                    <AllEvents />
                </div>
            </div>
        </div>
    )
}

export default ShopAllProducts