
import axios from "axios";
const GetUserType = async function(){
    try {
        let response = await axios.get(`http://localhost:4000/userType`);
        console.log('response',response);
        return response;
    } catch (error) {
        console.log("error",error)
    }
}
export default GetUserType