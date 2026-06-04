import Insurance from "../models/Insurance.js";
import Farm from "../models/Farm.js";

const generatePolicyNumber = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `KS-POL-${year}-${random}`;
};

export const applyInsurance = async (req, res) => {
  try {
    const {
      farm,
      cropName,
      season,
      area,
      areaUnit,
      sumInsured,
      premiumAmount,
    } = req.body;

    if (!farm || !cropName || !season || !area || !sumInsured || !premiumAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Farm, cropName, season, area, sumInsured and premiumAmount are required",
      });
    }

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
        message: "You can apply insurance only for your own farm",
      });
    }

    const insurance = await Insurance.create({
      farmer: req.user._id,
      farm,
      cropName,
      season,
      area,
      areaUnit,
      sumInsured,
      premiumAmount,
      policyNumber: generatePolicyNumber(),
    });

    res.status(201).json({
      success: true,
      message: "Insurance application submitted successfully",
      insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to apply for insurance",
      error: error.message,
    });
  }
};

export const getMyInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.find({ farmer: req.user._id })
      .populate("farm", "farmName state district village currentCrop area areaUnit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: insurance.length,
      insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insurance records",
      error: error.message,
    });
  }
};

export const getAllInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.find()
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop area areaUnit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: insurance.length,
      insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all insurance records",
      error: error.message,
    });
  }
};

export const getSingleInsurance = async (req, res) => {
  try {
    const insurance = await Insurance.findById(req.params.id)
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop area areaUnit");

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance record not found",
      });
    }

    const isOwner = insurance.farmer._id.toString() === req.user._id.toString();
    const isOfficerOrAdmin = ["officer", "admin"].includes(req.user.role);

    if (!isOwner && !isOfficerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this insurance record",
      });
    }

    res.status(200).json({
      success: true,
      insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch insurance record",
      error: error.message,
    });
  }
};

export const updateInsuranceStatus = async (req, res) => {
  try {
    const { status, claimAmount, remarks } = req.body;

    const insurance = await Insurance.findById(req.params.id);

    if (!insurance) {
      return res.status(404).json({
        success: false,
        message: "Insurance record not found",
      });
    }

    if (status) insurance.status = status;
    if (claimAmount !== undefined) insurance.claimAmount = claimAmount;
    if (remarks !== undefined) insurance.remarks = remarks;

    await insurance.save();

    res.status(200).json({
      success: true,
      message: "Insurance status updated successfully",
      insurance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update insurance status",
      error: error.message,
    });
  }
};