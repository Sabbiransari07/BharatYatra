import mongoose from "mongoose";

const websiteFeedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 2000,
    },

    category: {
      type: String,
      enum: [
        "general",
        "ui",
        "performance",
        "search",
        "maps",
        "chatbot",
        "booking",
        "other",
      ],
      default: "general",
    },

    page: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200,
    },

    status: {
      type: String,
      enum: [
        "new",
        "reviewed",
        "resolved",
      ],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const WebsiteFeedback = mongoose.model(
  "WebsiteFeedback",
  websiteFeedbackSchema
);

export default WebsiteFeedback;