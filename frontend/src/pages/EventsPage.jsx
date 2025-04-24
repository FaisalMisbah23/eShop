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
        <div>
          <Header activeHeading={4} />
          {allEvents.length !== 0 && (
            <EventCard data={allEvents && allEvents[0]} />
          )}
          <h4 className="text-center">{allEvents?.length === 0 && "No Events have!"}</h4>
        </div>
      )}
    </>
  );
};

export default EventsPage;
