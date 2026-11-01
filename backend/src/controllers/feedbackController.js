import WebsiteFeedback from "../models/WebsiteFeedback.js";

/*
 * Create website feedback
 */
export const createFeedback = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      rating,
      message,
      category = "general",
      page = null,
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

    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required.",
      });
    }

    if (cleanMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Feedback cannot exceed 2000 characters.",
      });
    }

    const allowedCategories = [
      "general",
      "ui",
      "performance",
      "search",
      "maps",
      "chatbot",
      "booking",
      "other",
    ];

    const cleanCategory = allowedCategories.includes(category)
      ? category
      : "general";

    const feedback = await WebsiteFeedback.create({
      user: userId,
      rating: numericRating,
      message: cleanMessage,
      category: cleanCategory,
      page: page ? String(page).trim() : null,
    });

    const populatedFeedback = await WebsiteFeedback.findById(
      feedback._id
    ).populate(
      "user",
      "fullName profileImage"
    );

    return res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been submitted.",
      feedback: populatedFeedback,
    });
  } catch (error) {
    console.error(
      "Create Feedback Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to submit feedback.",
    });
  }
};


/*
 * Get logged-in user's feedback
 */
export const getMyFeedback = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const feedback = await WebsiteFeedback.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      count: feedback.length,
      feedback,
    });
  } catch (error) {
    console.error(
      "Get My Feedback Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load your feedback.",
      feedback: [],
    });
  }
};


/*
 * Get a specific feedback
 */
export const getFeedbackById = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { feedbackId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const feedback = await WebsiteFeedback.findOne({
      _id: feedbackId,
      user: userId,
    }).populate(
      "user",
      "fullName profileImage"
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error(
      "Get Feedback Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load feedback.",
    });
  }
};


/*
 * Update user's feedback
 */
export const updateFeedback = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { feedbackId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const feedback = await WebsiteFeedback.findOne({
      _id: feedbackId,
      user: userId,
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    const {
      rating,
      message,
      category,
      page,
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
          message: "Rating must be between 1 and 5.",
        });
      }

      feedback.rating = numericRating;
    }

    if (message !== undefined) {
      const cleanMessage =
        String(message).trim();

      if (!cleanMessage) {
        return res.status(400).json({
          success: false,
          message:
            "Feedback message cannot be empty.",
        });
      }

      if (cleanMessage.length > 2000) {
        return res.status(400).json({
          success: false,
          message:
            "Feedback cannot exceed 2000 characters.",
        });
      }

      feedback.message = cleanMessage;
    }

    if (category !== undefined) {
      const allowedCategories = [
        "general",
        "ui",
        "performance",
        "search",
        "maps",
        "chatbot",
        "booking",
        "other",
      ];

      if (
        allowedCategories.includes(category)
      ) {
        feedback.category = category;
      }
    }

    if (page !== undefined) {
      feedback.page = page
        ? String(page).trim()
        : null;
    }

    await feedback.save();

    const populatedFeedback =
      await WebsiteFeedback.findById(
        feedback._id
      ).populate(
        "user",
        "fullName profileImage"
      );

    return res.json({
      success: true,
      message:
        "Feedback updated successfully.",
      feedback: populatedFeedback,
    });
  } catch (error) {
    console.error(
      "Update Feedback Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update feedback.",
    });
  }
};


/*
 * Delete user's feedback
 */
export const deleteFeedback = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { feedbackId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const feedback =
      await WebsiteFeedback.findOneAndDelete({
        _id: feedbackId,
        user: userId,
      });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Feedback Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete feedback.",
    });
  }
};