import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { submitFeedback } from "../../services/feedbackService";

const categories = [
  ["general", "General"],
  ["ui", "Website UI"],
  ["performance", "Performance"],
  ["search", "Search"],
  ["maps", "Maps"],
  ["chatbot", "AI Chatbot"],
  ["booking", "Booking"],
  ["other", "Other"],
];

function WebsiteFeedback() {
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setError("Please login to submit feedback.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (message.trim().length < 2) {
      setError("Please enter your feedback.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await submitFeedback({
        rating,
        category,
        message: message.trim(),
        page: window.location.pathname,
      });

      setRating(0);
      setCategory("general");
      setMessage("");

      setSuccess(
        "Thank you! Your feedback has been submitted."
      );
    } catch (err) {
      console.error("Feedback error:", err);

      setError(
        err?.message ||
          "Unable to submit feedback."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="website-feedback">

      <div className="feedback-header">
        <div>
          <span className="feedback-label">
            YOUR VOICE MATTERS
          </span>

          <h3>💬 Help us improve BharatYatra</h3>

          <p>
            Tell us what you like and what we can
            improve in your travel experience.
          </p>
        </div>
      </div>

      {!user ? (
        <div className="feedback-login">
          🔐 Please login to submit website feedback.
        </div>
      ) : (
        <form
          className="feedback-form"
          onSubmit={handleSubmit}
        >

          <div className="feedback-rating">

            <label>How would you rate BharatYatra?</label>

            <div className="feedback-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={
                    star <= rating
                      ? "feedback-star active"
                      : "feedback-star"
                  }
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
            </div>

          </div>

          <div className="feedback-field">

            <label htmlFor="feedback-category">
              Feedback category
            </label>

            <select
              id="feedback-category"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
            >
              {categories.map(
                ([value, label]) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                )
              )}
            </select>

          </div>

          <div className="feedback-field">

            <label htmlFor="website-feedback">
              Your feedback
            </label>

            <textarea
              id="website-feedback"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              placeholder="Tell us about your experience..."
              maxLength={2000}
              rows={5}
            />

            <small>
              {message.length}/2000
            </small>

          </div>

          <button
            type="submit"
            className="feedback-submit"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Send Feedback"}
          </button>

        </form>
      )}

      {success && (
        <div className="feedback-success">
          ✓ {success}
        </div>
      )}

      {error && (
        <div className="feedback-error">
          {error}
        </div>
      )}

    </div>
  );
}

export default WebsiteFeedback;