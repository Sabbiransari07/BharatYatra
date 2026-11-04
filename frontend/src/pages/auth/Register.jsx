import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError(
        "Please fill all required fields."
      );
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    if (!acceptTerms) {
      setError(
        "Please accept the Terms & Conditions."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName:
              formData.fullName.trim(),

            email:
              formData.email.trim(),

            mobile:
              formData.mobile.trim(),

            password:
              formData.password,

            confirmPassword:
              formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create account."
        );
      }

      alert(
        "Account created successfully! Please login."
      );

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      if (error.message === "Failed to fetch") {
        setError(
          "Unable to connect to server. Please start the backend."
        );
      } else {
        setError(
          error.message ||
            "Unable to create account."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    alert(
      "Google registration will be connected after Google Authentication setup."
    );
  };

  const handleAppleRegister = () => {
    alert(
      "Apple registration will be connected after Apple Authentication setup."
    );
  };

  return (
    <div className="auth-page register-page">

      {/* BACKGROUND OVERLAY */}
      <div className="auth-background-overlay"></div>

      {/* TOP NAVIGATION */}
      <header className="auth-topbar">

        <button
          type="button"
          className="auth-brand"
          onClick={() => navigate("/")}
          aria-label="Go to BharatYatra home"
        >
          <span className="auth-brand-icon">
            🇮🇳
          </span>

          <span className="auth-brand-text">
            <strong>BharatYatra</strong>

            <small>
              Explore • Experience • India
            </small>
          </span>
        </button>

        <div className="auth-top-actions">

          <span className="auth-top-question">
            Already have an account?
          </span>

          <Link
            to="/login"
            className="auth-top-register"
          >
            Login
          </Link>

        </div>

      </header>

      {/* REGISTER CONTENT */}
      <main className="auth-content">

        <section className="auth-card register-card">

          {/* HEADER */}
          <div className="auth-card-header">

            <div className="auth-welcome-icon">
              ✦
            </div>

            <p className="auth-eyebrow">
              START YOUR JOURNEY
            </p>

            <h1>
              Create your account
            </h1>

            <p className="auth-description">
              Join BharatYatra and discover
              incredible India.
            </p>

          </div>

          {/* ERROR */}
          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* REGISTER FORM */}
          <form
            className="auth-form register-form"
            onSubmit={handleSubmit}
          >

            {/* FULL NAME */}
            <div className="form-group">

              <label htmlFor="fullName">
                Full Name
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  👤
                </span>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={loading}
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="form-group">

              <label htmlFor="register-email">
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
                  id="register-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>

            {/* MOBILE */}
            <div className="form-group">

              <label htmlFor="mobile">
                Mobile Number
                <span className="optional">
                  Optional
                </span>
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  📱
                </span>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  autoComplete="tel"
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="form-group">

              <label htmlFor="register-password">
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
                  id="register-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}
            <div className="form-group">

              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  🔐
                </span>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>

            {/* TERMS */}
            <label className="terms-checkbox">

              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(event) =>
                  setAcceptTerms(
                    event.target.checked
                  )
                }
                disabled={loading}
              />

              <span>
                I agree to the{" "}
                <button
                  type="button"
                  className="terms-link"
                  onClick={(event) =>
                    event.preventDefault()
                  }
                >
                  Terms & Conditions
                </button>
                {" "}and Privacy Policy.
              </span>

            </label>

            {/* CREATE ACCOUNT */}
            <button
              type="submit"
              className="login-button register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}

              {!loading && (
                <span>→</span>
              )}
            </button>

          </form>

          {/* DIVIDER */}
          <div className="divider">

            <span></span>

            <p>
              OR CONTINUE WITH
            </p>

            <span></span>

          </div>

          {/* SOCIAL */}
          <div className="social-buttons">

            <button
              type="button"
              className="social-button"
              onClick={handleGoogleRegister}
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
              onClick={handleAppleRegister}
            >
              <span className="apple-icon">
                
              </span>

              <span>
                Continue with Apple
              </span>
            </button>

          </div>

          {/* LOGIN */}
          <div className="register-link">

            <span>
              Already registered?
            </span>

            <Link to="/login">
              Login here
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

export default Register;