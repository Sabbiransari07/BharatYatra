import React from "react";

export default function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="component-section-heading">
      <div>{eyebrow && <small>{eyebrow}</small>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}
