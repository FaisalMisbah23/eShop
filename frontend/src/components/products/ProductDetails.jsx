import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
  AiOutlineStar,
  AiFillStar,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { server } from "../../server";
import styles from "../../styles/styles";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getAllProductsShop(data && data.shop._id));
  }, [dispatch, data]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("item added to cart successfully!");
      }
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;
  const averageRating = avg.toFixed(2);

  const handleMessageSubmit = (data) => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          console.log("res from then", res);
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          console.log("error from catch", error);
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {data ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex text-sm text-gray-500">
              <Link to="/" className="hover:text-[#4F8CFF] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="hover:text-[#4F8CFF] transition-colors">
                Products
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{data.name}</span>
            </nav>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
              {/* Left Column - Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative">
                <img
                  src={`${data && data.images[select]?.url}`}
                    alt={data.name}
                    className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl shadow-lg"
                  />
                  {/* Stock Badge */}
                  {data.stock < 10 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Only {data.stock} left!
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Images */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`flex-shrink-0 cursor-pointer transition-all duration-200 ${
                          select === index
                            ? "ring-2 ring-[#4F8CFF] ring-offset-2"
                            : "hover:opacity-75"
                        }`}
                        onClick={() => setSelect(index)}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Product Title & Rating */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {data.name}
                  </h1>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <AiFillStar
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(data.ratings)
                              ? "text-[#FFB800]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      ({data.ratings} rating)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {data.description}
                </p>

                {/* Price */}
                <div className="flex items-center space-x-3">
                  <span className="text-3xl sm:text-4xl font-bold text-[#4F8CFF]">
                    ${data.discountPrice}
                  </span>
                  {data.originalPrice && data.originalPrice !== data.discountPrice && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      ${data.originalPrice}
                    </span>
                  )}
                  {data.originalPrice && data.originalPrice !== data.discountPrice && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* Quantity & Wishlist */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center space-x-2">
                    <button
                      onClick={decrementCount}
                        className="w-10 h-10 bg-[#4F8CFF] hover:bg-[#2563eb] text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                      <span className="w-12 h-10 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center font-semibold">
                      {count}
                    </span>
                    <button
                      onClick={incrementCount}
                        className="w-10 h-10 bg-[#4F8CFF] hover:bg-[#2563eb] text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => click ? removeFromWishlistHandler(data) : addToWishlistHandler(data)}
                    className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors self-start sm:self-auto"
                  >
                    {click ? (
                      <AiFillHeart size={24} className="text-red-500" />
                    ) : (
                      <AiOutlineHeart size={24} className="text-gray-600" />
                    )}
                  </button>
                  </div>

                {/* Stock Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">{data.stock}</span> items available in stock
                  </p>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCartHandler(data._id)}
                  className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2 text-lg"
                >
                  <AiOutlineShoppingCart size={20} />
                  <span>Add to Cart</span>
                </button>

                {/* Shop Information */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-4">
                  <Link to={`/shop/preview/${data?.shop?._id}`}>
                    <img
                      src={`${data?.shop?.avatar?.url}`}
                        alt={data.shop.name}
                        className="w-12 h-12 rounded-full border-2 border-[#4F8CFF]"
                    />
                  </Link>
                    <div>
                    <Link to={`/shop/preview/${data?.shop?._id}`}>
                        <h3 className="font-semibold text-[#4F8CFF] hover:underline">
                        {data.shop.name}
                      </h3>
                    </Link>
                      <p className="text-sm text-gray-600">
                      ({averageRating}/5) Ratings
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleMessageSubmit(data)}
                    className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <AiOutlineMessage size={16} />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-8">
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4F8CFF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 px-6 py-4 text-sm sm:text-base font-semibold transition-colors ${
            active === 1
              ? "text-[#4F8CFF] border-b-2 border-[#4F8CFF] bg-blue-50"
              : "text-gray-600 hover:text-[#4F8CFF] hover:bg-gray-50"
          }`}
            onClick={() => setActive(1)}
          >
            Product Details
        </button>
        <button
          className={`flex-1 px-6 py-4 text-sm sm:text-base font-semibold transition-colors ${
            active === 2
              ? "text-[#4F8CFF] border-b-2 border-[#4F8CFF] bg-blue-50"
              : "text-gray-600 hover:text-[#4F8CFF] hover:bg-gray-50"
          }`}
            onClick={() => setActive(2)}
          >
            Product Reviews
        </button>
        <button
          className={`flex-1 px-6 py-4 text-sm sm:text-base font-semibold transition-colors ${
            active === 3
              ? "text-[#4F8CFF] border-b-2 border-[#4F8CFF] bg-blue-50"
              : "text-gray-600 hover:text-[#4F8CFF] hover:bg-gray-50"
          }`}
            onClick={() => setActive(3)}
          >
            Seller Information
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 sm:p-8">
        {active === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {data.description}
          </p>
          </div>
        )}

        {active === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
          {data?.reviews && data.reviews.length > 0 ? (
              <div className="space-y-6">
                {data.reviews.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                <img
                  src={`${item.user.avatar?.url}`}
                        alt={item.user.name}
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{item.user.name}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <AiFillStar
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(data?.ratings || 0)
                                    ? "text-[#FFB800]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600">{item.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <AiOutlineStar size={48} className="mx-auto" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                <p className="text-gray-600">Be the first to review this product!</p>
              </div>
            )}
            </div>
          )}

      {active === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Seller Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
            <Link to={`/shop/preview/${data.shop._id}`}>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <img
                  src={`${data?.shop?.avatar?.url}`}
                      className="w-16 h-16 rounded-full border-2 border-[#4F8CFF]"
                      alt={data.shop.name}
                    />
                    <div>
                      <h3 className="font-bold text-[#4F8CFF] text-lg">{data.shop.name}</h3>
                      <p className="text-sm text-gray-600">
                    ({averageRating}/5) Ratings
                      </p>
                </div>
              </div>
            </Link>
                <p className="text-gray-600 leading-relaxed">{data.shop.description}</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Shop Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span className="font-medium">{data.shop?.createdAt?.slice(0, 10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Products:</span>
                      <span className="font-medium">{products && products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Reviews:</span>
                      <span className="font-medium">{totalReviewsLength}</span>
                    </div>
          </div>
                </div>
                
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <button className="w-full bg-[#4F8CFF] hover:bg-[#2563eb] text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                    Visit Shop
                  </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductDetails;
