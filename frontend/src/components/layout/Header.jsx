import React from "react";

export default function Header({ user, onNotifications, onProfile }) {
  return (
    <header className="component-header">
      <button className="notification-button" onClick={onNotifications}>🔔</button>
      <button className="header-profile-button" onClick={onProfile}>
        <span>{user?.profileImage ? <img src={user.profileImage} alt="Profile" /> : "👤"}</span>
        <div><small>Hello,</small><strong>{user?.fullName || "Traveler"}</strong></div><b>▾</b>
      </button>
    </header>
  );
}
