import React from "react";

const items = [
  ["🏠", "Dashboard", "/dashboard"],
  ["🧳", "My Trips", "/trips"],
  ["🔖", "Saved", "/saved"],
  ["💬", "Messages", "/messages"],
  ["👤", "Profile", "profile"],
  ["❓", "Help & Support", "/help"]
];

export default function Sidebar({ active = "Dashboard", onProfile, navigate }) {
  return (
    <aside className="component-sidebar">
      <div className="component-sidebar-brand"><span>🇮🇳</span><div><strong>BharatYatra</strong><small>Explore • Experience • India</small></div></div>
      <nav>{items.map(([icon, label, path]) => (
        <button key={label} className={active === label ? "active" : ""} onClick={() => path === "profile" ? onProfile?.() : navigate?.(path)}>
          <span>{icon}</span>{label}
        </button>
      ))}</nav>
    </aside>
  );
}
