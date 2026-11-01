import React from "react";

export default function MapView({ latitude, longitude, title = "Location" }) {
  if (!latitude || !longitude) return <div className="map-placeholder">Map coordinates unavailable.</div>;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - .05}%2C${latitude - .05}%2C${longitude + .05}%2C${latitude + .05}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  return <section className="map-view"><iframe title={title} src={src} loading="lazy" /></section>;
}
