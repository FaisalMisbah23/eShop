import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.01;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode("");
      }
    });
  };

  const discountPercentage = couponCodeData ? discountPrice : "";

  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentage);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping Information */}
        <div className="lg:col-span-2">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentage={discountPercentage}
          />
        </div>
      </div>
      
      {/* Payment Button */}
      <div className="flex justify-center mt-8">
        <button
          className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          onClick={paymentSubmit}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#4F8CFF] rounded-full flex items-center justify-center">
          <span className="text-white text-lg">🚚</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
      </div>
      
      <form className="space-y-6">
        {/* Name and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={user && user.name}
              required
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={user && user.email}
              required
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Phone and Zip Code */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip Code
            </label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Country and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Choose your country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <select
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Choose your City</option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1
            </label>
            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 2
            </label>
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            />
          </div>
        </div>
      </form>

      {/* Saved Addresses */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          className="text-[#4F8CFF] hover:text-[#2563eb] font-medium transition-colors"
          onClick={() => setUserInfo(!userInfo)}
        >
          Choose from saved addresses
        </button>
        
        {userInfo && (
          <div className="mt-4 space-y-3">
            {user &&
              user.addresses.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name="savedAddress"
                    className="mr-3 text-[#4F8CFF]"
                    onClick={() => {
                      setAddress1(item.address1);
                      setAddress2(item.address2);
                      setZipCode(item.zipCode);
                      setCountry(item.country);
                      setCity(item.city);
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{item.addressType}</h3>
                    <p className="text-sm text-gray-600">{item.address1}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentage,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#4F8CFF] rounded-full flex items-center justify-center">
          <span className="text-white text-lg">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
      </div>
      
      {/* Price Breakdown */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-semibold text-gray-900">${subTotalPrice}</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-semibold text-gray-900">${shipping.toFixed(2)}</span>
        </div>
        
        {discountPercentage && (
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Discount:</span>
            <span className="font-semibold text-green-600">-${discountPercentage.toString()}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#4F8CFF]">${totalPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Coupon Code */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply Coupon</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Apply Code
          </button>
        </form>
      </div>
      
      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">🔒</span>
          <span>Secure checkout with SSL encryption</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
