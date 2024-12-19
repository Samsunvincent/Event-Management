const booking = require('../db/Model/bookingSchema');
const Event = require('../db/Model/EventSchema');

const Language = require('../db/Model/languageSchema');
const Category = require('../db/Model/categorySchema');

const BookingEmailTemplate = require('../utils/email-templates/bookingTemplate').bookingConfirmationEmail
const user = require('../db/Model/userModel');
const { sendEmail } = require('../utils/send-email');


exports.bookingTicket = async function (req, res) {
  let eid = req.params.eid;
  let body = req.body;

  try {
    // Ensure the event ID is provided
    if (!eid) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Validate that user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    // Get customer details
    let customerDetails = await user.findOne({ _id: req.user.id });
    if (!customerDetails) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Get event details
    let eventDetails = await Event.findOne({ _id: eid });
    if (!eventDetails) {
      return res.status(404).json({ message: "Event not found" });
    }

    let customerName = customerDetails.name;
    let email = customerDetails.email;
    let eventName = eventDetails.name;
    let eventDate = eventDetails.endDate;
    let ticketAmount = eventDetails.ticketPrice;
    let availableTickets = eventDetails.availableTickets;

    // Validate the number of tickets
    if (!body.numberOfTickets || body.numberOfTickets <= 0) {
      return res.status(400).json({ message: "Number of tickets is required and must be greater than zero" });
    }

    // Check if there are enough tickets available
    if (body.numberOfTickets > availableTickets) {
      return res.status(400).json({ message: `Only ${availableTickets} tickets are available for this event.` });
    }

    // Check if the user already booked this event
    let existingBooking = await booking.findOne({
      userId: req.user.id,
      eventId: eid
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this event." });

    }

    // Calculate total amount based on the ticket price and quantity
    let totalAmount = body.numberOfTickets * ticketAmount;

    // Create the booking object
    let newBooking = {
      userId: req.user.id,
      eventId: eventDetails._id,
      numberOfTickets: body.numberOfTickets,
      totalAmount: totalAmount,
      status: 'pending'
    };

    // Create the booking record in the database
    let bookedTicket = await booking.create(newBooking);

    // Update the available tickets in the event collection
    eventDetails.availableTickets -= body.numberOfTickets;
    await eventDetails.save();


    //Email section

    // if (bookedTicket) {
    //   let ticketCount = bookedTicket.numberOfTickets;
    //   let totalPrice = bookedTicket.totalAmount;

    //   // Generate booking email content
    //   let bookingEmailContent = await BookingEmailTemplate(customerName, eventName, eventDate, ticketCount, ticketAmount, totalPrice);

    //   // Send the booking confirmation email
    //   await sendEmail(email, "Booking Confirmation", bookingEmailContent);
    // }




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
    const uid = req.params.id; // The user ID from the URL parameter
    const userIdFromToken = req.user ? req.user.id : null; // The user ID from the authenticated token

    // Debug logs
    console.log("Extracted UID from params:", uid);
    console.log("User ID from token:", userIdFromToken);

    // Validate if userId is provided and is a valid MongoDB ObjectId
    if (!uid) {
      return res.status(400).json({ message: "User ID is required in the URL." });
    }
    if (!/^[0-9a-fA-F]{24}$/.test(uid)) {
      return res.status(400).json({ message: "Valid user ID is required." });
    }

    // Validate user authorization
    if (!req.user || String(req.user.id) !== String(uid)) {
      return res.status(403).json({ message: "You are not authorized to access this resource." });
    }

    // Fetch the registered events for the user
    const findRegisteredEvents = await booking.find({ userId: uid });

    // Check if the user has any registered events
    if (findRegisteredEvents.length === 0) {
      return res.status(404).json({ message: "No registered events found for the user." });
    }

    // Fetch detailed event data for each booking
    const eventDetails = await Promise.all(
      findRegisteredEvents.map(async (booking) => {
        const event = await Event.findById(booking.eventId).lean();
        return {
          ...booking.toObject(), // Include booking details
          eventDetails: event || null, // Add event details or null if not found
        };
      })
    );

    // Remove bookings with missing or invalid event references
    const validEventDetails = eventDetails.filter((booking) => booking.eventDetails !== null);

    return res.status(200).json({
      message: "Registered events retrieved successfully",
      registeredEvents: validEventDetails,
    });
  } catch (error) {
    console.error("Error in ManageRegistration:", error.message);
    return res.status(500).json({
      message: "An error occurred while retrieving registered events.",
      error: error.message,
    });
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




