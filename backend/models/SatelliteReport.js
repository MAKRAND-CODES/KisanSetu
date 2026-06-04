import mongoose from "mongoose";

const coordinateSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const satelliteReportSchema = new mongoose.Schema(
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

    boundaryCoordinates: {
      type: [coordinateSchema],
      required: true,
    },

    calculatedArea: {
      squareMeters: Number,
      acres: Number,
      hectares: Number,
    },

    boundaryLengthMeters: {
      type: Number,
      default: 0,
    },

    satelliteProvider: {
      type: String,
      default: "Sentinel Hub Sentinel-2",
    },

    ndvi: {
      average: {
        type: Number,
        default: null,
      },
      min: {
        type: Number,
        default: null,
      },
      max: {
        type: Number,
        default: null,
      },
    },

    cropHealthStatus: {
      type: String,
      enum: ["unknown", "healthy", "moderate", "stressed", "critical"],
      default: "unknown",
    },

    satelliteDateFrom: {
      type: String,
      default: "",
    },

    satelliteDateTo: {
      type: String,
      default: "",
    },

    cloudCoverageLimit: {
      type: Number,
      default: 30,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const SatelliteReport = mongoose.model(
  "SatelliteReport",
  satelliteReportSchema
);

export default SatelliteReport;