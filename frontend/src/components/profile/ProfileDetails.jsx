import React, { useState } from "react";

export default function ProfileDetails({ user, onSave, onDelete, onImageChange }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: user?.fullName || "", email: user?.email || "", mobile: user?.mobile || "" });

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const save = async () => { await onSave?.(form); setEditing(false); };

  return (
    <section className="profile-details-component">
      <header><div><small>ACCOUNT</small><h2>Profile Details</h2><p>Your BharatYatra personal information</p></div></header>
      <div className="profile-picture-component">
        {user?.profileImage ? <img src={user.profileImage} alt="Profile" /> : <span>👤</span>}
        <label>📷<input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={e => onImageChange?.(e.target.files?.[0])} /></label>
      </div>
      <div className="profile-info-card">
        <div className="profile-info-head"><div><h3>Personal Information</h3><p>Manage your account details</p></div>{!editing && <button onClick={() => setEditing(true)}>✏️ Edit</button>}</div>
        {editing ? <div className="profile-edit-form">
          <label>Full Name<input name="fullName" value={form.fullName} onChange={change} /></label>
          <label>Email Address<input name="email" value={form.email} onChange={change} /></label>
          <label>Mobile Number<input name="mobile" value={form.mobile} onChange={change} /></label>
          <div><button onClick={save}>Save</button><button className="secondary" onClick={() => setEditing(false)}>Cancel</button></div>
        </div> : <div className="profile-fields">{[["Full Name",user?.fullName],["Email Address",user?.email],["Mobile Number",user?.mobile||"Not provided"]].map(([l,v])=><div key={l}><label>{l}</label><p>{v}</p></div>)}</div>}
      </div>
      <div className="delete-account-component"><h3>Delete Account</h3><p>This permanently removes your BharatYatra account.</p><button onClick={onDelete}>Delete Account</button></div>
    </section>
  );
}
