import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { server } from "../../server";
import { toast } from "react-toastify";
import axios from "axios";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { RxCross1 } from "react-icons/rx";

const buildCartPayload = (cart) =>
  (cart || []).map((c) => ({
    _id: c._id,
    qty: c.qty,
    shopId: c.shopId,
  }));

/** Backend Order model requires `user` and `totalPrice` (see backend/model/order.js). */
function buildCreateOrderBody(orderData, cartPayload, paymentInfo, reduxUser, extra = {}) {
  const orderUser = orderData?.user ?? reduxUser;
  const totalPrice = Number(orderData?.totalPrice);
  return {
    cart: cartPayload,
    shippingAddress: orderData?.shippingAddress,
    user: orderUser,
    totalPrice: Number.isFinite(totalPrice) ? totalPrice : 0,
    paymentInfo,
    ...extra,
  };
}

const stripeElementClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-gray-900";

function readLatestOrder() {
  try {
    const raw = localStorage.getItem("latestOrder");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

const Payment = () => {
  const [orderData, setOrderData] = useState(() => readLatestOrder());
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    setOrderData(readLatestOrder());
  }, [location.pathname]);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "eShop order",
            amount: {
              currency_code: "USD",
              value: orderData?.totalPrice,
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
      .then((orderId) => orderId);
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      if (payer != undefined) {
        payPalPaymentHandler(payer);
      }
    });
  };

  const payPalPaymentHandler = async (paymentInfo) => {
    if (!orderData?.cart?.length) {
      toast.error("No order data. Go back to checkout and try again.");
      return;
    }
    try {
      const cartPayload = buildCartPayload(orderData?.cart);
      await axios.post(
        `${server}/order/create-order`,
        buildCreateOrderBody(
          orderData,
          cartPayload,
          {
            id: paymentInfo.payer_id,
            status: "succeeded",
            type: "Paypal",
          },
          user,
          { couponName: orderData?.couponName || undefined }
        )
      );
      setOpen(false);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Order failed"
      );
    }
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    if (!orderData?.cart?.length) {
      toast.error("No order data. Go back to checkout and try again.");
      return;
    }
    try {
      const cartPayload = buildCartPayload(orderData?.cart);
      const { data } = await axios.post(`${server}/payment/create-payment-intent`, {
        cart: cartPayload,
        couponName: orderData?.couponName || undefined,
      });

      const client_secret = data.client_secret;
      const sessionId = data.sessionId;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        await axios.post(
          `${server}/order/create-order`,
          buildCreateOrderBody(
            orderData,
            cartPayload,
            {
              id: result.paymentIntent.id,
              status: result.paymentIntent.status,
              type: "Credit Card",
            },
            user,
            {
              couponName: orderData?.couponName || undefined,
              stripeCheckoutSessionId: sessionId,
            }
          )
        );
        setOpen(false);
        navigate("/order/success");
        toast.success("Order success!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Payment failed"
      );
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    if (!orderData?.cart?.length) {
      toast.error("No order data. Go back to checkout and try again.");
      return;
    }
    try {
      const cartPayload = buildCartPayload(orderData?.cart);
      await axios.post(
        `${server}/order/create-order`,
        buildCreateOrderBody(
          orderData,
          cartPayload,
          { type: "Cash on Delivery" },
          user,
          { couponName: orderData?.couponName || undefined }
        )
      );
      setOpen(false);
      navigate("/order/success");
      toast.success("Order successful!");
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Order failed"
      );
    }
  };

  const hasOrder =
    orderData &&
    typeof orderData === "object" &&
    Array.isArray(orderData.cart) &&
    orderData.cart.length > 0;

  if (!hasOrder) {
    return (
      <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          No order ready to pay
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Complete shipping details on checkout first. Your cart and totals are
          saved when you click &quot;Continue to payment&quot;.
        </p>
        <Link
          to="/checkout"
          className="mt-6 inline-block rounded-md bg-[#4F8CFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2563eb]"
        >
          Go to checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
        <div className="lg:col-span-2">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="lg:col-span-1">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const stripeInputStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111827",
      "::placeholder": { color: "#9CA3AF" },
    },
    invalid: { color: "#B91C1C" },
  },
};

