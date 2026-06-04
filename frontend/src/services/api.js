import axios from "axios";

const API = axios.create({
  baseURL: "https://kisansetu-backend-5oag.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("kisansetu_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;