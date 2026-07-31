// src/Service/airport.js
import axios from "axios";
import { config } from "./config";

export const getAirports = async () => {
    try {
        const response = await axios.get(`${config.serverUrl}/admin/airports`);
        //console.log("Airports fetched successfully:", response.data);
        return response.data;
    } catch (err) {
        //console.error("Error fetching airports:", err);
        throw err;
    }
};

export const addAirport = async ({ airportName, city, country, iataCode }) => {
    try {
        const response = await axios.post(`${config.serverUrl}/admin/airports`, {
            airportName,
            city,
            country,
            iataCode
        });
        //console.log("Airport added successfully:", response.data);
        return response.data;
    } catch (error) {
        ////console.error("Error adding airport:", error);
        throw error;
    }
};

export const editAirport = async ({ airportId, airportName, city, country, iataCode }) => {
    try {
        const response = await axios.put(`${config.serverUrl}/admin/airports/${airportId}`, {
            airportName,
            city,
            country,
            iataCode
        });
        //console.log("Airport updated successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error updating airport:", error);
        throw error;
    }
};

export const deleteAirport = async (airportId) => {
    try {
        const response = await axios.delete(`${config.serverUrl}/admin/airports/${airportId}`);
        //console.log("Airport deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error deleting airport:", error);
        throw error;
    }
};
