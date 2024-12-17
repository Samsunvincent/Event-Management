import axios from "axios";

const AddEventRoute =  async (body,token,id) =>{
    try {
        let response = await axios.post(`http://localhost:4000/addEvents/${id}`,body,{
            headers : {
         
                "Authorization" : `Bearer ${token}`,
            },
        });
        console.log('response fromm add events route',response);
        return response
    } catch (error) {
        console.log('error',error);
    }
}
export default AddEventRoute