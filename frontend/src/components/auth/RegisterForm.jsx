import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Account created successfully!");

      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-heading">
        <h2>Create Your Account ✨</h2>

        <p>
          Join BharatYatra and start your journey
        </p>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Error Message */}
        {error && (
          <div
            style={{
              color: "#d32f2f",
              background: "#ffebee",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>

          <div className="input-wrapper">
            <span className="input-icon">👤</span>

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>

          <div className="input-wrapper">
            <span className="input-icon">✉</span>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>
        </div>

        {/* Mobile Optional */}
        <div className="form-group">
          <label>
            Mobile Number <span>(Optional)</span>
          </label>

          <div className="input-wrapper">
            <span className="input-icon">📱</span>

            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>

          <div className="input-wrapper">
            <span className="input-icon">🔒</span>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>

          <div className="input-wrapper">
            <span className="input-icon">🔒</span>

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="terms">
          <input type="checkbox" required />

          <span>
            I agree to the{" "}
            <button type="button">Terms & Conditions</button>
            {" "}and{" "}
            <button type="button">Privacy Policy</button>
          </span>
        </label>

        {/* Create Account */}
        <button
          type="submit"
          className="login-button"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Account"}
          {!loading && <span>→</span>}
        </button>

        {/* Divider */}
        <div className="divider">
          <span></span>
          <p>OR</p>
          <span></span>
        </div>

        {/* Social */}
        <div className="social-buttons">
          <button type="button" className="social-button">
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <button type="button" className="social-button">
            <span className="apple-icon">●</span>
            Continue with Apple
          </button>
        </div>

        {/* Login */}
        <div className="register-link">
          <span>Already have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

      </form>
    </div>
  );
}

export default RegisterForm;