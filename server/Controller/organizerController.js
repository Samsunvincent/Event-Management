const Event = require('../db/Model/EventSchema');
const categorydata = require('../db/Model/categorySchema');
const languagedata = require('../db/Model/languageSchema');
const mongoose = require('mongoose');
const user = require('../db/Model/userModel')
const usertype = require('../db/Model/userType')
const city = require('../db/Model/citySchema')






exports.addEvents = async function (req, res) {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    let body_category = body.category;
    let match_category = await categorydata.findOne({ Category: body_category });

    let body_language = body.language;  // Fixed typo here 'langauage' to 'language'
    let match_language = await languagedata.findOne({ Language: body_language });

    let body_city = body.city;
    let match_city = await city.findOne( { City : body_city})

    if (!match_category || !match_language) {  // Corrected the condition
        return res.status(400).json({
            message: 'Select a valid category or valid language'
        });
    }

    try {
        if (!body || Object.keys(body).length === 0) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        const images = (req.files['images[]'] || []).map(file => ({
            url: file.path,  // Store the file path
            alt: req.body.altText || 'Event Image',  // Optional alt text
        }));

        // Convert req.params.id to ObjectId
        const organizerId = new mongoose.Types.ObjectId(req.params.id);

        // Creating new event with the valid category and language ObjectIds
        const newEvent = new Event({
            u_id: organizerId,  // Ensure u_id is an ObjectId
            name: req.body.name,
            description: req.body.description,
            venue: req.body.venue,
            city: match_city.City,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            category: match_category._id,  // Using category ObjectId
            language: match_language._id,  // Using language ObjectId
            ticketPrice: req.body.ticketPrice,
            availableTickets: req.body.availableTickets,
            status: req.body.status,
            images,
        });

        await newEvent.save();  // Save the new event to the database

        return res.status(201).json({
            message: 'Event added successfully',
            event: newEvent
        });

    } catch (error) {
        console.log("Error adding event:", error);
        return res.status(500).json({
            message: 'An error occurred while adding the event',
            error: error.message
        });
    }
};


exports.getEvents = async function (req, res) {
    try {
        const userid = req.params.id;

        let eventQuery = {};

        // Check if userid is provided
        if (userid) {
            // Fetch the user by ID
            const check_user = await user.findOne({ _id: userid });
            if (!check_user) {
                return res.status(404).json({ message: "User not found" });
            }
            console.log("check_user", check_user);

            // Fetch user type and validate
            const check_userType = await usertype.findOne({ _id: check_user.userType }).populate('userType');
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
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found" });
        }
        console.log("event", events);

        // Respond with the fetched events
        res.status(200).json({ message: "Events fetched successfully", events });
    } catch (error) {
        console.error("Error in getEvents:", error);
        res.status(500).json({ message: "An error occurred while fetching events", error: error.message });
    }
};

exports.getEvent = async function (req, res) {
    try {
        const e_id = req.params.e_id;

        // Validate if event ID is provided
        if (!e_id) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        // Fetch the event by ID
        const checkEvent = await Event.findOne({ _id: e_id });
        if (!checkEvent) {
            return res.status(404).json({ message: "Oops! Event not found. Please try again." });
        }

        // Fetch associated language data
        const findLanguage = await languagedata.findOne({ _id: checkEvent.language });
        if (!findLanguage) {
            return res.status(400).json({ message: "Language is not defined for this event" });
        }

        // Fetch associated category data
        const findCategory = await categorydata.findOne({ _id: checkEvent.category });
        if (!findCategory) {
            return res.status(400).json({ message: "Category is not defined for this event" });
        }

        // Fetch organizer details
        const findOrganizerDetails = await user.findOne({ _id: checkEvent.u_id });
        if (!findOrganizerDetails) {
            return res.status(400).json({ message: "Oops! Organizer details are not provided" });
        }

        // Respond with the event details
        return res.status(200).json({
            message: "Event retrieved successfully",
            event: checkEvent,
            language: findLanguage,
            category: findCategory,
            organizer: findOrganizerDetails,
        });
    } catch (error) {
        console.error("Error in getEvent:", error);
        res.status(500).json({ message: "An error occurred while retrieving the event", error: error.message });
    }
};

exports.getOwnEvent = async function (req, res) {
    try {
        const u_id = req.params.id;

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









