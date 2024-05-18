import axios from "axios";

const baseURL = "http://localhost:4000/";

export const validateUser = async (token) => {
 try {
    const res = axios.get(`${baseURL}api/users/login`, {
        headers : {
            Authorization : "Bearer " + token,
        }
    }); 
    return (await res).data;
 } 
 catch (error) {
    
 }
}