import axios from "axios";

const AddedEvents = async (token) =>{
    try {
        let response = await axios.get(`http://localhost:4000/getOwnEvent`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });
        console.log("response from added events route",response);
        return response;
    } catch (error) {
        console.log('error',error);
    }
}

export default AddedEvents