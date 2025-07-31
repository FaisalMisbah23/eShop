import React, { useEffect, useState } from "react";
import { productData } from "../../../static/data";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);
  return (
    <div className={`${styles.section}`}>
      <div className="text-[32px] font-extrabold text-[#4F8CFF] text-center mb-8 font-sans drop-shadow-lg">Best Deals</div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
        {data && data.length !== 0 && (
          <>
            {data &&
              data.map((i, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 p-4 flex flex-col items-center relative">
                  <span className="absolute top-4 left-4 bg-[#FFB800] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Best Deal</span>
                  <ProductCard data={i} />
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
