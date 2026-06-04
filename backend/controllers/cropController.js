import CropRecommendation from "../models/CropRecommendation.js";
import { recommendCrops } from "../utils/cropRules.js";

export const getCropRecommendations = async (req, res) => {
  try {
    const { state, district, soilType, season, waterAvailability } = req.body;

    if (!state || !soilType || !season || !waterAvailability) {
      return res.status(400).json({
        success: false,
        message: "State, soilType, season and waterAvailability are required",
      });
    }

    const recommendations = recommendCrops({
      state,
      soilType,
      season,
      waterAvailability,
    });

    const savedRecommendation = await CropRecommendation.create({
      farmer: req.user._id,
      state,
      district,
      soilType,
      season,
      waterAvailability,
      recommendations,
    });

    res.status(200).json({
      success: true,
      message: "Crop recommendations generated successfully",
      count: recommendations.length,
      recommendations,
      savedRecommendationId: savedRecommendation._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate crop recommendations",
      error: error.message,
    });
  }
};

export const getCropRecommendationHistory = async (req, res) => {
  try {
    const history = await CropRecommendation.find({
      farmer: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch crop recommendation history",
      error: error.message,
    });
  }
};