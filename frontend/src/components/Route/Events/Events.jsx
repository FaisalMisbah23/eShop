import React from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.event);
  return (
    <div>
      {!isLoading && (
        <div className={`${styles.section} mb-12`}>
          <div className="text-[32px] font-extrabold text-[#4F8CFF] text-center mb-8 font-sans drop-shadow-lg">Popular Events</div>
          <div className="w-full grid">
            {allEvents.length !== 0 && (
              <EventCard data={allEvents && allEvents[0]} />
            )}
            {allEvents?.length === 0 && <h4 className="text-gray-400 text-lg">No Events have!</h4>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
