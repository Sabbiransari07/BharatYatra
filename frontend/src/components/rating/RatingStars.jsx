import React from "react";

export default function RatingStars({ value = 0, onChange, readOnly = false }) {
  return <div className="rating-stars" aria-label={`${value} out of 5 stars`}>
    {[1,2,3,4,5].map(star => <button key={star} type="button" disabled={readOnly} className={star <= value ? "selected" : ""} onClick={() => onChange?.(star)}>★</button>)}
  </div>;
}
