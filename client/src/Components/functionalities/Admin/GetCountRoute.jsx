import axios from "axios";

const Count = async function (token) {
    try {
        let response = await axios.get(`http://localhost:4000/Count`,{
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`
            }
        });
        console.log("response from count",response);
        return response;
    } catch (error) {
        console.log('error', error);



    }
}
export default Count