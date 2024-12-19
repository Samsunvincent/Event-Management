const user = require('../db/Model/userModel');
const Event = require('../db/Model/EventSchema');
const Booking = require('../db/Model/bookingSchema'); 
const mongoose = require('mongoose');

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


