import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    cropName: {
      type: String,
      required: true,
    },

    season: {
      type: String,
      enum: ["kharif", "rabi", "zaid"],
      required: true,
    },

    area: {
      type: Number,
      required: true,
    },

    areaUnit: {
      type: String,
      enum: ["acre", "hectare", "bigha"],
      default: "acre",
    },

    sumInsured: {
      type: Number,
      required: true,
    },

    premiumAmount: {
      type: Number,
      required: true,
    },

    policyNumber: {
      type: String,
      unique: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "verified",
        "approved",
        "active",
        "rejected",
        "claim_requested",
        "claim_approved",
        "claim_released",
      ],
      default: "pending",
    },

    claimAmount: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Insurance = mongoose.model("Insurance", insuranceSchema);

export default Insurance;