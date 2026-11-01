import React from "react";

export default function DestinationCard({ destination, onClick }) {
  return (
    <article className="destination-card-component" onClick={() => onClick?.(destination)} tabIndex="0">
      <div className="destination-card-icon">📍</div>
      <div><h3>{destination?.name || "Destination"}</h3><p>{destination?.state || destination?.country || "India"}</p></div>
      <span>↗</span>
    </article>
  );
}
