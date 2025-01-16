import axios from "axios";

const BlockOrUnblockRoute = async (id,token,body) =>{
    try {
        let response = await axios.post(`http://localhost:4000/blockOrUnblock/${id}`,body,{
            headers : {
                'Content-Type' : 'application/json',
                Authorization : `Bearer ${token}`,
            },
        });

        console.log('Response from block or unblock route',response);
        return response;

    } catch (error) {
        console.log('error',error);
    }
}

export default BlockOrUnblockRoute