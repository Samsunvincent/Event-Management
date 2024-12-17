import { useEffect, useState } from "react";
import Nav from "../../Nav/Nav";
import GetUserData from "../../functionalities/GetUserDataRoute";
import { useParams, Link, useNavigate } from "react-router-dom";
import UpdateProfileRoute from "../../functionalities/UpdateProfileRoute";

// Import Font Awesome for pen, cross, and tick icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const { id, login, usertype } = useParams(); // Extracting user ID from the route params
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const navigate = useNavigate();

    // States to control edit mode for each input field
    const [editMode, setEditMode] = useState({
        name: false,
        email: false,
        phone: false,
    });

    // Fetch user data on component load
    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedUserData = await GetUserData(id);
            console.log("fetchedUserData", fetchedUserData);
            // Set user data to state
            setUserData({
                name: fetchedUserData?.user?.name || "",
                email: fetchedUserData?.user?.email || "",
                phone: fetchedUserData?.user?.phone || "",
            });
        };
        fetchUserData();
    }, [id]);

    // Toggle edit mode for individual input fields
    const toggleEditMode = (field) => {
        setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    // Save changes logic: Update backend and exit edit mode
    const saveEdit = async (field) => {
        const updatedField = { [field]: userData[field] }; // Sending only the updated field
        console.log(`Saving ${field}:`, updatedField);
        try {
            const response = await UpdateProfileRoute(updatedField, id);
            console.log("Update Response:", response);
            toggleEditMode(field); // Exit edit mode after successful update
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleAddEvent = () => {
        navigate(`/listevent/${login}/${id}/${usertype}`);
    };

    const handleAddedEvent = () => {
        navigate(`/getOwnEvent/${login}/${id}/${usertype}`);
    };

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Nav />
                <div className="bg-gray-100 pt-4 flex-1">
                    <header className="bg-blue-900 text-white p-6">
                        <div className="container mx-auto flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold">{userData.name}</h1>
                                <p className="text-sm">{userData.email}</p>
                            </div>
                            <div className="space-x-4">
                                {usertype === "Attendees" && (
                                    <button
                                        className="text-white hover:underline cursor-pointer"
                                        onClick={() => navigate(`/tickets/${login}/${id}/${usertype}`)}
                                    >
                                        Tickets
                                    </button>
                                )}
                                {usertype === "Organizer" && (
                                    <>
                                        <button
                                            className="text-white hover:underline cursor-pointer"
                                            onClick={handleAddEvent}
                                        >
                                            List Events
                                        </button>
                                        <button
                                            className="text-white hover:underline cursor-pointer"
                                            onClick={handleAddedEvent}
                                        >
                                            Added Events
                                        </button>
                                        <button
                                            className="text-white hover:underline cursor-pointer"
                                            onClick={() => navigate(`/tickets/${login}/${id}/${usertype}`)}
                                        >
                                            Tickets
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="container mx-auto mt-8 p-6 bg-white shadow rounded w-1/2">
                        <h2 className="text-lg font-semibold mb-4">
                            Please update your account details below
                        </h2>
                        <form className="space-y-4">
                            {/* Name Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="w-full p-2 border border-gray-300 rounded pr-10"
                                    value={userData.name}
                                    readOnly={!editMode.name}
                                    onChange={(e) =>
                                        setUserData({ ...userData, name: e.target.value })
                                    }
                                />
                                <div className="absolute top-1/2 transform -translate-y-1/2 right-2 space-x-2 flex">
                                    {editMode.name ? (
                                        <>
                                            <button
                                                type="button"
                                                className="text-green-600"
                                                onClick={() => saveEdit("name")}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-600"
                                                onClick={() => toggleEditMode("name")}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="text-blue-600"
                                            onClick={() => toggleEditMode("name")}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full p-2 border border-gray-300 rounded pr-10"
                                    value={userData.email}
                                    readOnly={!editMode.email}
                                    onChange={(e) =>
                                        setUserData({ ...userData, email: e.target.value })
                                    }
                                />
                                <div className="absolute top-1/2 transform -translate-y-1/2 right-2 space-x-2 flex">
                                    {editMode.email ? (
                                        <>
                                            <button
                                                type="button"
                                                className="text-green-600"
                                                onClick={() => saveEdit("email")}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-600"
                                                onClick={() => toggleEditMode("email")}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="text-blue-600"
                                            onClick={() => toggleEditMode("email")}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="w-full p-2 border border-gray-300 rounded pr-10"
                                    value={userData.phone}
                                    readOnly={!editMode.phone}
                                    onChange={(e) =>
                                        setUserData({ ...userData, phone: e.target.value })
                                    }
                                />
                                <div className="absolute top-1/2 transform -translate-y-1/2 right-2 space-x-2 flex">
                                    {editMode.phone ? (
                                        <>
                                            <button
                                                type="button"
                                                className="text-green-600"
                                                onClick={() => saveEdit("phone")}
                                            >
                                                <FontAwesomeIcon icon={faCheck} />
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-600"
                                                onClick={() => toggleEditMode("phone")}
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="text-blue-600"
                                            onClick={() => toggleEditMode("phone")}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        </>
    );
}
