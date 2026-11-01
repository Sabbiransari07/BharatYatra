import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
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
          onClick={() => interactive && onChange?.(star)}
          disabled={!interactive}
          aria-label={`${star} star`}
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const placeId = place?.id || place?.place_id || null;

  const placeName = useMemo(
    () => place?.name || "this place",
    [place]
  );

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
      console.error("Review loading error:", err);
      setError("Unable to load reviews right now.");
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
      setError("This place does not have a valid place ID.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    if (comment.trim().length < 2) {
      setError("Please write a short review.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await createReview({
        placeId,
        placeName,
        destination: placeName,
        rating,
        comment: comment.trim(),
      });

      setRating(0);
      setComment("");
      setMessage("Your review has been submitted successfully.");

      await loadReviews();
    } catch (err) {
      console.error("Review submission error:", err);

      setError(
        err?.message ||
          "Unable to submit your review."
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
            See what travellers say about {placeName}.
          </p>
        </div>

        <div className="reviews-summary">
          <strong>{averageRating}</strong>
          <Stars value={Math.round(Number(averageRating))} />
          <span>
            {reviews.length} review
            {reviews.length !== 1 ? "s" : ""}
          </span>
        </div>

      </div>

      {/* REVIEW FORM */}
      <div className="review-form-card">

        <h4>Share your experience</h4>

        {!user ? (
          <p className="review-login-message">
            Please login to write a review.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>

            <label>Your rating</label>

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
              maxLength={1000}
              rows={4}
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

        {message && (
          <div className="review-success">
            ✓ {message}
          </div>
        )}

        {error && (
          <div className="review-error">
            {error}
          </div>
        )}

      </div>

      {/* EXISTING REVIEWS */}
      <div className="reviews-list">

        <h4>Traveller reviews</h4>

        {loading ? (
          <div className="reviews-empty">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="reviews-empty">
            <span>💬</span>
            <strong>No reviews yet</strong>
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
                  value={Number(review.rating || 0)}
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