import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../../services/api.js";
import "../../styles/auth.css";

function Login() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
email: "",
password: "",
});

const [rememberMe, setRememberMe] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

// Handle input changes
const handleChange = (event) => {
const { name, value } = event.target;

```
setFormData((previous) => ({
  ...previous,
  [name]: value,
}));

setError("");
```

};

// Handle login
const handleSubmit = async (event) => {
event.preventDefault();
setError("");

```
if (!formData.email.trim() || !formData.password) {
  setError("Please enter your email and password.");
  return;
}

setLoading(true);

try {
  const data = await apiPost("/api/auth/login", {
    email: formData.email.trim(),
    password: formData.password,
  });

  // Validate authentication token
  if (!data.token) {
    throw new Error(
      "Authentication token was not received."
    );
  }

  // Save JWT token
  localStorage.setItem("token", data.token);

  // Save user information
  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );

    localStorage.setItem(
      "bharatYatraUser",
      JSON.stringify(data.user)
    );
  }

  // Remember me
  if (rememberMe) {
    localStorage.setItem("rememberMe", "true");
  } else {
    localStorage.removeItem("rememberMe");
  }

  // Navigate to dashboard
  navigate("/dashboard", {
    replace: true,
  });

} catch (error) {
  console.error("Login Error:", error);

  if (error.message === "Failed to fetch") {
    setError(
      "Unable to connect to BharatYatra server. Please try again."
    );
  } else {
    setError(error.message || "Unable to login.");
  }

} finally {
  setLoading(false);
}
```

};

// Google Login
const handleGoogleLogin = () => {
alert(
"Google login will be connected after Google Authentication setup."
);
};

// Apple Login
const handleAppleLogin = () => {
alert(
"Apple login will be connected after Apple Authentication setup."
);
};

return ( <div className="auth-page">

```
  {/* Background Overlay */}
  <div className="auth-background-overlay"></div>

  {/* TOP NAVIGATION */}
  <header className="auth-topbar">

    <button
      type="button"
      className="auth-brand"
      onClick={() => navigate("/")}
      aria-label="Go to BharatYatra home"
    >
      <span className="auth-brand-icon">🇮🇳</span>

      <span className="auth-brand-text">
        <strong>BharatYatra</strong>
        <small>Explore • Experience • India</small>
      </span>
    </button>

    <div className="auth-top-actions">
      <span className="auth-top-question">
        Don't have an account?
      </span>

      <Link
        to="/register"
        className="auth-top-register"
      >
        Register
      </Link>
    </div>

  </header>

  {/* LOGIN CONTENT */}
  <main className="auth-content">

    <section className="auth-card login-card">

      {/* CARD HEADER */}
      <div className="auth-card-header">

        <div className="auth-welcome-icon">
          ✦
        </div>

        <p className="auth-eyebrow">
          WELCOME BACK
        </p>

        <h1>
          Welcome to BharatYatra
        </h1>

        <p className="auth-description">
          Sign in to continue your journey
          across incredible India.
        </p>

      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div
          className="auth-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* LOGIN FORM */}
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        {/* EMAIL */}
        <div className="form-group">

          <label htmlFor="email">
            Email Address
          </label>

          <div className="input-wrapper">

            <span
              className="input-icon"
              aria-hidden="true"
            >
              ✉
            </span>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              disabled={loading}
            />

          </div>
        </div>

        {/* PASSWORD */}
        <div className="form-group">

          <label htmlFor="password">
            Password
          </label>

          <div className="input-wrapper">

            <span
              className="input-icon"
              aria-hidden="true"
            >
              🔒
            </span>

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword((previous) => !previous)
              }
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? "🙈" : "👁"}
            </button>

          </div>
        </div>

        {/* OPTIONS */}
        <div className="login-options">

          <label className="remember">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              disabled={loading}
            />

            <span>
              Remember me
            </span>

          </label>

          <button
            type="button"
            className="forgot-password"
            onClick={() =>
              navigate("/forgot-password")
            }
          >
            Forgot Password?
          </button>

        </div>

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}

          {!loading && (
            <span>→</span>
          )}
        </button>

      </form>

      {/* DIVIDER */}
      <div className="divider">
        <span></span>
        <p>OR CONTINUE WITH</p>
        <span></span>
      </div>

      {/* SOCIAL LOGIN */}
      <div className="social-buttons">

        <button
          type="button"
          className="social-button"
          onClick={handleGoogleLogin}
        >
          <span className="google-icon">
            G
          </span>

          <span>
            Continue with Google
          </span>
        </button>

        <button
          type="button"
          className="social-button"
          onClick={handleAppleLogin}
        >
          <span className="apple-icon">
            
          </span>

          <span>
            Continue with Apple
          </span>
        </button>

      </div>

      {/* REGISTER LINK */}
      <div className="register-link">

        <span>
          New to BharatYatra?
        </span>

        <Link to="/register">
          Create an account
        </Link>

      </div>

      {/* BACK HOME */}
      <button
        type="button"
        className="back-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Explore India
      </button>

    </section>

  </main>

  {/* FOOTER */}
  <footer className="auth-footer">
    TRAVEL • EXPLORE • EXPERIENCE • REPEAT
  </footer>

</div>


);
}

export default Login;
