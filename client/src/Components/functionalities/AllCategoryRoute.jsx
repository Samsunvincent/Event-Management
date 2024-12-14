import axios from "axios";

const AllCategoryRoute = async function(){
    try {
        let response = await axios.get(`http://localhost:4000/category`,{
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
export default AllCategoryRoute