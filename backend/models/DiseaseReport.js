import mongoose from "mongoose";

const diseaseReportSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      default: null,
    },

    cropName: {
      type: String,
      required: true,
    },

    imageName: {
      type: String,
      default: "",
    },

    diagnosis: {
      diseaseName: String,
      confidence: String,
      severity: String,
      symptoms: [String],
      possibleCauses: [String],
      organicTreatment: [String],
      chemicalTreatment: [String],
      preventionTips: [String],
      farmerAdvice: String,
      disclaimer: String,
    },
  },
  { timestamps: true }
);

const DiseaseReport = mongoose.model("DiseaseReport", diseaseReportSchema);

export default DiseaseReport;