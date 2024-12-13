import React, { useCallback, useEffect, useState } from "react";
import GetUserType from "../../functionalities/getUserType";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast only
import { useNavigate } from "react-router-dom";

export default function UserRegistration() {
    const [userTypes, setUserTypes] = useState([]);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [usertype, setUserType] = useState();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const fetchedUserType = await GetUserType();
                const formattedUserTypes = fetchedUserType.data.map((type) => ({
                    value: type._id,
                    label: type.userType,
                }));
                setUserTypes(formattedUserTypes);
            } catch (error) {
                console.error("Error fetching user types:", error);
                toast.error("Failed to load user types. Please try again.");
            }
        };
        fetchUserType();
    }, []);

    const togglePassword = () => {
        const passwordInput = document.getElementById("password");
        const toggleIcon = document.getElementById("toggleIcon");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.classList.remove("fa-eye");
            toggleIcon.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            toggleIcon.classList.remove("fa-eye-slash");
            toggleIcon.classList.add("fa-eye");
        }
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        const formData = { name, email, phone, password, userType: usertype };

        try {
            const response = await axios.post(`http://localhost:4000/register`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 201) {
                toast.success("User registered successfully!");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Failed to register user. Please check your inputs.");
        }
    };

    const handleLogin = useCallback(() =>{
        navigate('/login')
    })

    return (
        <div className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://img.freepik.com/free-photo/back-view-crowd-fans-watching-live-performance-music-concert-night-copy-space_637285-544.jpg?t=st=1734055341~exp=1734058941~hmac=c486b63949efffe782bf71702f7c6a95d48676352db02f265bdcce2f4ee4403c&w=1380')" }}>
            <div className="bg-white/30 backdrop-blur-xxl p-8 rounded-lg shadow-md w-full max-w-4xl opacity-90">
                <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">User Registration</h2>
                <p className="text-xl text-center text-white mb-8">Seamlessly manage your events, from start to finish</p>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegistration}>
                    <div>
                        <label className="block text-white font-medium mb-2" htmlFor="first-name">
                            Name
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            type="text"
                            id="first-name"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />
                    </div>
                    <div>
                        <label className="block text-white font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            type="email"
                            id="email"
                            placeholder="example@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-white font-medium mb-2" htmlFor="phone">
                            Phone
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            type="tel"
                            id="phone"
                            placeholder="123-456-7890"
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-white font-medium mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            type="password"
                            id="password"
                            placeholder="********"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600 focus:outline-none"
                            onClick={togglePassword}
                        >
                            <i id="toggleIcon" className="far fa-eye" />
                        </button>
                    </div>
                    <div>
                        <label className="block text-white font-medium mb-2" htmlFor="usertype">
                            User Type
                        </label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
                            id="usertype"
                            defaultValue=""
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="" disabled>
                                Select a user type
                            </option>
                            {userTypes.length > 0 ? (
                                userTypes.map((type) => (
                                    <option key={type.value} value={type.label}>
                                        {type.label}
                                    </option>
                                ))
                            ) : (
                                <option>Loading...</option>
                            )}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-200 focus:outline-none"
                        >
                            Register
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-white">Already have an account?</p>
                    <button
                        className="text-blue-600 hover:text-blue-800 focus:outline-none"
                        onClick={handleLogin}
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
}
