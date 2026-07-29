import axios from "axios";
import { config } from "./config";

export const getAirlines = async () => {
    try {
        // http://localhost:8080
        const response = await axios.get(`${config.serverUrl}/admin/airlines`);
        //console.log("Airlines fetched successfully:", response.data);
        return response.data;
    }
    catch (err) {
        //console.error("Error fetching airlines:", err);
        throw err;
    }
}

export const addAirline = async ({ airlineName, country }) => {
    try {  
        const response=await axios.post(`${config.serverUrl}/admin/airlines`, {
            airlineName,
            country
        });
        //console.log("Airline added successfully:", response.data);
        return response.data;
    }
    catch (error) {
        //console.error("Error adding airline:", error);
        throw error;
    }
}

export const editAirline=async({airlineName,country, airlineId})=>{
    try {
        const response = await axios.put(`${config.serverUrl}/admin/airlines/${airlineId}`, {
            airlineName,
            country
        });
        //console.log("Airline updated successfully:", response.data);
        return response.data;
    } catch (error) {
        //console.error("Error updating airline:", error);
        throw error;
    }
}

export const deleteAirline = async (airlineId) => {
    try {
        const response = await axios.delete(`${config.serverUrl}/admin/airlines/${airlineId}`);
        //console.log("Airline deleted successfully:", response.data);
        return response.data;
    } catch (error) {
        ////console.error("Error deleting airline:", error);
        throw error;
    }
}