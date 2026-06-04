import mongoose from "mongoose";

const marketPriceSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    mandiName: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerQuintal: {
      type: Number,
      required: true,
    },

    arrivalDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MarketPrice = mongoose.model("MarketPrice", marketPriceSchema);

export default MarketPrice;