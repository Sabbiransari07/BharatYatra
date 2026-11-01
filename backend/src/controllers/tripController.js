import mongoose from "mongoose";
import Trip from "../models/Trip.js";

const getUserId = (req) =>
  req.user?.id || req.user?._id;

/*
 * Create Trip
 */
export const createTrip = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const {
      title,
      destination,
      state,
      country,
      latitude,
      longitude,
      startDate,
      endDate,
      days,
      status,
      notes,
      itinerary,
      budget,
    } = req.body;

    if (!destination) {
      return res.status(400).json({
        success: false,
        message: "Trip destination is required.",
      });
    }

    const cleanTitle =
      String(title || `${destination} Trip`).trim();

    if (!cleanTitle) {
      return res.status(400).json({
        success: false,
        message: "Trip title is required.",
      });
    }

    const trip = await Trip.create({
      user: userId,
      title: cleanTitle,
      destination: String(destination).trim(),
      state: state || null,
      country: country || "India",
      latitude:
        Number.isFinite(Number(latitude))
          ? Number(latitude)
          : null,
      longitude:
        Number.isFinite(Number(longitude))
          ? Number(longitude)
          : null,
      startDate: startDate || null,
      endDate: endDate || null,
      days: Math.max(1, Number(days) || 1),
      status: status || "draft",
      notes: notes || "",
      itinerary: Array.isArray(itinerary)
        ? itinerary
        : [],
      budget:
        budget && typeof budget === "object"
          ? budget
          : {},
    });

    return res.status(201).json({
      success: true,
      message: "Trip created successfully.",
      trip,
    });
  } catch (error) {
    console.error(
      "Create Trip Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create trip.",
    });
  }
};


/*
 * Get all user's trips
 */
export const getTrips = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const trips = await Trip.find({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    return res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (error) {
    console.error(
      "Get Trips Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load trips.",
      trips: [],
    });
  }
};


/*
 * Get single trip
 */
export const getTripById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(tripId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const trip = await Trip.findOne({
      _id: tripId,
      user: userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    return res.json({
      success: true,
      trip,
    });
  } catch (error) {
    console.error(
      "Get Trip Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load trip.",
    });
  }
};


/*
 * Update Trip
 */
export const updateTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(tripId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const allowedFields = [
      "title",
      "destination",
      "state",
      "country",
      "latitude",
      "longitude",
      "startDate",
      "endDate",
      "days",
      "status",
      "notes",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.title !== undefined) {
      updates.title =
        String(updates.title).trim();

      if (!updates.title) {
        return res.status(400).json({
          success: false,
          message: "Trip title cannot be empty.",
        });
      }
    }

    if (updates.destination !== undefined) {
      updates.destination =
        String(updates.destination).trim();

      if (!updates.destination) {
        return res.status(400).json({
          success: false,
          message:
            "Trip destination cannot be empty.",
        });
      }
    }

    if (updates.days !== undefined) {
      updates.days = Math.max(
        1,
        Number(updates.days) || 1
      );
    }

    const trip =
      await Trip.findOneAndUpdate(
        {
          _id: tripId,
          user: userId,
        },
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    return res.json({
      success: true,
      message: "Trip updated successfully.",
      trip,
    });
  } catch (error) {
    console.error(
      "Update Trip Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to update trip.",
    });
  }
};


/*
 * Delete Trip
 */
export const deleteTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(tripId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip ID.",
      });
    }

    const trip =
      await Trip.findOneAndDelete({
        _id: tripId,
        user: userId,
      });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    return res.json({
      success: true,
      message: "Trip deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Trip Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete trip.",
    });
  }
};


/*
 * Add itinerary item
 */
export const addItineraryItem = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const trip = await Trip.findOne({
      _id: tripId,
      user: userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const {
      day,
      date,
      title,
      description,
      placeId,
      placeName,
      category,
      latitude,
      longitude,
      estimatedCost,
      notes,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message:
          "Itinerary item title is required.",
      });
    }

    trip.itinerary.push({
      day: Math.max(1, Number(day) || 1),
      date: date || null,
      title: String(title).trim(),
      description: description || "",
      placeId: placeId || null,
      placeName: placeName || null,
      category: category || null,
      latitude:
        Number.isFinite(Number(latitude))
          ? Number(latitude)
          : null,
      longitude:
        Number.isFinite(Number(longitude))
          ? Number(longitude)
          : null,
      estimatedCost:
        Math.max(
          0,
          Number(estimatedCost) || 0
        ),
      notes: notes || "",
    });

    await trip.save();

    return res.status(201).json({
      success: true,
      message:
        "Itinerary item added successfully.",
      trip,
    });
  } catch (error) {
    console.error(
      "Add Itinerary Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to add itinerary item.",
    });
  }
};


/*
 * Update itinerary item
 */
export const updateItineraryItem = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const {
      tripId,
      itemId,
    } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      user: userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const item =
      trip.itinerary.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Itinerary item not found.",
      });
    }

    const fields = [
      "day",
      "date",
      "title",
      "description",
      "placeId",
      "placeName",
      "category",
      "latitude",
      "longitude",
      "estimatedCost",
      "notes",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await trip.save();

    return res.json({
      success: true,
      message:
        "Itinerary item updated successfully.",
      trip,
    });
  } catch (error) {
    console.error(
      "Update Itinerary Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update itinerary item.",
    });
  }
};


/*
 * Delete itinerary item
 */
export const deleteItineraryItem = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const {
      tripId,
      itemId,
    } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      user: userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const item =
      trip.itinerary.id(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message:
          "Itinerary item not found.",
      });
    }

    item.deleteOne();

    await trip.save();

    return res.json({
      success: true,
      message:
        "Itinerary item deleted successfully.",
      trip,
    });
  } catch (error) {
    console.error(
      "Delete Itinerary Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to delete itinerary item.",
    });
  }
};


/*
 * Save trip budget
 */
export const saveTripBudget = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      user: userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    const budget = req.body;

    if (
      !budget ||
      typeof budget !== "object"
    ) {
      return res.status(400).json({
        success: false,
        message: "Budget data is required.",
      });
    }

    trip.budget = {
      ...trip.budget.toObject(),
      ...budget,
    };

    await trip.save();

    return res.json({
      success: true,
      message:
        "Trip budget saved successfully.",
      budget: trip.budget,
      trip,
    });
  } catch (error) {
    console.error(
      "Save Trip Budget Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to save trip budget.",
    });
  }
};


/*
 * Get trip budget
 */
export const getTripBudget = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    const trip = await Trip.findOne({
      _id: tripId,
      user: userId,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    return res.json({
      success: true,
      budget: trip.budget,
    });
  } catch (error) {
    console.error(
      "Get Trip Budget Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load trip budget.",
    });
  }
};


/*
 * Mark trip as completed
 */
export const completeTrip = async (
  req,
  res
) => {
  try {
    const userId = getUserId(req);
    const { tripId } = req.params;

    const trip =
      await Trip.findOneAndUpdate(
        {
          _id: tripId,
          user: userId,
        },
        {
          status: "completed",
        },
        {
          new: true,
        }
      );

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    return res.json({
      success: true,
      message:
        "Trip marked as completed.",
      trip,
    });
  } catch (error) {
    console.error(
      "Complete Trip Error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to complete trip.",
    });
  }
};