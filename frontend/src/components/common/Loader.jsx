import React from "react";

export default function Loader({ text = "Loading..." }) {
  return <div className="component-loader"><span className="loader-spinner" /><p>{text}</p></div>;
}
