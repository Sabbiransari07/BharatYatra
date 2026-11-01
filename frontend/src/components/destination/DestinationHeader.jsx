import React from "react";

export default function DestinationHeader({ destination, onBack, onSearch }) {
  const [value, setValue] = React.useState("");
  const submit = e => { e.preventDefault(); if (value.trim()) onSearch?.(value.trim()); };

  return (
    <header className="destination-component-header">
      <button onClick={onBack} className="back-button">←</button>
      <div><small>BHARATYATRA</small><h1>{destination?.name || "Explore India"}</h1></div>
      <form onSubmit={submit}><input value={value} onChange={e => setValue(e.target.value)} placeholder="Search destination..." /><button>Search</button></form>
    </header>
  );
}
