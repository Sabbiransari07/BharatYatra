import Review from "../models/Review.js";

/*
 * Create a new review
 */
export const createReview = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      placeId,
      placeName,
      destination,
      tripId,
      rating,
      comment,
    } = req.body;

    const numericRating = Number(rating);

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const cleanComment = String(comment || "").trim();

    if (!cleanComment) {
      return res.status(400).json({
        success: false,
        message: "Review comment is required.",
      });
    }

    if (cleanComment.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Review cannot exceed 1000 characters.",
      });
    }

    if (!placeId && !tripId) {
      return res.status(400).json({
        success: false,
        message: "Review must belong to a place or trip.",
      });
    }

    /*
     * Prevent duplicate place review.
     */
    if (placeId) {
      const existingReview = await Review.findOne({
        user: userId,
        placeId,
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message:
            "You have already reviewed this place. You can edit your existing review.",
          review: existingReview,
        });
      }
    }

    /*
     * Prevent duplicate trip review.
     */
    if (tripId) {
      const existingReview = await Review.findOne({
        user: userId,
        tripId,
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          message:
            "You have already reviewed this trip. You can edit your existing review.",
          review: existingReview,
        });
      }
    }

    const review = await Review.create({
      user: userId,
      placeId: placeId || null,
      placeName: placeName || null,
      destination: destination || null,
      tripId: tripId || null,
      rating: numericRating,
      comment: cleanComment,
    });

    const populatedReview = await Review.findById(
      review._id
    ).populate(
      "user",
      "fullName profileImage"
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Create Review Error:",
      error.message
    );

    /*
     * MongoDB duplicate-key protection.
     */
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You have already submitted a review for this item.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
};


/*
 * Get reviews for a place
 */
export const getPlaceReviews = async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!placeId) {
      return res.status(400).json({
        success: false,
        message: "Place ID is required.",
      });
    }

    const reviews = await Review.find({
      placeId,
    })
      .populate(
        "user",
        "fullName profileImage"
      )
      .sort({ createdAt: -1 });

    const total = reviews.length;

    const average =
      total > 0
        ? Number(
            (
              reviews.reduce(
                (sum, review) =>
                  sum + Number(review.rating),
                0
              ) / total
            ).toFixed(1)
          )
        : 0;

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    reviews.forEach((review) => {
      const rating = Number(review.rating);

      if (distribution[rating] !== undefined) {
        distribution[rating]++;
      }
    });

    return res.json({
      success: true,
      count: total,
      averageRating: average,
      distribution,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get Place Reviews Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
      reviews: [],
    });
  }
};


/*
 * Get reviews for a trip
 */
export const getTripReviews = async (req, res) => {
  try {
    const { tripId } = req.params;

    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: "Trip ID is required.",
      });
    }

    const reviews = await Review.find({
      tripId,
    })
      .populate(
        "user",
        "fullName profileImage"
      )
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get Trip Reviews Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load trip reviews.",
      reviews: [],
    });
  }
};


/*
 * Get logged-in user's reviews
 */
export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const reviews = await Review.find({
      user: userId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get My Reviews Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load your reviews.",
      reviews: [],
    });
  }
};


/*
 * Update user's review
 */
export const updateReview = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const {
      rating,
      comment,
    } = req.body;

    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        !Number.isFinite(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Rating must be between 1 and 5.",
        });
      }

      review.rating = numericRating;
    }

    if (comment !== undefined) {
      const cleanComment =
        String(comment).trim();

      if (!cleanComment) {
        return res.status(400).json({
          success: false,
          message:
            "Review comment cannot be empty.",
        });
      }

      if (cleanComment.length > 1000) {
        return res.status(400).json({
          success: false,
          message:
            "Review cannot exceed 1000 characters.",
        });
      }

      review.comment = cleanComment;
    }

    await review.save();

    const populatedReview =
      await Review.findById(
        review._id
      ).populate(
        "user",
        "fullName profileImage"
      );

    return res.json({
      success: true,
      message: "Review updated successfully.",
      review: populatedReview,
    });
  } catch (error) {
    console.error(
      "Update Review Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update review.",
    });
  }
};


/*
 * Delete user's review
 */
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const review =
      await Review.findOneAndDelete({
        _id: reviewId,
        user: userId,
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    return res.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Review Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete review.",
    });
  }
};