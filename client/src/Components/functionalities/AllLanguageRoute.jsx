import axios from "axios";

const AllLanguageRoute = async function(){
    try {
        let response = await axios.get(`http://localhost:4000/language`,{
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
export default AllLanguageRoute