import React, { useMemo } from "react";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import { useSelector } from "react-redux";

const BestDeals = () => {
  const { allProducts } = useSelector((state) => state.products);
  const data = useMemo(() => {
    if (!allProducts?.length) return [];
    return [...allProducts]
      .sort((a, b) => b.sold_out - a.sold_out)
      .slice(0, 5);
  }, [allProducts]);
  return (
    <div className={`${styles.section}`}>
      <div className="text-[32px] font-extrabold text-[#4F8CFF] text-center mb-8 font-sans drop-shadow-lg">Best Deals</div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mb-12">
        {data && data.length !== 0 ? (
          data.map((i, index) => (
            <div
              key={i._id || index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 p-4 flex flex-col items-center relative"
            >
              <span className="absolute top-4 left-4 bg-[#FFB800] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Best Deal
              </span>
              <ProductCard data={i} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 text-gray-500">
            <p className="text-lg font-medium text-gray-700">No best deals yet</p>
            <p className="mt-2">Browse all products to find something you love.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestDeals;
