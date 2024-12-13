import axios from "axios";

const LoginRoute = async (body,navigate) =>{
    if (!body || !body.email || !body.password) {
        alert('Email and password are required');
        return; // Exit early if email and password are not provided
    }

    try {
        let response = await axios.post(`http://localhost:4000/login`,body,{
            headers : {
                'Content-Type ' : 'application/json',
            },
        });
        console.log("response from login route",response.data);
        if(response.data.statusCode === 200){
            let data = response.data.data
            console.log('data',data);

            let userType,id

            if(data.user.userType){
                userType = data.user.userType.userType
                id = data.user._id
            }else if(data.user.name === "Admin"){
                userType = data.user.name
                id = data.user._id
            }else{
                toast.success("user type not found");
                return
            }

            console.log('userType',userType);

            let token = data.token;
            let token_key = id;
            localStorage.setItem(token_key,token);
            console.log('token',token);

            if(userType === "Admin"){
                navigate(`/Admin/${token_key}/${id}/${userType}`)
            }else if(userType === "Organizer"){
                navigate(`/Organizer/${token_key}/${id}/${userType}`)
            }else if(userType === "Attendees"){
                navigate(`/Attendees/${token_key}/${id}/${userType}`)
            }
        }
    } catch (error) {
        console.log('error',error);
    }
}

export default LoginRoute