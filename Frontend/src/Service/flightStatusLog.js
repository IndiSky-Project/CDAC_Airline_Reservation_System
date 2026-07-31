// src/service/flightStatusLog.js

import axios from "axios";
import { config } from "./config";

const BASE_URL = `${config.serverUrl}`;

// Admin-specific flight status logs
export const getAllFlightStatusLogs = () => {
  return axios.get(`${BASE_URL}/admin/flight-status-logs`);
};

export const addFlightStatusLog = (logData) => {
  return axios.post(`${BASE_URL}/admin/flight-status-logs`, logData);
};

// Public flight status (used by users to check flight status)
export const getFlightStatusByNumber = async (flightNumber) => {
  const response = await axios.get(`${BASE_URL}/api/flights/status`, {
    params: { flightNumber }
  });
  return response.data;
};
