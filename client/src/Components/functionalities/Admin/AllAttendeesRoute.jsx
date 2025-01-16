import axios from "axios";

const AllAttendeesRoute = async (token) =>{
    try {
        let response  = await axios.get(`http://localhost:4000/allAttendees`,{
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`,
            },
        });
        console.log("response from the all attendees route : ",response);
        return response;
    } catch (error) {
        console.log('error',error);

    }
}

export default AllAttendeesRoute