import React from "react";

export default function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="component-error-state">
      <span>!</span><h3>Unable to load</h3><p>{message}</p>
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  );
}
