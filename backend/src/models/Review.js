import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // External tourism provider ka place ID
    placeId: {
      type: String,
      default: null,
      trim: true,
    },

    placeName: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200,
    },

    destination: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200,
    },

    // Optional: review can also belong to a saved trip
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * One user can review a particular place only once.
 * They can edit that review later.
 */
reviewSchema.index(
  { user: 1, placeId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      placeId: { $type: "string" },
    },
  }
);

/*
 * One user can review a particular trip only once.
 */
reviewSchema.index(
  { user: 1, tripId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      tripId: { $type: "objectId" },
    },
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;