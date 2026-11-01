import React from "react";

export default function EmptyState({ icon = "🧭", title = "Nothing found", message = "There is no information to show yet.", action }) {
  return (
    <div className="component-empty-state">
      <span>{icon}</span><h3>{title}</h3><p>{message}</p>
      {action}
    </div>
  );
}
