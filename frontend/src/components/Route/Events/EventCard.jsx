import React from "react";
import CountDown from "./CountDown";
import styles from "../../../styles/styles";
import { addToCart } from "../../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };
  return (
    <div
      className={`w-full block bg-white rounded-2xl shadow-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-6`}
    >
      <div className="w-full lg:w-[50%] m-auto">
        <img 
          src={`${data.images[0]?.url}`} 
          alt={data.name}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center p-6">
        <h2 className="text-2xl font-bold text-[#222] mb-3">{data.name}</h2>
        <p className="text-gray-600 mb-4">{data.description}</p>
        <div className="flex py-3 justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h5 className="font-[500] text-lg text-gray-400 line-through">
              ${data.originalPrice}
            </h5>
            <h5 className="font-bold text-2xl text-[#4F8CFF]">
              ${data.discountPrice}
            </h5>
          </div>
          <span className="px-3 py-1 bg-[#FFB800] text-white rounded-full text-sm font-semibold">
            {data.sold_out} sold
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center gap-4 mt-4">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <button className="px-6 py-3 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-colors">
              See Details
            </button>
          </Link>
          <button
            className="px-6 py-3 bg-[#FFB800] hover:bg-[#e6a600] text-white font-semibold rounded-lg transition-colors"
            onClick={() => addToCartHandler(data)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
