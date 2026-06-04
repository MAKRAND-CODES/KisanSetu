import mongoose from "mongoose";

const farmSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmName: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      required: true,
    },

    village: {
      type: String,
      required: true,
    },

    soilType: {
      type: String,
      enum: ["black", "red", "alluvial", "sandy", "clay", "loamy", "other"],
      required: true,
    },

    currentCrop: {
      type: String,
      default: "",
    },

    season: {
      type: String,
      enum: ["kharif", "rabi", "zaid", "none"],
      default: "none",
    },

    area: {
      type: Number,
      required: true,
    },

    areaUnit: {
      type: String,
      enum: ["acre", "hectare", "bigha"],
      default: "acre",
    },

    coordinates: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
    },

    irrigationType: {
      type: String,
      enum: ["rainfed", "canal", "borewell", "drip", "sprinkler", "other"],
      default: "rainfed",
    },
  },
  { timestamps: true }
);

const Farm = mongoose.model("Farm", farmSchema);

export default Farm;