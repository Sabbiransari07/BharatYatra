import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createReview,
  getPlaceReviews,
} from "../../services/reviewService";

function Stars({ value = 0, interactive = false, onChange }) {
  return (
    <div className="review-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "star active" : "star"}
          onClick={() => {
            if (interactive && onChange) {
              onChange(star);
            }
          }}
          disabled={!interactive}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewsSection({ place }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const placeId = place?.id || null;
  const placeName = place?.name || "this place";

  async function loadReviews() {
    if (!placeId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getPlaceReviews(placeId);

      setReviews(
        Array.isArray(response?.reviews)
          ? response.reviews
          : Array.isArray(response)
          ? response
          : []
      );
    } catch (err) {
      console.error("Load reviews error:", err);
      setError("Unable to load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
  }, [placeId]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      setError("Please login to write a review.");
      return;
    }

    if (!placeId) {
      setError("This place does not have a valid ID.");
      return;
    }

    if (rating < 1) {
      setError("Please select a rating.");
      return;
    }

    if (comment.trim().length < 2) {
      setError("Please write a review.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createReview({
        placeId,
        placeName,
        destination: placeName,
        rating,
        comment: comment.trim(),
      });

      setRating(0);
      setComment("");

      setSuccess("Review submitted successfully.");

      await loadReviews();
    } catch (err) {
      console.error("Submit review error:", err);

      setError(
        err?.message || "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="reviews-section">

      {/* HEADER */}
      <div className="reviews-header">

        <div>
          <h3>⭐ Reviews & Ratings</h3>

          <p>
            Traveller reviews for {placeName}
          </p>
        </div>

        <div className="reviews-summary">

          <strong>
            {averageRating}
          </strong>

          <Stars
            value={Math.round(
              Number(averageRating)
            )}
          />

          <span>
            {reviews.length} review
            {reviews.length !== 1 ? "s" : ""}
          </span>

        </div>

      </div>

      {/* FORM */}
      <div className="review-form-card">

        <h4>
          Share your experience
        </h4>

        {!user ? (
          <p className="review-login-message">
            Please login to write a review.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>

            <label>
              Your rating
            </label>

            <Stars
              value={rating}
              interactive
              onChange={setRating}
            />

            <label htmlFor="review-comment">
              Your review
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              placeholder={`How was your experience at ${placeName}?`}
              rows={4}
              maxLength={1000}
            />

            <div className="review-form-footer">

              <span>
                {comment.length}/1000
              </span>

              <button
                type="submit"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </div>

          </form>
        )}

        {success && (
          <div className="review-success">
            ✓ {success}
          </div>
        )}

        {error && (
          <div className="review-error">
            {error}
          </div>
        )}

      </div>

      {/* REVIEW LIST */}
      <div className="reviews-list">

        <h4>
          Traveller reviews
        </h4>

        {loading ? (
          <div className="reviews-empty">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">

            <span>💬</span>

            <strong>
              No reviews yet
            </strong>

            <p>
              Be the first traveller to review this place.
            </p>

          </div>
        ) : (
          reviews.map((review) => (

            <div
              className="review-item"
              key={review._id || review.id}
            >

              <div className="review-item-top">

                <div className="review-user">

                  <div className="review-avatar">
                    {(
                      review.user?.fullName ||
                      "T"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>
                      {review.user?.fullName ||
                        "Traveller"}
                    </strong>

                    <small>
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </small>

                  </div>

                </div>

                <Stars
                  value={Number(
                    review.rating || 0
                  )}
                />

              </div>

              <p className="review-comment">
                {review.comment}
              </p>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default ReviewsSection;