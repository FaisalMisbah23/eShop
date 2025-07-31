import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { useSelector } from "react-redux";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const d =
      allProducts && [...allProducts].sort((a, b) => b.sold_out - a.sold_out);
    setData(d);
  }, [allProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#A0C1FF] to-[#4F8CFF]">
      <Header activeHeading={2} />
      {/* Hero Section */}
      <div className="w-full py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">
          Best Selling Products
        </h1>
        <p className="text-white text-lg sm:text-xl text-center max-w-2xl">
          Discover the most popular products on eShopZone, loved by our
          customers and trending right now!
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BestSellingPage;
