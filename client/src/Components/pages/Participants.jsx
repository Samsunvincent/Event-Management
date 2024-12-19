import { useEffect, useState } from "react";
import NavTwo from "../Nav/NavTwo";
import GetParticipants from "../functionalities/GetParticipantsRoute";
import { useParams } from "react-router-dom";

export default function Participants() {
    const { login, id, usertype, e_id } = useParams();
    const token = localStorage.getItem(login);

    // State to hold participant data
    const [participants, setParticipants] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const fetchedParticipantData = await GetParticipants(e_id, token);
                if (fetchedParticipantData && fetchedParticipantData.participants) {
                    setParticipants(fetchedParticipantData.participants);
                } else {
                    setError('No participants found.');
                }
            } catch (err) {
                setError('Error fetching participants.');
                console.error(err);
            }
        };
        fetchParticipants();
    }, [e_id, token]); // Dependency on e_id and token

    return (
        <>
            <div>
                <NavTwo />
            </div>
            
            <div className="container p-4">
                <h1 className="text-2xl font-bold mb-4">Participants List</h1>
                
                {error && <p className="text-red-500">{error}</p>}

                {/* Display participants in a table if available */}
                {participants && participants.length > 0 ? (
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Phone</th>
                                <th className="py-2 px-4 border-b">Total Amount</th>
                                <th className="py-2 px-4 border-b">Total Tickets</th>
                                <th className="py-2 px-4 border-b">Bookings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participants.map((participant) => (
                                <tr key={participant._id} className="hover:bg-gray-100">
                                    <td className="py-2 px-4 border-b text-center">{participant.name}</td>
                                    <td className="py-2 px-4 border-b text-center">{participant.email}</td>
                                    <td className="py-2 px-4 border-b text-center">{participant.phone}</td>
                                    <td className="py-2 px-4 border-b text-center">{participant.totalAmount}</td>
                                    <td className="py-2 px-4 border-b text-center">{participant.totalTickets}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {participant.bookings.length > 0 ? (
                                            <ul>
                                                {participant.bookings.map((booking, index) => (
                                                    <li key={index}>
                                                        {/* Assuming each booking has relevant details */}
                                                        Booking #{index + 1}: {/* Add booking details here */}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>No bookings</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No participants to display.</p>
                )}
            </div>
        </>
    );
}
