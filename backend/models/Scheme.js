import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: [
        "income_support",
        "insurance",
        "credit",
        "soil",
        "subsidy",
        "other",
      ],
      required: true,
    },

    eligibility: {
      minLandArea: {
        type: Number,
        default: 0,
      },

      states: [String],
    },

    benefitAmount: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Scheme = mongoose.model("Scheme", schemeSchema);

export default Scheme;