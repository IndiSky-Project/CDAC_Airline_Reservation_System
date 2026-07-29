import { toast } from "react-toastify";
import { config } from "./config";
import axios from 'axios';


export async function GetFlightSearch(trip, from, to, dep, arr, passenger) {

    try {
        let url = `${config.serverUrl}/api/flights/search?source=${from}&destination=${to}&departure=${dep}&passengers=${passenger}&travelclass=ECONOMY&tripType=${trip}`;

        if (arr) {
            url += `&arrival=${arr}`;
        }
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        toast.error(err);
    }
}

export const getFlights = async () => {
    try {
        const response = await axios.get(`${config.serverUrl}/admin/flights`);
        //console.log("Flights fetched successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error fetching flights:", error);
        throw error;
    }
};

export const addFlight = async (flightData) => {
    try {
        const response = await axios.post(`${config.serverUrl}/admin/flights`, flightData);
        //console.log("Flight added successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error adding flight:", error);
        throw error;
    }
};

export const editFlight = async (flightId, flightData) => {
    try {
        const response = await axios.put(`${config.serverUrl}/admin/flights/${flightId}`, flightData);
        //console.log("Flight updated successfully:", response.data);
        return response.data;
    } catch (error) {
        ////console.error("Error updating flight:", error);
        throw error;
    }
};


export const deleteFlight = async (flightId) => {
    try {
        const response = await axios.delete(`${config.serverUrl}/admin/flights/${flightId}`);
        //console.log("Flight deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error deleting flight:", error);
        throw error;
    }
};
