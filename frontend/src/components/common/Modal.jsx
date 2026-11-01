import React from "react";

export default function Modal({ open, title, children, onClose, footer }) {
  if (!open) return null;
  return (
    <div className="component-modal-overlay" onMouseDown={e => e.target === e.currentTarget && onClose?.()}>
      <div className="component-modal">
        <header><div><h2>{title}</h2></div><button onClick={onClose} aria-label="Close">×</button></header>
        <div className="component-modal-body">{children}</div>
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}
