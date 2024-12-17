import axios from "axios";

const BookEventRoute = async function (eid, body, token) {
    try {
        const response = await axios.post(
            `http://localhost:4000/bookTicket/${eid}`,
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
            }
        );

        console.log('response from book event route', response);

        // Check for specific status or messages and return them consistently
        return response.data;
    } catch (error) {
        // Catch error and return a consistent response with error message
        console.error("Booking failed:", error);
        return { message: error.response?.data?.message || "An error occurred during booking." };
    }
};

export default BookEventRoute;
