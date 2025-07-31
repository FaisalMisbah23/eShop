import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
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

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(storedOrder);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: "Sunflower",
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
      .then((orderId) => {
        return orderId;
      });
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;
      let paymentInfo = payer;

      if (paymentInfo != undefined) {
        payPalPaymentHandler(paymentInfo);
      }
    });
  };

  const payPalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: "succeeded",
      type: "Paypal",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  const PaymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${server}/payment/process`,
        PaymentData,
        config
      );

      const client_secret = data.client_secret;

      if (!stripe || !elements) return;
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios
            .post(`${server}/order/create-order`, order, config)
            .then((res) => {
              setOpen(false);
              navigate("/order/success");
              toast.success("Order success!");
              localStorage.setItem("cartItems", JSON.stringify([]));
              localStorage.setItem("latestOrder", JSON.stringify([]));
              window.location.reload();
            });
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    order.paymentInfo = {
      type: "Cash on Delivery",
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate("/order/success");
        toast.success("Order successful!");
        localStorage.setItem("cartItems", JSON.stringify([]));
        localStorage.setItem("latestOrder", JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
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
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
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
  const [select, setSelect] = useState(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#4F8CFF] rounded-full flex items-center justify-center">
          <span className="text-white text-lg">💳</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
      </div>

      {/* Payment Options */}
      <div className="space-y-6">
        {/* Credit Card Option */}
        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#4F8CFF] transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                select === 1 
                  ? "border-[#4F8CFF] bg-[#4F8CFF]" 
                  : "border-gray-300"
              }`}
            onClick={() => setSelect(1)}
          >
              {select === 1 && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Credit/Debit Card</h3>
        </div>

          {select === 1 && (
            <form onSubmit={paymentHandler} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    required
                    value={user && user.name}
                    className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <CardExpiryElement
                    className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#374151",
                        },
                        empty: {
                          color: "#9CA3AF",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <CardNumberElement
                    className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#374151",
                        },
                        empty: {
                          color: "#9CA3AF",
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <CardCvcElement
                    className="w-full px-4 py-3 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent transition-colors"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#374151",
                        },
                        empty: {
                          color: "#9CA3AF",
                        },
                      },
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Pay Now
              </button>
            </form>
          )}
        </div>

        {/* PayPal Option */}
        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#4F8CFF] transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                select === 2 
                  ? "border-[#4F8CFF] bg-[#4F8CFF]" 
                  : "border-gray-300"
              }`}
              onClick={() => setSelect(2)}
            >
              {select === 2 && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">PayPal</h3>
          </div>

          {select === 2 && (
            <div>
              <button
                className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                onClick={() => setOpen(true)}
              >
                Pay with PayPal
              </button>
              
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">PayPal Payment</h3>
                      <button
                      onClick={() => setOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <RxCross1 size={24} />
                      </button>
                  </div>
                  <PayPalScriptProvider
                    options={{
                      "client-id":
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
            )}
          </div>
          )}
      </div>

        {/* Cash on Delivery Option */}
        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#4F8CFF] transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                select === 3 
                  ? "border-[#4F8CFF] bg-[#4F8CFF]" 
                  : "border-gray-300"
              }`}
            onClick={() => setSelect(3)}
          >
              {select === 3 && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Cash on Delivery</h3>
        </div>

          {select === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Pay with cash when your order is delivered.
              </p>
              <form onSubmit={cashOnDeliveryHandler}>
                <button
                type="submit"
                  className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Confirm Order
                </button>
            </form>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);
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
          <span className="font-semibold text-gray-900">${orderData?.subTotalPrice}</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-semibold text-gray-900">${shipping}</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-gray-600">Discount:</span>
          <span className="font-semibold text-green-600">
            {orderData?.discountPrice ? "-$" + orderData.discountPrice : "-"}
          </span>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-[#4F8CFF]">${orderData?.totalPrice}</span>
          </div>
        </div>
      </div>
      
      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="text-green-500">🔒</span>
          <span>Secure payment processing</span>
        </div>
      </div>
    </div>
  );
};

export default Payment;
