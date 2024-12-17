import axios from "axios";
const GetUserData = async function(id){
    try {
        let response = await axios.get(`http://localhost:4000/getProfile/${id}`,{
            headers : {
                'Content-Type' : "application/json",

            },

        });
        console.log("response from get profile route",response);
        return response.data;
    } catch (error) {
        console.log('error',error);
    }
}

export default GetUserData