import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineFilter, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineStar, AiOutlineLocation, AiOutlinePhone, AiOutlineMail } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoIosStar } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const ShopPreviewPageNew = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Mock shop data for preview
  const mockShop = {
    _id: "1",
    name: "Fashion Store",
    description: "Your one-stop destination for trendy fashion and accessories. We offer high-quality clothing, shoes, and accessories for all ages and styles.",
    avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    address: "123 Fashion Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "contact@fashionstore.com",
    website: "www.fashionstore.com",
    rating: 4.5,
    numOfReviews: 128,
    totalProducts: 156,
    followers: 2340,
    following: 156,
    joinedDate: "2023-01-15",
    categories: ["Clothing", "Shoes", "Accessories", "Jewelry"],
    socialLinks: {
      facebook: "https://facebook.com/fashionstore",
      instagram: "https://instagram.com/fashionstore",
      twitter: "https://twitter.com/fashionstore"
    }
  };

  // Mock products data
  const mockProducts = [
    {
      _id: "1",
      name: "Classic White T-Shirt",
      description: "Premium cotton t-shirt with perfect fit",
      images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" }],
      price: 29.99,
      discountPrice: 24.99,
      category: "Clothing",
      ratings: 4.5,
      numOfReviews: 45,
      sold: 120
    },
    {
      _id: "2",
      name: "Denim Jeans",
      description: "Comfortable and stylish denim jeans",
      images: [{ url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop" }],
      price: 89.99,
      discountPrice: 69.99,
      category: "Clothing",
      ratings: 4.8,
      numOfReviews: 67,
      sold: 89
    },
    {
      _id: "3",
      name: "Leather Handbag",
      description: "Elegant leather handbag for everyday use",
      images: [{ url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&h=300&fit=crop" }],
      price: 149.99,
      discountPrice: 119.99,
      category: "Accessories",
      ratings: 4.6,
      numOfReviews: 34,
      sold: 56
    },
    {
      _id: "4",
      name: "Running Shoes",
      description: "Comfortable running shoes for athletes",
      images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" }],
      price: 129.99,
      discountPrice: 99.99,
      category: "Shoes",
      ratings: 4.7,
      numOfReviews: 89,
      sold: 234
    }
  ];

  const categories = ["All", "Clothing", "Shoes", "Accessories", "Jewelry"];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header activeHeading={3} />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-12">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Shop Avatar */}
            <div className="relative">
              <img
                src={mockShop.avatar}
                alt={mockShop.name}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Shop Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {mockShop.name}
              </h1>
              <p className="text-lg text-white/90 mb-4 max-w-2xl">
                {mockShop.description}
              </p>
              
              {/* Shop Stats */}
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockShop.rating}</div>
                  <div className="flex justify-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <IoIosStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(mockShop.rating) ? 'text-yellow-300' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm opacity-80">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockShop.numOfReviews}</div>
                  <div className="text-sm opacity-80">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockShop.totalProducts}</div>
                  <div className="text-sm opacity-80">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{mockShop.followers}</div>
                  <div className="text-sm opacity-80">Followers</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button className="bg-white hover:bg-gray-100 text-[#4F8CFF] px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                Follow Shop
              </button>
              <button className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg">
                Contact Shop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Details Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <AiOutlineLocation className="text-[#4F8CFF]" size={20} />
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div className="font-medium">{mockShop.address}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AiOutlinePhone className="text-[#4F8CFF]" size={20} />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium">{mockShop.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AiOutlineMail className="text-[#4F8CFF]" size={20} />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{mockShop.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "products", name: "Products", count: mockProducts.length },
              { id: "reviews", name: "Reviews", count: mockShop.numOfReviews },
              { id: "about", name: "About", count: null }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-[#4F8CFF] text-[#4F8CFF]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.name}
                {tab.count && (
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "products" && (
          <div>
            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search */}
                <div className="flex-1 relative">
                  <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <BiCategory className="text-[#4F8CFF]" size={20} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <AiOutlineFilter className="text-[#4F8CFF]" size={20} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <ReviewCard key={index} />
            ))}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About {mockShop.name}</h3>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                {mockShop.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shop Details</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-medium">Joined:</span> {formatDate(mockShop.joinedDate)}</div>
                    <div><span className="font-medium">Categories:</span> {mockShop.categories.join(", ")}</div>
                    <div><span className="font-medium">Website:</span> {mockShop.website}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div><span className="font-medium">Address:</span> {mockShop.address}</div>
                    <div><span className="font-medium">Phone:</span> {mockShop.phone}</div>
                    <div><span className="font-medium">Email:</span> {mockShop.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleAddToCart = () => {
    // Add cart functionality here
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discountPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:text-red-500'
          }`}
        >
          <AiOutlineHeart size={20} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <IoIosStar
              key={i}
              className={`w-4 h-4 ${
                i < (product.ratings || 0) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({product.numOfReviews || 0})</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-[#4F8CFF]">
            ${product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {product.sold} sold
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-3 py-2 rounded-lg transition-colors"
          >
            <AiOutlineShoppingCart size={16} />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (isDisliked) {
      setIsDisliked(false);
    }
    setIsLiked(!isLiked);
  };

  const handleDislike = () => {
    if (isLiked) {
      setIsLiked(false);
    }
    setIsDisliked(!isDisliked);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <IoIosStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < 4 ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">(4/5)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">2 days ago</div>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Amazing quality products!</h4>
          <p className="text-gray-600 leading-relaxed">
            I ordered a dress from this shop and I'm absolutely in love with it! The quality is exceptional and it fits perfectly. The shipping was fast and the customer service was excellent. Highly recommend!
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              isLiked ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <AiOutlineHeart size={16} />
            <span className="text-sm">12</span>
          </button>
          <button
            onClick={handleDislike}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
              isDisliked ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-red-600'
            }`}
          >
            <AiOutlineHeart size={16} />
            <span className="text-sm">1</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPreviewPageNew; 