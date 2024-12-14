import axios from "axios";

const FilterEventsRoute = async function(query,token) {
    try {
        let response = await axios.get(`http://localhost:4000/filter`, {
            headers: {
                "Content-Type": 'application/json'
            },
            params: query,  // Pass the query parameters here
        });
        console.log('response from filter', response);
        return response;
    } catch (error) {
        console.log("error", error);
    }
}

export default FilterEventsRoute;
