import axios from "axios";

const UpdateEventRoute = async function (body, e_id, token) {
    // Validate inputs
    if (!e_id || typeof e_id !== "string") {
        throw new Error("Invalid event ID. Please provide a valid event ID.");
    }
    if (!token || typeof token !== "string") {
        throw new Error("Invalid token. Please provide a valid authentication token.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw new Error("Invalid body. Body should be an object with event details.");
    }

    const requiredFields = ["name", "city", "startDate", "endDate", "venue"];
    for (const field of requiredFields) {
        if (!body[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    try {
        const response = await axios.put(
            `http://localhost:4000/updateEvent/${e_id}`,  // Ensure the URL is correct
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,  // Add the authorization token in the header
                },
            }
        );
        console.log("Response from update event route", response);
        return response;  // Return the successful response
    } catch (error) {
        console.error("Error in UpdateEventRoute:", error.response || error.message);
        throw error;  // Re-throw error for higher-level handling
    }
};

export default UpdateEventRoute;
