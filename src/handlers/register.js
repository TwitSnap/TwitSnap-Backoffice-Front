import ApiError from "../errors/ApiError.js";

export default async function register(email, password, token) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            //'Access-Control-Allow-Origin': '*',
        };
        const requestBody = {
            email: email,
            password: password,
            token: token,
        };

        const response = await fetch('https://twitsnap-backoffice-gateway.onrender.com/v1/auth/register', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (response.ok) {
            console.log("Successfully registered");
        } else if (response.status >= 400 && response.status < 500) {
            const message = responseData.title || "Unspecified error message.";
            throw new ApiError(response.status, message);
        } else {
            const message = responseData.title || "Unspecified API error.";
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