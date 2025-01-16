import { useEffect, useState } from "react";
import AllAttendeesRoute from "../../functionalities/Admin/AllAttendeesRoute"; // Assuming you have a similar API function for fetching attendees
import BlockOrUnblockRoute from "../../functionalities/Admin/BlockOrUnblockRoute"; // Assuming you have a similar API function for block/unblock actions
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AllAttendees() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAttendee, setSelectedAttendee] = useState(null);
    const [description, setDescription] = useState(""); // State to store description

    useEffect(() => {
        const fetchAllAttendees = async () => {
            try {
                const fetchedAttendeeData = await AllAttendeesRoute(token);
                console.log('fetchedAttendeeData from all attendees', fetchedAttendeeData);

                if (Array.isArray(fetchedAttendeeData?.data?.data)) {
                    setAttendees(fetchedAttendeeData.data.data);
                } else {
                    throw new Error("Failed to fetch attendees");
                }
            } catch (error) {
                console.error('Error fetching attendees:', error);
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAttendees();
    }, [token]);

    const handleBlockUnblock = async (action) => {
        try {
            const body = {
                status: action, // 'block' or 'unblock'
                description: description, // Passing the description field
            };

            const response = await BlockOrUnblockRoute(selectedAttendee._id, token, body);
            console.log('Block/Unblock Response:', response);

            if (response?.data) {
                toast.success(response?.data?.message); // Toast the server message
                setAttendees(attendees.map((attendee) =>
                    attendee._id === selectedAttendee._id
                        ? { ...attendee, user_Status: action === "block" ? "block" : "unblock" }
                        : attendee
                ));
            } else {
                toast.error("Failed to change attendee status");
            }
        } catch (error) {
            toast.error("An error occurred while processing the request");
            console.error(error);
        } finally {
            setModalOpen(false); // Close modal after action
            setDescription(""); // Clear description after action
        }
    };

    const openModal = (attendee) => {
        setSelectedAttendee(attendee);
        setModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    All Attendees
                </h1>
                <div className="overflow-hidden rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200 bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Registered At
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        Loading attendees...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            ) : attendees.length > 0 ? (
                                attendees.map((attendee) => (
                                    <tr key={attendee._id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {attendee.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {attendee.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {attendee.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {attendee.isActive ? "Active" : "Inactive"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(attendee.registeredAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                            {attendee.user_Status === 'block' ? (
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    onClick={() => openModal(attendee)}
                                                >
                                                    Unblock
                                                </button>
                                            ) : (
                                                <button
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    onClick={() => openModal(attendee)}
                                                >
                                                    Block
                                                </button>
                                            )}
                                            <button className="text-red-600 hover:text-red-900">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        No attendees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold mb-4">Confirm Action</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to {selectedAttendee?.user_Status === "block" ? "unblock" : "block"} this attendee?
                        </p>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className="mt-4 w-full p-2 border border-gray-300 rounded"
                        />
                        <div className="mt-4 flex justify-between">
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                onClick={() => setModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() => handleBlockUnblock(selectedAttendee?.user_Status === "block" ? "unblock" : "block")}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
