import mongoose from "mongoose";

const cropRecommendationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    district: {
      type: String,
      default: "",
    },

    soilType: {
      type: String,
      required: true,
    },

    season: {
      type: String,
      required: true,
    },

    waterAvailability: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    recommendations: [
      {
        crop: String,
        score: Number,
        suitability: String,
        reasons: [String],
        tips: [String],
      },
    ],
  },
  { timestamps: true }
);

const CropRecommendation = mongoose.model(
  "CropRecommendation",
  cropRecommendationSchema
);

export default CropRecommendation;