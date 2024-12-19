import axios from "axios";

const GetParticipants = async function(e_id, token) {
    // Validate input parameters
    if (!e_id || typeof e_id !== 'string') {
        console.error('Invalid event ID. Please provide a valid e_id.');
        return { error: 'Invalid event ID.' };
    }
    if (!token || typeof token !== 'string') {
        console.error('Invalid token. Please provide a valid token.');
        return { error: 'Invalid token.' };
    }

    try {
        // Make the API request
        let response = await axios.get(`http://localhost:4000/getParticipants/${e_id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        // Check if response is successful
        if (response.status >= 200 && response.status < 300) {
            console.log('Response from participants route:', response);
            return response.data; // Return only the data from the response
        } else {
            console.error('Unexpected response status:', response.status);
            return { error: 'Unexpected response status.' };
        }
    } catch (error) {
        // Handle errors
        if (error.response) {
            // The request was made and the server responded with a status code outside of the range of 2xx
            console.error('Error response:', error.response.data);
            return { error: error.response.data || 'An error occurred on the server.' };
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            return { error: 'No response from server. Please check your network connection.' };
        } else {
            // Something happened while setting up the request
            console.error('Error setting up request:', error.message);
            return { error: `Request error: ${error.message}` };
        }
    }
}

export default GetParticipants;
