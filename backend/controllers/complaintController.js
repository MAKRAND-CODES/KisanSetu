import Complaint from "../models/Complaint.js";
import Farm from "../models/Farm.js";

export const createComplaint = async (req, res) => {
  try {
    const {
      farm,
      damageType,
      title,
      description,
      estimatedLoss,
      damagePercentage,
    } = req.body;

    if (!farm || !damageType || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "Farm, damage type, title and description are required",
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
        message: "You can create complaint only for your own farm",
      });
    }

    const complaint = await Complaint.create({
      farmer: req.user._id,
      farm,
      damageType,
      title,
      description,
      estimatedLoss,
      damagePercentage,
    });

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint",
      error: error.message,
    });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ farmer: req.user._id })
      .populate("farm", "farmName state district village currentCrop area areaUnit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
      error: error.message,
    });
  }
};

export const getSingleComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village soilType currentCrop area areaUnit");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    const isOwner = complaint.farmer._id.toString() === req.user._id.toString();
    const isOfficerOrAdmin = ["officer", "admin"].includes(req.user.role);

    if (!isOwner && !isOfficerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this complaint",
      });
    }

    res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaint",
      error: error.message,
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop area areaUnit")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all complaints",
      error: error.message,
    });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, officerRemarks, approvedAmount } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    if (status) complaint.status = status;
    if (officerRemarks !== undefined) complaint.officerRemarks = officerRemarks;
    if (approvedAmount !== undefined) complaint.approvedAmount = approvedAmount;

    await complaint.save();

    res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
      error: error.message,
    });
  }
};