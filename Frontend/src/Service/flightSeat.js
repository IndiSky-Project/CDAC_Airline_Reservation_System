import { toast } from "react-toastify";
import axios from "axios";
import { config } from "./config"; 

export async function getSeatsByFlightId(flightId) {
  try {
    const url = `${config.serverUrl}/api/flights/${flightId}/seats`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch seat data");
    return [];
  }
}

const BASE_URL = `${config.serverUrl}/admin/seats`;

export const getAllSeats = () => {
  return axios.get(BASE_URL);
};

export const addSeat = (seatData) => {
  return axios.post(BASE_URL, seatData);
};

export const updateSeat = (seatId, seatData) => {
  return axios.put(`${BASE_URL}/${seatId}`, seatData);
};

export const deleteSeat = (seatId) => {
  return axios.delete(`${BASE_URL}/${seatId}`);
};
