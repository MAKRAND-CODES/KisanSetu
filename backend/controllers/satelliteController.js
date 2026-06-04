import axios from "axios";
import SatelliteReport from "../models/SatelliteReport.js";
import Farm from "../models/Farm.js";
import {
  calculatePolygonArea,
  calculateBoundaryLength,
  getBoundingBox,
  convertToGeoJsonPolygon,
} from "../utils/calculateArea.js";

const getCropHealthStatus = (avgNdvi) => {
  if (avgNdvi === null || avgNdvi === undefined) return "unknown";
  if (avgNdvi >= 0.6) return "healthy";
  if (avgNdvi >= 0.4) return "moderate";
  if (avgNdvi >= 0.2) return "stressed";
  return "critical";
};

const getSentinelAccessToken = async () => {
  const response = await axios.post(
    process.env.SENTINEL_TOKEN_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SENTINEL_CLIENT_ID,
      client_secret: process.env.SENTINEL_CLIENT_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

const fetchNdviFromSentinel = async ({
  boundaryCoordinates,
  dateFrom,
  dateTo,
  cloudCoverageLimit,
}) => {
  const token = await getSentinelAccessToken();

  const bbox = getBoundingBox(boundaryCoordinates);
  const geometry = convertToGeoJsonPolygon(boundaryCoordinates);

  const statisticsUrl = "https://services.sentinel-hub.com/api/v1/statistics";

  const payload = {
    input: {
      bounds: {
        geometry,
        properties: {
          crs: "http://www.opengis.net/def/crs/EPSG/0/4326",
        },
      },
      data: [
        {
          type: "sentinel-2-l2a",
          dataFilter: {
            timeRange: {
              from: `${dateFrom}T00:00:00Z`,
              to: `${dateTo}T23:59:59Z`,
            },
            maxCloudCoverage: cloudCoverageLimit,
          },
        },
      ],
    },
    aggregation: {
      timeRange: {
        from: `${dateFrom}T00:00:00Z`,
        to: `${dateTo}T23:59:59Z`,
      },
      aggregationInterval: {
        of: "P1D",
      },
      width: 512,
      height: 512,
      evalscript: `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B08", "dataMask"],
            output: [
              { id: "ndvi", bands: 1, sampleType: "FLOAT32" },
              { id: "dataMask", bands: 1 }
            ]
          };
        }

        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
          return {
            ndvi: [ndvi],
            dataMask: [sample.dataMask]
          };
        }
      `,
    },
    calculations: {
      ndvi: {
        statistics: {
          default: {
            percentiles: {
              k: [5, 50, 95],
            },
          },
        },
      },
    },
  };

  const response = await axios.post(statisticsUrl, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const intervals = response.data.data || [];

  const validStats = intervals
    .map((item) => item.outputs?.ndvi?.bands?.B0?.stats)
    .filter(Boolean);

  if (validStats.length === 0) {
    return {
      average: null,
      min: null,
      max: null,
    };
  }

  const latest = validStats[validStats.length - 1];

  return {
    average: Number(latest.mean?.toFixed(3)),
    min: Number(latest.min?.toFixed(3)),
    max: Number(latest.max?.toFixed(3)),
  };
};

export const createSatelliteReport = async (req, res) => {
  try {
    const {
      farm,
      boundaryCoordinates,
      cropHealthStatus,
      notes,
    } = req.body;

    if (!farm || !boundaryCoordinates || boundaryCoordinates.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Farm and at least 3 boundary coordinates are required",
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
        message: "You can create satellite report only for your own farm",
      });
    }

    const calculatedArea = calculatePolygonArea(boundaryCoordinates);
    const boundaryLengthMeters = calculateBoundaryLength(boundaryCoordinates);

    const report = await SatelliteReport.create({
      farmer: req.user._id,
      farm,
      boundaryCoordinates,
      calculatedArea,
      boundaryLengthMeters,
      cropHealthStatus: cropHealthStatus || "unknown",
      satelliteProvider: "Manual boundary measurement",
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Satellite farm report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create satellite report",
      error: error.message,
    });
  }
};

export const createLiveNdviReport = async (req, res) => {
  try {
    const {
      farm,
      boundaryCoordinates,
      dateFrom,
      dateTo,
      cloudCoverageLimit = 30,
      notes,
    } = req.body;

    if (!farm || !boundaryCoordinates || boundaryCoordinates.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Farm and at least 3 boundary coordinates are required",
      });
    }

    if (!dateFrom || !dateTo) {
      return res.status(400).json({
        success: false,
        message: "dateFrom and dateTo are required",
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
        message: "You can create report only for your own farm",
      });
    }

    if (
      !process.env.SENTINEL_CLIENT_ID ||
      !process.env.SENTINEL_CLIENT_SECRET ||
      !process.env.SENTINEL_TOKEN_URL
    ) {
      return res.status(500).json({
        success: false,
        message: "Sentinel Hub credentials missing in .env",
      });
    }

    const calculatedArea = calculatePolygonArea(boundaryCoordinates);
    const boundaryLengthMeters = calculateBoundaryLength(boundaryCoordinates);

    const ndvi = await fetchNdviFromSentinel({
      boundaryCoordinates,
      dateFrom,
      dateTo,
      cloudCoverageLimit,
    });

    const cropHealthStatus = getCropHealthStatus(ndvi.average);

    const report = await SatelliteReport.create({
      farmer: req.user._id,
      farm,
      boundaryCoordinates,
      calculatedArea,
      boundaryLengthMeters,
      satelliteProvider: "Sentinel Hub Sentinel-2 L2A NDVI",
      ndvi,
      cropHealthStatus,
      satelliteDateFrom: dateFrom,
      satelliteDateTo: dateTo,
      cloudCoverageLimit,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Live Sentinel NDVI report created successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create live NDVI report",
      error: error.response?.data || error.message,
    });
  }
};

export const getMySatelliteReports = async (req, res) => {
  try {
    const reports = await SatelliteReport.find({ farmer: req.user._id })
      .populate("farm", "farmName state district village currentCrop")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch satellite reports",
      error: error.message,
    });
  }
};

export const getSingleSatelliteReport = async (req, res) => {
  try {
    const report = await SatelliteReport.findById(req.params.id)
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop area areaUnit");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Satellite report not found",
      });
    }

    const isOwner = report.farmer._id.toString() === req.user._id.toString();
    const isOfficerOrAdmin = ["officer", "admin"].includes(req.user.role);

    if (!isOwner && !isOfficerOrAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this report",
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch satellite report",
      error: error.message,
    });
  }
};

export const getAllSatelliteReports = async (req, res) => {
  try {
    const reports = await SatelliteReport.find()
      .populate("farmer", "name phone state district village")
      .populate("farm", "farmName state district village currentCrop")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all satellite reports",
      error: error.message,
    });
  }
};