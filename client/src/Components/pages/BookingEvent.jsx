import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleViewRoute from "../functionalities/SingleViewRoute";
import BookEventRoute from "../functionalities/BookEventRoute";
import { toast, ToastContainer } from 'react-toastify';  // Import toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the CSS for styling

export default function BookingEvent() {
    const { e_id, login, id, usertype } = useParams();  // You can use e_id for event-specific fetching
    const [singleData, setSingleData] = useState();
    const [ticketCount, setTicketCount] = useState(1);
    const [ticketPrice, setTicketPrice] = useState(599);  // Default value for now
    const [totalPrice, setTotalPrice] = useState(ticketCount * ticketPrice);
    const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);  // Track booking status
    const [isLoading, setIsLoading] = useState(false);  // Loading state for the booking process
    const token = localStorage.getItem(login);

    // Fetch event data based on e_id
    useEffect(() => {
        const fetchSingleEvent = async () => {
            const fetchedData = await SingleViewRoute(e_id,id);  // Fetch event details based on e_id
            console.log("fetchedData", fetchedData);

            // Dynamically set the event data from fetchedData
            setSingleData(fetchedData.data.event);  // Set the event data
            setTicketPrice(fetchedData.data.event.ticketPrice);  // Set the ticket price dynamically
        };
        fetchSingleEvent();
    }, [e_id, id, token]);

    const handleProceed = useCallback(async () => {
        // If booking is already confirmed, do nothing
        if (isBookingConfirmed) {
            return;
        }

        // Start loading state
        setIsLoading(true);

        const data = {
            numberOfTickets: ticketCount,
            eventName: singleData?.name,  // Dynamic event name
            eventPrice: ticketPrice,      // Dynamic ticket price
        };

        // Book the event and handle response
        try {
            const booking = await BookEventRoute(e_id, data, token);
            console.log('booking', booking);

            if (booking && booking.booking && booking.booking.status === "confirmed") {
                // If booking is confirmed, set the status to confirmed
                setIsBookingConfirmed(true);
                toast.success("Booking Confirmed!");
            } else if (booking && booking.message) {
                // Display the error message using toast
                toast.error(booking.message);
            }
        } catch (error) {
            console.error('Booking failed:', error);
            toast.error("An error occurred while booking. Please try again.");
        } finally {
            // Stop loading state after the booking process is complete
            setIsLoading(false);
        }
    }, [e_id, ticketCount, token, singleData, ticketPrice, isBookingConfirmed]);

    // Update total price when ticket count changes
    const handleTicketChange = (e) => {
        const count = parseInt(e.target.value, 10);
        setTicketCount(count);
        setTotalPrice(count * ticketPrice);
    };

    return (
        <>
            <div className="flex gap-8 p-6">
                {/* Left: Event Image and Details (75%) */}
                <div className="flex-3 w-3/4 p-4 border rounded-md bg-gray-50 shadow-md">
                    {/* Event Image */}
                    <div className="mb-4 w-1/3">
                        {singleData?.images?.[0]?.url ? (
                            <img
                                src={`http://localhost:4000/${singleData.images[0].url}`} // Assuming the image URL is correct
                                alt={singleData.name}
                                className="w-full h-48 object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                                No Image Available
                            </div>
                        )}
                    </div>

                    {/* Event Info */}
                    <div className="ml-4">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{singleData?.name || "Event Name"}</h2>
                        <p className="text-gray-600 mb-4">{singleData?.description || "Event description goes here. Briefly describe the event and what it's about."}</p>

                        <div className="text-gray-600 font-medium">
                            <p><strong>Venue:</strong> {singleData?.venue || "Venue Name"}</p>
                            <p><strong>City:</strong> {singleData?.city || "City"}</p>
                            <p><strong>Date & Time:</strong> {new Date(singleData?.startDate).toLocaleString() || "Event Date & Time"}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Price Summary (25%) */}
                <div className="w-1/4 p-4 bg-white shadow-md rounded-md">
                    <div className="p-4 border-b">
                        <h3 className="text-xl font-semibold text-gray-800">Price Summary</h3>
                    </div>

                    {/* Price Summary Section */}
                    <div className="space-y-3 p-4">
                        <div className="flex justify-between">
                            <p className="text-gray-600">Tickets ({ticketCount} x ₹{ticketPrice})</p>
                            <p className="text-gray-800 font-semibold">₹{totalPrice}</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-600">Service Charge</p>
                            <p className="text-gray-800 font-semibold">₹50</p> {/* Assuming static service charge */}
                        </div>
                        <div className="border-t pt-4 flex justify-between font-semibold">
                            <p>Total</p>
                            <p className="text-xl text-gray-800">₹{totalPrice + 50}</p> {/* Dynamic total */}
                        </div>
                    </div>

                    {/* Ticket Selection */}
                    <div className="p-4 border-b">
                        <h3 className="text-xl font-semibold text-gray-800">Select Tickets</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            You can add up to 10 tickets only
                        </p>
                    </div>

                    <div className="flex justify-between items-center border rounded-md p-4 shadow-sm mb-4">
                        <div>
                            <p className="text-gray-800 font-medium">{singleData?.name || "Event Name"}</p>
                            <p className="text-gray-600 font-semibold mt-1">₹{ticketPrice}</p>
                        </div>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={ticketCount}
                            onChange={handleTicketChange}
                            className="w-12 p-2 border rounded-md text-center"
                        />
                    </div>

                    {/* Proceed Button inside the Price Summary */}
                    <div className="mt-6">
                        <button
                            className={`w-full py-2 rounded transition ${isLoading || isBookingConfirmed ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-600'}`}
                            onClick={handleProceed}
                            disabled={isLoading || isBookingConfirmed}
                        >
                            {isBookingConfirmed ? "Booking Confirmed" : isLoading ? "Processing..." : "Proceed"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast Container to render notifications */}
            <ToastContainer />
        </>
    );
}
