import React from "react";

export default function ProfilePanel({ open, user, onClose, onDetails, onLogout }) {
  if (!open) return null;
  return (
    <div className="profile-panel-overlay" onMouseDown={e => e.target === e.currentTarget && onClose?.()}>
      <aside className="profile-panel">
        <header><h2>Profile</h2><button onClick={onClose}>×</button></header>
        <div className="profile-panel-user"><div>{user?.profileImage ? <img src={user.profileImage} alt="Profile" /> : "👤"}</div><h3>{user?.fullName || "Traveler"}</h3><p>{user?.email || ""}</p></div>
        <button onClick={onDetails}>👤 Profile Details <span>→</span></button>
        <button className="logout" onClick={onLogout}>↪ Logout <span>→</span></button>
      </aside>
    </div>
  );
}
