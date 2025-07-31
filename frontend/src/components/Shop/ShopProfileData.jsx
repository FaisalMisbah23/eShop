import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { getAllEventsShop } from "../../redux/actions/event";
import Ratings from "../products/Ratings";
import { format } from "timeago.js";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.event);
  const { seller } = useSelector((state) => state.seller);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(seller?._id));
  }, [dispatch]);

  const [active, setActive] = useState(1);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>
          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? "text-red-500" : "text-[#333]"
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-6 py-2 rounded-lg transition-colors duration-200 font-semibold">
                  <span>DashBoard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
          {products &&
            products.map((i, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                <ProductCard data={i} isShop={true} />
              </div>
            ))}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          {(() => {
            const now = new Date();
            const runningEvents = events?.filter(
              (event) =>
                new Date(event.start_date) <= now && 
                new Date(event.finish_date) >= now
            );
            
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-12">
                  {runningEvents &&
                    runningEvents.map((i, index) => (
                      <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4">
                        <ProductCard
                          data={i}
                          isShop={true}
                          isEvent={true}
                        />
                      </div>
                    ))}
                </div>
                {(!runningEvents || runningEvents.length === 0) && (
                  <h5 className="w-full text-center py-5 text-[18px]">
                    No Running Events for this shop!
                  </h5>
                )}
              </>
            );
          })()}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div className="w-full flex my-4">
                <img
                  src={`${item.user.avatar?.url}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-2">
                  <div className="flex w-full items-center">
                    <h1 className="font-[600] pr-2">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  <p className="text-[#000000a7] text-[14px]">
                    {format(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full text-center py-5 text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
