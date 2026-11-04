import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";
import SearchBar from "../components/search/SearchBar";
import SearchSuggestions from "../components/search/SearchSuggestions";

function Dashboard() {
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDetailsOpen, setProfileDetailsOpen] =
    useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] =
    useState(false);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [activeNav, setActiveNav] =
    useState("dashboard");

  // =====================================================
  // DESTINATION SEARCH
  // =====================================================

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleDestinationSearch = async (value) => {
    const cleanQuery = value.trim();

    if (!cleanQuery) {
      setSearchError("Please enter a state, city or destination.");
      return;
    }

    setSearching(true);
    setSearchError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/search?query=${encodeURIComponent(cleanQuery)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to search destination"
        );
      }

      if (!data.results || data.results.length === 0) {
        throw new Error("No Indian destination found for this search.");
      }

      sessionStorage.setItem(
        "bharatYatraSearchResult",
        JSON.stringify(data.results[0])
      );

      navigate(
        `/destination/${encodeURIComponent(cleanQuery)}`
      );
    } catch (error) {
      console.error("Destination Search Error:", error);

      setSearchError(
        error.message ||
          "Unable to search destination right now."
      );
    } finally {
      setSearching(false);
    }
  };

  const handleSuggestedSearch = (destination) => {
    setSearchQuery(destination);
    handleDestinationSearch(destination);
  };

  const [user, setUser] = useState({
    fullName: "BharatYatra User",
    email: "",
    mobile: "",
    profileImage: null,
  });

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
  });


  // =====================================================
  // LOAD CURRENT USER FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load profile"
          );
        }

        const currentUser = {
          ...data.user,
          profileImage:
            data.user.profileImage || null,
        };

        setUser(currentUser);

        setEditForm({
          fullName: currentUser.fullName || "",
          email: currentUser.email || "",
          mobile: currentUser.mobile || "",
        });

        // Keep fresh data locally
        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Load User Error:",
          error
        );

        // Invalid/expired token
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });
      }
    };

    loadUser();
  }, [navigate]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    setProfileOpen(false);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  const openProfile = () => {
    setActiveNav("profile");
    setProfileOpen(true);
  };


  // =====================================================
  // OPEN PROFILE DETAILS
  // =====================================================

  const openProfileDetails = () => {
    setProfileOpen(false);
    setProfileDetailsOpen(true);
    setEditing(false);
  };


  // =====================================================
  // CLOSE PROFILE DETAILS
  // =====================================================

  const closeProfileDetails = () => {
    if (saving) {
      return;
    }

    setProfileDetailsOpen(false);
    setEditing(false);
  };


  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEditProfile = () => {
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      mobile: user.mobile || "",
    });

    setEditing(true);
  };


  // =====================================================
  // HANDLE EDIT INPUT
  // =====================================================

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSaveProfile = async () => {
    if (!editForm.fullName.trim()) {
      alert("Full Name is required.");
      return;
    }

    if (!editForm.email.trim()) {
      alert("Email Address is required.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            fullName: editForm.fullName.trim(),
            email: editForm.email.trim(),
            mobile: editForm.mobile.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update profile"
        );
      }

      const updatedUser = {
        ...user,
        ...data.user,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setEditing(false);

      alert(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Update Profile Error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // PROFILE IMAGE UPLOAD
  // =====================================================

  const handleProfileImageChange = async (
    event
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Profile picture must be smaller than 5MB."
      );

      event.target.value = "";

      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();

      formData.append(
        "profileImage",
        file
      );

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/profile-image`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to upload profile picture"
        );
      }

      const updatedUser = {
        ...user,
        profileImage:
          data.profileImage,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert(
        "Profile picture updated successfully!"
      );
    } catch (error) {
      console.error(
        "Profile Image Error:",
        error
      );

      alert(error.message);
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };


  // =====================================================
  // DELETE ACCOUNT
  // =====================================================

  const openDeleteConfirmation = () => {
    setDeleteConfirmOpen(true);
  };


  const closeDeleteConfirmation = () => {
    if (!deleting) {
      setDeleteConfirmOpen(false);
    }
  };


  const handleDeleteAccount = async () => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/delete-account`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete account"
        );
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Delete Account Error:",
        error
      );

      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };


  // =====================================================
  // PROFILE IMAGE URL
  // =====================================================

  const profileImageUrl =
    user.profileImage
      ? user.profileImage.startsWith(
          "http"
        )
        ? user.profileImage
        : `${import.meta.env.VITE_API_URL}${user.profileImage}`
      : null;


  // =====================================================
  // RENDER
  // =====================================================


  return (
    <div className="dashboard-page">

      {/* =================================================
          FIXED SIDEBAR
          ================================================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          

          <div className="dashboard-logo-text">
            <h2>BharatYatra</h2>
            <span>Explore • Experience • India</span>
          </div>
        </div>

        <nav className="dashboard-nav">

          <button
            type="button"
            className={`nav-item ${activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveNav("dashboard")}
          >
            <span className="nav-icon">⌂</span>
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === "trips" ? "active" : ""}`}
            onClick={() => setActiveNav("trips")}
          >
            <span className="nav-icon">▣</span>
            <span>My Trips</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === "saved" ? "active" : ""}`}
            onClick={() => setActiveNav("saved")}
          >
            <span className="nav-icon">♡</span>
            <span>Saved</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === "messages" ? "active" : ""}`}
            onClick={() => setActiveNav("messages")}
          >
            <span className="nav-icon">◌</span>
            <span>Messages</span>
          </button>

          <button
            type="button"
            className={`nav-item ${activeNav === "profile" ? "active" : ""}`}
            onClick={openProfile}
          >
            <span className="nav-icon">♙</span>
            <span>Profile</span>
          </button>

        </nav>   
      </aside>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main className="dashboard-main dashboard-main-transparent">
        <div className="dashboard-content-container">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="dashboard-header-left">

            <div className="dashboard-header-brand" aria-hidden="true">
              🇮🇳
            </div>

            <div>
              <p className="welcome-text">
                Welcome to BharatYatra
              </p>

              <h1>
                Discover Incredible India
              </h1>
            </div>

          </div>


          <div className="dashboard-header-right">

            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
              title="Notifications"
              onClick={() => {}}
            >
              🔔
            </button>

            <button
              type="button"
              className="header-profile"
              onClick={openProfile}
              aria-label="Open profile"
            >

              {profileImageUrl ? (
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="header-profile-image"
                />
              ) : (
                <span className="header-profile-placeholder">
                  👤
                </span>
              )}

              <span className="header-profile-info">
                <span className="header-profile-greeting">
                  Hello,
                </span>

                <strong>
                  {user.fullName || "BharatYatra User"}
                </strong>
              </span>

              <span className="header-profile-arrow">
               ⌄
              </span>

            </button>

          </div>

        </header>


        {/* =================================================
            HERO / SEARCH
            ================================================= */}

        <section className="dashboard-hero">

          <img
            src="/images/dashboard-bg.png"
            alt=""
            className="hero-background-image"
            aria-hidden="true"
          />

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <span className="hero-small-title">
              ✦ INDIA IS WAITING FOR YOU
            </span>

            <h2>
              Where do you want to go?
            </h2>

            <p>
              Discover destinations, plan trips, and experience a
              greater India.
            </p>

            <SearchBar
              value={searchQuery}
              onChange={(value) => {
                setSearchQuery(value);
                setSearchError("");
              }}
              onSubmit={handleDestinationSearch}
              placeholder="Search for a state, city or destination..."
              className="destination-search"
              inputClassName="dashboard-search-input"
              inputWrapperClassName="search-input-wrapper"
              iconClassName="search-icon"
              buttonClassName="search-button"
              disabled={searching}
              buttonText={searching ? "Searching..." : "Search"}
            />

            <SearchSuggestions
              items={[
                "Kerala",
                "Rajasthan",
                "Himachal Pradesh",
                "Varanasi",
                "Goa",
                "Kashmir",
              ]}
              onSelect={handleSuggestedSearch}
              className="search-suggestions"
            />

            {searchError && (
              <p className="search-status search-status-error">
                {searchError}
              </p>
            )}
          </div>

        </section>


        {/* TAGLINE */}

        <div className="dashboard-tagline">

          <span className="tagline-line"></span>

          <p>
            TRAVEL
            <span>•</span>
            EXPLORE
            <span>•</span>
            EXPERIENCE
            <span>•</span>
            REPEAT
          </p>

          <span className="tagline-line"></span>

        </div>



        </div>
      </main>


      {/* FIXED PAGE FOOTER */}
      {/* FOOTER / CUSTOMER SUPPORT */}
      <footer className="dashboard-footer">
        <div className="support-card">
          <div className="support-card-icon" aria-hidden="true">☎</div>
          <div className="support-card-content">
            <h3>24/7 Customer Support</h3>
            <p className="support-languages">Hindi, Tamil, Kannada, Marathi support available</p>
            <a className="support-phone" href="tel:18002427282929">
            <span aria-hidden="true">📞</span>
            <span>8795456612</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© 2026 Bharat Yatra - Student Innovation Project</p>
          <p className="footer-made">🇮🇳 Made in India | For India | By India</p>
          <p className="footer-mission">Making Indian travel accessible to all Indians ✈️🌿</p>
        </div>
      </footer>


      {/* =================================================
          PROFILE OVERLAY / PROFILE DETAILS
          ================================================= */}

      {/* =================================================
          PROFILE OVERLAY
          ================================================= */}

      {profileOpen && (
        <div
          className="profile-overlay"
          onClick={() =>
            setProfileOpen(false)
          }
        ></div>
      )}


      {/* =================================================
          PROFILE SLIDE
          ================================================= */}

      <aside
        className={`profile-slide ${
          profileOpen
            ? "profile-slide-open"
            : ""
        }`}
      >

        <div className="profile-slide-header">

          <h2>
            My Profile
          </h2>

          <button
            className="profile-close"
            onClick={() =>
              setProfileOpen(false)
            }
          >
            ✕
          </button>

        </div>


        <div className="profile-info">

          <div className="profile-large-icon">

            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="profile-large-image"
              />
            ) : (
              "👤"
            )}

          </div>


          <h3>
            {user.fullName}
          </h3>

          <p>
            {user.email}
          </p>

        </div>


        {/* PROFILE MENU */}

        <div className="profile-menu">

          <button
            className="profile-menu-item"
            onClick={openProfileDetails}
          >
            👤
            <span>
              Profile Details
            </span>
          </button>


          <button
            className="profile-menu-item logout-item"
            onClick={handleLogout}
          >
            🚪
            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* =================================================
          PROFILE DETAILS
          ================================================= */}

      {profileDetailsOpen && (

        <div
          className="profile-details-overlay"
          onClick={closeProfileDetails}
        >

          <div
            className="profile-details-container"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="profile-details-header">

              <div>

                <h2>
                  Profile Details
                </h2>

                <p>
                  Manage your BharatYatra profile
                </p>

              </div>


              <button
                className="profile-details-close"
                onClick={closeProfileDetails}
              >
                ✕
              </button>

            </div>


            {/* PROFILE PICTURE */}

            <div className="profile-picture-section">

              <div className="profile-picture-wrapper">

                {profileImageUrl ? (

                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="profile-details-image"
                  />

                ) : (

                  <div className="profile-details-placeholder">
                    👤
                  </div>

                )}


                <label
                  className="profile-camera-button"
                  title="Change profile picture"
                >

                  📷

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleProfileImageChange
                    }
                    disabled={
                      uploadingImage
                    }
                    hidden
                  />

                </label>

              </div>


              <p className="profile-picture-text">

                {uploadingImage
                  ? "Uploading..."
                  : "Click the camera icon to change your picture"}

              </p>

            </div>


            {/* INFORMATION CARD */}

            <div className="profile-information-card">

              <div className="profile-information-card-header">

                <div>

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Your BharatYatra account information
                  </p>

                </div>


                {!editing && (

                  <button
                    className="edit-profile-button"
                    onClick={
                      handleEditProfile
                    }
                  >
                    ✏️ Edit
                  </button>

                )}

              </div>


              {/* VIEW MODE */}

              {!editing && (

                <div className="profile-information-fields">

                  <div className="profile-field">

                    <label>
                      Full Name
                    </label>

                    <div className="profile-field-value">
                      {user.fullName ||
                        "Not provided"}
                    </div>

                  </div>


                  <div className="profile-field">

                    <label>
                      Email Address
                    </label>

                    <div className="profile-field-value">
                      {user.email ||
                        "Not provided"}
                    </div>

                  </div>


                  <div className="profile-field">

                    <label>
                      Mobile Number
                    </label>

                    <div className="profile-field-value">
                      {user.mobile ||
                        "Not provided"}
                    </div>

                  </div>

                </div>

              )}


              {/* EDIT MODE */}

              {editing && (

                <div className="profile-edit-form">

                  <div className="profile-edit-field">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={
                        editForm.fullName
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter your full name"
                      disabled={saving}
                    />

                  </div>


                  <div className="profile-edit-field">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={
                        editForm.email
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter your email"
                      disabled={saving}
                    />

                  </div>


                  <div className="profile-edit-field">

                    <label>
                      Mobile Number
                    </label>

                    <input
                      type="tel"
                      name="mobile"
                      value={
                        editForm.mobile
                      }
                      onChange={
                        handleEditChange
                      }
                      placeholder="Enter your mobile number"
                      disabled={saving}
                    />

                  </div>


                  <div className="profile-edit-buttons">

                    <button
                      className="cancel-edit-button"
                      onClick={() =>
                        setEditing(false)
                      }
                      disabled={saving}
                    >
                      Cancel
                    </button>


                    <button
                      className="save-profile-button"
                      onClick={
                        handleSaveProfile
                      }
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : "Save Changes"}
                    </button>

                  </div>

                </div>

              )}

            </div>


            {/* DELETE */}

            <div className="profile-delete-section">

              <div>

                <h3>
                  🗑️ Delete Account
                </h3>

                <p>
                  Permanently delete your BharatYatra account.
                </p>

              </div>


              <button
                className="profile-delete-button"
                onClick={
                  openDeleteConfirmation
                }
              >
                Delete Account
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =================================================
          DELETE CONFIRMATION
          ================================================= */}

      {deleteConfirmOpen && (

        <div
          className="delete-confirm-overlay"
          onClick={
            closeDeleteConfirmation
          }
        >

          <div
            className="delete-confirm-container"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h3>
              Delete Account?
            </h3>

            <p>
              Are you sure you want to delete your account?
            </p>


            <div className="delete-confirm-buttons">

              <button
                className="delete-no-button"
                onClick={
                  closeDeleteConfirmation
                }
                disabled={deleting}
              >
                No
              </button>


              <button
                className="delete-yes-button"
                onClick={
                  handleDeleteAccount
                }
                disabled={deleting}
              >
                {deleting
                  ? "Deleting..."
                  : "Yes"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Dashboard;