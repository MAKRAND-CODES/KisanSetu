import axios from "axios";
import MarketPrice from "../models/MarketPrice.js";

export const createMarketPrice = async (req, res) => {
  try {
    const marketPrice = await MarketPrice.create(req.body);

    res.status(201).json({
      success: true,
      message: "Market price added successfully",
      marketPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add market price",
      error: error.message,
    });
  }
};

export const getAllMarketPrices = async (req, res) => {
  try {
    const prices = await MarketPrice.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch market prices",
      error: error.message,
    });
  }
};

export const getPricesByCrop = async (req, res) => {
  try {
    const prices = await MarketPrice.find({
      cropName: {
        $regex: req.params.cropName,
        $options: "i",
      },
    }).sort({ pricePerQuintal: -1 });

    res.status(200).json({
      success: true,
      count: prices.length,
      prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch crop prices",
      error: error.message,
    });
  }
};

export const getRealMandiPrices = async (req, res) => {
  try {
    const { crop, state, district, limit = 20 } = req.query;

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: "Crop name is required",
      });
    }

    const apiKey = process.env.DATA_GOV_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "DATA_GOV_API_KEY missing in .env",
      });
    }

    const filters = {
      "api-key": apiKey,
      format: "json",
      limit,
      "filters[commodity]": crop,
    };

    if (state) {
      filters["filters[state]"] = state;
    }

    if (district) {
      filters["filters[district]"] = district;
    }

    const response = await axios.get(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
      { params: filters }
    );

    const records = response.data.records || [];

    const prices = records.map((item) => ({
      state: item.state,
      district: item.district,
      market: item.market,
      commodity: item.commodity,
      variety: item.variety,
      arrivalDate: item.arrival_date,
      minPrice: Number(item.min_price),
      maxPrice: Number(item.max_price),
      modalPrice: Number(item.modal_price),
    }));

    res.status(200).json({
      success: true,
      source: "data.gov.in AGMARKNET",
      count: prices.length,
      prices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch real mandi prices",
      error: error.response?.data || error.message,
    });
  }
};

export const updateMarketPrice = async (req, res) => {
  try {
    const marketPrice = await MarketPrice.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!marketPrice) {
      return res.status(404).json({
        success: false,
        message: "Market price not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Market price updated",
      marketPrice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update market price",
      error: error.message,
    });
  }
};

export const deleteMarketPrice = async (req, res) => {
  try {
    const marketPrice = await MarketPrice.findById(req.params.id);

    if (!marketPrice) {
      return res.status(404).json({
        success: false,
        message: "Market price not found",
      });
    }

    await marketPrice.deleteOne();

    res.status(200).json({
      success: true,
      message: "Market price deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete market price",
      error: error.message,
    });
  }
};