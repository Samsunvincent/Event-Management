import { useCallback, useEffect, useState } from "react";
import Nav from "../../Nav/Nav";
import AllEventRouteAdmin from "../../functionalities/Admin/AllEventRouteAdmin";
import { useNavigate, useParams } from "react-router-dom";

export default function AllEventsAdmin() {
    const { login, id, usertype } = useParams();
    const token = login ? localStorage.getItem(login) : null;

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllevents = async () => {
            try {
                const fetchedData = await AllEventRouteAdmin(token);
                if (fetchedData?.data?.data?.events) {
                    setEvents(fetchedData.data.data.events);
                } else {
                    throw new Error("Failed to fetch events");
                }
            } catch (error) {
                console.error("Error fetching events:", error);
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAllevents();
    }, [token]);

    const handleParticipants = useCallback(
        (e_id) => {
            navigate(`/participants/${login}/${id}/${usertype}/${e_id}`);
        },
        [navigate, login, id, usertype]
    );

   

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        All Events
                    </h1>
                    <div className="overflow-hidden rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        City
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Start Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        End Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Venue
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
                                            Loading events...
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
                                ) : events.length > 0 ? (
                                    events.map((event) => (
                                        <tr
                                            key={event._id}
                                            className="hover:bg-gray-100"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {event.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {event.city}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(event.startDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(event.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {event.venue}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                                                <button
                                                    className="text-green-600 hover:text-green-900"
                                                    onClick={() =>
                                                        handleParticipants(
                                                            event._id
                                                        )
                                                    }
                                                >
                                                    View Participants
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
                                            colSpan="6"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No events available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
