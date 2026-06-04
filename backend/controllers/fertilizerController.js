import FertilizerRecommendation from "../models/FertilizerRecommendation.js";
import { recommendFertilizer } from "../utils/fertilizerRules.js";

export const getFertilizerRecommendation = async (req, res) => {
  try {
    const { cropName, soilType, growthStage } = req.body;

    if (!cropName || !soilType || !growthStage) {
      return res.status(400).json({
        success: false,
        message: "cropName, soilType and growthStage are required",
      });
    }

    const result = recommendFertilizer({
      cropName,
      soilType,
      growthStage,
    });

    if (!result.matched) {
      return res.status(404).json({
        success: false,
        message: result.message,
      });
    }

    const savedRecommendation = await FertilizerRecommendation.create({
      farmer: req.user._id,
      cropName,
      soilType,
      growthStage,
      recommendation: result.recommendation,
    });

    res.status(200).json({
      success: true,
      message: "Fertilizer recommendation generated successfully",
      recommendation: result.recommendation,
      savedRecommendationId: savedRecommendation._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate fertilizer recommendation",
      error: error.message,
    });
  }
};

export const getFertilizerHistory = async (req, res) => {
  try {
    const history = await FertilizerRecommendation.find({
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
      message: "Failed to fetch fertilizer history",
      error: error.message,
    });
  }
};