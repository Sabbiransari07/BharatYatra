import React from "react";

export default function PlaceCard({ place, onMap }) {
  return (
    <article className="place-card-component">
      <div className="place-card-icon">🏛️</div>
      <div><h3>{place?.name || "Tourist Place"}</h3><p>{place?.category || "Attraction"}</p>
      {onMap && place?.latitude && place?.longitude && <button onClick={() => onMap(place)}>View on map →</button>}</div>
    </article>
  );
}
