import axios from "axios";

const SingleViewRoute = async function(e_id){
    try {
        let response = await axios.get(`http://localhost:4000/getEvent/${e_id}`,{
            headers : {
                'Content-Type' : 'application/json'
            },
        });
        console.log("response",response);
        return response;
    } catch (error) {
        console.log('error',error);
    }
}

export default SingleViewRoute