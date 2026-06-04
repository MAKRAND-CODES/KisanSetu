import { fertilizerData } from "../data/fertilizerData.js";

export const recommendFertilizer = ({ cropName, soilType, growthStage }) => {
  const crop = fertilizerData.find(
    (item) => item.cropName.toLowerCase() === cropName.toLowerCase()
  );

  if (!crop) {
    return {
      matched: false,
      message: "No fertilizer data found for this crop",
      recommendation: null,
    };
  }

  let score = 0;
  const reasons = [];

  if (crop.soilTypes.includes(soilType)) {
    score += 50;
    reasons.push(`Suitable fertilizer plan for ${soilType} soil`);
  } else {
    reasons.push(`Soil type ${soilType} is not the best match for ${cropName}`);
  }

  if (crop.growthStages.includes(growthStage)) {
    score += 50;
    reasons.push(`Growth stage ${growthStage} matched`);
  } else {
    reasons.push(`Growth stage ${growthStage} is not listed for this crop`);
  }

  return {
    matched: true,
    recommendation: {
      cropName: crop.cropName,
      suitabilityScore: score,
      npk: crop.npk,
      fertilizers: crop.fertilizers,
      tips: crop.tips,
      warnings: crop.warnings,
      reasons,
    },
  };
};