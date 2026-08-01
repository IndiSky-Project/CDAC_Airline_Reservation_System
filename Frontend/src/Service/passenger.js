import { toast } from "react-toastify";
import axios from "axios"
import { config } from './config';

export async function addPassenger(passengerlist){
    try {
        // const url 
        const url = `${config.serverUrl}/api/passengers/addlist`;
        const resp=await axios.post(url,passengerlist);
        return resp
    } catch (err) {
        toast.error(err);
    }
}