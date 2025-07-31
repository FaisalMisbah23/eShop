import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineStar, AiOutlineLike, AiOutlineDislike, AiOutlineMessage } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoIosStar } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const ShopReviewsPage = () => {
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Mock reviews data for preview
  const mockReviews = [
    {
      _id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      shop: {
        name: "Fashion Store",
        avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop"
      },
      rating: 5,
      title: "Amazing quality products!",
      comment: "I ordered a dress from this shop and I'm absolutely in love with it! The quality is exceptional and it fits perfectly. The shipping was fast and the customer service was excellent. Highly recommend!",
      images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"],
      createdAt: "2024-01-15T10:30:00Z",
      helpful: 12,
      notHelpful: 1,
      replies: 2
    },
    {
      _id: "2",
      user: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
      },
      shop: {
        name: "Tech Gadgets",
        avatar: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=100&fit=crop"
      },
      rating: 4,
      title: "Great service and fast delivery",
      comment: "Ordered a smartphone and it arrived earlier than expected. The product was exactly as described and the packaging was secure. The only minor issue was a small delay in tracking updates, but overall very satisfied.",
      images: ["https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300&h=200&fit=crop"],
      createdAt: "2024-01-12T14:20:00Z",
      helpful: 8,
      notHelpful: 0,
      replies: 1
    },
    {
      _id: "3",
      user: {
        name: "Emily Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
      },
      shop: {
        name: "Home Decor Plus",
        avatar: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&h=100&fit=crop"
      },
      rating: 3,
      title: "Good products but slow shipping",
      comment: "The products I received were of good quality and matched the description. However, the shipping took longer than expected. The customer service was responsive when I inquired about the delay.",
      images: ["https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=200&fit=crop"],
      createdAt: "2024-01-10T09:15:00Z",
      helpful: 5,
      notHelpful: 2,
      replies: 1
    },
    {
      _id: "4",
      user: {
        name: "David Wilson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      },
      shop: {
        name: "Sports Equipment",
        avatar: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=100&h=100&fit=crop"
      },
      rating: 5,
      title: "Excellent sports gear!",
      comment: "Bought a complete set of workout equipment and I'm extremely happy with the quality. Everything was well-packaged and arrived in perfect condition. The prices are competitive and the selection is great.",
      images: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop"],
      createdAt: "2024-01-08T16:45:00Z",
      helpful: 15,
      notHelpful: 0,
      replies: 3
    },
    {
      _id: "5",
      user: {
        name: "Lisa Thompson",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
      },
      shop: {
        name: "Beauty Essentials",
        avatar: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop"
      },
      rating: 2,
      title: "Disappointed with the quality",
      comment: "I ordered some beauty products but they didn't meet my expectations. The quality was below average and one item arrived damaged. The customer service was helpful in resolving the issue though.",
      images: ["https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"],
      createdAt: "2024-01-05T11:30:00Z",
      helpful: 3,
      notHelpful: 4,
      replies: 2
    }
  ];

  useEffect(() => {
    let filtered = [...mockReviews];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (selectedRating !== "All") {
      const rating = parseInt(selectedRating);
      filtered = filtered.filter(review => review.rating === rating);
    }

    // Sort reviews
    switch (sortBy) {
      case "rating-high":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    setFilteredReviews(filtered);
  }, [searchTerm, selectedRating, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAverageRating = () => {
    const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / mockReviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  return (
    <>
      <Header activeHeading={3} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shop Reviews
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Read authentic reviews from real customers. Make informed decisions based on community feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4F8CFF]">{getAverageRating()}</div>
              <div className="flex justify-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <IoIosStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(getAverageRating()) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4F8CFF]">{mockReviews.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4F8CFF]">{mockReviews.length}</div>
              <div className="text-sm text-gray-600 mt-1">Shops Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#4F8CFF]">
                {mockReviews.reduce((sum, review) => sum + review.helpful, 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Helpful Votes</div>
            </div>
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
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              />
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-2">
              <AiOutlineStar className="text-[#4F8CFF]" size={20} />
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              >
                <option value="All">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <BiCategory className="text-[#4F8CFF]" size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="rating-high">Highest Rated</option>
                <option value="rating-low">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredReviews.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredReviews.length} of {mockReviews.length} reviews
              </p>
            </div>
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <ReviewCard key={review._id} review={review} formatDate={formatDate} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AiOutlineSearch size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reviews found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

const ReviewCard = ({ review, formatDate }) => {
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
              src={review.user.avatar}
              alt={review.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{review.user.name}</h3>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <IoIosStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-1">({review.rating}/5)</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">{formatDate(review.createdAt)}</div>
            <div className="text-sm text-[#4F8CFF] font-medium">{review.shop.name}</div>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
          <p className="text-gray-600 leading-relaxed">{review.comment}</p>
        </div>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <div className="mb-4">
            <div className="flex gap-2 overflow-x-auto">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt="Review"
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isLiked ? 'bg-green-100 text-green-600' : 'text-gray-500 hover:text-green-600'
              }`}
            >
              <AiOutlineLike size={16} />
              <span className="text-sm">{review.helpful + (isLiked ? 1 : 0)}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isDisliked ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <AiOutlineDislike size={16} />
              <span className="text-sm">{review.notHelpful + (isDisliked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 rounded-lg text-gray-500 hover:text-[#4F8CFF] transition-colors">
              <AiOutlineMessage size={16} />
              <span className="text-sm">{review.replies} replies</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={review.shop.avatar}
              alt={review.shop.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-500">{review.shop.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopReviewsPage; 