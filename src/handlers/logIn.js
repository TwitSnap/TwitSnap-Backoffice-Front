import ApiError from "../errors/ApiError.js";

export default async function logIn(email, password) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        };
        const requestBody = {
            email: email,
            password: password,
        };

        const response = await fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        const responseData = await response.json();

        if (response.ok) {
            const token = responseData.token;
            if (token) {
                localStorage.setItem('token', token);
            }
            console.log("Successfully logged in");
            console.log("   token saved: ", token);
        } else if (response.status === 400) {
            throw new ApiError(response.status, responseData.error);
        } else {
            throw new ApiError(response.status, "Unknown API error");
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