const PaymentInfo = ({
  user,
  open,
  setOpen,
  onApprove,
  createOrder,
  paymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [method, setMethod] = useState("card");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
        How do you want to pay?
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Pick one option. Card details are processed by Stripe; we never store
        your full card number on our servers.
      </p>

      <fieldset className="mt-6 space-y-4">
        <legend className="sr-only">Payment method</legend>

        <div
          className={`rounded-lg border p-4 ${
            method === "card" ? "border-[#4F8CFF] ring-1 ring-[#4F8CFF]" : "border-gray-200"
          }`}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={method === "card"}
              onChange={() => setMethod("card")}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-gray-900">Debit or credit card</span>
              <span className="mt-0.5 block text-sm text-gray-600">
                Pay with Visa, Mastercard, or other major cards.
              </span>
            </span>
          </label>

          {method === "card" ? (
            <form onSubmit={paymentHandler} className="mt-5 space-y-4 border-t border-gray-100 pt-5">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Card number</span>
                <CardNumberElement
                  className={`${stripeElementClass} mt-1`}
                  options={stripeInputStyle}
                />
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Expiry date</span>
                  <CardExpiryElement
                    className={`${stripeElementClass} mt-1`}
                    options={stripeInputStyle}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Security code (CVC)</span>
                  <CardCvcElement
                    className={`${stripeElementClass} mt-1`}
                    options={stripeInputStyle}
                  />
                </label>
              </div>
              <div>
                <label htmlFor="pay-card-name" className="block text-sm font-medium text-gray-700">
                  Name on card
                </label>
                <input
                  id="pay-card-name"
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Must match your card. Taken from your account name.
                </p>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-[#4F8CFF] px-4 py-3 text-base font-semibold text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:ring-offset-2"
              >
                Pay and place order
              </button>
            </form>
          ) : null}
        </div>

        <div
          className={`rounded-lg border p-4 ${
            method === "paypal" ? "border-[#4F8CFF] ring-1 ring-[#4F8CFF]" : "border-gray-200"
          }`}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={method === "paypal"}
              onChange={() => setMethod("paypal")}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-gray-900">PayPal</span>
              <span className="mt-0.5 block text-sm text-gray-600">
                Log in to PayPal in the next step to approve payment.
              </span>
            </span>
          </label>

          {method === "paypal" ? (
            <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
              <button
                type="button"
                className="w-full rounded-md bg-[#4F8CFF] px-4 py-3 text-base font-semibold text-white hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:ring-offset-2"
                onClick={() => setOpen(true)}
              >
                Continue with PayPal
              </button>
            </div>
          ) : null}
        </div>

        <div
          className={`rounded-lg border p-4 ${
            method === "cod" ? "border-[#4F8CFF] ring-1 ring-[#4F8CFF]" : "border-gray-200"
          }`}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
              className="mt-1"
            />
            <span>
              <span className="font-medium text-gray-900">Cash on delivery</span>
              <span className="mt-0.5 block text-sm text-gray-600">
                Pay the courier when your package arrives. Have the exact total
                ready if possible.
              </span>
            </span>
          </label>

          {method === "cod" ? (
            <form
              onSubmit={cashOnDeliveryHandler}
              className="mt-5 border-t border-gray-100 pt-5"
            >
              <button
                type="submit"
                className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:ring-offset-2"
              >
                Place order (pay on delivery)
              </button>
            </form>
          ) : null}
        </div>
      </fieldset>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="paypal-dialog-title"
        >
          <div className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <h3 id="paypal-dialog-title" className="text-lg font-semibold text-gray-900">
                Pay with PayPal
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close PayPal window"
              >
                <RxCross1 size={22} />
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Complete payment in the PayPal widget below. You can cancel here
              to choose another method.
            </p>
            <div className="mt-4">
              <PayPalScriptProvider
                options={{
                  "client-id":
                    process.env.REACT_APP_PAYPAL_CLIENT_ID ||
                    "Aczac4Ry9_QA1t4c7TKH9UusH3RTe6onyICPoCToHG10kjlNdI-qwobbW9JAHzaRQwFMn2-k660853jn",
                }}
              >
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  onApprove={onApprove}
                  createOrder={createOrder}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const CartData = ({ orderData }) => {
  const sub = Number(orderData?.subTotalPrice ?? 0);
  const ship = Number(orderData?.shipping ?? 0);
  const disc = orderData?.discountPrice
    ? Number(orderData.discountPrice)
    : 0;
  const total = Number(orderData?.totalPrice ?? 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
        Order total
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Same numbers you saw on checkout. Currency: USD.
      </p>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="font-medium text-gray-900 tabular-nums">
            ${sub.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium text-gray-900 tabular-nums">
            ${ship.toFixed(2)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-gray-600">Discount</dt>
          <dd className="font-medium text-green-700 tabular-nums">
            {disc > 0 ? `−$${disc.toFixed(2)}` : "—"}
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between gap-4 text-base">
            <dt className="font-semibold text-gray-900">Total to pay</dt>
            <dd className="font-semibold text-gray-900 tabular-nums">
              ${total.toFixed(2)}
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        <p>
          To change your address or cart,{" "}
          <Link to="/checkout" className="font-semibold text-[#4F8CFF] underline hover:text-[#2563eb]">
            return to checkout
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Payment;
