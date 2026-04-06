import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const fieldClass =
  "w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-[#4F8CFF] focus:outline-none focus:ring-1 focus:ring-[#4F8CFF]";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const shipping = subTotalPrice * 0.01;
  const discountAmount = couponCodeData ? discountPrice : 0;
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountAmount).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2);

  const paymentSubmit = () => {
    const missing = [];
    if (!String(address1).trim()) missing.push("street address");
    if (!String(zipCode).trim()) missing.push("ZIP or postal code");
    if (!country) missing.push("country");
    if (!city) missing.push("state or region");
    if (missing.length) {
      toast.error(`Please complete: ${missing.join(", ")}.`);
      return;
    }

    const shippingAddress = {
      address1: address1.trim(),
      address2: address2.trim(),
      zipCode: zipCode.trim(),
      country,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice: couponCodeData ? discountAmount : undefined,
      shippingAddress,
      user,
      couponName: couponCodeData ? couponCodeData.name : undefined,
    };

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode.trim();
    if (!name) {
      toast.error("Enter a coupon code first.");
      return;
    }

    try {
      const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
      const coupon = res.data.couponCode;
      if (coupon == null) {
        toast.error("That coupon code was not found.");
        setCouponCode("");
        return;
      }
      const shopId = coupon.shopId;
      const couponCodeValue = coupon.value;
      const matchingItems = cart?.filter((item) => item.shopId === shopId) || [];
      if (matchingItems.length === 0) {
        toast.error("This coupon does not apply to items in your cart.");
        setCouponCode("");
        return;
      }
      const eligiblePrice = matchingItems.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
      );
      const computed = (eligiblePrice * couponCodeValue) / 100;
      setDiscountPrice(computed);
      setCouponCodeData(coupon);
      setCouponCode("");
      toast.success("Coupon applied.");
    } catch {
      toast.error("Could not check coupon. Try again.");
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-800">Your cart is empty. Add items before checkout.</p>
        <Link
          to="/products"
          className="mt-4 inline-block font-semibold text-[#4F8CFF] underline hover:text-[#2563eb]"
        >
          Go to products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <form
          className="lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            paymentSubmit();
          }}
        >
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
            fieldClass={fieldClass}
          />
          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              type="submit"
              className="w-full rounded-md bg-[#4F8CFF] px-4 py-3 text-base font-semibold text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:ring-offset-2 sm:w-auto sm:min-w-[240px]"
            >
              Continue to payment
            </button>
            <p className="mt-3 text-sm text-gray-500">
              Next you will choose card, PayPal, or cash on delivery. You can go
              back to your cart from the header if you need to change items.
            </p>
          </div>
        </form>

        <div className="lg:col-span-1">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountAmount={discountAmount}
          />
        </div>
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
  fieldClass,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
        Delivery address
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Use the same details as your account where possible. Update anything
        that should be different for this order only.
      </p>

      <div className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="checkout-name" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              id="checkout-name"
              type="text"
              readOnly
              value={user?.name || ""}
              className={`${fieldClass} mt-1 bg-gray-50 text-gray-600`}
            />
          </div>
          <div>
            <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="checkout-email"
              type="email"
              readOnly
              value={user?.email || ""}
              className={`${fieldClass} mt-1 bg-gray-50 text-gray-600`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="checkout-phone"
              type="tel"
              readOnly
              value={user?.phoneNumber ? String(user.phoneNumber) : ""}
              placeholder="Not on file"
              className={`${fieldClass} mt-1 bg-gray-50 text-gray-600 placeholder:text-gray-400`}
            />
            <p className="mt-1 text-xs text-gray-500">
              From your account profile. Update it in profile settings if needed.
            </p>
          </div>
          <div>
            <label htmlFor="checkout-zip" className="block text-sm font-medium text-gray-700">
              ZIP or postal code <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-zip"
              type="text"
              autoComplete="postal-code"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${fieldClass} mt-1`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="checkout-country" className="block text-sm font-medium text-gray-700">
              Country <span className="text-red-600">*</span>
            </label>
            <select
              id="checkout-country"
              required
              className={`${fieldClass} mt-1`}
              value={country}
              onChange={(e) => {
                setCountry(e.target.value);
                setCity("");
              }}
            >
              <option value="">Select country</option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="checkout-region" className="block text-sm font-medium text-gray-700">
              State / region <span className="text-red-600">*</span>
            </label>
            <select
              id="checkout-region"
              required
              disabled={!country}
              className={`${fieldClass} mt-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500`}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">
                {country ? "Select state or region" : "Choose a country first"}
              </option>
              {country &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="checkout-address1" className="block text-sm font-medium text-gray-700">
              Street address <span className="text-red-600">*</span>
            </label>
            <input
              id="checkout-address1"
              type="text"
              autoComplete="address-line1"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${fieldClass} mt-1`}
              placeholder="House number and street name"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="checkout-address2" className="block text-sm font-medium text-gray-700">
              Apartment, suite, etc.{" "}
              <span className="font-normal text-gray-500">(optional)</span>
            </label>
            <input
              id="checkout-address2"
              type="text"
              autoComplete="address-line2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${fieldClass} mt-1`}
              placeholder="Only if it applies"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <button
          type="button"
          className="text-sm font-semibold text-[#4F8CFF] underline hover:text-[#2563eb]"
          onClick={() => setUserInfo(!userInfo)}
          aria-expanded={userInfo}
        >
          {userInfo ? "Hide saved addresses" : "Fill from a saved address"}
        </button>

        {userInfo && (
          <ul className="mt-4 space-y-3" role="list">
            {user?.addresses?.length ? (
              user.addresses.map((item, index) => (
                <li key={index}>
                  <label
                    htmlFor={`saved-addr-${index}`}
                    className="flex cursor-pointer items-start gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50"
                  >
                    <input
                      id={`saved-addr-${index}`}
                      type="radio"
                      name="savedAddress"
                      className="mt-1"
                      onChange={() => {
                        setAddress1(item.address1);
                        setAddress2(item.address2 || "");
                        setZipCode(String(item.zipCode ?? ""));
                        setCountry(item.country);
                        setCity(item.city);
                      }}
                    />
                    <span>
                      <span className="font-medium text-gray-900">
                        {item.addressType}
                      </span>
                      <span className="mt-0.5 block text-sm text-gray-600">
                        {item.address1}
                        {item.address2 ? `, ${item.address2}` : ""}
                      </span>
                    </span>
                  </label>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No saved addresses yet.</li>
            )}
          </ul>
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
  discountAmount,
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
        Order summary
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Shipping is 1% of the item subtotal. Totals update when a coupon
        applies.
      </p>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Subtotal (items)</dt>
          <dd className="font-medium text-gray-900 tabular-nums">
            ${Number(subTotalPrice).toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium text-gray-900 tabular-nums">
            ${shipping.toFixed(2)}
          </dd>
        </div>
        {discountAmount ? (
          <div className="flex justify-between gap-4">
            <dt className="text-gray-600">Coupon discount</dt>
            <dd className="font-medium text-green-700 tabular-nums">
              −${Number(discountAmount).toFixed(2)}
            </dd>
          </div>
        ) : null}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between gap-4 text-base">
            <dt className="font-semibold text-gray-900">Total due</dt>
            <dd className="font-semibold text-gray-900 tabular-nums">
              ${Number(totalPrice).toFixed(2)}
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h3 className="text-sm font-semibold text-gray-900">Coupon code</h3>
        <p className="mt-1 text-xs text-gray-500">
          Optional. One code per order if your items qualify.
        </p>
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
          <label htmlFor="checkout-coupon" className="sr-only">
            Coupon code
          </label>
          <input
            id="checkout-coupon"
            type="text"
            className={fieldClass}
            placeholder="Enter code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            type="submit"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:ring-offset-2"
          >
            Apply coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
