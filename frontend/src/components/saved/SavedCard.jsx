import React from "react";

export default function SavedCard({ item, onOpen, onRemove }) {
  return <article className="saved-card-component">
    <div className="saved-icon">🔖</div><div><h3>{item?.name || "Saved Place"}</h3><p>{item?.category || item?.state || "India"}</p></div>
    <button onClick={() => onOpen?.(item)}>Open</button><button onClick={() => onRemove?.(item)}>×</button>
  </article>;
}
