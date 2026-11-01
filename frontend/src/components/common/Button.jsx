import React from "react";

export default function Button({ children, variant = "primary", type = "button", loading = false, disabled = false, onClick, className = "" }) {
  return (
    <button type={type} className={`component-button ${variant} ${className}`} disabled={disabled || loading} onClick={onClick}>
      {loading ? "Please wait..." : children}
    </button>
  );
}
