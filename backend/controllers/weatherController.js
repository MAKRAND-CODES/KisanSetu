import axios from "axios";
import Farm from "../models/Farm.js";
import { generateWeatherAdvice } from "../utils/weatherAdvice.js";

export const getCurrentWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OpenWeather API key missing",
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: apiKey,
          units: "metric",
        },
      }
    );

    const data = response.data;

    const weather = {
      city: data.name,
      country: data.sys.country,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      condition: data.weather[0].description,
      windSpeed: data.wind.speed,
      coordinates: {
        latitude: data.coord.lat,
        longitude: data.coord.lon,
      },
    };

    const advice = generateWeatherAdvice(weather);

    res.status(200).json({
      success: true,
      weather,
      advice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather",
      error: error.response?.data?.message || error.message,
    });
  }
};

export const getFarmWeather = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.farmId);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farm.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to access this farm weather",
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OpenWeather API key missing",
      });
    }

    const { latitude, longitude } = farm.coordinates;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Farm coordinates are missing",
      });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat: latitude,
          lon: longitude,
          appid: apiKey,
          units: "metric",
        },
      }
    );

    const data = response.data;

    const weather = {
      farmName: farm.farmName,
      location: `${farm.village}, ${farm.district}, ${farm.state}`,
      temperature: data.main.temp,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      condition: data.weather[0].description,
      windSpeed: data.wind.speed,
      coordinates: {
        latitude: data.coord.lat,
        longitude: data.coord.lon,
      },
    };

    const advice = generateWeatherAdvice(weather);

    res.status(200).json({
      success: true,
      weather,
      advice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch farm weather",
      error: error.response?.data?.message || error.message,
    });
  }
};