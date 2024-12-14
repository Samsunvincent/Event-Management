const booking = require('../db/Model/bookingSchema');
const Event = require('../db/Model/EventSchema');

const Language = require('../db/Model/languageSchema'); 
const Category = require('../db/Model/categorySchema'); 


exports.bookingTicket = async function (req, res) {
    let eid = req.params.eid;
    let body = req.body;
   

    try {
        // Check if event ID is provided
        if (!eid) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // Validate if req.user exists (authenticated user)
        if (!req.user || !req.user.id) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        // Find the event with the provided ID
        let findEvent = await Event.findOne({ _id: eid });
        if (!findEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Extract event details
        let { availableTickets, ticketPrice } = findEvent;

        // Validate the request body
        if (!body.numberOfTickets || body.numberOfTickets <= 0) {
            return res.status(400).json({ message: "Number of tickets is required and must be greater than zero" });
        }

        // Check if enough tickets are available
        if (body.numberOfTickets > availableTickets) {
            return res.status(400).json({ message: `Only ${availableTickets} tickets are available for this event.` });
        }

        // Check if the user already booked this event
        let existingBooking = await booking.findOne({
            userId: req.user.id, // Assuming user ID is available in the request object
            eventId: eid
        });

        if (existingBooking) {
            return res.status(400).json({ message: "You have already booked this event." });
        }

        // Calculate total amount based on ticket price and quantity
        let totalAmount = body.numberOfTickets * ticketPrice;

        // Create a new booking
        let newBooking = {
            userId: req.user.id,
            eventId: findEvent._id,
            numberOfTickets: body.numberOfTickets,
            totalAmount: totalAmount,
            status: 'pending'
        };

        // Create the booking record in the database
        let bookedTicket = await booking.create(newBooking);

        // Update the available tickets in the event collection
        findEvent.availableTickets -= body.numberOfTickets;
        await findEvent.save();

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


exports.ManageRegistration = async function (req, res) {
    try {
        let uid = req.params.id; // The user ID from the URL parameter
        let userIdFromToken = req.user ? req.user.id : null; // The user ID from the authenticated token
        console.log(userIdFromToken);

        console.log(req.user); // This is for debugging purposes (you can remove it in production)

        // Validate if userId is provided and is a valid MongoDB ObjectId
        if (!uid || !/^[0-9a-fA-F]{24}$/.test(uid)) {
            return res.status(400).json({ message: "Valid user ID is required" });
        }

        // Validate if req.user exists and the user ID from the token matches the user ID in the params
        if (!req.user || req.user.id !== uid) {
            return res.status(403).json({ message: "You are not authorized to access this resource" });
        }

        // Fetch the registered events for the user
        let findRegisteredEvents = await booking.find({ userId: uid });

        // Check if the user has any registered events
        if (findRegisteredEvents.length === 0) {
            return res.status(404).json({ message: "No registered events found for the user" });
        }

        // Log the found registered events (for debugging purposes, remove in production)
        console.log('findRegisteredEvents', findRegisteredEvents);

        // Respond with the found registered events
        return res.status(200).json({
            message: "Registered events retrieved successfully",
            registeredEvents: findRegisteredEvents
        });

    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error in ManageRegistration:", error.message);

        // Send a generic error response
        return res.status(500).json({ message: "An error occurred while retrieving registered events", error: error.message });
    }
};


exports.getFilteredEvents = async function (req, res) {
  try {
    // Get the filters from query params
    let { language, city, category } = req.query;

    // Build the filter object dynamically
    let filter = {};

    // Add language filter if provided (checking if language is a reference)
    if (language) {
      const languageObj = await Language.findOne({ Language: language }); // Assuming 'name' is a field in Language collection
      if (languageObj) {
        filter.language = languageObj._id; // Filter by the ObjectId
      } else {
        return res.status(400).json({ message: "Invalid language provided" });
      }
    }

    // Add city filter if provided
    if (city) {
      filter.city = city; // Assuming city is directly stored in the 'city' field of the event
    }

    // Add category filter if provided (checking if category is a reference)
    if (category) {
      const categoryObj = await Category.findOne({ Category: category }); // Assuming 'name' is a field in Category collection
      if (categoryObj) {
        filter.category = categoryObj._id; // Filter by the ObjectId
      } else {
        return res.status(400).json({ message: "Invalid category provided" });
      }
    }

    // Fetch events based on the filter and populate language and category references
    const events = await Event.find(filter)
      .populate('category') // Populate the 'category' reference
      .populate('language'); // Populate the 'language' reference

    // If no events are found, return a message
    if (events.length === 0) {
      return res.status(404).json({ message: "No events found matching the filters" });
    }

    // Return the filtered events
    return res.status(200).json({
      message: "Events fetched successfully",
      events: events
    });

  } catch (error) {
    console.error("Error fetching filtered events:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};



