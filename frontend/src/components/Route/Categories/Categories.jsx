import React from "react"
import { brandingData, categoriesData } from "../../../static/data"
import styles from "../../../styles/styles"
import { useNavigate } from "react-router-dom";

const Categories = () => {
    const navigate = useNavigate();
    return (
        <>
            {/* Branding Row */}
            <div className={`${styles.section} hidden sm:block`}>
                <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-2xl">
                    {brandingData && brandingData.map((i, index) => (
                        <div className="flex items-start" key={index}>
                            {i.icon}
                            <div className="px-3">
                                <h3 className="font-bold text-base text-[#4F8CFF]">{i.title}</h3>
                                <p className="text-xs text-gray-500">{i.Description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories Grid */}
            <div
                className={`${styles.section} bg-white p-8 rounded-3xl mb-12 shadow-lg`}
                id="categories"
            >
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                    {categoriesData &&
                        categoriesData.map((i) => {
                            const handleSubmit = (i) => {
                                navigate(`/products?category=${i.title}`);
                            };
                            return (
                                <div
                                    className="w-full h-[120px] flex items-center justify-between cursor-pointer overflow-hidden bg-gradient-to-br from-[#F5F8FF] to-[#A0C1FF] rounded-2xl shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl p-4"
                                    key={i.id}
                                    onClick={() => handleSubmit(i)}
                                >
                                    <h5 className="text-[20px] font-semibold text-[#222]">{i.title}</h5>
                                    <img
                                        src={i.image_Url}
                                        className="w-[100px] object-cover rounded-xl shadow-sm"
                                        alt="image"
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
        </>
    )
}

export default Categories