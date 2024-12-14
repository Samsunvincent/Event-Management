import axios from "axios";

const AllCityRoute = async function(){
    try {
        let response = await axios.get(`http://localhost:4000/city`,{
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        console.log("response",response);
        return response.data
    } catch (error) {
        console.log('error',error);
    }
}
export default AllCityRoute