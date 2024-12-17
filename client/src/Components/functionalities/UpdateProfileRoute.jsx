import axios from "axios";
const UpdateProfileRoute = async function(body,id){
    try {
        let response = await axios.put(`http://localhost:4000/updateProfile/${id}`,body,{
            headers : {
                'content-Type' : "application/json"
            },
        });
        console.log('response',response);
        return response;
    } catch (error) {
        console.log('error',error);
    }
}

export default UpdateProfileRoute