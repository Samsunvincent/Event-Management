import axios from "axios";

const TicketsRoute = async function(id,token){
    try {
        let response = await axios.get(`http://localhost:4000/manageRegisteredEvents/${id}`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });
        console.log("response from the tickets route",response);
        return response.data;
    } catch (error) {
        console.log('error',error);
    }
}

export default TicketsRoute