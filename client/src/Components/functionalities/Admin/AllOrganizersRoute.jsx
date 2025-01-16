import axios from "axios";


const AllOrganizersRoute = async (token) =>{
    try {
        let response = await axios.get(`http://localhost:4000/allOrganizer`,{
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`
            },
        });
        console.log("response from the allOrganizers route : ",response);
        return response
    } catch (error) {
        console.log('error',error);
    }
}

export default AllOrganizersRoute