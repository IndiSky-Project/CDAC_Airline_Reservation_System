import { myAxios } from "./config";
import axios from "axios";
import { config } from "./config";

export const signUp = async (userData) => {
  try {
    const response = await myAxios.post("/user/register", userData);
    return { success: true, data: response.data };
  } catch (error) {
    const message =
      error.response?.data || "Something went wrong while registering!";
    return { success: false, error: message };
  }
};

export const login = async (userData) => {
    try{
      const response = await myAxios.post("/user/login", userData);
      return { success: true, data: response.data };
    }catch (error){
      const message = 
      error.response?.data || "Something went wrong in login !!"
      //console.log(userData)
        return { success: false, error: message };
    }
};

export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(`${config.serverUrl}/user/${userId}`);
    //console.log("User details fetched successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    //console.error("Error fetching user details:", error);
    const message = error.response?.data || "Failed to fetch user details!";
    return { success: false, error: message };
  }
};

// Update user details by ID
export const updateUserDetails = async (userId, userData) => {
  try {
    const response = await axios.put(`${config.serverUrl}/user/${userId}`, userData);
    //console.log("User details updated successfully:", response.data);
    return { success: true, data: response.data };
  } catch (error) {
    //console.error("Error updating user details:", error);
    const message = error.response?.data || "Failed to update user details!";
    return { success: false, error: message };
  }
};

