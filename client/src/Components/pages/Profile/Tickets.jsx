import { useEffect, useState } from "react";
import TicketsRoute from "../../functionalities/TicketsRoute";
import { useParams } from "react-router-dom";

export default function Tickets() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [ticketData, setTicketData] = useState({ registeredEvents: [] });

    useEffect(() => {
        const fetchTicketData = async () => {
            const fetchedTicketData = await TicketsRoute(id, token);
            console.log("fetchedTicketData", fetchedTicketData);
            setTicketData(fetchedTicketData);
        };
        fetchTicketData();
    }, [id, token]);

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-semibold text-center text-blue-900 mb-8">
                    Your Tickets
                </h1>

                {ticketData?.registeredEvents?.length > 0 ? (
                    ticketData.registeredEvents.map((ticket, index) => {
                        const eventDetail = ticket.eventDetails; // Access directly from registeredEvents

                        return eventDetail ? (
                            <div
                                key={index}
                                className="bg-white rounded-lg shadow-md p-6 mb-6"
                            >
                                {/* Event details */}
                                <div className="flex items-center mb-4">
                                    <img
                                        src={`http://localhost:4000/${eventDetail?.images[0]?.url}`}
                                        alt={eventDetail?.name}
                                        className="w-32 h-32 object-cover rounded-lg mr-4"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {eventDetail?.name}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {eventDetail?.venue} |{" "}
                                            {new Date(eventDetail?.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Ticket information */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">
                                            Tickets: {ticket.numberOfTickets}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Total Amount: ₹{ticket.totalAmount}
                                        </p>
                                    </div>
                                    <div>
                                        <span
                                            className={`${
                                                ticket.status === "pending"
                                                    ? "bg-yellow-300 text-yellow-800"
                                                    : "bg-green-300 text-green-800"
                                            } px-4 py-1 rounded-full text-sm font-semibold`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <p className="text-center text-gray-600">Event details not found.</p>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-600">
                        <p>You have no registered tickets.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
