import axios from "axios";

const AllEventRouteAdmin = async (token) =>{
    try {
        let response = await axios.get(`http://localhost:4000/allevents`,{
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`
            },
        });
        console.log('response from allevents admin',response);
        return response;
    } catch (error) {
        console.log('error',error);

    }
}

export default AllEventRouteAdmin