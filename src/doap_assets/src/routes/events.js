import React, { Fragment, useState, useEffect, useCallback } from "react";
import { getInvoices } from "../data";
import { Link, Outlet } from "react-router-dom";
// import { doap } from "../services/wrapper";
import { doap } from "../../../declarations/doap";

export default function Events() {
  const [events, setEvents] = useState([]);

  const getEvents = useCallback(async () => {
    const res = await doap.getEvents();
    console.log("reees", res);
    //getEvents returns an array of array
    let flatEvents = res.flat().filter((a) => typeof a != 'string');
    setEvents(flatEvents);
  }, []);

  useEffect(() => {
    getEvents();
  }, []);

  //   let events = getEvents();
  return (
    <div style={{ display: "flex" }}>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
        {events &&
          events.length > 0 &&
          events.map((event) => (
            <Link
              key={event.name}
              style={{ display: "block", margin: "1rem 0" }}
              to={`/events/${event.number}`}
            >
              {event.name}
            </Link>
          ))}
      </nav>
    </div>
  );
}
