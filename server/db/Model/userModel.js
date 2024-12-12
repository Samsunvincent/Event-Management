const mongoose = require('mongoose');

let registerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            //   required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
        },
        email: {
            type: String,
            //   required: [true, "Email is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email address",
            ],
        },
        phone: {
            type: Number
        },

        password: {
            type: String,
            //   required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        password_token: {
            type: String
        },
        userType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userType"
        },
        
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Export the schema as a model
module.exports = mongoose.model('useData', registerSchema);
