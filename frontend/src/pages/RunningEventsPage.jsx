import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AiOutlineSearch, AiOutlineCalendar, AiOutlineClockCircle, AiOutlineLocation } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoIosStar } from "react-icons/io";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const RunningEventsPage = () => {
  const { allEvents } = useSelector((state) => state.events);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const categories = ["All", "Flash Sale", "Seasonal", "Holiday", "Clearance", "New Arrival", "Limited Time"];

  // Mock events data for preview
  const mockEvents = [
    {
      _id: "1",
      name: "Summer Flash Sale",
      description: "Get up to 70% off on summer essentials. Limited time offer!",
      images: [{ url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop" }],
      category: "Flash Sale",
      startDate: "2024-06-15",
      endDate: "2024-06-30",
      discount: 70,
      shop: { name: "Fashion Store" },
      ratings: 4.5,
      numOfReviews: 128,
      status: "active"
    },
    {
      _id: "2",
      name: "Back to School Collection",
      description: "Everything you need for the new school year at amazing prices.",
      images: [{ url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop" }],
      category: "Seasonal",
      startDate: "2024-08-01",
      endDate: "2024-09-15",
      discount: 50,
      shop: { name: "School Supplies Plus" },
      ratings: 4.8,
      numOfReviews: 89,
      status: "active"
    },
    {
      _id: "3",
      name: "Black Friday Early Access",
      description: "Early access to Black Friday deals. Don't miss out!",
      images: [{ url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop" }],
      category: "Holiday",
      startDate: "2024-11-20",
      endDate: "2024-11-30",
      discount: 80,
      shop: { name: "Tech Gadgets" },
      ratings: 4.2,
      numOfReviews: 256,
      status: "active"
    },
    {
      _id: "4",
      name: "Winter Clearance",
      description: "Clear out winter inventory with massive discounts.",
      images: [{ url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop" }],
      category: "Clearance",
      startDate: "2024-02-01",
      endDate: "2024-03-15",
      discount: 60,
      shop: { name: "Winter Wear Co" },
      ratings: 4.6,
      numOfReviews: 67,
      status: "active"
    }
  ];

  useEffect(() => {
    let filtered = [...mockEvents];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Sort events
    switch (sortBy) {
      case "discount-high":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      case "discount-low":
        filtered.sort((a, b) => a.discount - b.discount);
        break;
      case "rating":
        filtered.sort((a, b) => b.ratings - a.ratings);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        break;
    }

    setFilteredEvents(filtered);
  }, [searchTerm, selectedCategory, sortBy]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <>
      <Header activeHeading={4} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#4F8CFF] via-[#A0C1FF] to-[#F5F8FF] pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Running Events
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Don't miss out on these amazing deals and limited-time offers. Shop now before they're gone!
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
                placeholder="Search events..."
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
              <AiOutlineCalendar className="text-[#4F8CFF]" size={20} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border-2 border-[#A0C1FF] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F8CFF] focus:border-transparent"
              >
                <option value="newest">Newest</option>
                <option value="discount-high">Highest Discount</option>
                <option value="discount-low">Lowest Discount</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredEvents.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredEvents.length} active events
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} formatDate={formatDate} getDaysRemaining={getDaysRemaining} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AiOutlineCalendar size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No events found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

const EventCard = ({ event, formatDate, getDaysRemaining }) => {
  const daysRemaining = getDaysRemaining(event.endDate);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Event Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.images?.[0]?.url || "https://via.placeholder.com/400x250?text=Event+Image"}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {event.discount}% OFF
        </div>
        {daysRemaining > 0 && (
          <div className="absolute top-2 right-2 bg-[#4F8CFF] text-white px-3 py-1 rounded-full text-sm font-semibold">
            {daysRemaining} days left
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <IoIosStar
              key={i}
              className={`w-4 h-4 ${
                i < event.ratings ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-1">({event.numOfReviews})</span>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 text-lg">
          {event.name}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AiOutlineCalendar className="text-[#4F8CFF]" size={16} />
            <span>{formatDate(event.startDate)} - {formatDate(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AiOutlineLocation className="text-[#4F8CFF]" size={16} />
            <span>{event.shop?.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 capitalize">
            {event.category}
          </span>
          <Link
            to={`/event/${event._id}`}
            className="bg-[#4F8CFF] hover:bg-[#2563eb] text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            View Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RunningEventsPage; 