import { useEffect, useState } from "react";
import AllOrganizersRoute from "../../functionalities/Admin/AllOrganizersRoute";
import BlockOrUnblockRoute from "../../functionalities/Admin/BlockOrUnblockRoute";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AllOrganizers() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrganizer, setSelectedOrganizer] = useState(null);
    const [description, setDescription] = useState(""); // State to store description

    useEffect(() => {
        const fetchAllOrganizers = async () => {
            try {
                const fetchedOrgnizerData = await AllOrganizersRoute(token);
                console.log('fetchedOrgnizerData from all organizers', fetchedOrgnizerData);

                if (Array.isArray(fetchedOrgnizerData?.data?.data)) {
                    setOrganizers(fetchedOrgnizerData.data.data);
                } else {
                    throw new Error("Failed to fetch organizers");
                }
            } catch (error) {
                console.error('Error fetching organizers:', error);
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllOrganizers();
    }, [token]);

    const handleBlockUnblock = async (action) => {
        try {
            const body = {
                status: action, // 'block' or 'unblock'
                description: description, // Passing the description field
            };
    
            const response = await BlockOrUnblockRoute(selectedOrganizer._id, token, body);
            console.log('Block/Unblock Response:', response);
    
            if (response?.data) {
                toast.success(response?.data?.message); // Toast the server message
                setOrganizers(organizers.map(organizer =>
                    organizer._id === selectedOrganizer._id
                        ? { ...organizer, user_Status: action === "block" ? "block" : "unblock" }
                        : organizer
                ));
            } else {
                toast.error("Failed to change organizer status");
            }
        } catch (error) {
            toast.error("An error occurred while processing the request");
            console.error(error);
        } finally {
            setModalOpen(false); // Close modal after action
            setDescription(""); // Clear description after action
        }
    };
    

    const openModal = (organizer) => {
        setSelectedOrganizer(organizer);
        setModalOpen(true);
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        All Organizers
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
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Updated At
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
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            Loading organizers...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            {error}
                                        </td>
                                    </tr>
                                ) : organizers.length > 0 ? (
                                    organizers.map((organizer) => (
                                        <tr key={organizer._id} className="hover:bg-gray-100">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {organizer.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {organizer.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {organizer.phone}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {organizer.isActive ? "Active" : "Inactive"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(organizer.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(organizer.updatedAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                                <button
                                                    className={`${
                                                        organizer.user_Status === "block"
                                                            ? "text-green-600 hover:text-green-900"
                                                            : "text-yellow-600 hover:text-yellow-900"
                                                    }`}
                                                    onClick={() => openModal(organizer)}
                                                >
                                                    {organizer.user_Status === "block" ? "Unblock" : "Block"}
                                                </button>
                                                <button className="text-red-600 hover:text-red-900">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No organizers found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold mb-4">Confirm Action</h3>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to {selectedOrganizer?.user_Status === "block" ? "unblock" : "block"} this organizer?
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
                                onClick={() => handleBlockUnblock(selectedOrganizer?.user_Status === "block" ? "unblock" : "block")}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
