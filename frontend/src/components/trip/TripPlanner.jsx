import React, { useState } from "react";

export default function TripPlanner({ destination, onCreate }) {
  const [title, setTitle] = useState("");
  const [days, setDays] = useState(3);
  const [startDate, setStartDate] = useState("");

  const submit = e => { e.preventDefault(); onCreate?.({ title: title.trim() || `${destination || "India"} Trip`, destination, days, startDate }); };

  return <form className="trip-planner-component" onSubmit={submit}>
    <h2>Create your itinerary</h2><p>Save your trip and build your India travel plan.</p>
    <label>Trip Name<input value={title} onChange={e => setTitle(e.target.value)} placeholder="My India Trip" /></label>
    <div className="trip-planner-row"><label>Start Date<input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></label><label>Days<input type="number" min="1" value={days} onChange={e => setDays(+e.target.value || 1)} /></label></div>
    <button type="submit">Create Trip</button>
  </form>;
}
