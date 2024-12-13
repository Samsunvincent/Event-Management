const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    u_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',  // Match the model name defined in the userdata schema
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        // required: true,
    },
    endDate: {
        type: Date,
        // required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language',
        required: true,
    },
    ticketPrice: {
        type: Number,
        required: true,
    },
    availableTickets: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'], // Example statuses
        default: 'Active',
    },
    images: [
        {
            url: String,
            alt: String,
        },
    ],
});

module.exports = mongoose.model('Event', EventSchema);
