import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  // =========================================
  // LOGIN
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        '${import.meta.env.VITE_API_URL}/api/auth/login',
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password"
        );
      }


      // Save JWT token
      localStorage.setItem(
        "token",
        data.token
      );


      // Save user data
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }


      // Remember me
      if (rememberMe) {
        localStorage.setItem(
          "rememberMe",
          "true"
        );
      } else {
        localStorage.removeItem(
          "rememberMe"
        );
      }


      // Go to dashboard
      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {

      console.error(
        "Login Error:",
        error
      );


      if (
        error.message ===
        "Failed to fetch"
      ) {
        setError(
          "Unable to connect to server. Please start the backend."
        );
      } else {
        setError(
          error.message ||
            "Unable to login"
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =========================================
  // GOOGLE LOGIN
  // =========================================

  const handleGoogleLogin = () => {
    alert(
      "Google Login will be connected soon."
    );
  };


  // =========================================
  // APPLE LOGIN
  // =========================================

  const handleAppleLogin = () => {
    alert(
      "Apple Login will be connected soon."
    );
  };


  return (
    <div className="login-form-wrapper">

      {/* =====================================
          HEADING
          ===================================== */}

      <div className="login-heading">

        <h2>
          Welcome Back 👋
        </h2>

        <p>
          Login to continue your BharatYatra journey
        </p>

      </div>


      <form onSubmit={handleSubmit}>

        {/* =====================================
            EMAIL
            ===================================== */}

        <div className="form-group">

          <label>
            Email Address
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              ✉
            </span>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="email"
            />

          </div>

        </div>


        {/* =====================================
            PASSWORD
            ===================================== */}

        <div className="form-group">

          <label>
            Password
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              🔒
            </span>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              disabled={loading}
            >
              {showPassword
                ? "🙈"
                : "👁"}
            </button>

          </div>

        </div>


        {/* =====================================
            OPTIONS
            ===================================== */}

        <div className="login-options">

          <label className="remember">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(
                  e.target.checked
                )
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
              navigate(
                "/forgot-password"
              )
            }
            disabled={loading}
          >
            Forgot password?
          </button>

        </div>


        {/* =====================================
            ERROR MESSAGE
            ===================================== */}

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}


        {/* =====================================
            LOGIN
            ===================================== */}

        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >

          {loading
            ? "Logging in..."
            : "Login"}

          {!loading && (
            <span>
              →
            </span>
          )}

        </button>


        {/* =====================================
            DIVIDER
            ===================================== */}

        <div className="divider">

          <span></span>

          <p>
            OR
          </p>

          <span></span>

        </div>


        {/* =====================================
            SOCIAL LOGIN
            ===================================== */}

        <div className="social-buttons">

          <button
            type="button"
            className="social-button"
            onClick={
              handleGoogleLogin
            }
            disabled={loading}
          >

            <span className="google-icon">
              G
            </span>

            Continue with Google

          </button>


          <button
            type="button"
            className="social-button"
            onClick={
              handleAppleLogin
            }
            disabled={loading}
          >

            <span className="apple-icon">
              ●
            </span>

            Continue with Apple

          </button>

        </div>


        {/* =====================================
            REGISTER
            ===================================== */}

        <div className="register-link">

          <span>
            Don't have an account?{" "}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Register now
          </button>

        </div>

      </form>

    </div>
  );
}

export default LoginForm;