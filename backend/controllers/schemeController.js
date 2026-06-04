import Scheme from "../models/Scheme.js";
import { schemesData } from "../data/schemesData.js";
import { checkSchemeEligibility } from "../utils/schemeEligibility.js";

export const seedSchemes = async (req, res) => {
  try {
    await Scheme.deleteMany();
    const schemes = await Scheme.insertMany(schemesData);

    res.status(201).json({
      success: true,
      message: "Schemes seeded successfully",
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to seed schemes",
      error: error.message,
    });
  }
};

export const getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ active: true }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch schemes",
      error: error.message,
    });
  }
};

export const getSingleScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scheme",
      error: error.message,
    });
  }
};

export const checkEligibility = async (req, res) => {
  try {
    const schemes = await Scheme.find({ active: true });

    const results = schemes.map((scheme) => {
      const result = checkSchemeEligibility(scheme, req.user);

      return {
        schemeId: scheme._id,
        title: scheme.title,
        category: scheme.category,
        benefitAmount: scheme.benefitAmount,
        eligible: result.eligible,
        reasons: result.reasons,
      };
    });

    res.status(200).json({
      success: true,
      farmer: {
        name: req.user.name,
        state: req.user.state,
        landArea: req.user.landArea,
      },
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to check eligibility",
      error: error.message,
    });
  }
};

export const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);

    res.status(201).json({
      success: true,
      message: "Scheme created successfully",
      scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create scheme",
      error: error.message,
    });
  }
};

export const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Scheme updated successfully",
      scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update scheme",
      error: error.message,
    });
  }
};

export const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: "Scheme not found",
      });
    }

    await scheme.deleteOne();

    res.status(200).json({
      success: true,
      message: "Scheme deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete scheme",
      error: error.message,
    });
  }
};