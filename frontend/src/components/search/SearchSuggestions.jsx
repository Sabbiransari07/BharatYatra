import React from "react";

export default function SearchSuggestions({
  items = [],
  onSelect,
  className = "",
}) {
  return (
    <div className={className}>
      <span>Try:</span>

      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onSelect?.(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
