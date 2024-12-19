const Event = require('../db/Model/EventSchema');
const categorydata = require('../db/Model/categorySchema');
const languagedata = require('../db/Model/languageSchema');
const mongoose = require('mongoose');
const user = require('../db/Model/userModel')
const usertype = require('../db/Model/userType')
const city = require('../db/Model/citySchema')
const Booking = require('../db/Model/bookingSchema')






exports.addEvents = async function (req, res) {
    try {
        const body = req.body;
        const user = req.user;

        // Debug logs
        console.log('req.user:', user);

        // Check if the request body exists
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({
                message: 'All fields are required',
            });
        }

        // Validate that the user is authenticated
        if (!user) {
            return res.status(401).json({
                message: 'Unauthorized. Please log in.',
            });
        }

        // Check if the user has the Organizer role
        const userRole = user.role?.trim().toLowerCase(); // Use `user.role`
        console.log('Extracted user role:', userRole);

        if (userRole !== 'organizer') {
            return res.status(403).json({
                message: 'Forbidden. Only organizers can add events.',
            });
        }

        // Validate and find the category, language, and city
        const { category, language, city: cityName } = body;

        const [match_category, match_language, match_city] = await Promise.all([
            categorydata.findOne({ Category: category }),
            languagedata.findOne({ Language: language }),
            city.findOne({ City: cityName }),
        ]);

        if (!match_category || !match_language) {
            return res.status(400).json({
                message: 'Select a valid category or valid language',
            });
        }

        // Process image files if available
        const images = (req.files?.['images[]'] || []).map(file => ({
            url: file.path,
            alt: body.altText || 'Event Image', // Fallback to default alt text
        }));

        // Convert organizer ID to ObjectId
        const organizerId =new mongoose.Types.ObjectId(req.params.id);

        // Create a new event
        const newEvent = new Event({
            u_id: organizerId,
            name: body.name,
            description: body.description,
            venue: body.venue,
            city: match_city?.City, // Optional chaining for safety
            startDate: body.startDate,
            endDate: body.endDate,
            category: match_category._id, // Use category ObjectId
            language: match_language._id, // Use language ObjectId
            ticketPrice: body.ticketPrice,
            availableTickets: body.availableTickets,
            status: body.status,
            images,
        });

        // Save the new event in the database
        await newEvent.save();

        return res.status(201).json({
            message: 'Event added successfully',
            event: newEvent,
        });
    } catch (error) {
        console.error('Error adding event:', error);
        return res.status(500).json({
            message: 'An error occurred while adding the event',
            error: error.message,
        });
    }
};



exports.getEvents = async function (req, res) {
    try {
        const userid = req.params.id;
        let eventQuery = {};

        // Get the current date
        const currentDate = new Date();

        // Check if userid is provided
        if (userid) {
            // Fetch the user by ID
            const check_user = await user.findOne({ _id: userid });
            if (!check_user) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("check_user", check_user);

            // Fetch user type and validate
            const check_userType = await usertype.findOne({ _id: check_user.userType });
            console.log("check_userType", check_userType);

            if (!check_userType) {
                return res.status(404).json({ message: "User type not found" });
            }

            // Check user type and set query accordingly
            if (check_userType.userType === "Organizer") {
                eventQuery = { u_id: { $ne: userid } }; // Exclude events added by the organizer
            }
        } else {
            console.log("No user ID provided. Fetching all events.");
        }

        // Fetch events based on the constructed query (all events if no userid)
        const events = await Event.find(eventQuery);

        // If no events are found, return an empty array
        if (!events || events.length === 0) {
            return res.status(200).json({ message: "No events found", events: [] });
        }

        // Filter out events that have passed
        const activeEvents = events.filter(event => new Date(event.endDate) >= currentDate);

        // Update the status of passed events to "Inactive"
        const passedEvents = events.filter(event => new Date(event.endDate) < currentDate);
        for (const event of passedEvents) {
            event.status = "Inactive";
            await event.save(); // Update event status in the database
        }

        console.log("Active Events:", activeEvents);

        // Respond with the active events
        res.status(200).json({ message: "Events fetched successfully", events: activeEvents });
    } catch (error) {
        console.error("Error in getEvents:", error);
        res.status(500).json({ message: "An error occurred while fetching events", error: error.message });
    }
};



