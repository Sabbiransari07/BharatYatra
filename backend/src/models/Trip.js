import mongoose from "mongoose";

const itineraryItemSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
    },

    date: {
      type: Date,
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    placeId: {
      type: String,
      default: null,
      trim: true,
    },

    placeName: {
      type: String,
      default: null,
      trim: true,
    },

    category: {
      type: String,
      default: null,
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    _id: true,
  }
);

const budgetSchema = new mongoose.Schema(
  {
    days: {
      type: Number,
      default: 1,
      min: 1,
    },

    travellers: {
      type: Number,
      default: 1,
      min: 1,
    },

    stay: {
      type: Number,
      default: 0,
      min: 0,
    },

    food: {
      type: Number,
      default: 0,
      min: 0,
    },

    transport: {
      type: Number,
      default: 0,
      min: 0,
    },

    activities: {
      type: Number,
      default: 0,
      min: 0,
    },

    stayTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    foodTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    transportTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    activitiesTotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    state: {
      type: String,
      default: null,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },

    endDate: {
      type: Date,
      default: null,
    },

    days: {
      type: Number,
      default: 1,
      min: 1,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "planned",
        "ongoing",
        "completed",
        "cancelled",
      ],
      default: "draft",
    },

    itinerary: {
      type: [itineraryItemSchema],
      default: [],
    },

    budget: {
      type: budgetSchema,
      default: () => ({}),
    },

    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.index({
  user: 1,
  createdAt: -1,
});

tripSchema.index({
  user: 1,
  status: 1,
});

const Trip = mongoose.model(
  "Trip",
  tripSchema
);

export default Trip;