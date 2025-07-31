import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineFilter, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoIosStar } from "react-icons/io";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const ShopProductsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["All", "Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Beauty", "Toys"];

  useEffect(() => {
    if (allProducts) {
      let filtered = [...allProducts];

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by category
      if (selectedCategory !== "All") {
        filtered = filtered.filter(product =>
          product.category === selectedCategory
        );
      }

      // Sort products
      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          filtered.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
          break;
        case "newest":
        default:
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [allProducts, searchTerm, selectedCategory, sortBy]);

  return (
    <>
      <Header activeHeading={3} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shop Products
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing products from trusted sellers. Find exactly what you're looking for with our comprehensive product catalog.
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
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
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredProducts.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {allProducts?.length || 0} products
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AiOutlineSearch size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
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
    // Add wishlist functionality here
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
            Sold by {product.shop?.name || "Unknown Shop"}
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

export default ShopProductsPage; 