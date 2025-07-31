import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  return (
    <div className="fixed top-0 left-0 w-full bg-black bg-opacity-50 h-screen z-50 flex justify-end">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF] text-white">
          <div className="flex items-center gap-3">
            <IoBagHandleOutline size={28} />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
          </div>
          <button
            onClick={() => setOpenCart(false)}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <RxCross1 size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
        {cart && cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <IoBagHandleOutline size={64} className="text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-center">Add some products to get started!</p>
          </div>
        ) : (
          <>
              {/* Item count */}
              <div className="p-4 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">
                  {cart && cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
                </p>
              </div>

              {/* Cart Items */}
              <div className="flex-1">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart && cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-[#4F8CFF]">${totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout" onClick={() => setOpenCart(false)}>
              <button className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                Checkout Now
              </button>
              </Link>
            </div>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromCartHandler, quantityChangeHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (value > data.stock) {
      toast.error("Product stock limited!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {/* Product Image */}
        <img
          src={`${data.images[0]?.url}`}
          alt={data.name}
          className="w-20 h-20 object-cover rounded-lg shadow-sm"
        />
        
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{data.name}</h3>
          <p className="text-sm text-gray-600">${data.discountPrice}</p>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => decrement(data)}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <HiOutlineMinus size={16} />
            </button>
            <span className="w-8 text-center font-medium">{value}</span>
            <button
              onClick={() => increment(data)}
              className="w-8 h-8 rounded-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white flex items-center justify-center transition-colors"
            >
              <HiPlus size={16} />
            </button>
          </div>
        </div>

        {/* Price and Remove */}
        <div className="text-right">
          <p className="font-semibold text-[#4F8CFF]">${totalPrice.toFixed(2)}</p>
          <button
          onClick={() => removeFromCartHandler(data)}
            className="mt-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <RxCross1 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
