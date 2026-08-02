// src/service/booking.js
import { toast } from "react-toastify";
import { config } from "./config";
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/bookings';

export const getUserBookings = async (userId) => {
  const response = await axios.get(`${BASE_URL}/user/${userId}`);
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await axios.put(`${BASE_URL}/${bookingId}/cancel`);
  return response.data;
};

// Creates new booking and returns the booking details for payment processing.
export async function createBooking(bookingPayload) {
  try {
    const url = `${config.serverUrl}/api/bookings`;
    const response = await axios.post(url, bookingPayload);
    toast.success("Booking Registered, make a payment!");
    return response.data;
  } catch (error) {
    toast.error("Booking registration failed!");
    //console.error("Error during booking:",  error);
    return null;
  }
}


export async function getBooking(id) {
  try {
    const url = `${config.serverUrl}/api/bookings/${id}/confirmation`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    //console.error("Error during booking:", error);
  }
}
