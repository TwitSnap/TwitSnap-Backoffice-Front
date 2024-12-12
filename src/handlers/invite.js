import ApiError from "../errors/ApiError.js";
import {API_URL} from "../constants.js";

export default async function invite(email) {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Token is missing");
        }

        const headers = {
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${token}`
        };

        const requestBody = {
            email: email,
        };

        const response = await fetch(API_URL + '/v1/auth/invitation',{
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });
        
        if (response.ok) {
            console.log("Invitation sent");
        } else if (response.status >= 400 && response.status < 500) {
            const responseData = await response.json();
            const message = responseData.title || "Unspecified error message.";
            throw new ApiError(response.status, message);
        } else {
            const responseData = await response.json();
            const message = responseData.title || "Unspecified API error.";
            throw new ApiError(response.status, message);
        }
    } catch (error) {
        if (error instanceof ApiError) {
            console.log("API error: ", error.status, error.message);
        } else {
            console.error("Error: ", error.message);
        }
        throw error;
    }
}