const booking = require('../db/Model/bookingSchema');

const Event = require('../db/Model/EventSchema');

exports.bookingTicket = async function(req, res) {
    let eid = req.params.eid;
    let body = req.body;
    
    try {
        // Check if event ID is provided
        if (!eid) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // Find the event with the provided ID
        let findEvent = await Event.findOne({ _id: eid });
        if (!findEvent) {
            return res.status(400).json({ message: "Event not found" });
        }
        console.log('findEvent:', findEvent);

        // Get the user ID associated with the event (assuming the event has a `u_id` field for user ID)
        let userId = findEvent.u_id;
        console.log('userId:', userId);

        
        // Validate the request body (e.g., number of tickets and total amount)
        if (!body.numberOfTickets || body.numberOfTickets <= 0) {
            return res.status(400).json({ message: "Number of tickets is required and must be greater than zero" });
        }
        if (!body.totalAmount || body.totalAmount <= 0) {
            return res.status(400).json({ message: "Total amount is required and must be greater than zero" });
        }

        // Create a new booking
        let newBooking = {
            userId, // Current logged-in user
            eventId: findEvent._id,   // Event the user is booking
            numberOfTickets: body.numberOfTickets,  // Number of tickets from the request body
            totalAmount: body.totalAmount,  // Total amount from the request body
            status: 'pending'  // Default status
        };

        // Create the booking record in the database
        let bookedTicket = await booking.create(newBooking);

        // Respond with the created booking
        return res.status(201).json({
            message: "Booking created successfully",
            booking: bookedTicket
        });

    } catch (error) {
        console.error('Error booking ticket:', error);
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
