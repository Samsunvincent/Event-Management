import axios from "axios";

export default async function SingleViewRoute(e_id, id) {
    console.log('e_id:', e_id); // Debugging line
    console.log('id:', id); // Debugging line

    try {
        // Base URL
        let url = `http://localhost:4000/getEvent/${e_id}`;

        // Append id only if it is defined and valid
        if (id) {
            url += `/${id}`;
        }

        console.log('Request URL:', url); // Debugging line to check the final URL

        // Make the GET request
        let response = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("response", response);
        return response;
    } catch (error) {
        console.error('error', error);
        return null;
    }
}
