import ApiError from "../errors/ApiError.js";
import {API_URL} from "../constants.js";

export default async function logIn(email, password) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin': '*',
        };
        const requestBody = {
            email: email,
            password: password,
        };

        const response = await fetch(API_URL + '/v1/auth/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (response.ok) {
            const token = responseData.token;
            if (token) {
                console.log("Successfully logged in");
                localStorage.setItem('token', token);
            }
        } else if (response.status >= 400 && response.status < 500) {
            const message = responseData.title || "Unspecified error message.";
            throw new ApiError(response.status, message);
        } else {
            const message = responseData.title || "Unknown API error.";
            throw new ApiError(response.status, message);
        }
    } catch(error) {
        if (error instanceof ApiError) {
            console.log("API error: ", error.status, error.message);
        } else {
            console.error("Error: ", error.message);
        }
        throw error;
    }
}