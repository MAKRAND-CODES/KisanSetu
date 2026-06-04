import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
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

    damageType: {
      type: String,
      enum: ["flood", "drought", "hailstorm", "pest", "disease", "fire", "other"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    estimatedLoss: {
      type: Number,
      default: 0,
    },

    damagePercentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "compensation_released"],
      default: "pending",
    },

    officerRemarks: {
      type: String,
      default: "",
    },

    approvedAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Complaint = mongoose.model("Complaint", complaintSchema);

export default Complaint;