exports.getEvent = async function (req, res) {
    try {
        const e_id = req.params.e_id;
        const userId = req.params.id; // Extract user ID from the params (optional)

        // Validate if event ID is provided
        if (!e_id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // Initialize checkEvent
        let checkEvent = null;

        // Fetch the event by ID only if userId is provided or if it's not "undefined"
        if (userId && userId !== "undefined") {
            checkEvent = await Event.findOne({ _id: e_id });
            if (!checkEvent) {
                return res.status(404).json({ message: "Oops! Event not found. Please try again." });
            }
        } else {
            // If userId is not provided, fetch the event without checking for user-specific data
            checkEvent = await Event.findOne({ _id: e_id });
            if (!checkEvent) {
                return res.status(404).json({ message: "Oops! Event not found. Please try again." });
            }
        }

        // Fetch associated language data
        const findLanguage = await languagedata.findOne({ _id: checkEvent.language });
        if (!findLanguage && (userId && userId !== "undefined")) {
            return res.status(400).json({ message: "Language is not defined for this event" });
        }

        // Fetch associated category data
        const findCategory = await categorydata.findOne({ _id: checkEvent.category });
        if (!findCategory && (userId && userId !== "undefined")) {
            return res.status(400).json({ message: "Category is not defined for this event" });
        }

        // Fetch organizer details
        const findOrganizerDetails = await user.findOne({ _id: checkEvent.u_id });
        if (!findOrganizerDetails && (userId && userId !== "undefined")) {
            return res.status(400).json({ message: "Oops! Organizer details are not provided" });
        }

        // Fetch similar events based on category (excluding the current event)
        const similarEvents = await Event.find({ category: checkEvent.category, _id: { $ne: e_id } }).limit(5);

        // Check if the current user has booked this event (only if userId is provided)
        let isBooked = false;
        if (userId && userId !== "undefined") {
            const matchDetails = await Booking.findOne({ userId: userId, eventId: e_id });
            if (matchDetails) {
                isBooked = true;
            }
        }

        // Respond with the event details and similar events
        return res.status(200).json({
            message: "Event retrieved successfully",
            event: checkEvent,
            language: findLanguage,
            category: findCategory,
            organizer: findOrganizerDetails,
            similarEvents: similarEvents,
            isBooked: isBooked, // Boolean to indicate if user booked this event (if userId exists)
        });
    } catch (error) {
        console.error("Error in getEvent:", error);
        res.status(500).json({ message: "An error occurred while retrieving the event", error: error.message });
    }
};

exports.getOwnEvent = async function (req, res) {
    try {
        const u_id = req.user.id;

        // Validate if user ID is provided
        if (!u_id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch events created by the user
        const findOwnEvents = await Event.find({ u_id: u_id });

        // Check if events exist
        if (findOwnEvents.length === 0) {
            return res.status(404).json({ message: "No events found for this user" });
        }

        // Respond with the found events
        return res.status(200).json({
            message: "Own events retrieved successfully",
            events: findOwnEvents,
        });
    } catch (error) {
        console.error("Error in getOwnEvent:", error);
        return res.status(500).json({
            message: "An error occurred while retrieving the events",
            error: error.message,
        });
    }
};

exports.updateEvent = async function (req, res) {
    const eventId = req.params.e_id;  // Event ID to update
    const body = req.body;

    // Validate if the user is authenticated and authorized
    if (!req.user) {
        return res.status(401).json({
            message: 'Unauthorized. Please log in.'
        });
    }

    // Ensure the user is an Organizer
    if (req.user.role !== 'Organizer') {
        return res.status(403).json({
            message: 'Forbidden. Only organizers can update events.'
        });
    }

    try {
        // Find the event by ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }

        // Ensure the user is the organizer of the event they are updating
        if (event.u_id.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: 'Forbidden. You are not the organizer of this event.'
            });
        }

        // Prepare the update object
        const updateData = {};

        // If the category, language, or city is provided, validate and update
        if (body.category) {
            const match_category = await categorydata.findOne({ Category: body.category });
            if (!match_category) {
                return res.status(400).json({
                    message: 'Select a valid category'
                });
            }
            updateData.category = match_category._id;
        }

        if (body.language) {
            const match_language = await languagedata.findOne({ Language: body.language });
            if (!match_language) {
                return res.status(400).json({
                    message: 'Select a valid language'
                });
            }
            updateData.language = match_language._id;
        }

        if (body.city) {
            const match_city = await city.findOne({ City: body.city });
            if (!match_city) {
                return res.status(400).json({
                    message: 'Select a valid city'
                });
            }
            updateData.city = match_city.City;
        }

        // Only set fields that are provided in the request body
        if (body.name) updateData.name = body.name;
        if (body.description) updateData.description = body.description;
        if (body.venue) updateData.venue = body.venue;
        if (body.startDate) updateData.startDate = body.startDate;
        if (body.endDate) {
            // If the endDate is being updated, we need to check if the event should be reactivated
            updateData.endDate = body.endDate;

            // Automatically update the status if the endDate is changed
            const currentDate = new Date();
            if (new Date(body.endDate) > currentDate) {
                updateData.status = 'Active';  // Reactivate the event if the new endDate is in the future
            } else {
                updateData.status = 'Inactive';  // Mark as inactive if the new endDate is in the past
            }
        }
        if (body.ticketPrice) updateData.ticketPrice = body.ticketPrice;
        if (body.availableTickets) updateData.availableTickets = body.availableTickets;
        if (body.status) updateData.status = body.status;

        // If new images are provided, update the images array
        if (req.files && req.files['images[]']) {
            const updatedImages = (req.files['images[]'] || []).map(file => ({
                url: file.path,  // Store the file path
                alt: req.body.altText || 'Event Image',  // Optional alt text
            }));
            updateData.images = updatedImages;  // Update the images field
        }

        // Use $set to update only the modified fields
        const updatedEvent = await Event.findByIdAndUpdate(eventId, { $set: updateData }, { new: true });

        return res.status(200).json({
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (error) {
        console.log("Error updating event:", error);
        return res.status(500).json({
            message: 'An error occurred while updating the event',
            error: error.message
        });
    }
};

exports.deleteEvent = async function (req, res) {
    const e_id = req.params.e_id;

    // Validate that e_id is provided
    if (!e_id) {
        return res.status(400).json({ message: "Event ID is required" });
    }

    try {
        // Find the event by ID
        const findEvent = await Event.findById(e_id);
        if (!findEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete the event
        const deleteEvent = await Event.deleteOne({ _id: e_id });
        if (deleteEvent.deletedCount === 0) {
            return res.status(400).json({ message: "Failed to delete the event. Please try again." });
        }

        // Return success message
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ message: "An error occurred while deleting the event", error: error.message });
    }
};


 exports.getParticipantsForEvent = async (req, res) => {
    const e_id = req.params.e_id;

    // Validate event ID
    if (!e_id || !mongoose.Types.ObjectId.isValid(e_id)) {
        return res.status(400).json({ message: "Invalid event ID" });
    }

    try {
        const participants = await Booking.aggregate([
            {
                $match: { eventId: new mongoose.Types.ObjectId(e_id) } // Ensure eventId is a valid ObjectId using 'new'
            },
            {
                $lookup: {
                    from: "usedatas", // The collection storing user details (ensure the name is correct)
                    localField: "userId", // userId in booking collection
                    foreignField: "_id", // _id in the user collection
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails" // Flatten the userDetails array
            },
            {
                $group: {
                    _id: "$userId", // Group by userId to consolidate multiple bookings by the same user
                    name: { $first: "$userDetails.name" }, // Get the user's name
                    email: { $first: "$userDetails.email" }, // Get the user's email
                    phone: { $first: "$userDetails.phone" }, // Get the user's phone number
                    totalTickets: { $sum: "$numberOfTickets" }, // Sum tickets booked by the user
                    totalAmount: { $sum: "$totalAmount" }, // Sum the total amount paid by the user
                    bookings: {
                        $push: {
                            numberOfTickets: "$numberOfTickets",
                            totalAmount: "$totalAmount",
                            status: "$status",
                            bookingDate: "$bookingDate"
                        }
                    }
                }
            }
        ]);

        if (!participants.length === 0) {
            return res.status(404).json({ message: "No participants found for this event" });
        }

        return res.status(200).json({ message: "Participants retrieved successfully", participants });
    } catch (error) {
        console.error("Error fetching participants for event:", error);
        return res.status(500).json({ message: "An error occurred while fetching participants", error: error.message });
    }
};





//crud operations completed












