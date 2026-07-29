import axios from "axios";
import { config } from "./config";

const BASE_URL = `${config.serverUrl}/admin/dashboard`;

export const getDashboardData = () => {
  return axios.get(BASE_URL);
};
