/*import { GoogleGenerativeAI } from "@google/generative-ai";
import DiseaseReport from "../models/DiseaseReport.js";
import Farm from "../models/Farm.js";

const cleanJsonResponse = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const detectDisease = async (req, res) => {
  try {
    const { cropName, farm } = req.body;

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: "cropName is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Crop image is required",
      });
    }

    if (farm) {
      const farmExists = await Farm.findById(farm);

      if (!farmExists) {
        return res.status(404).json({
          success: false,
          message: "Farm not found",
        });
      }

      if (farmExists.farmer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can use only your own farm",
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY missing in .env",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `
You are an expert agricultural crop disease diagnosis assistant for Indian farmers.

Analyze the crop leaf/plant image carefully.

Crop name: ${cropName}

Return ONLY valid JSON. No markdown. No explanation outside JSON.

JSON format:
{
  "diseaseName": "string",
  "confidence": "High/Medium/Low",
  "severity": "Low/Medium/High",
  "symptoms": ["string"],
  "possibleCauses": ["string"],
  "organicTreatment": ["string"],
  "chemicalTreatment": ["string"],
  "preventionTips": ["string"],
  "farmerAdvice": "simple Hindi-English advice for farmer",
  "disclaimer": "AI result is advisory only. Consult agriculture expert before chemical pesticide use."
}

If the image is not clear or not a crop/leaf image, set:
"diseaseName": "Unable to determine"
and confidence "Low".
`;

    const result = await model.generateContent([prompt, imagePart]);
    const aiText = result.response.text();

    let diagnosis;

    try {
      diagnosis = JSON.parse(cleanJsonResponse(aiText));
    } catch (parseError) {
      diagnosis = {
        diseaseName: "Unable to parse AI response",
        confidence: "Low",
        severity: "Unknown",
        symptoms: [],
        possibleCauses: [],
        organicTreatment: [],
        chemicalTreatment: [],
        preventionTips: [],
        farmerAdvice: aiText,
        disclaimer:
          "AI result is advisory only. Consult agriculture expert before chemical pesticide use.",
      };
    }

    const report = await DiseaseReport.create({
      farmer: req.user._id,
      farm: farm || null,
      cropName,
      imageName: req.file.originalname,
      diagnosis,
    });

    res.status(201).json({
      success: true,
      message: "Disease detection completed successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Disease detection failed",
      error: error.message,
    });
  }
};

export const getMyDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ farmer: req.user._id })
      .populate("farm", "farmName state district village currentCrop")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch disease reports",
      error: error.message,
    });
  }
};

export const getSingleDiseaseReport = async (req, res) => {
  try {
    const report = await DiseaseReport.findById(req.params.id)
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Disease report not found",
      });
    }

    const isOwner = report.farmer._id.toString() === req.user._id.toString();
    const isOfficerOrAdmin = ["officer", "admin"].includes(req.user.role);

    if (!isOwner && !isOfficerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this disease report",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch disease report",
      error: error.message,
    });
  }
};

export const getAllDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find()
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all disease reports",
      error: error.message,
    });
  }
};*/
import { GoogleGenerativeAI } from "@google/generative-ai";
import DiseaseReport from "../models/DiseaseReport.js";
import Farm from "../models/Farm.js";

const cleanJsonResponse = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const detectDisease = async (req, res) => {
  try {
    const { cropName, farm } = req.body;

    const imageFile = req.files?.[0];

    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: "cropName is required",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Crop image is required",
      });
    }

    if (farm) {
      const farmExists = await Farm.findById(farm);

      if (!farmExists) {
        return res.status(404).json({
          success: false,
          message: "Farm not found",
        });
      }

      if (farmExists.farmer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You can use only your own farm",
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY missing in .env",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const imagePart = {
      inlineData: {
        data: imageFile.buffer.toString("base64"),
        mimeType: imageFile.mimetype,
      },
    };

    const prompt = `
You are an expert agricultural crop disease diagnosis assistant for Indian farmers.

Analyze the crop leaf/plant image carefully.

Crop name: ${cropName}

Return ONLY valid JSON. No markdown. No explanation outside JSON.

JSON format:
{
  "diseaseName": "string",
  "confidence": "High/Medium/Low",
  "severity": "Low/Medium/High",
  "symptoms": ["string"],
  "possibleCauses": ["string"],
  "organicTreatment": ["string"],
  "chemicalTreatment": ["string"],
  "preventionTips": ["string"],
  "farmerAdvice": "simple Hindi-English advice for farmer",
  "disclaimer": "AI result is advisory only. Consult agriculture expert before chemical pesticide use."
}

If the image is not clear or not a crop/leaf image, set:
"diseaseName": "Unable to determine"
and confidence "Low".
`;

    const result = await model.generateContent([prompt, imagePart]);
    const aiText = result.response.text();

    let diagnosis;

    try {
      diagnosis = JSON.parse(cleanJsonResponse(aiText));
    } catch (parseError) {
      diagnosis = {
        diseaseName: "Unable to parse AI response",
        confidence: "Low",
        severity: "Unknown",
        symptoms: [],
        possibleCauses: [],
        organicTreatment: [],
        chemicalTreatment: [],
        preventionTips: [],
        farmerAdvice: aiText,
        disclaimer:
          "AI result is advisory only. Consult agriculture expert before chemical pesticide use.",
      };
    }

    const report = await DiseaseReport.create({
      farmer: req.user._id,
      farm: farm || null,
      cropName,
      imageName: imageFile.originalname,
      diagnosis,
    });

    res.status(201).json({
      success: true,
      message: "Disease detection completed successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Disease detection failed",
      error: error.message,
    });
  }
};

export const getMyDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find({ farmer: req.user._id })
      .populate("farm", "farmName state district village currentCrop")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch disease reports",
      error: error.message,
    });
  }
};

export const getSingleDiseaseReport = async (req, res) => {
  try {
    const report = await DiseaseReport.findById(req.params.id)
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Disease report not found",
      });
    }

    const isOwner = report.farmer._id.toString() === req.user._id.toString();
    const isOfficerOrAdmin = ["officer", "admin"].includes(req.user.role);

    if (!isOwner && !isOfficerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this disease report",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch disease report",
      error: error.message,
    });
  }
};

export const getAllDiseaseReports = async (req, res) => {
  try {
    const reports = await DiseaseReport.find()
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all disease reports",
      error: error.message,
    });
  }
};