import React from "react";

export default function TripCard({ trip, onOpen, onDelete }) {
  return <article className="trip-card-component">
    <div><small>{trip?.status || "UPCOMING TRIP"}</small><h3>{trip?.title || "My India Trip"}</h3><p>{trip?.destination || "India"} {trip?.startDate ? `• ${trip.startDate}` : ""}</p></div>
    <button onClick={() => onOpen?.(trip)}>View Trip →</button>{onDelete && <button className="danger" onClick={() => onDelete(trip)}>Delete</button>}
  </article>;
}
