import { toast } from "react-toastify";
import axios from "axios";
import { config } from "./config";

export async function makePayment(paymentData) {
  try {
    const url = `${config.serverUrl}/api/payments`; 
    const response = await axios.post(url, paymentData);

    toast.success("Payment successful!");
    return response.data;
  } catch (error) {
    //console.error("Payment failed:", error.response?.data || error.message);
    toast.error(
      error.response?.data?.message || "Payment failed. Please try again later."
    );
    return null;
  }
}

const BASE_URL = `${config.serverUrl}/api/payments`;

export const getPaymentsByUser = async (userId) => {
  const response = await axios.get(`${BASE_URL}/user`, {
    params: { userId },
  });
  return response.data;
};
