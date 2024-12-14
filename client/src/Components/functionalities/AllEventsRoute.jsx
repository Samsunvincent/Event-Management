import axios from "axios";

const AllEventsRoute = async function (id) {
  try {
    // Send a GET request to the server with the id as part of the URL path
    let response = await axios.get(`http://localhost:4000/getEvents/${id || ''}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('response', response);
    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};

export default AllEventsRoute;
