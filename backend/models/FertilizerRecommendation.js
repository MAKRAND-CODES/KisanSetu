import mongoose from "mongoose";

const fertilizerRecommendationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cropName: {
      type: String,
      required: true,
    },

    soilType: {
      type: String,
      required: true,
    },

    growthStage: {
      type: String,
      required: true,
    },

    recommendation: {
      cropName: String,
      suitabilityScore: Number,
      npk: String,
      fertilizers: [String],
      tips: [String],
      warnings: [String],
      reasons: [String],
    },
  },
  { timestamps: true }
);

const FertilizerRecommendation = mongoose.model(
  "FertilizerRecommendation",
  fertilizerRecommendationSchema
);

export default FertilizerRecommendation;