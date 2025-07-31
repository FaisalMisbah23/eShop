import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist])

  const handleMessageSubmit = () => { };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart!")
    } else {
      if (count > data.stock) {
        toast.error("Product stock limited!")
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("item added to cart successfully!")
      }
    }
  }

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  }

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  }

  return (
    <div className="bg-white">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="w-full max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl relative overflow-hidden max-h-[95vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white">
              <h2 className="text-lg sm:text-xl font-bold">Product Details</h2>
              <button
                onClick={() => setOpen(false)}
                className="p-1 sm:p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                <RxCross1 size={20} className="sm:text-xl" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                {/* Left Column - Image and Shop Info */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="relative">
                    <img 
                      src={`${data.images && data.images[0]?.url}`} 
                      alt={data.name}
                      className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-lg sm:rounded-xl shadow-lg"
                    />
                  </div>
                  
                  {/* Shop Information */}
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <Link to={`/shop/preview/${data.shop._id}`} className="flex items-center space-x-2 sm:space-x-3">
                      <img
                        src={`${data?.shop?.avatar?.url}`}
                        alt={data.shop.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#4F8CFF]"
                      />
                      <div>
                        <h3 className="font-semibold text-[#4F8CFF] text-sm sm:text-base">{data.shop.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">{data?.ratings} Ratings</p>
                      </div>
                    </Link>
                    
                    <button
                      className="w-full mt-3 sm:mt-4 bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                      onClick={handleMessageSubmit}
                    >
                      <AiOutlineMessage size={16} className="sm:text-lg" />
                      Send Message
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="text-[#FFB800] font-semibold">{data.sold_out || 0}</span> sold
                    </p>
                  </div>
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {data.name}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {data.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-[#4F8CFF]">
                      ${data.discountPrice}
                    </span>
                    {data.originalPrice && data.originalPrice !== data.discountPrice && (
                      <span className="text-base sm:text-lg text-gray-400 line-through">
                        ${data.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Quantity:</span>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <button
                          onClick={decrementCount}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4F8CFF] hover:bg-[#2563eb] text-white rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
                        >
                          -
                        </button>
                        <span className="w-10 h-8 sm:w-12 sm:h-10 bg-white border border-gray-300 rounded-lg flex items-center justify-center font-semibold text-sm sm:text-base">
                          {count}
                        </span>
                        <button
                          onClick={incrementCount}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-[#4F8CFF] hover:bg-[#2563eb] text-white rounded-lg flex items-center justify-center transition-colors text-sm sm:text-base"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                      className="p-2 sm:p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors self-start sm:self-auto"
                    >
                      {click ? (
                        <AiFillHeart size={20} className="sm:text-xl text-red-500" />
                      ) : (
                        <AiOutlineHeart size={20} className="sm:text-xl text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Stock Info */}
                  <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg">
                    <p className="text-xs sm:text-sm text-green-700">
                      <span className="font-semibold">{data.stock}</span> items available
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCartHandler(data._id)}
                    className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
                  >
                    <AiOutlineShoppingCart size={18} className="sm:text-xl" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
