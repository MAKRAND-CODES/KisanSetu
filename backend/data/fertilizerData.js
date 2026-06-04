export const fertilizerData = [
  {
    cropName: "Soybean",
    soilTypes: ["black", "loamy"],
    growthStages: ["sowing", "vegetative", "flowering"],
    npk: "20:60:20",
    fertilizers: ["DAP", "MOP", "Rhizobium culture"],
    tips: [
      "Use Rhizobium seed treatment before sowing.",
      "Avoid excessive nitrogen because soybean fixes nitrogen naturally.",
    ],
    warnings: ["Overuse of urea can reduce nodulation in soybean."],
  },
  {
    cropName: "Wheat",
    soilTypes: ["black", "alluvial", "loamy"],
    growthStages: ["sowing", "tillering", "flowering"],
    npk: "120:60:40",
    fertilizers: ["Urea", "DAP", "MOP"],
    tips: [
      "Apply nitrogen in split doses.",
      "First irrigation is important at crown root initiation stage.",
    ],
    warnings: ["Avoid urea application before heavy rain."],
  },
  {
    cropName: "Rice",
    soilTypes: ["clay", "alluvial"],
    growthStages: ["transplanting", "tillering", "panicle"],
    npk: "100:50:50",
    fertilizers: ["Urea", "DAP", "MOP", "Zinc sulphate"],
    tips: [
      "Apply zinc sulphate if leaves show yellowing.",
      "Maintain proper water level in field.",
    ],
    warnings: ["Excess nitrogen may increase pest attack."],
  },
  {
    cropName: "Cotton",
    soilTypes: ["black"],
    growthStages: ["sowing", "vegetative", "flowering", "boll"],
    npk: "80:40:40",
    fertilizers: ["Urea", "DAP", "MOP", "Boron"],
    tips: [
      "Cotton responds well to balanced potassium.",
      "Boron can help during flowering stage.",
    ],
    warnings: ["Avoid excess nitrogen; it increases vegetative growth."],
  },
  {
    cropName: "Maize",
    soilTypes: ["loamy", "alluvial", "red"],
    growthStages: ["sowing", "knee-high", "tasseling"],
    npk: "120:60:40",
    fertilizers: ["Urea", "DAP", "MOP", "Zinc sulphate"],
    tips: [
      "Apply nitrogen in split doses.",
      "Zinc deficiency is common in maize.",
    ],
    warnings: ["Do not apply fertilizer too close to seed."],
  },
  {
    cropName: "Chickpea",
    soilTypes: ["black", "loamy", "sandy"],
    growthStages: ["sowing", "vegetative", "flowering"],
    npk: "20:40:20",
    fertilizers: ["DAP", "MOP", "Rhizobium culture"],
    tips: [
      "Use seed treatment with Rhizobium.",
      "Needs low nitrogen fertilizer.",
    ],
    warnings: ["Avoid over-irrigation and heavy nitrogen use."],
  },
];