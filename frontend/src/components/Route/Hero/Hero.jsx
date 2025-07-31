import React from "react"
import styles from "../../../styles/styles"
import { Link } from "react-router-dom"

const Hero = () => {
    return (
        <div className="relative min-h-[70vh] 800px:min-h-[100vh] w-full flex items-center justify-center bg-gradient-to-br from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-16">
            {/* Overlay for text clarity */}
            <div className="absolute inset-0 bg-black bg-opacity-20 z-0 rounded-b-[60px]" />
            <div className="relative z-10 w-[90%] 800px:w-[60%] flex flex-col items-center text-center py-12">
                <h1 className="text-[40px] leading-[1.1] 800px:text-[64px] font-extrabold text-white drop-shadow-lg mb-4 font-sans">
                    Welcome to eShopZone
                </h1>
                <p className="pt-2 text-[18px] 800px:text-[22px] font-medium text-white/90 mb-8 max-w-2xl">
                    Your ultimate online marketplace for everything you need. Discover amazing products from trusted sellers, enjoy great deals, and shop with confidence.
                </p>
                <Link to="/products" className="inline-block">
                    <div className="px-8 py-3 bg-white hover:bg-gray-100 text-[#4F8CFF] transition-colors duration-200 rounded-full shadow-lg">
                        <span className="font-semibold text-[20px] tracking-wide">
                            Start Shopping
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Hero