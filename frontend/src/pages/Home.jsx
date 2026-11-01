import { Link } from "react-router-dom";
import "../styles/auth.css";

function Home() {
  return (
    <div className="landing-page">

      {/* BACKGROUND */}
      <div className="landing-overlay"></div>

      {/* TOP NAVBAR */}
      <header className="auth-topbar">

        <Link
          to="/"
          className="auth-brand"
          style={{
            textDecoration: "none",
          }}
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
        </Link>

        <div className="auth-top-actions">

          <Link
            to="/login"
            className="auth-top-register"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="auth-top-register"
          >
            Register
          </Link>

        </div>

      </header>


      {/* HERO */}
      <main className="landing-content">

        <section className="landing-copy">

          <div className="landing-eyebrow">
            ✦ INDIA IS WAITING FOR YOU
          </div>

          <h1 className="landing-title">
            Discover
            <span>Incredible India</span>
          </h1>

          <p className="landing-description">
            Explore beautiful destinations, discover
            hidden places, experience local culture,
            plan your perfect trip and create
            unforgettable memories across India.
          </p>

          <div className="landing-actions">

            <Link
              to="/login"
              className="landing-primary-button"
            >
              Start Exploring →
            </Link>

            <Link
              to="/register"
              className="landing-secondary-button"
            >
              Create Account
            </Link>

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="auth-footer">
        TRAVEL • EXPLORE • EXPERIENCE • REPEAT
      </footer>

    </div>
  );
}

export default Home;