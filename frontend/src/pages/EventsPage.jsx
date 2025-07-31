import React from "react";
import Header from "../components/Layout/Header";
import EventCard from "../components/Route/Events/EventCard";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.event);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-[#F5F8FF] via-[#A0C1FF] to-[#4F8CFF]">
          <Header activeHeading={4} />
          {/* Hero Section */}
          <div className="w-full py-12 px-4 flex flex-col items-center justify-center bg-gradient-to-r from-[#4F8CFF] to-[#A0C1FF]">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 text-center drop-shadow-lg">Events & Promotions</h1>
            <p className="text-white text-lg sm:text-xl text-center max-w-2xl">Stay up to date with the latest events and exclusive promotions on eShopZone!</p>
          </div>
          <div className="max-w-4xl mx-auto px-4 py-10">
            {allEvents.length !== 0 ? (
              <EventCard data={allEvents && allEvents[0]} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24">
                <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-center w-full text-2xl font-semibold text-gray-500">No events available!</h4>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
