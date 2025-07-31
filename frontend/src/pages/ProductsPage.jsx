import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import { useSelector } from 'react-redux';

const ProductsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (categoryData === null) {
      setData(allProducts);
    } else {
      const d = allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
  }, [allProducts, categoryData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#A0C1FF] to-[#4F8CFF]">
      <Header activeHeading={3} />
      {/* Hero Section */}
      <div className="w-full py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">All Products</h1>
        <p className="text-white text-lg sm:text-xl text-center max-w-2xl">Browse our complete collection of products on eShopZone. Find the best deals and latest trends!</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
            {data.map((i, index) => <ProductCard data={i} key={index} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m-6 0V7a2 2 0 012-2h2a2 2 0 012 2v10" />
            </svg>
            <h1 className="text-center w-full text-2xl font-semibold text-gray-500">No products found!</h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;