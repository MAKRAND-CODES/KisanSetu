import Farm from "../models/Farm.js";

export const createFarm = async (req, res) => {
  try {
    const {
      farmName,
      state,
      district,
      village,
      soilType,
      currentCrop,
      season,
      area,
      areaUnit,
      coordinates,
      irrigationType,
    } = req.body;

    if (!farmName || !state || !district || !village || !soilType || !area) {
      return res.status(400).json({
        success: false,
        message: "Farm name, location, soil type and area are required",
      });
    }

    const farm = await Farm.create({
      farmer: req.user._id,
      farmName,
      state,
      district,
      village,
      soilType,
      currentCrop,
      season,
      area,
      areaUnit,
      coordinates,
      irrigationType,
    });

    res.status(201).json({
      success: true,
      message: "Farm added successfully",
      farm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add farm",
      error: error.message,
    });
  }
};

export const getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ farmer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: farms.length,
      farms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch farms",
      error: error.message,
    });
  }
};

export const getSingleFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this farm",
      });
    }

    res.status(200).json({
      success: true,
      farm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch farm",
      error: error.message,
    });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to update this farm",
      });
    }

    const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Farm updated successfully",
      farm: updatedFarm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update farm",
      error: error.message,
    });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this farm",
      });
    }

    await farm.deleteOne();

    res.status(200).json({
      success: true,
      message: "Farm deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete farm",
      error: error.message,
    });
  }
};