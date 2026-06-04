import { cropsData } from "../data/cropsData.js";

export const recommendCrops = ({
  state,
  soilType,
  season,
  waterAvailability,
}) => {
  const recommendations = cropsData
    .map((crop) => {
      let score = 0;
      const reasons = [];

      if (crop.states.includes(state)) {
        score += 25;
        reasons.push(`Commonly grown in ${state}`);
      }

      if (crop.soilTypes.includes(soilType)) {
        score += 30;
        reasons.push(`Suitable for ${soilType} soil`);
      }

      if (crop.seasons.includes(season)) {
        score += 30;
        reasons.push(`Good for ${season} season`);
      }

      if (crop.waterNeeds.includes(waterAvailability)) {
        score += 15;
        reasons.push(`Matches ${waterAvailability} water availability`);
      }

      return {
        crop: crop.name,
        score,
        suitability:
          score >= 80 ? "High" : score >= 50 ? "Medium" : "Low",
        reasons,
        tips: crop.tips,
      };
    })
    .filter((item) => item.score >= 40)
    .sort((a, b) => b.score - a.score);

  return recommendations;
};