import { useCallback, useEffect, useState } from "react";
import AddedEvents from "../../functionalities/AddedEventsRoute";
import { useNavigate, useParams } from "react-router-dom";

export default function AddedEvent() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [events, setEvents] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAddedEvents = async () => {
            const fetchedData = await AddedEvents(token);
            setEvents(fetchedData.data.events);
            console.log("Fetched Data:", fetchedData);
        };
        fetchAddedEvents();
    }, [id, login]);
    const handleParticipants = (e_id, event) => {
        event.stopPropagation(); // Prevent propagation to the row's onClick
        console.log("View participants for event ID:", e_id );
        navigate(`/participants/${login}/${id}/${usertype}/${e_id}`)
        // Additional logic to view participants
    };


    const handleSingleView = useCallback((e_id) => {
        navigate(`/singleView/${login}/${id}/${usertype}/${e_id}`)
    })
    const handleEdit = (e_id,event) =>{
        event.stopPropagation()
        navigate(`/updateEvent/${login}/${id}/${usertype}/${e_id}`)
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Events Added by Organizer
                </h1>
                <div className="overflow-hidden rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200 bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Event Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    City
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Start Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    End Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Venue
                                </th>
                                <th
                                    scope="col"
                                    className="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200"  >
                            {events.length > 0 ? (
                                events.map((event) => (
                                    <tr
                                        key={event._id}
                                        className="hover:bg-gray-100 transition duration-300 cursor:pointer" // Fixed typo
                                        onClick={() => handleSingleView(event._id)}
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
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={(e) => handleParticipants(event._id, e)} // Pass the event explicitly
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                View Participants
                                            </button>
                                            <button
                                                onClick={(e) => handleEdit(event._id, e)} // New edit button
                                                className="text-green-600 hover:text-green-900"
                                            >
                                                Edit
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
                                        No events found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
