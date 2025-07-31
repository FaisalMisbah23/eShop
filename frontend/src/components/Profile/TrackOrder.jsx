import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  // Define status configurations
  const getStatusConfig = (status) => {
    const configs = {
      "Processing": {
        icon: "🏪",
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-800",
        title: "Processing in Shop",
        description: "Your order is being prepared by the seller"
      },
      "Transferred to delivery partner": {
        icon: "🚚",
        color: "bg-orange-500",
        bgColor: "bg-orange-50",
        textColor: "text-orange-800",
        title: "Transferred to Delivery Partner",
        description: "Your order has been handed over to our delivery partner"
      },
      "Shipping": {
        icon: "📦",
        color: "bg-purple-500",
        bgColor: "bg-purple-50",
        textColor: "text-purple-800",
        title: "In Transit",
        description: "Your order is on the way with our delivery partner"
      },
      "Received": {
        icon: "🏙️",
        color: "bg-indigo-500",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-800",
        title: "Arrived in Your City",
        description: "Your order has arrived in your city and will be delivered soon"
      },
      "On the way": {
        icon: "🛵",
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-800",
        title: "Out for Delivery",
        description: "Our delivery person is on the way to deliver your order"
      },
      "Delivered": {
        icon: "✅",
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        title: "Delivered Successfully",
        description: "Your order has been delivered successfully"
      },
      "Processing refund": {
        icon: "🔄",
        color: "bg-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        title: "Refund Processing",
        description: "Your refund request is being processed"
      },
      "Refund Success": {
        icon: "💰",
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-800",
        title: "Refund Successful",
        description: "Your refund has been processed successfully"
      }
    };
    return configs[status] || {
      icon: "❓",
      color: "bg-gray-500",
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
      title: "Unknown Status",
      description: "Status information not available"
    };
  };

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">📋</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Order Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the order you're looking for. Please check your order ID.
        </p>
        <Link
          to="/profile"
          className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          View All Orders
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(data.status);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Order Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 ${statusConfig.color} rounded-full flex items-center justify-center`}>
          <span className="text-2xl">{statusConfig.icon}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order #{data._id?.slice(-8)}</h2>
          <p className="text-gray-600">Order Date: {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Status Card */}
      <div className={`${statusConfig.bgColor} border border-current ${statusConfig.textColor} rounded-xl p-6 mb-8`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{statusConfig.icon}</span>
          <h3 className="text-xl font-semibold">{statusConfig.title}</h3>
        </div>
        <p className="text-lg">{statusConfig.description}</p>
      </div>

      {/* Order Details */}
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Order Status</span>
              <p className="text-gray-900 font-semibold">{data.status}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Total Amount</span>
              <p className="text-gray-900 font-semibold">${data.totalPrice}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Method</span>
              <p className="text-gray-900 font-semibold">{data.paymentInfo?.type || "Not specified"}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500">Payment Status</span>
              <p className="text-gray-900 font-semibold">{data.paymentInfo?.status || "Pending"}</p>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {data.shippingAddress && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">
                {data.shippingAddress.address1}, {data.shippingAddress.address2}
              </p>
              <p className="text-gray-600">
                {data.shippingAddress.city}, {data.shippingAddress.country} {data.shippingAddress.zipCode}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/profile"
              className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
            >
              View All Orders
            </Link>
            
            <Link
              to="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
