const user = require('../db/Model/userModel');
const Event = require('../db/Model/EventSchema');
const Booking = require('../db/Model/bookingSchema'); 
const mongoose = require('mongoose');
const usertype = require('../db/Model/userType')
const blockTemplate = require('../utils/email-templates/blockOrUnblock').blockUserEmailTemplate
const sendEmail = require('../utils/send-email').sendEmail

exports.Count = async function (req, res) {
    try {
        // Count of users
        const userCount = await user.countDocuments();

        // Count of events
        const eventCount = await Event.countDocuments();

        // Calculate total revenue from Booking collection
        const totalRevenueResult = await Booking.aggregate([
            { $match: { status: "pending" } }, // Consider only 'confirmed' bookings
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

        // Get the latest 5 booked events
        const latestBookings = await Booking.find()
            .sort({ bookingDate: -1 }) // Sort by bookingDate in descending order
            .limit(5) // Limit to the latest 5 bookings
            .populate('eventId', 'name venue startDate endDate description city images ticketPrice ') // Populate event details (adjust fields as needed)
            .lean();

        // Sending the response
        res.status(200).json({
            userCount,
            eventCount,
            totalRevenue,
            latestBookings
        });
    } catch (error) {
        console.error("Error in Count function:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.allEvent = async function (req, res) {
    try {
        // Fetch all events
        const events = await Event.find().populate('category').populate('language');
        
        // Send response
        res.status(200).json({
            success: true,
            message: "Fetched all events successfully",
            data: {
                events,
            },
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: error.message,
        });
    }
};

exports.allOrganizers = async function (req, res) {
    try {
        // Find the Organizer userType ID
        const organizerType = await usertype.findOne({ userType: "Organizer" });

        if (!organizerType) {
            return res.status(404).json({ message: "Organizer type not found" });
        }

        // Find all users with the Organizer userType
        const organizers = await user.find({ userType: organizerType._id });

        if (organizers.length === 0) {
            return res.status(404).json({ message: "No organizers found" });
        }

        // Respond with the list of organizers
        res.status(200).json({
            success: true,
            data: organizers,
        });
    } catch (error) {
        console.error("Error fetching organizers:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.allAttendees = async function (req, res) {
    try {
        // Find the Attendee userType ID
        const attendeeType = await usertype.findOne({ userType: "Attendees" });

        if (!attendeeType) {
            return res.status(404).json({ message: "Attendee type not found" });
        }

        // Find all users with the Attendee userType
        const attendees = await user.find({ userType: attendeeType._id });

        if (attendees.length === 0) {
            return res.status(404).json({ message: "No attendees found" });
        }

        // Respond with the list of attendees
        res.status(200).json({
            success: true,
            data: attendees,
        });
    } catch (error) {
        console.error("Error fetching attendees:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.blockOrUnblock = async function(req, res) {
    try {
        const userId = req.params.id; // Get user ID from URL params
        const description = req.body.description; // Get description from the request body

        // Find the user by ID
        const userData = await user.findById(userId);
        const userName = userData.name;
        const emails = userData.email;
        
        
        
        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Toggle the user status
        const isBlocking = userData.user_Status === "unblock";
        userData.user_Status = isBlocking ? "block" : "unblock";
        
        // If blocking the user, validate description
        if (isBlocking && !description) {
            return res.status(400).json({ message: "Description is required when blocking the user" });
        }

        // Save the updated user status
        await userData.save();

        // If the user is blocked and description is provided, send email (or other actions)
        if (isBlocking && description) {
         

            console.log(`Send email to ${userData.email} with description: ${description}`);

            //send email function


            const blockUser  = await blockTemplate(userName,description)
            await sendEmail(emails,"Blocking the user",blockUser)
        }

        return res.status(200).json({
            message: `User successfully ${userData.user_Status === "block" ? "blocked" : "unblocked"}`,
            userStatus: userData.user_Status
        });
    } catch (error) {
        console.error('Error blocking/unblocking user:', error);
        return res.status(500).json({ message: "Server error, please try again later" });
    }
};

