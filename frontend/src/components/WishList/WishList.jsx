import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { BsCartPlus } from "react-icons/bs";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addToCart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-black bg-opacity-50 h-screen z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#FFB800] to-[#FFD700] text-white">
          <div className="flex items-center gap-3">
            <AiOutlineHeart size={28} />
            <h2 className="text-xl font-bold">Wishlist</h2>
          </div>
          <button
            onClick={() => setOpenWishlist(false)}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <RxCross1 size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {wishlist && wishlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <AiOutlineHeart size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-500 text-center">Save your favorite products here!</p>
            </div>
          ) : (
            <>
              {/* Item count */}
              <div className="p-4 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                  {wishlist && wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in wishlist
                </p>
              </div>

              {/* Wishlist Items */}
              <div className="flex-1">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <WishlistSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const WishlistSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <img
          src={`${data?.images[0]?.url}`}
          alt={data.name}
          className="w-20 h-20 object-cover rounded-lg shadow-sm"
        />
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{data.name}</h3>
          <p className="text-lg font-bold text-[#FFB800] mt-1">${totalPrice.toFixed(2)}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => addToCartHandler(data)}
            className="p-2 bg-[#4F8CFF] hover:bg-[#2563eb] text-white rounded-lg transition-colors"
            title="Add to cart"
          >
            <BsCartPlus size={18} />
          </button>
          <button
            onClick={() => removeFromWishlistHandler(data)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove from wishlist"
          >
            <RxCross1 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
